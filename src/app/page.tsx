import React from "react";
import Link from "next/link";
import { Scissors, BookOpen, Send, ShoppingBag, CheckCircle, ArrowRight, Heart } from "lucide-react";
import { prisma } from "@/lib/db";
import FeaturedCarousel from "@/components/common/FeaturedCarousel";

export default async function HomePage() {
  const productsRaw = await prisma.product.findMany({
    where: { active: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  const featuredProducts = productsRaw.map((prod) => ({
    id: prod.id,
    name: prod.name,
    description: prod.description,
    price: prod.price,
    imageUrl: prod.name === "Bloco de Notas Autoadesivas Neon (Post-It)" ? "/post_it_notes.png" : prod.imageUrl,
    category: prod.category,
    stock: prod.stock,
  }));

  const specialties = [
    {
      title: "Papelaria Criativa",
      desc: "Cadernos temáticos, estojos, canetas fineliner vibrantes, organizadores e materiais incríveis para estudos e rotinas organizadas.",
      icon: BookOpen,
      color: "from-rosa-400 to-rosa-600",
      bg: "bg-rosa-500/5 dark:bg-rosa-500/10",
      text: "text-rosa-500 dark:text-verde-400",
      cta: "Visitar Loja",
      link: "/papelaria",
    },
    {
      title: "Conserto de Roupas",
      desc: "Ajustes de barra, substituição de zíperes, reparos invisíveis e customização geral para fazer suas roupas vestirem perfeitamente.",
      icon: Scissors,
      color: "from-verde-400 to-verde-600",
      bg: "bg-verde-500/5 dark:bg-verde-500/10",
      text: "text-verde-600 dark:text-verde-400",
      cta: "Pedir Orçamento",
      link: "/orcamento",
    },
    {
      title: "Bordados Personalizados",
      desc: "Trabalhos únicos em toalhas, enxovais, jaquetas, uniformes e patches criados com precisão industrial e cuidado artístico.",
      icon: Heart,
      color: "from-rosa-400 via-rosa-500 to-verde-400",
      bg: "bg-rosa-500/5 dark:bg-rosa-500/10",
      text: "text-rosa-500 dark:text-rosa-400",
      cta: "Pedir Orçamento",
      link: "/orcamento",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rosa-50/50 via-rosa-50/30 to-verde-50/50 dark:from-rosa-950/20 dark:via-slate-950 dark:to-slate-950 py-20 lg:py-32 transition-colors duration-300">
        <div className="absolute inset-y-0 right-0 -z-10 w-full max-w-3xl translate-x-1/4 translate-y-1/10 rounded-full bg-rosa-200/20 dark:bg-rosa-950/15 blur-3xl lg:translate-x-1/3"></div>
        <div className="absolute top-1/2 left-0 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-verde-200/20 dark:bg-verde-950/10 blur-3xl"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rosa-100/60 dark:bg-rosa-900/30 px-3.5 py-1.5 text-xs font-bold text-rosa-700 dark:text-verde-300">
              <span className="h-2 w-2 rounded-full bg-rosa-500 dark:bg-verde-400 animate-pulse"></span>
              Loja Física em Hortolândia - SP
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl leading-[1.15]">
              Onde a <span className="bg-gradient-to-r from-rosa-500 via-rosa-400 to-verde-400 dark:from-rosa-400 dark:via-verde-400 dark:to-verde-400 bg-clip-text text-transparent">criatividade</span> encontra o cuidado artesanal
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Compre o melhor da papelaria criativa online, retire na loja física ou receba em casa. Também oferecemos serviços de bordados e consertos finos de roupas com orçamento rápido online!
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link
                href="/papelaria"
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-rosa-500 hover:bg-rosa-600 text-white font-semibold px-6 py-3.5 shadow-lg shadow-rosa-500/30 dark:shadow-rosa-950/50 transition hover:scale-[1.02] active:scale-95 duration-200"
              >
                <ShoppingBag className="h-5 w-5" />
                Explorar Papelaria
              </Link>
              <Link
                href="/orcamento"
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-rosa-300 hover:text-rosa-500 dark:hover:text-verde-400 duration-200"
              >
                <Send className="h-5 w-5" />
                Solicitar Orçamento
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <FeaturedCarousel products={featuredProducts} />

      {/* 2. Specialties Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Nossas Especialidades
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Oferecemos soluções completas com atendimento local ágil e compromisso com a qualidade nos mínimos detalhes.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {specialties.map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-rosa-200 dark:hover:border-verde-900"
                >
                  <div>
                    <div className={`inline-flex rounded-xl p-3 ${spec.bg} ${spec.text}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white group-hover:text-rosa-500 dark:group-hover:text-verde-400 transition">
                      {spec.title}
                    </h3>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {spec.desc}
                    </p>
                  </div>
                  <div className="mt-8 pt-4">
                    <Link
                      href={spec.link}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition group-hover:text-rosa-500 dark:group-hover:text-verde-400"
                    >
                      <span>{spec.cta}</span>
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Promo Banner / Institutional Highlight */}
      <section className="py-16 bg-gradient-to-br from-rosa-950 via-slate-900 to-verde-900 text-white rounded-t-3xl md:rounded-3xl max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 md:my-8 shadow-xl">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <span className="text-verde-400 font-bold tracking-widest text-xs uppercase">
              Facilidade e Praticidade
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Papelaria Delivery ou Retirada na Loja
            </h2>
            <p className="text-rosa-100 text-base leading-relaxed">
              Selecione seus cadernos, canetas, garrafas e organizadores no nosso catálogo virtual. No momento do pagamento, indique se deseja retirar em nosso balcão ou se quer entrega domiciliar! 
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>Compra rápida com Login e Cadastro Obrigatório.</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>Calculadora integrada de entrega de até 5km.</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>Se estiver a mais de 5km da loja, garantimos a opção de Retirada!</span>
              </div>
            </div>
            <div className="pt-4">
              <Link
                href="/papelaria"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-rosa-950 shadow transition hover:bg-rosa-50"
              >
                <span>Acessar o Catálogo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-verde-300">
              Orçamento de Bordados e Consertos Online
            </h3>
            <p className="text-slate-200 text-sm">
              Chega de perder tempo se deslocando até a loja apenas para saber o preço. Faça o upload do modelo de bordado ou foto da roupa que precisa de ajuste, detalhe seu pedido, e receba um retorno diretamente da nossa equipe!
            </p>
            <ul className="space-y-3 text-sm text-slate-100">
              <li className="flex items-center space-x-2">
                <span className="font-bold text-verde-400">1.</span>
                <span>Preencha os campos com seu Nome e Telefone</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="font-bold text-verde-400">2.</span>
                <span>Escreva o que precisa ser feito na roupa</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="font-bold text-verde-400">3.</span>
                <span>Anexe uma foto do rasgo/tecido ou modelo em PDF</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/orcamento"
                className="block text-center w-full rounded-xl bg-rosa-500 hover:bg-rosa-600 text-white font-semibold py-3 transition shadow-lg shadow-rosa-500/30"
              >
                Solicitar Orçamento Grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              O que dizem nossos clientes
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Prezamos pelo carinho no atendimento e satisfação de cada morador de Hortolândia.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                text: "Os cadernos e estojos da papelaria são a coisa mais fofa! Fiz a compra pelo site, o cálculo da distância deu 3.2km, paguei a taxinha e entregaram em menos de duas horas. Excelente!",
                author: "Mariana Souza",
                role: "Estudante - Hortolândia",
              },
              {
                text: "Mandei fotos de dois ternos que precisavam ajustar a manga pelo formulário de orçamento do site. Recebi o orçamento rápido no email, levei na loja para marcar e o serviço ficou impecável. Super indico!",
                author: "Carlos Eduardo",
                role: "Advogado - Centro",
              },
              {
                text: "Encomendei os bordados dos uniformes da minha empresa de Hortolândia. O processo de envio do PDF do logo pelo site foi muito simples e prático. Qualidade impecável dos bordados!",
                author: "Fernanda Lima",
                role: "Microempreendedora - Jardim Rosolém",
              },
            ].map((testi, idx) => (
              <div key={idx} className="rounded-2xl bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
                <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed">
                  "{testi.text}"
                </p>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{testi.author}</p>
                  <p className="text-rosa-500 dark:text-verde-400 text-xs mt-0.5">{testi.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
