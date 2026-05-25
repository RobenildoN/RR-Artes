"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Loader2,
  Package,
  FileCheck,
  ClipboardList,
  Plus,
  Trash2,
  Edit2,
  FileDown,
  Phone,
  User,
  Activity,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // Navigation states
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "budgets">("products");

  // Data states
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  
  // Fetch loaders
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingBudgets, setLoadingBudgets] = useState(false);

  // Form states (Product creation / update)
  const [prodForm, setProdForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "papelaria",
    stock: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Redirection / Guard effect
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Loaders triggers based on active tab
  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    if (activeTab === "products") fetchProducts();
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "budgets") fetchBudgets();
  }, [activeTab, user]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/produtos");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/pedidos");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchBudgets = async () => {
    setLoadingBudgets(true);
    try {
      const res = await fetch("/api/orcamentos");
      if (res.ok) {
        const data = await res.json();
        setBudgets(data.orcamentos || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBudgets(false);
    }
  };

  // Product form submission handler
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setFormLoading(true);

    const { id, name, description, price, imageUrl, category, stock } = prodForm;

    if (!name || !description || !price || !imageUrl || !category || !stock) {
      setFormError("Preencha todos os campos obrigatórios.");
      setFormLoading(false);
      return;
    }

    try {
      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing ? `/api/produtos/${id}` : "/api/produtos";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, price, imageUrl, category, stock }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormSuccess(isEditing ? "Produto atualizado!" : "Produto cadastrado!");
        // Reset form
        setProdForm({
          id: "",
          name: "",
          description: "",
          price: "",
          imageUrl: "",
          category: "papelaria",
          stock: "",
        });
        setIsEditing(false);
        fetchProducts();
      } else {
        setFormError(data.error || "Ocorreu um erro ao salvar o produto.");
      }
    } catch (err) {
      setFormError("Erro de comunicação com o servidor.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClick = (prod: any) => {
    setProdForm({
      id: prod.id,
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      imageUrl: prod.imageUrl,
      category: prod.category,
      stock: prod.stock.toString(),
    });
    setIsEditing(true);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir/desativar este produto?")) return;
    try {
      const res = await fetch(`/api/produtos/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Order status update handler
  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/pedidos/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) {
    return (
      <div className="flex-grow flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
      </div>
    );
  }

  // Double check admin rights before rendering
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="rounded-2xl border border-red-100 bg-white p-8 shadow-md space-y-4">
          <ShieldAlert className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="text-xl font-bold text-slate-900">Acesso Restrito</h2>
          <p className="text-slate-500 text-sm">
            Esta área é destinada exclusivamente a administradores credenciados. Redirecionando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Brand header info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
            <Activity className="h-8 w-8 text-pink-600 animate-pulse" />
            <span>Painel Administrativo</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Gerencie produtos da papelaria, controle pedidos e analise orçamentos de serviços.</p>
        </div>
        
        {/* Navigation Tabs buttons */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          {[
            { id: "products", label: "Produtos", icon: Package },
            { id: "orders", label: "Pedidos", icon: ClipboardList },
            { id: "budgets", label: "Orçamentos", icon: FileCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-bold transition border ${
                  activeTab === tab.id
                    ? "bg-pink-600 border-pink-600 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-pink-200 hover:text-pink-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TAB CONTENT: PRODUCTS CRUD */}
      {activeTab === "products" && (
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Create/Edit form */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-base">
              {isEditing ? "Editar Produto" : "Novo Produto"}
            </h3>
            
            {formError && (
              <div className="rounded-lg bg-red-50 border border-red-100 p-2.5 text-[11px] text-red-700 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-2.5 text-[11px] text-emerald-800 flex items-center space-x-2">
                <FileCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div>
                <label htmlFor="prod-name" className="block font-bold text-slate-400 uppercase">Nome</label>
                <input
                  type="text"
                  id="prod-name"
                  required
                  placeholder="Caderno, Estojo..."
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="prod-cat" className="block font-bold text-slate-400 uppercase">Categoria</label>
                  <select
                    id="prod-cat"
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-slate-200 px-2 py-2 focus:border-pink-500 focus:outline-none"
                  >
                    <option value="papelaria">Papelaria</option>
                    <option value="miscelaneas">Miscelâneas</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="prod-price" className="block font-bold text-slate-400 uppercase">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="prod-price"
                    required
                    placeholder="19.90"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="prod-stock" className="block font-bold text-slate-400 uppercase">Estoque</label>
                  <input
                    type="number"
                    id="prod-stock"
                    required
                    placeholder="50"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="prod-img" className="block font-bold text-slate-400 uppercase">URL Imagem</label>
                  <input
                    type="text"
                    id="prod-img"
                    required
                    placeholder="https://images.unsplash..."
                    value={prodForm.imageUrl}
                    onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="prod-desc" className="block font-bold text-slate-400 uppercase">Descrição</label>
                <textarea
                  id="prod-desc"
                  required
                  rows={3}
                  placeholder="Características, folhas, tamanho..."
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-pink-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-grow rounded-lg bg-pink-600 text-white py-2.5 font-semibold hover:bg-pink-700 transition"
                >
                  {formLoading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Cadastrar Produto"}
                </button>
                
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setProdForm({ id: "", name: "", description: "", price: "", imageUrl: "", category: "papelaria", stock: "" });
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-500 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Products List Table */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm overflow-hidden">
            <h3 className="font-bold text-slate-800 text-base mb-4">Catálogo de Produtos</h3>

            {loadingProducts ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">Nenhum produto cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Produto</th>
                      <th className="px-4 py-3">Categoria</th>
                      <th className="px-4 py-3 text-right">Preço</th>
                      <th className="px-4 py-3 text-center">Estoque</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-4 py-3 flex items-center space-x-2.5">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="h-8 w-8 rounded object-cover border shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-800 truncate block max-w-[180px]">{prod.name}</span>
                            {!prod.active && <span className="text-[9px] bg-red-100 text-red-700 px-1 py-0.2 rounded font-semibold mt-0.5">Inativo</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize">{prod.category}</td>
                        <td className="px-4 py-3 text-right font-semibold">R$ {prod.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`rounded font-bold px-1.5 py-0.5 ${prod.stock <= 5 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                            {prod.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1 shrink-0">
                          <button
                            onClick={() => handleEditClick(prod)}
                            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Desativar / Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm overflow-hidden">
          <h3 className="font-bold text-slate-800 text-base mb-4">Gerenciamento de Pedidos</h3>

          {loadingOrders ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400">Nenhum pedido realizado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Cliente / Contato</th>
                    <th className="px-4 py-3">Itens</th>
                    <th className="px-4 py-3">Tipo Entrega</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50 transition">
                      {/* Customer info */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-pink-500" />
                          <span>{ord.user.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{ord.user.email}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <Phone className="h-3 w-3" />
                          <span>{ord.user.phone || "Sem telefone"}</span>
                        </div>
                      </td>

                      {/* Items lists */}
                      <td className="px-4 py-3">
                        <div className="space-y-0.5 max-w-[200px] truncate">
                          {ord.items.map((it: any) => (
                            <div key={it.id} className="text-[10px] text-slate-500 truncate">
                              • {it.product.name} ({it.quantity}x)
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Delivery type & address details */}
                      <td className="px-4 py-3">
                        <span className={`rounded-lg px-2 py-0.5 font-bold uppercase text-[9px] ${
                          ord.deliveryType === "RETIRADA"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-pink-100 text-pink-700"
                        }`}>
                          {ord.deliveryType === "RETIRADA" ? "Retirada" : "Entrega"}
                        </span>
                        {ord.deliveryType === "ENTREGA" && ord.address && (
                          <div className="text-[9px] text-slate-400 mt-1 max-w-[150px] truncate leading-tight">
                            {ord.address.street}, {ord.address.number} ({ord.address.neighborhood})
                          </div>
                        )}
                      </td>

                      {/* Final total price */}
                      <td className="px-4 py-3 text-right font-bold text-slate-800">
                        R$ {ord.total.toFixed(2)}
                      </td>

                      {/* Status selectors */}
                      <td className="px-4 py-3 text-center shrink-0">
                        <select
                          value={ord.status}
                          onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                          className={`rounded-lg px-2 py-1 text-[10px] font-bold focus:outline-none border ${
                            ord.status === "DELIVERED"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                              : ord.status === "SHIPPED"
                              ? "bg-indigo-50 border-indigo-200 text-indigo-800"
                              : ord.status === "PAID"
                              ? "bg-sky-50 border-sky-200 text-sky-800"
                              : ord.status === "CANCELLED"
                              ? "bg-red-50 border-red-200 text-red-800"
                              : "bg-amber-50 border-amber-200 text-amber-800"
                          }`}
                        >
                          <option value="PENDING">Pendente (Aguard. Pgto)</option>
                          <option value="PAID">Pago (Preparando)</option>
                          <option value="SHIPPED">Enviado / Pronto P/ Retirada</option>
                          <option value="DELIVERED">Entregue</option>
                          <option value="CANCELLED">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB CONTENT: BUDGETS BOX */}
      {activeTab === "budgets" && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm overflow-hidden">
          <h3 className="font-bold text-slate-800 text-base mb-4">Solicitações de Orçamentos</h3>

          {loadingBudgets ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
            </div>
          ) : budgets.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400">Nenhum orçamento solicitado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Cliente / Contato</th>
                    <th className="px-4 py-3">Tipo do Serviço</th>
                    <th className="px-4 py-3">Descrição Detalhada</th>
                    <th className="px-4 py-3 text-center">Anexo</th>
                    <th className="px-4 py-3 text-center">E-mail Notificado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {budgets.map((bud) => (
                    <tr key={bud.id} className="hover:bg-slate-50/50 transition">
                      {/* Customer info */}
                      <td className="px-4 py-3 font-bold text-slate-800">
                        <div className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-pink-500" />
                          <span>{bud.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                          <Phone className="h-3 w-3" />
                          <span>{bud.phone}</span>
                        </div>
                      </td>

                      {/* Service Type labels */}
                      <td className="px-4 py-3">
                        <span className={`rounded-lg px-2 py-0.5 font-bold uppercase text-[9px] ${
                          bud.type === "BORDADO"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}>
                          {bud.type === "BORDADO" ? "Bordado" : "Conserto Roupa"}
                        </span>
                      </td>

                      {/* Budget Details Description */}
                      <td className="px-4 py-3 max-w-[280px]">
                        <p className="line-clamp-3 leading-relaxed whitespace-pre-wrap">{bud.description}</p>
                      </td>

                      {/* File attachment download link */}
                      <td className="px-4 py-3 text-center shrink-0">
                        <a
                          href={bud.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold px-3 py-1.5 border border-pink-100 hover:border-pink-200 transition"
                        >
                          <FileDown className="h-3.5 w-3.5" />
                          <span>Baixar Anexo</span>
                        </a>
                      </td>

                      {/* Automated email sending checkbox/indicator */}
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded px-1.5 py-0.5 font-bold text-[9px] ${
                          bud.emailSent
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {bud.emailSent ? "Disparado" : "Offline Logged"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
