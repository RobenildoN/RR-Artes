const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed script...");

  // 1. Create a default Admin
  const adminEmail = "admin@rrartes.com.br";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("admin", salt);

    await prisma.user.create({
      data: {
        name: "RR Artes Admin",
        email: adminEmail,
        passwordHash,
        phone: "(19) 98888-7777",
        role: "ADMIN",
      },
    });
    console.log("Default Admin created: admin@rrartes.com.br / admin");
  } else {
    console.log("Admin user already exists.");
  }

  // 2. Create products
  const products = [
    {
      name: "Caderno Universitário Capa Dura 10 Matérias",
      description: "Caderno espiral universitário com capa dura, 160 folhas. Ideal para estudantes escolares e acadêmicos.",
      price: 19.90,
      imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=60",
      category: "papelaria",
      stock: 50,
    },
    {
      name: "Estojo Escolar Duplo Slim Rosa Pastel",
      description: "Estojo escolar com dois compartimentos amplos, resistente, perfeito para lápis, canetas e borrachas.",
      price: 24.90,
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60",
      category: "papelaria",
      stock: 30,
    },
    {
      name: "Kit Canetas Coloridas Fineliner 12 Cores",
      description: "Caneta hidrográfica de ponta fina de 0.4mm, cores vibrantes, tinta de secagem rápida que não borra.",
      price: 34.90,
      imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&auto=format&fit=crop&q=60",
      category: "papelaria",
      stock: 25,
    },
    {
      name: "Lápis de Cor Faber-Castell 24 Cores EcoLápis",
      description: "Estojo clássico com 24 cores intensas, macias ao desenhar e fáceis de apontar. Madeira de manejo sustentável.",
      price: 32.90,
      imageUrl: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=500&auto=format&fit=crop&q=60",
      category: "papelaria",
      stock: 40,
    },
    {
      name: "Bloco de Notas Autoadesivas Neon (Post-It)",
      description: "4 blocos de cores vibrantes com 90 folhas cada, ideais para deixar anotações importantes no escritório ou caderno.",
      price: 12.90,
      imageUrl: "/post_it_notes.png",
      category: "papelaria",
      stock: 60,
    },
    {
      name: "Organizador de Mesa Acrílico Giratório",
      description: "Organizador giratório 360° com divisórias para canetas, clipes, réguas e pequenos acessórios organizados na sua mesa.",
      price: 45.00,
      imageUrl: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&auto=format&fit=crop&q=60",
      category: "miscelaneas",
      stock: 15,
    },
    {
      name: "Luminária de Mesa LED Articulada USB",
      description: "Luminária de mesa recarregável com haste flexível e 3 níveis de intensidade de luz, perfeita para estudos noturnos.",
      price: 59.90,
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60",
      category: "miscelaneas",
      stock: 20,
    },
    {
      name: "Porta-Retrato Criativo de Pinus 10x15",
      description: "Porta-retrato artesanal de madeira pinus com acabamento fosco natural. Ideal para fotos de momentos inesquecíveis.",
      price: 29.90,
      imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&auto=format&fit=crop&q=60",
      category: "miscelaneas",
      stock: 18,
    },
    {
      name: "Garrafa Térmica Inox Pastel 500ml",
      description: "Garrafa de parede dupla em aço inoxidável, mantém bebidas frias por 24 horas e quentes por 12 horas. Design elegante.",
      price: 49.90,
      imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
      category: "miscelaneas",
      stock: 22,
    }
  ];

  for (const prod of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: prod.name },
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: prod,
      });
      console.log(`Product created: ${prod.name}`);
    } else {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: { imageUrl: prod.imageUrl },
      });
      console.log(`Product updated: ${prod.name}`);
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
