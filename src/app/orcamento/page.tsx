"use client";

import React, { useState, useRef } from "react";
import { Scissors, FileText, Upload, CheckCircle, AlertCircle, FileCheck, Loader2 } from "lucide-react";

export default function BudgetRequestPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tipo, setTipo] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Interactive UI states
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleFileSelection = (file: File) => {
    setError(null);
    const ext = file.name.split(".").pop()?.toLowerCase();
    
    // Check file type
    if (ext !== "pdf" && ext !== "png" && ext !== "jpg" && ext !== "jpeg") {
      setError("Formato de arquivo inválido. Por favor, anexe apenas PDF ou imagens (PNG, JPG).");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("O arquivo selecionado é muito grande. O limite máximo permitido é de 5 MB.");
      return;
    }

    setSelectedFile(file);

    // Create preview if it's an image
    if (ext !== "pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreviewUrl(null); // PDF doesn't have an easy native data URL preview
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  // Drag and Drop support
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFilePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!tipo || !nome || !telefone || !descricao || !selectedFile) {
      setError("Por favor, preencha todos os campos obrigatórios e anexe o arquivo.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("tipo", tipo);
      formData.append("nome", nome);
      formData.append("telefone", telefone);
      formData.append("descricao", descricao);
      formData.append("file", selectedFile);

      const res = await fetch("/api/orcamentos", {
        method: "POST",
        body: formData, // No content-type header, let browser set it with boundary
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        // Reset state
        setTipo("");
        setNome("");
        setTelefone("");
        setDescricao("");
        setSelectedFile(null);
        setFilePreviewUrl(null);
      } else {
        setError(data.error || "Ocorreu um erro ao enviar sua solicitação.");
      }
    } catch (err) {
      setError("Erro ao se conectar com o servidor. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rosa-100 dark:bg-rosa-900/30 px-3.5 py-1.5 text-xs font-bold text-rosa-700 dark:text-verde-300">
          <Scissors className="h-3.5 w-3.5 animate-pulse" /> Atendimento Personalizado
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
          Pedido de Orçamento Online
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Precisa de um bordado computadorizado exclusivo ou de um conserto/ajuste em sua roupa? Envie os detalhes e o modelo anexado. Analisaremos tudo e retornaremos seu orçamento em breve!
        </p>
      </div>

      {/* Main Submission Form Card */}
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-md transition-colors">
        {success ? (
          <div className="flex flex-col items-center justify-center text-center py-10 space-y-5">
            <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 animate-bounce" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">Orçamento Enviado com Sucesso!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
              Sua solicitação de orçamento foi salva em nosso sistema e encaminhada para o e-mail administrativo da **RR Artes**. Fique atento ao seu celular ou email, entraremos em contato rapidamente.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="rounded-xl bg-rosa-500 hover:bg-rosa-600 text-white font-semibold px-6 py-3 transition"
            >
              Solicitar Novo Orçamento
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 p-4 text-xs text-red-700 dark:text-red-300 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Type Select */}
              <div>
                <label htmlFor="tipo" className="block text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wide">
                  Tipo do Pedido (Obrigatório)
                </label>
                <select
                  id="tipo"
                  required
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-4 py-3.5 text-sm focus:border-rosa-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-rosa-500 transition text-slate-800 dark:text-white"
                >
                  <option value="">Selecione o serviço...</option>
                  <option value="BORDADO">Bordado Computadorizado</option>
                  <option value="CONSERTO_ROUPA">Conserto / Ajuste de Roupa</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="nome" className="block text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wide">
                  Nome do Cliente (Obrigatório)
                </label>
                <input
                  type="text"
                  id="nome"
                  required
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-4 py-3.5 text-sm focus:border-rosa-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-rosa-500 transition text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wide">
                  Telefone / WhatsApp (Obrigatório)
                </label>
                <input
                  type="text"
                  id="phone"
                  required
                  placeholder="(19) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-4 py-3.5 text-sm focus:border-rosa-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-rosa-500 transition text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="desc" className="block text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wide">
                Descrição do Pedido (Obrigatório)
              </label>
              <textarea
                id="desc"
                required
                rows={5}
                placeholder="Descreva detalhadamente o serviço. Para bordados, indique a posição e tamanho aproximado. Para consertos, especifique o ajuste necessário (ex: encurtar manga, trocar zíper)."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-4 py-3.5 text-sm focus:border-rosa-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-rosa-500 transition resize-none text-slate-800 dark:text-white"
              />
            </div>

            {/* Custom Interactive File Uploader */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wide mb-1">
                Anexo de Imagem ou PDF (Obrigatório)
              </label>
              
              <input
                type="file"
                ref={fileInputRef}
                required
                onChange={handleFileInputChange}
                accept=".pdf,image/png,image/jpeg,image/jpg"
                className="hidden"
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
                  isDragOver
                    ? "border-rosa-500 bg-rosa-500/5 dark:bg-rosa-950/10"
                    : "border-slate-200 dark:border-slate-800 hover:border-rosa-300 dark:hover:border-rosa-900 hover:bg-slate-50/50 dark:hover:bg-slate-950/30"
                }`}
              >
                {selectedFile ? (
                  /* Attached Preview Card */
                  <div className="space-y-4 w-full max-w-sm">
                    {filePreviewUrl ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm mx-auto w-48 bg-slate-50 dark:bg-slate-950">
                        <img
                          src={filePreviewUrl}
                          alt="Pré-visualização do anexo"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rosa-50 dark:bg-rosa-950/40 text-rosa-500 dark:text-verde-400">
                        <FileCheck className="h-7 w-7" />
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="rounded-lg border border-red-100 bg-red-50 px-4 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                    >
                      Remover Arquivo
                    </button>
                  </div>
                ) : (
                  /* Empty State Uploader */
                  <div className="space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 group-hover:bg-rosa-50 dark:group-hover:bg-rosa-950/40 group-hover:text-rosa-500 dark:group-hover:text-verde-400 transition">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Arraste seu arquivo aqui ou <span className="text-rosa-500 dark:text-verde-400 underline">busque no computador</span>
                      </p>
                      <p className="text-[10px] text-slate-455 dark:text-slate-500 mt-1">Formatos aceitos: PDF, PNG, JPG, JPEG (Máx. 5 MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rosa-500 hover:bg-rosa-600 text-white font-semibold py-4 shadow-md shadow-rosa-500/10 transition active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processando e Anexando...</span>
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" />
                  <span>Enviar Pedido de Orçamento</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
