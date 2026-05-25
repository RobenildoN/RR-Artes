import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

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
    const { status } = await req.json();

    const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status inválido." },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Pedido não encontrado." },
        { status: 404 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        address: true,
        items: { include: { product: true } },
      },
    });

    return NextResponse.json({
      message: "Status do pedido atualizado com sucesso!",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar pedido." },
      { status: 500 }
    );
  }
}
