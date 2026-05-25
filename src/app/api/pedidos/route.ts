import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

// Get user orders or all orders if Admin
export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { error: "Você precisa estar logado para ver pedidos." },
        { status: 401 }
      );
    }

    let orders;

    if (user.role === "ADMIN") {
      // Admin sees everything
      orders = await prisma.order.findMany({
        include: {
          user: {
            select: { name: true, email: true, phone: true },
          },
          address: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Standard user sees their own orders
      orders = await prisma.order.findMany({
        where: { userId: user.id },
        include: {
          address: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pedidos." },
      { status: 500 }
    );
  }
}

// Create new order
export async function POST(req: Request) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { error: "Você precisa estar logado para finalizar uma compra." },
        { status: 401 }
      );
    }

    const { items, deliveryType, addressData } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "O carrinho de compras está vazio ou é inválido." },
        { status: 400 }
      );
    }

    if (!deliveryType || (deliveryType !== "RETIRADA" && deliveryType !== "ENTREGA")) {
      return NextResponse.json(
        { error: "Tipo de entrega inválido." },
        { status: 400 }
      );
    }

    let savedAddressId: string | null = null;
    let distanceKm = 0;
    let deliveryFee = 0;

    // Check delivery constraints
    if (deliveryType === "ENTREGA") {
      if (!addressData) {
        return NextResponse.json(
          { error: "O endereço de entrega é obrigatório." },
          { status: 400 }
        );
      }

      const { street, number, complement, neighborhood, city, state, zipCode, distance } = addressData;

      if (!street || !number || !neighborhood || !city || !state || !zipCode) {
        return NextResponse.json(
          { error: "Todos os campos de endereço são obrigatórios para a entrega." },
          { status: 400 }
        );
      }

      // Parse distance (simulate/read from form)
      distanceKm = parseFloat(distance || "0");

      // ENFORCE the 5km restriction strictly!
      if (distanceKm > 5) {
        return NextResponse.json(
          { error: "Entrega indisponível para distâncias superiores a 5 km da loja. Por favor, escolha 'Retirar na Loja'." },
          { status: 400 }
        );
      }

      // Calculate delivery fee: R$ 5,00 flat + R$ 2,00 per km
      deliveryFee = 5.00 + (distanceKm * 2.00);

      // Save the address in DB under user
      const address = await prisma.address.create({
        data: {
          street,
          number,
          complement: complement || null,
          neighborhood,
          city,
          state,
          zipCode,
          distanceKm,
          userId: user.id,
        },
      });

      savedAddressId = address.id;
    }

    // Process and validate items in transaction
    const result = await prisma.$transaction(async (tx) => {
      let orderTotal = 0;
      const verifiedItems = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.active) {
          throw new Error(`Produto não disponível.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto: ${product.name}`);
        }

        // Decrement product stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
          },
        });

        const itemSubtotal = product.price * item.quantity;
        orderTotal += itemSubtotal;

        verifiedItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Final total includes delivery fee
      const finalTotal = orderTotal + deliveryFee;

      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          total: finalTotal,
          deliveryType,
          deliveryFee,
          distanceKm,
          addressId: savedAddressId,
          status: "PENDING",
          items: {
            create: verifiedItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return newOrder;
    });

    return NextResponse.json(
      { message: "Pedido realizado com sucesso!", order: result },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao processar seu pedido." },
      { status: 500 }
    );
  }
}
