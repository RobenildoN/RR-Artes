"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Info, Scissors, Palette } from "lucide-react";

export default function AboutPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-20">
      {/* 1. Brand Story & Mission */}
      <section className="grid gap-12 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1 rounded-full bg-rosa-100 dark:bg-rosa-950/40 px-3 py-1 text-xs font-bold text-rosa-700 dark:text-verde-300">
            <Info className="h-3 w-3" /> Quem Somos
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            A História da RR Artes
          </h1>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
            Fundada em Hortolândia, a **RR Artes** nasceu do desejo de unir duas paixões: a expressão criativa através da papelaria fina e o resgate da alfaiataria de alta qualidade por meio do conserto de roupas e bordados sob medida.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
            Ao longo dos anos, nos tornamos o ponto de referência para estudantes, artesãos, profissionais e famílias locais que buscam materiais de papelaria diferenciados para organizar suas rotinas, além de um serviço atencioso de costura e bordados industriais para renovar e personalizar peças afetivas ou corporativas.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="border-l-4 border-rosa-500 pl-4">
              <span className="flex items-center space-x-2 text-rosa-500 dark:text-rosa-400 font-bold">
                <Palette className="h-5 w-5" />
                <span>Papelaria & Afeto</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Materiais selecionados para enriquecer seus estudos, planejamento e decoração.</p>
            </div>
            <div className="border-l-4 border-verde-400 pl-4">
              <span className="flex items-center space-x-2 text-verde-600 dark:text-verde-400 font-bold">
                <Scissors className="h-5 w-5" />
                <span>Costura & Arte</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bordados computadorizados ultra-precisos e costura sob medida que renova seu estilo.</p>
            </div>
          </div>
        </div>

        {/* Story Illustration Container */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rosa-500/10 to-verde-500/10 p-8 border border-rosa-100 dark:border-rosa-950/30 flex flex-col justify-center items-center text-center space-y-6 aspect-video">
          <div className="absolute top-4 right-4 text-rosa-500/20 text-9xl font-black">RR</div>
          <span className="text-rosa-500 dark:text-rosa-400 text-5xl font-black">Arte em Cada Ponto</span>
          <span className="text-verde-600 dark:text-verde-400 text-3xl font-extrabold">Carinho em Cada Detalhe</span>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md">
            "Não vendemos apenas canetas ou costuramos tecidos. Entregamos ferramentas de organização e restauramos a auto-estima em cada peça de roupa que passa pelas nossas mãos."
          </p>
        </div>
      </section>

      {/* 2. Map and Contact Section */}
      <section className="grid gap-12 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Envie uma Mensagem</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Dúvidas, sugestões ou parcerias? Fale conosco!</p>

          {submitted ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 p-8 text-center text-emerald-800 dark:text-emerald-300">
              <CheckCircle className="h-12 w-12 text-emerald-500 mb-3 animate-bounce" />
              <h3 className="font-bold text-lg">Mensagem enviada com sucesso!</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Nossa equipe retornará seu contato o mais breve possível.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs font-semibold underline text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-200"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Seu nome"
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:border-rosa-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-rosa-500 transition text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  E-mail de Contato
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="voce@exemplo.com"
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:border-rosa-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-rosa-500 transition text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Escreva sua mensagem aqui..."
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:border-rosa-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-rosa-500 transition resize-none text-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-rosa-500 hover:bg-rosa-600 text-white font-semibold py-3.5 shadow-md shadow-rosa-500/20 active:scale-98 transition duration-200"
              >
                <Send className="h-4 w-4" />
                Enviar Mensagem
              </button>
            </form>
          )}
        </div>

        {/* Visual Map / Info Box */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Nossa Loja</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Venha nos fazer uma visita presencial em Hortolândia!</p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-rosa-500 dark:text-verde-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Endereço</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">Rua da Amizade, 95 - Jardim Brasil, Hortolândia - SP</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-rosa-500 dark:text-verde-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Horário de Atendimento</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">Segunda a Sexta: 08:00h às 18:00h</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Sábado: 08:00h às 12:00h</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-rosa-500 dark:text-verde-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">WhatsApp</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">(19) 98888-7777</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Mock Map Container */}
          <div className="relative overflow-hidden rounded-2xl border border-rosa-100 dark:border-slate-800 bg-rosa-50/50 dark:bg-slate-900/50 p-6 shadow-inner h-60 flex flex-col justify-between">
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex flex-col items-center justify-center select-none transition-colors">
              {/* Mock map graphic paths using styled grid background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
              {/* Simulated river */}
              <div className="absolute top-1/3 left-0 w-full h-8 bg-sky-200/60 dark:bg-sky-950/40 -rotate-12 blur-xs"></div>
              {/* Simulated streets */}
              <div className="absolute top-0 left-1/3 w-6 h-full bg-slate-100/90 dark:bg-slate-700/80 shadow-sm"></div>
              <div className="absolute top-1/2 left-0 w-full h-8 bg-slate-100/90 dark:bg-slate-700/80 -translate-y-1/2 shadow-sm"></div>

              {/* Active Marker Pin */}
              <div className="relative z-10 flex flex-col items-center animate-bounce">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rosa-500 text-white shadow-lg shadow-rosa-500/30">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="mt-1.5 rounded-lg bg-slate-900 dark:bg-slate-950 px-2 py-1 text-[10px] font-bold text-white shadow">
                  RR ARTES
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between bg-white/90 dark:bg-slate-900/95 backdrop-blur-xs border border-slate-100 dark:border-slate-800 rounded-xl p-3 shadow-md">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Jardim Brasil, Hortolândia</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Localização Privilegiada e de fácil acesso</p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-rosa-500 text-white px-3 py-1 text-[10px] font-bold tracking-wide transition hover:bg-rosa-600"
              >
                Abrir Mapa
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
