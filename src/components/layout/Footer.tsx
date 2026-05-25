import React from "react";
import { Phone, Mail, MapPin, Clock, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <span className="text-[#f08bab] text-xl font-black tracking-wider uppercase">
              RR ARTES
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              O seu cantinho de papelaria criativa, variedades, bordados personalizados e consertos profissionais em roupas na cidade de Hortolândia. Cuidamos do seu estilo e dos seus materiais com carinho artesanal.
            </p>
          </div>

          {/* Column 2: Atendimento e Localização */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Contato & Endereço
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-rosa-500 dark:text-verde-400 shrink-0" />
                <span>Rua da Amizade, 95 - Jardim Brasil, Hortolândia - SP</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-rosa-500 dark:text-verde-400 shrink-0" />
                <span>(19) 98888-7777</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-rosa-500 dark:text-verde-400 shrink-0" />
                <span>contato@rrartes.com.br</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Horário de Funcionamento */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Funcionamento
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-rosa-500 dark:text-verde-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Segunda a Sexta:</p>
                  <p className="text-slate-500 dark:text-slate-400">08:00 às 18:00</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-rosa-500 dark:text-verde-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Sábado:</p>
                  <p className="text-slate-500 dark:text-slate-400">08:00 às 12:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="mt-12 border-t border-slate-200 dark:border-slate-900 pt-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} RR Artes. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1 justify-center">
            Feito com <Heart className="h-3 w-3 fill-rosa-400 text-rosa-400" /> para a comunidade de Hortolândia
          </p>
        </div>
      </div>
    </footer>
  );
}
