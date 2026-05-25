import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

// Public: Get all active products
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const whereClause: any = { active: true };

    if (category && category !== "all") {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos." },
      { status: 500 }
    );
  }
}

// Admin: Add a new product
export async function POST(req: Request) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso não autorizado." },
        { status: 403 }
      );
    }

    const { name, description, price, imageUrl, category, stock } = await req.json();

    if (!name || !description || price === undefined || !imageUrl || !category || stock === undefined) {
      return NextResponse.json(
        { error: "Todos os campos do produto são obrigatórios." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        category,
        stock: parseInt(stock),
        active: true,
      },
    });

    return NextResponse.json(
      { message: "Produto cadastrado com sucesso!", product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar produto." },
      { status: 500 }
    );
  }
}
