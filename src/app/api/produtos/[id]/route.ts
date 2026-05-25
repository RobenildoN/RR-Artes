import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

// Admin: Update product details
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso não autorizado." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { name, description, price, imageUrl, category, stock, active } = await req.json();

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado." },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProduct.imageUrl,
        category: category !== undefined ? category : existingProduct.category,
        stock: stock !== undefined ? parseInt(stock) : existingProduct.stock,
        active: active !== undefined ? active : existingProduct.active,
      },
    });

    return NextResponse.json({
      message: "Produto atualizado com sucesso!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar produto." },
      { status: 500 }
    );
  }
}

// Admin: Soft delete product (set active = false)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso não autorizado." },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado." },
        { status: 404 }
      );
    }

    // Check if product is in any order. If yes, soft delete (active = false). If not, we can hard delete.
    const isReferenced = await prisma.orderItem.findFirst({
      where: { productId: id },
    });

    if (isReferenced) {
      await prisma.product.update({
        where: { id },
        data: { active: false },
      });
      return NextResponse.json({
        message: "Produto desativado com sucesso (mantido no histórico de pedidos).",
      });
    } else {
      await prisma.product.delete({
        where: { id },
      });
      return NextResponse.json({
        message: "Produto excluído com sucesso do banco de dados.",
      });
    }
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Erro ao excluir produto." },
      { status: 500 }
    );
  }
}
