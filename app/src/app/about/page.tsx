'use client';

import { Coffee, ArrowLeft, Bug, Github } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Coffee className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Kávová Anketa</h1>
              <p className="text-sm text-slate-500">O aplikaci</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na hlasování
        </Link>

        {/* About Card */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">O této anketě</h2>

          <div className="space-y-4 text-slate-600">
            <p>
              Tato anketa vznikla jako školní projekt pro demonstraci vývoje a nasazení
              webové aplikace. Cílem je jednoduchá otázka o denní spotřebě kávy, na kterou
              mohou návštěvníci anonymně hlasovat.
            </p>

            <p>
              <strong className="text-slate-900">Technické informace:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Frontend: Next.js 14 s React a Tailwind CSS</li>
              <li>Backend: Next.js API Routes</li>
              <li>Databáze: MySQL 8.0</li>
              <li>Nasazení: Docker Compose na VPS</li>
              <li>CI/CD: GitHub Actions</li>
            </ul>

            <p>
              Hlasování je anonymní a každý návštěvník může hlasovat pouze jednou. Data jsou sdílená
              mezi všemi uživateli a zůstávají zachována i po restartu serveru.
            </p>
          </div>
        </div>

        {/* Bug Report Card */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bug className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-900">Nahlásit chybu</h2>
          </div>

          <div className="space-y-4 text-slate-600">
            <p>
              Našli jste na stránce chybu? Ať už jde o technickou závadu, překlepovou chybu,
              nebo jakýkoliv jiný problém - budeme rádi za vaši zpětnou vazbu.
            </p>

            <p>Chyby prosím nahlaste přes GitHub Issues:</p>

            <a
              href="https://github.com/riveerxd/anketa/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors bg-slate-900 text-white hover:bg-slate-800"
            >
              <Github className="w-4 h-4" />
              Vytvořit nový issue
            </a>

            <p className="text-sm text-slate-500">
              Při nahlašování prosím uvádějte:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-slate-500">
              <li>Popis problému</li>
              <li>Kroky k reprodukci chyby</li>
              <li>Prohlížeč a zařízení</li>
              <li>Screenshot (pokud je to možné)</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center text-sm text-slate-500">
          2026 Kávová Anketa
        </div>
      </footer>
    </div>
  );
}
