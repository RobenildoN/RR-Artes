"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { ShoppingCart, User, LogOut, Menu, X, ShieldAlert, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const links = [
    { name: "Início", path: "/" },
    { name: "Sobre Nós", path: "/sobre" },
    { name: "Papelaria & Variedades", path: "/papelaria" },
    { name: "Solicitar Orçamento", path: "/orcamento" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-rosa-100/20 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Brand using the official PNG logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center space-x-3">
              <img
                src="/Logo RR Artes.png"
                alt="Logo RR Artes"
                className="h-10 w-10 rounded-full border border-rosa-100 dark:border-rosa-950/50 shadow-sm transition duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-[#f08bab] text-xl font-black tracking-wider">
                  RR ARTES
                </span>
                <span className="text-[9px] font-extrabold text-rosa-500 dark:text-verde-400 uppercase tracking-widest leading-none">
                  Hortolândia
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-semibold transition-colors duration-200 hover:text-rosa-500 dark:hover:text-verde-400 ${
                  isActive(link.path)
                    ? "text-rosa-500 dark:text-verde-400"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Controls, Dark mode switcher & Cart */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center rounded-full p-2 text-slate-600 dark:text-slate-300 hover:bg-rosa-50 dark:hover:bg-slate-900 hover:text-rosa-500 dark:hover:text-verde-400 transition duration-200"
              aria-label="Alternar Tema"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-rosa-500" />}
            </button>

            {/* Cart Icon Link */}
            <Link
              href="/carrinho"
              className="relative flex items-center justify-center rounded-full p-2 text-slate-600 dark:text-slate-300 transition-colors hover:bg-rosa-50 dark:hover:bg-slate-900 hover:text-rosa-500 dark:hover:text-verde-400"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rosa-500 text-[10px] font-bold text-white shadow-md shadow-rosa-500/30">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Auth status block */}
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>Painel Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                  <User className="h-4 w-4 text-rosa-500 dark:text-verde-400" />
                  <span className="max-w-[120px] truncate text-sm font-medium">
                    {user.name.split(" ")[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition"
                  title="Sair"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-rosa-500 dark:hover:text-verde-400 transition"
                >
                  Entrar
                </Link>
                <Link
                  href="/login?register=true"
                  className="rounded-lg bg-rosa-500 dark:bg-rosa-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rosa-500/20 hover:bg-rosa-600 dark:hover:bg-rosa-600 transition-all duration-200"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center md:hidden space-x-2">
            {/* Theme switch mobile */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center rounded-full p-2 text-slate-600 dark:text-slate-300 hover:bg-rosa-50 dark:hover:bg-slate-900 hover:text-rosa-500 dark:hover:text-verde-400 transition"
              aria-label="Alternar Tema"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-rosa-500" />}
            </button>

            <Link
              href="/carrinho"
              className="relative flex items-center justify-center rounded-full p-2 text-slate-600 dark:text-slate-300 hover:bg-rosa-50 dark:hover:bg-slate-900 hover:text-rosa-500 dark:hover:text-verde-400"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rosa-500 text-[10px] font-bold text-white">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-md p-2 text-slate-600 dark:text-slate-300 hover:bg-rosa-50 dark:hover:bg-slate-900 hover:text-rosa-500 dark:hover:text-verde-400 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rosa-100/10 dark:border-slate-900 bg-white dark:bg-slate-950 px-4 py-4 space-y-4 shadow-inner transition-colors duration-300">
          <div className="flex flex-col space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                  isActive(link.path)
                    ? "bg-rosa-50 dark:bg-rosa-950/50 text-rosa-500 dark:text-verde-400"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-rosa-500 dark:hover:text-verde-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-900 pt-3">
            {user ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 px-3 text-slate-700 dark:text-slate-300 font-semibold">
                  <User className="h-5 w-5 text-rosa-500 dark:text-verde-400" />
                  <span>{user.name}</span>
                </div>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 px-3 py-2.5 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 font-bold"
                  >
                    <ShieldAlert className="h-5 w-5" />
                    <span>Painel Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center space-x-2 rounded-lg px-3 py-2.5 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 px-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center text-base font-semibold text-slate-600 dark:text-slate-300 hover:text-rosa-500 dark:hover:text-verde-400 py-2"
                >
                  Entrar
                </Link>
                <Link
                  href="/login?register=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center rounded-lg bg-rosa-500 py-3 text-base font-semibold text-white shadow-md"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
