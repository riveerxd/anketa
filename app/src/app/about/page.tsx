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
              <h1 className="text-xl font-semibold text-slate-900">Kavova Anketa</h1>
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
          Zpet na hlasovani
        </Link>

        {/* About Card */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">O teto ankete</h2>

          <div className="space-y-4 text-slate-600">
            <p>
              Tato anketa vznikla jako skolni projekt pro demonstraci vyvoje a nasazeni
              webove aplikace. Cílem je jednoducha otazka o denni spotrebe kavy, na kterou
              mohou navstevnici anonymne hlasovat.
            </p>

            <p>
              <strong className="text-slate-900">Technicke informace:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Frontend: Next.js 14 s React a Tailwind CSS</li>
              <li>Backend: Next.js API Routes</li>
              <li>Databaze: MySQL 8.0</li>
              <li>Nasazeni: Docker Compose na VPS</li>
              <li>CI/CD: GitHub Actions</li>
            </ul>

            <p>
              Hlasovani je anonymni a kazdy navstevnik muze hlasovat. Data jsou sdilena
              mezi vsemi uzivateli a zustavaji zachovana i po restartu serveru.
            </p>
          </div>
        </div>

        {/* Bug Report Card */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bug className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-900">Nahlasit chybu</h2>
          </div>

          <div className="space-y-4 text-slate-600">
            <p>
              Nasli jste na strance chybu? At uz jde o technicku zavadu, preklepovou chybu,
              nebo jakykoliv jiny problem - budeme radi za vasi zpetnou vazbu.
            </p>

            <p>Chyby prosim nahlaste pres GitHub Issues:</p>

            <a
              href="https://github.com/riveerxd/anketa/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors bg-slate-900 text-white hover:bg-slate-800"
            >
              <Github className="w-4 h-4" />
              Vytvorit novy issue
            </a>

            <p className="text-sm text-slate-500">
              Pri nahlasovani prosim uvadejte:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-slate-500">
              <li>Popis problemu</li>
              <li>Kroky k reprodukci chyby</li>
              <li>Prohlizec a zarizeni</li>
              <li>Screenshot (pokud je to mozne)</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center text-sm text-slate-500">
          2026 Kavova Anketa
        </div>
      </footer>
    </div>
  );
}
