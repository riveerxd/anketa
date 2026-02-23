'use client';

import { useState } from 'react';
import { Coffee, RotateCcw, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminPage() {
  const [resetToken, setResetToken] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!resetToken.trim()) {
      setMessage({ type: 'error', text: 'Zadejte token' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Hlasování bylo resetováno!' });
        setResetToken('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Reset selhal' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Chyba připojení k serveru' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Coffee className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Administrace</h1>
              <p className="text-sm text-slate-500">Kávová Anketa</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na anketu
        </Link>

        {/* Message */}
        {message && (
          <div className={cn(
            "mb-6 px-4 py-3 rounded-lg flex items-center gap-3",
            message.type === 'success'
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          )}>
            {message.type === 'success'
              ? <Check className="w-5 h-5 text-emerald-600" />
              : <AlertCircle className="w-5 h-5 text-red-600" />
            }
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Reset Card */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Reset hlasování</h2>

          <p className="text-sm text-slate-600 mb-4">
            Tato akce smaže všechny hlasy a umožní všem uživatelům hlasovat znovu.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Reset token
              </label>
              <input
                type="password"
                placeholder="Zadejte token..."
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              {loading ? 'Resetuji...' : 'Resetovat hlasování'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
