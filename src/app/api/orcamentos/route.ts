import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { getAuthUser } from "@/lib/auth";
import fs from "fs";
import path from "path";

// GET all budget requests (Admin only)
export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso não autorizado." },
        { status: 403 }
      );
    }

    const orcamentos = await prisma.budgetRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orcamentos }, { status: 200 });
  } catch (error) {
    console.error("Fetch budgets error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar orçamentos." },
      { status: 500 }
    );
  }
}

// POST new budget request
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const tipo = formData.get("tipo") as string; // "BORDADO" or "CONSERTO_ROUPA"
    const nome = formData.get("nome") as string;
    const telefone = formData.get("telefone") as string;
    const descricao = formData.get("descricao") as string;
    const file = formData.get("file") as File;

    if (!tipo || !nome || !telefone || !descricao || !file) {
      return NextResponse.json(
        { error: "Todos os campos do orçamento são obrigatórios (tipo, nome, telefone, descrição, anexo)." },
        { status: 400 }
      );
    }

    // Validate type
    if (tipo !== "BORDADO" && tipo !== "CONSERTO_ROUPA") {
      return NextResponse.json(
        { error: "Tipo de orçamento inválido." },
        { status: 400 }
      );
    }

    // Read file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate file extension
    const ext = path.extname(file.name).toLowerCase();
    if (ext !== ".pdf" && ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return NextResponse.json(
        { error: "Formato de arquivo inválido. Apenas PDFs ou imagens (PNG, JPG, JPEG) são permitidos." },
        { status: 400 }
      );
    }

    // Generate unique local file path
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, buffer);
    const fileUrl = `/uploads/${filename}`;

    // Create DB entry
    const orcamento = await prisma.budgetRequest.create({
      data: {
        type: tipo,
        name: nome,
        phone: telefone,
        description: descricao,
        fileUrl,
        status: "PENDING",
      },
    });

    const typeLabel = tipo === "BORDADO" ? "Bordado" : "Conserto de Roupa";
    const storeEmail = process.env.STORE_EMAIL || "contato@rrartes.com.br";
    const subject = `Novo Orçamento: ${typeLabel} - ${nome}`;

    const textContent = `
      Novo Pedido de Orçamento - RR Artes
      ---------------------------------
      Tipo: ${typeLabel}
      Cliente: ${nome}
      Telefone: ${telefone}
      Descrição: ${descricao}
      
      O arquivo está anexo a este e-mail ou pode ser visualizado no painel administrativo.
    `;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ec4899; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; margin-top: 0;">Novo Pedido de Orçamento - RR Artes</h2>
        <p><strong>Tipo de Pedido:</strong> ${typeLabel}</p>
        <p><strong>Cliente:</strong> ${nome}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>Descrição:</strong></p>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #ec4899; font-style: italic; white-space: pre-wrap;">
          ${descricao}
        </div>
        <p style="margin-top: 20px; font-size: 0.9em; color: #6b7280;">O arquivo de orçamento enviado pelo cliente está anexado a este e-mail.</p>
      </div>
    `;

    // Send email with the file attached
    const emailSent = await sendEmail({
      to: storeEmail,
      subject,
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: file.name,
          path: filePath,
        },
      ],
    });

    if (emailSent) {
      await prisma.budgetRequest.update({
        where: { id: orcamento.id },
        data: { emailSent: true },
      });
    }

    return NextResponse.json(
      {
        message: "Pedido de orçamento enviado com sucesso!",
        orcamento: {
          ...orcamento,
          emailSent,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Budget request error:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar orçamento." },
      { status: 500 }
    );
  }
}
