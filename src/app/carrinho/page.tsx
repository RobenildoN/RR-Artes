"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  Trash2,
  Plus,
  Minus,
  MapPin,
  ShoppingBag,
  Info,
  CheckCircle,
  Truck,
  Store,
  Lock,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

// Pre-defined local Hortolândia neighborhoods and their deterministic mock distances from the downtown physical store.
const NEIGHBORHOODS = [
  { name: "Selecione o Bairro...", distance: 0, zip: "" },
  { name: "Centro (Hortolândia)", distance: 1.2, zip: "13184-000" },
  { name: "Jardim Rosolém", distance: 3.2, zip: "13184-520" },
  { name: "Jardim Amanda I e II", distance: 4.8, zip: "13188-000" },
  { name: "Parque Novo Ângulo", distance: 2.8, zip: "13184-250" },
  { name: "Jardim Santa Clara", distance: 1.8, zip: "13186-200" },
  { name: "Divisa Sumaré / Região Leste", distance: 6.5, zip: "13185-999" }, // EXCEEDS 5KM limit!
  { name: "Área Rural / Fronteira Norte", distance: 7.2, zip: "13189-999" }, // EXCEEDS 5KM limit!
];

export default function CartAndCheckoutPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();

  const [deliveryType, setDeliveryType] = useState<"RETIRADA" | "ENTREGA">("RETIRADA");
  
  // Address form fields
  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [distanceKm, setDistanceKm] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // Handle neighborhood select and dynamically calculate mock distance and pre-fill ZIP Code
  const handleNeighborhoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const found = NEIGHBORHOODS.find((n) => n.name === selectedName);
    
    if (found) {
      setNeighborhood(found.name);
      setDistanceKm(found.distance);
      setZipCode(found.zip);
      
      // If distance > 5km, force fallback to Retirada na Loja and reset toggle!
      if (found.distance > 5) {
        setDeliveryType("RETIRADA");
      }
    } else {
      setNeighborhood("");
      setDistanceKm(0);
      setZipCode("");
    }
  };

  // Calculate delivery fee: R$ 5,00 flat rate + R$ 2,00 per km
  const deliveryFee = deliveryType === "ENTREGA" ? 5.00 + distanceKm * 2.00 : 0.00;
  const finalTotal = cartTotal + deliveryFee;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setLoading(true);

    let addressData = null;

    if (deliveryType === "ENTREGA") {
      if (!street || !number || !neighborhood || !zipCode) {
        setError("Todos os campos do endereço são obrigatórios para entrega.");
        setLoading(false);
        return;
      }
      
      if (distanceKm > 5) {
        setError("Não realizamos entregas para endereços a mais de 5km de distância da loja.");
        setLoading(false);
        return;
      }

      addressData = {
        street,
        number,
        complement,
        neighborhood,
        city: "Hortolândia",
        state: "SP",
        zipCode,
        distance: distanceKm,
      };
    }

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          deliveryType,
          addressData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrderSuccess(data.order);
        clearCart();
      } else {
        setError(data.error || "Ocorreu um erro ao finalizar o pedido.");
      }
    } catch (err) {
      setError("Erro ao se conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Order Success Screen
  if (orderSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="rounded-2xl border border-emerald-100 dark:border-emerald-950/30 bg-white dark:bg-slate-900 p-10 shadow-xl space-y-6 transition-colors">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
            <CheckCircle className="h-10 w-10 animate-bounce" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Pedido Confirmado!</h1>
          <p className="text-slate-600 dark:text-slate-350 text-sm">
            Parabéns! Seu pedido foi registrado com sucesso em nosso sistema. Uma cópia das instruções de retirada ou entrega foi enviada para o seu email de cadastro.
          </p>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-5 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2 text-slate-800 dark:text-slate-300">
            <p><strong>ID do Pedido:</strong> {orderSuccess.id}</p>
            <p><strong>Total Pago:</strong> R$ {orderSuccess.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            <p><strong>Tipo de Envio:</strong> {orderSuccess.deliveryType === "RETIRADA" ? "Retirada na Loja (Grátis)" : "Entrega em Domicílio"}</p>
            {orderSuccess.deliveryType === "ENTREGA" && (
              <p><strong>Taxa de Entrega:</strong> R$ {orderSuccess.deliveryFee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (Distância: {orderSuccess.distanceKm} km)</p>
            )}
            <p><strong>Status do Pedido:</strong> <span className="rounded bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 font-bold px-1.5 py-0.5 uppercase">Aguardando Pagamento</span></p>
          </div>

          <p className="text-slate-450 dark:text-slate-500 text-[11px]">
            Para realizar o pagamento via Pix ou tirar dúvidas, acione nosso WhatsApp utilizando o botão flutuante.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link
              href="/papelaria"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 text-white font-semibold px-6 py-3 w-full sm:w-auto hover:bg-purple-700 transition shadow-md shadow-purple-600/10"
            >
              <ShoppingBag className="h-4 w-4" />
              Continuar Comprando
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold px-6 py-3 w-full sm:w-auto hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Empty Cart Screen
  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-sm space-y-6 transition-colors">
          <ShoppingBag className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-650" />
          <h1 className="text-2xl font-bold text-slate-850 dark:text-white">Seu Carrinho está Vazio</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
            Você ainda não adicionou nenhum item de papelaria ou miscelânea ao seu carrinho de compras.
          </p>
          <div className="pt-4">
            <Link
              href="/papelaria"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 shadow transition duration-200"
            >
              <span>Acessar Papelaria</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">Meu Carrinho</h1>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Side: Cart items details */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6 transition-colors">
            <h2 className="text-lg font-bold text-slate-850 dark:text-white">Itens Selecionados ({cart.length})</h2>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {cart.map((item) => (
                <div key={item.product.id} className="flex py-5 first:pt-0 last:pb-0 items-center justify-between gap-4">
                  {/* Photo & Specs */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm leading-snug">{item.product.name}</h4>
                      <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-0.5 capitalize">{item.product.category}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">R$ {item.product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} un.</p>
                    </div>
                  </div>

                  {/* Quantity and subtotal controls */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 hover:text-purple-650 transition"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-850 dark:text-slate-300">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 hover:text-purple-650 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-slate-905 dark:text-white text-sm">
                        R$ {(item.product.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="mt-1 text-slate-405 dark:text-slate-500 hover:text-red-500 transition text-[10px] font-semibold flex items-center space-x-0.5 justify-end"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Block OR Checkout details */}
        <div className="lg:col-span-5 space-y-6">
          {!user ? (
            /* Login Lock Warning */
            <div className="rounded-2xl border border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-md text-center space-y-6 transition-colors">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400">
                <Lock className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Cadastro e Login Obrigatório</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Para prosseguir com o pagamento e a entrega dos itens de papelaria, você precisa estar cadastrado e conectado ao sistema de forma segura.
              </p>
              
              <Link
                href="/login?checkout=true&redirect=/carrinho"
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-purple-600 text-white font-semibold py-3.5 shadow-md shadow-purple-600/10 hover:bg-purple-700 transition"
              >
                Identificar-se ou Cadastrar
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            /* Logged-in Customer Checkout Engine */
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6 transition-colors">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Finalizar Compra</h2>
              
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 p-3 text-xs text-red-700 dark:text-red-300 flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                {/* Delivery Type Selectors */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Método de Recebimento
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("RETIRADA")}
                      className={`flex flex-col items-center justify-center rounded-xl p-3 border text-center transition ${
                        deliveryType === "RETIRADA"
                          ? "border-purple-500 bg-purple-500/5 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400"
                          : "border-slate-200 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-900 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
                      }`}
                    >
                      <Store className="h-5 w-5 mb-1" />
                      <span className="text-xs font-semibold">Retirar na Loja</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">Sem taxa de entrega</span>
                    </button>

                    <button
                      type="button"
                      disabled={distanceKm > 5}
                      onClick={() => setDeliveryType("ENTREGA")}
                      className={`flex flex-col items-center justify-center rounded-xl p-3 border text-center transition ${
                        distanceKm > 5
                          ? "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-900 text-slate-300 dark:text-slate-700 cursor-not-allowed"
                          : deliveryType === "ENTREGA"
                          ? "border-purple-500 bg-purple-500/5 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400"
                          : "border-slate-200 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-900 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
                      }`}
                    >
                      <Truck className="h-5 w-5 mb-1" />
                      <span className="text-xs font-semibold">Receber em Casa</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">Calculada por distância</span>
                    </button>
                  </div>
                </div>

                {/* Delivery Address fields */}
                <div className="space-y-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-4">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center space-x-1.5">
                    <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Detalhes do Endereço</span>
                  </h3>

                  {/* Neighborhood Selector with Simulated Distance */}
                  <div>
                    <label htmlFor="neighborhood" className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                      Selecione seu Bairro (Hortolândia)
                    </label>
                    <select
                      id="neighborhood"
                      required
                      value={neighborhood}
                      onChange={handleNeighborhoodChange}
                      className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none text-slate-800 dark:text-white"
                    >
                      {NEIGHBORHOODS.map((n, idx) => (
                        <option key={idx} value={n.name}>
                          {n.name} {n.distance > 0 ? `(${n.distance} km)` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Show distance-limit lockout information */}
                  {distanceKm > 0 && (
                    <div className={`rounded-lg p-2.5 text-[11px] flex items-start space-x-2 border ${
                      distanceKm > 5
                        ? "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-400"
                        : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300"
                    }`}>
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Distância Calculada: {distanceKm} km</p>
                        {distanceKm > 5 ? (
                          <p className="mt-0.5 leading-snug">
                            <strong>Bloqueado:</strong> Endereço a mais de 5km de distância. Nossa entrega residencial atende apenas em até 5km. Escolha <strong>Retirar na Loja</strong>.
                          </p>
                        ) : (
                          <p className="mt-0.5 leading-snug">
                            <strong>Liberado:</strong> Entrega domiciliar disponível! Taxa calculada de R$ {deliveryFee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Address Text Fields */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label htmlFor="street" className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Rua</label>
                      <input
                        type="text"
                        id="street"
                        required={deliveryType === "ENTREGA"}
                        placeholder="Nome da rua"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="number" className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Nº</label>
                      <input
                        type="text"
                        id="number"
                        required={deliveryType === "ENTREGA"}
                        placeholder="123"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="complement" className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Comp. (Opcional)</label>
                      <input
                        type="text"
                        id="complement"
                        placeholder="Apto, Sala"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="zip" className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">CEP</label>
                      <input
                        type="text"
                        id="zip"
                        required={deliveryType === "ENTREGA"}
                        readOnly
                        placeholder="13184-000"
                        value={zipCode}
                        className="mt-1 block w-full rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-100 dark:bg-slate-950 px-3 py-2 text-xs text-slate-550 dark:text-slate-500 font-medium select-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Subtotals & Fees overview */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-sm text-slate-650 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Subtotal dos Itens:</span>
                    <span className="font-bold text-slate-850 dark:text-white">
                      R$ {cartTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {deliveryType === "ENTREGA" && (
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        Taxa de Entrega ({distanceKm} km):
                      </span>
                      <span className="font-bold text-purple-650 dark:text-purple-400">
                        R$ {deliveryFee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-base font-extrabold text-slate-900 dark:text-white">
                    <span>Total do Pedido:</span>
                    <span>
                      R$ {finalTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || (deliveryType === "ENTREGA" && distanceKm > 5)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 shadow-md shadow-purple-600/10 transition active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Processando..." : "Confirmar e Enviar Pedido"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
