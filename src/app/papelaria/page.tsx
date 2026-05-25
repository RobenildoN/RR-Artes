"use client";

import React, { useState, useEffect } from "react";
import { useCart, Product } from "@/context/CartContext";
import { Search, ShoppingCart, Loader2, Sparkles, Filter } from "lucide-react";

export default function StationeryCatalogPage() {
  const { addToCart, cart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/produtos", window.location.origin);
      if (category !== "all") url.searchParams.set("category", category);
      if (search) url.searchParams.set("search", search);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]); // Auto refetch when category buttons clicked

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const getCartQuantity = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* 1. Page Title */}
      <div className="text-center md:text-left space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-105 dark:bg-purple-950/40 px-3.5 py-1.5 text-xs font-bold text-purple-700 dark:text-purple-300">
          <Sparkles className="h-3 w-3" /> E-Commerce Local
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
          Papelaria & Variedades Online
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
          Navegue por nossa papelaria criativa e presentes artesanais exclusivos. Faça seu pedido com segurança e escolha retirar em nosso balcão ou receber em casa!
        </p>
      </div>

      {/* 2. Filters & Search Box */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        {/* Category Toggles */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "Todos" },
            { id: "papelaria", label: "Papelaria" },
            { id: "miscelaneas", label: "Miscelâneas" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition border ${category === cat.id
                  ? "bg-purple-600 border-purple-600 dark:bg-purple-600 dark:border-purple-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-purple-200 dark:hover:border-purple-900 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Pesquisar caderno, caneta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-16 py-2.5 text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition text-slate-800 dark:text-white"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 px-3 py-1.5 text-xs font-bold transition hover:bg-purple-100 dark:hover:bg-purple-900/50"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* 3. Products Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
          <p className="text-sm text-slate-400 dark:text-slate-500">Carregando catálogo maravilhoso...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 transition-colors">
          <Filter className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-650" />
          <h3 className="mt-4 font-bold text-slate-800 dark:text-white text-lg">Nenhum produto localizado</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Não encontramos resultados para sua busca ou categoria. Tente mudar o termo da pesquisa ou verifique novamente mais tarde!
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("all");
            }}
            className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-4 py-2 transition"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((prod) => {
            const isOutOfStock = prod.stock <= 0;
            const currentCartQty = getCartQuantity(prod.id);
            const isLimitReached = currentCartQty >= prod.stock;
            const isAdded = addedItemIds[prod.id];

            return (
              <div
                key={prod.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-900"
              >
                {/* Product Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Category Badge */}
                  <span className={`absolute top-3 left-3 rounded-lg px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${prod.category === "papelaria"
                      ? "bg-purple-600 text-white"
                      : "bg-pink-600 text-white"
                    }`}>
                    {prod.category === "papelaria" ? "Papelaria" : "Miscelânea"}
                  </span>

                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="rounded-lg bg-red-600 text-white font-extrabold text-xs px-4 py-1.5 shadow">
                        Esgotado
                      </span>
                    </div>
                  )}
                </div>

                {/* Info and Actions */}
                <div className="flex flex-col flex-grow justify-between p-6">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-455 transition">
                      {prod.name}
                    </h3>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    {/* Price and Stock info */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Preço</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">
                          R$ {prod.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      {!isOutOfStock && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${prod.stock < 10
                            ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                            : "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400"
                          }`}>
                          {prod.stock < 10 ? `Apenas ${prod.stock} un.` : `${prod.stock} em estoque`}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <button
                      disabled={isOutOfStock || isLimitReached}
                      onClick={() => handleAddToCart(prod)}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold tracking-wide shadow-sm transition duration-200 ${isOutOfStock
                          ? "bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-650 cursor-not-allowed shadow-none"
                          : isLimitReached
                            ? "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-500 cursor-not-allowed shadow-none"
                            : isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/10 hover:shadow-purple-700/20 dark:shadow-purple-950/30 active:scale-[0.98]"
                        }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {isOutOfStock
                        ? "Esgotado"
                        : isLimitReached
                          ? "Limite Atingido"
                          : isAdded
                            ? "Adicionado!"
                            : "Adicionar ao Carrinho"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
