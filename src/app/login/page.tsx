"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, User, Phone, CheckCircle2, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, user } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";
  const forCheckout = searchParams.get("checkout") === "true";

  // Auto select register tab if requested in query
  useEffect(() => {
    if (searchParams.get("register") === "true") {
      setIsRegister(true);
    }
  }, [searchParams]);

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (isRegister) {
      if (!name || !email || !password) {
        setError("Todos os campos são obrigatórios para cadastro.");
        setLoading(false);
        return;
      }
      const res = await register(name, email, password, phone);
      if (res.success) {
        setSuccess("Conta criada com sucesso! Redirecionando...");
        setTimeout(() => {
          router.push(redirectTo);
        }, 1500);
      } else {
        setError(res.error || "Ocorreu um erro no cadastro.");
      }
    } else {
      if (!email || !password) {
        setError("E-mail e senha são obrigatórios.");
        setLoading(false);
        return;
      }
      const res = await login(email, password);
      if (res.success) {
        setSuccess("Login realizado com sucesso! Redirecionando...");
        setTimeout(() => {
          router.push(redirectTo);
        }, 1500);
      } else {
        setError(res.error || "E-mail ou senha incorretos.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-gradient-to-br from-rosa-50/20 via-rosa-50/10 to-verde-50/20 dark:from-rosa-950/10 dark:via-slate-950 dark:to-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl transition-colors duration-300">
        {/* Banner if redirected from checkout */}
        {forCheckout && (
          <div className="mb-6 rounded-xl bg-rosa-50 dark:bg-rosa-950/30 border border-rosa-100 dark:border-rosa-900/50 p-3.5 text-xs text-rosa-700 dark:text-verde-300 flex items-start space-x-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-rosa-500" />
            <div>
              <p className="font-bold">Login Obrigatório</p>
              <p className="mt-0.5 text-rosa-650 dark:text-verde-300 leading-relaxed">
                Por favor, acesse sua conta ou crie um cadastro rápido para finalizar seu pedido de papelaria.
              </p>
            </div>
          </div>
        )}

        {/* Tab Selector Headers */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 pb-2 mb-6">
          <button
            onClick={() => {
              setIsRegister(false);
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 text-center pb-3 text-sm font-semibold border-b-2 transition duration-200 ${
              !isRegister
                ? "border-rosa-500 text-rosa-500 dark:border-verde-400 dark:text-verde-400"
                : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            Acessar Conta
          </button>
          <button
            onClick={() => {
              setIsRegister(true);
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 text-center pb-3 text-sm font-semibold border-b-2 transition duration-200 ${
              isRegister
                ? "border-rosa-500 text-rosa-500 dark:border-verde-400 dark:text-verde-400"
                : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            Criar Cadastro
          </button>
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">
          {isRegister ? "Comece Suas Compras na RR Artes" : "Bem-vindo de Volta!"}
        </h2>
        <p className="text-xs text-slate-450 dark:text-slate-400 text-center mt-1">
          {isRegister
            ? "Cadastre-se rápido e aproveite nossos produtos e serviços"
            : "Entre com seus dados para prosseguir"}
        </p>

        {/* Success / Error Messages */}
        {error && (
          <div className="mt-5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 p-3 text-xs text-red-755 dark:text-red-300 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-3 text-xs text-emerald-755 dark:text-emerald-300 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegister && (
            <div>
              <label htmlFor="reg-name" className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                Nome Completo
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="reg-name"
                  required
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-3 text-sm focus:border-rosa-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-rosa-500 transition text-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              E-mail
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                id="email"
                required
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-3 text-sm focus:border-rosa-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-rosa-500 transition text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label htmlFor="reg-phone" className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                Celular / WhatsApp (Opcional)
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                  <Phone className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="reg-phone"
                  placeholder="(19) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-3 text-sm focus:border-rosa-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-rosa-500 transition text-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="pass" className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Senha
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                id="pass"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-3 text-sm focus:border-rosa-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-rosa-500 transition text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 rounded-xl bg-rosa-500 hover:bg-rosa-600 text-white font-semibold py-3.5 shadow-md shadow-rosa-500/10 transition active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Processando..." : isRegister ? "Confirmar Cadastro" : "Acessar Conta"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center py-20 bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rosa-500"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
