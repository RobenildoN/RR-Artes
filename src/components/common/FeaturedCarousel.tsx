"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Sparkles, ShoppingBag } from "lucide-react";
import { useCart, Product } from "@/context/CartContext";
import Link from "next/link";

interface FeaturedCarouselProps {
  products: Product[];
}

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const { addToCart, cart } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [isHovered, setIsHovered] = useState(false);

  // Update scroll buttons visibility on scroll or resize
  const checkScrollLimits = () => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      // Allow minor floating-point difference in browser scrollWidth/clientWidth
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollLimits);
      // Initial check
      checkScrollLimits();
      
      // Check again after a short delay to ensure rendering is complete
      const timer = setTimeout(checkScrollLimits, 100);

      window.addEventListener("resize", checkScrollLimits);

      return () => {
        container.removeEventListener("scroll", checkScrollLimits);
        window.removeEventListener("resize", checkScrollLimits);
        clearTimeout(timer);
      };
    }
  }, [products]);

  // Autoplay functionality: Scroll right every 4 seconds unless hovered
  useEffect(() => {
    if (isHovered || !products.length) return;

    const interval = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = containerRef.current;
        
        // If we are at the end, wrap back to the beginning
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          containerRef.current.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          containerRef.current.scrollTo({
            left: scrollLeft + clientWidth * 0.75, // Scroll 75% of container width for overlapping context
            behavior: "smooth",
          });
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovered, products.length]);

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      // Scroll by 80% of container width to make sure items are not partially skipped
      const scrollAmount = clientWidth * 0.8;
      const targetScroll =
        direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

      containerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
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

  if (products.length === 0) return null;

  return (
    <section 
      className="py-16 bg-slate-50/50 dark:bg-slate-950/20 border-y border-slate-100 dark:border-slate-900 transition-colors duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hide Scrollbars CSS */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rosa-100/60 dark:bg-rosa-900/30 px-3 py-1 text-xs font-bold text-rosa-700 dark:text-verde-300 mb-3">
              <Sparkles className="h-3 w-3 text-rosa-500 dark:text-verde-400" />
              Favoritos dos Clientes
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Destaques de Papelaria & Presentes
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm max-w-xl">
              Nossos itens mais vendidos e queridinhos da papelaria criativa. Garanta o seu antes que acabe o estoque!
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2 self-end md:self-auto">
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Item anterior"
              className={`rounded-xl p-2.5 border transition-all duration-200 ${
                canScrollLeft
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-rosa-300 hover:text-rosa-500 dark:hover:text-verde-400 shadow-sm active:scale-95 cursor-pointer"
                  : "bg-slate-100 dark:bg-slate-900/50 border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Próximo item"
              className={`rounded-xl p-2.5 border transition-all duration-200 ${
                canScrollRight
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-rosa-300 hover:text-rosa-500 dark:hover:text-verde-400 shadow-sm active:scale-95 cursor-pointer"
                  : "bg-slate-100 dark:bg-slate-900/50 border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel Window */}
        <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 overflow-hidden">
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {products.map((prod) => {
              const isOutOfStock = prod.stock <= 0;
              const currentCartQty = getCartQuantity(prod.id);
              const isLimitReached = currentCartQty >= prod.stock;
              const isAdded = addedItemIds[prod.id];

              return (
                <div
                  key={prod.id}
                  className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 snap-start snap-always"
                >
                  <div className="group flex flex-col h-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300 hover:border-rosa-200 dark:hover:border-verde-900/50 hover:-translate-y-0.5">
                    {/* Image Area */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950 rounded-t-2xl">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Category Badge */}
                      <span className={`absolute top-3 left-3 rounded-lg px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${
                        prod.category === "papelaria"
                          ? "bg-rosa-500 text-white"
                          : "bg-verde-500 text-white"
                      }`}>
                        {prod.category === "papelaria" ? "Papelaria" : "Miscelânea"}
                      </span>

                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="rounded-lg bg-red-650 text-white font-extrabold text-xs px-4 py-1.5 shadow">
                            Esgotado
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col flex-grow p-5 justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-base leading-snug group-hover:text-rosa-500 dark:group-hover:text-verde-400 transition duration-200 line-clamp-1">
                          {prod.name}
                        </h3>
                        <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2 min-h-[36px]">
                          {prod.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-50 dark:border-slate-850/50 space-y-4">
                        {/* Price and Stock Status */}
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                              Preço
                            </p>
                            <p className="text-xl font-black text-slate-950 dark:text-white">
                              R$ {prod.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                          </div>

                          {!isOutOfStock && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              prod.stock < 10
                                ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                                : "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400"
                            }`}>
                              {prod.stock < 10 ? `Apenas ${prod.stock} un.` : `${prod.stock} un.`}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart CTA */}
                        <button
                          disabled={isOutOfStock || isLimitReached}
                          onClick={() => handleAddToCart(prod)}
                          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold tracking-wide shadow-xs transition-all duration-200 ${
                            isOutOfStock
                              ? "bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-650 cursor-not-allowed"
                              : isLimitReached
                              ? "bg-slate-50 dark:bg-slate-950 text-slate-550 cursor-not-allowed"
                              : isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-rosa-500 hover:bg-rosa-600 text-white shadow-rosa-500/10 hover:shadow-rosa-600/20 dark:shadow-rosa-950/20 active:scale-[0.97] cursor-pointer"
                          }`}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          {isOutOfStock
                            ? "Esgotado"
                            : isLimitReached
                            ? "Limite Atingido"
                            : isAdded
                            ? "Adicionado!"
                            : "Adicionar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View Catalog Footer Link */}
        <div className="mt-8 text-center">
          <Link
            href="/papelaria"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-rosa-500 dark:hover:text-verde-400 transition"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Ver todo o catálogo de papelaria</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
