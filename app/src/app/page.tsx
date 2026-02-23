'use client';

import { useState, useEffect } from 'react';
import {
  Coffee,
  Vote,
  BarChart3,
  RotateCcw,
  Check,
  AlertCircle,
  Lock,
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Option {
  id: number;
  label: string;
  text: string;
  votes: number;
}

interface ResultsData {
  question: string;
  options: Option[];
  totalVotes: number;
}

// Generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Cookie helpers
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

function setCookie(name: string, value: string, days: number = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [checkingVote, setCheckingVote] = useState(true);

  const question = 'Kolik šálků kávy denně je ještě normální?';

  // Initialize voter ID cookie
  useEffect(() => {
    let voterId = getCookie('voter_id');
    if (!voterId) {
      voterId = generateUUID();
      setCookie('voter_id', voterId);
    }
  }, []);

  // Check if user already voted
  useEffect(() => {
    const checkVoted = async () => {
      try {
        const res = await fetch('/api/check-voted');
        const data = await res.json();
        setHasVoted(data.hasVoted);
        if (data.hasVoted) {
          setShowResults(true);
        }
      } catch (err) {
        console.error('Failed to check vote status:', err);
      } finally {
        setCheckingVote(false);
      }
    };
    checkVoted();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch('/api/results');
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch results:', err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleVote = async () => {
    if (!selectedOption || hasVoted) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId: selectedOption }),
      });

      const data = await res.json();

      if (data.success) {
        setResults(data.data);
        setShowResults(true);
        setHasVoted(true);
        setMessage({ type: 'success', text: 'Hlas byl zaznamenán!' });
      } else {
        if (data.alreadyVoted) {
          setHasVoted(true);
          setShowResults(true);
        }
        setMessage({ type: 'error', text: data.error || 'Něco se pokazilo' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Chyba připojení k serveru' });
    } finally {
      setLoading(false);
    }
  };

  const handleShowResults = () => {
    fetchResults();
    setShowResults(true);
  };

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
        setSelectedOption(null);
        setShowReset(false);
        setHasVoted(false);
        fetchResults();
      } else {
        setMessage({ type: 'error', text: data.error || 'Reset selhal' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Chyba připojení k serveru' });
    } finally {
      setLoading(false);
    }
  };

  if (checkingVote) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Načítání...</div>
      </div>
    );
  }

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
              <p className="text-sm text-slate-500">Hlasuj a zjisti, co si myslí ostatní</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Message Toast */}
        {message && (
          <div className={cn(
            "mb-6 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2",
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

        {/* Already Voted Notice */}
        {hasVoted && (
          <div className="mb-6 px-4 py-3 rounded-lg flex items-center gap-3 bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">Už jste hlasoval/a. Děkujeme za váš hlas!</span>
          </div>
        )}

        {/* Voting Card */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-slate-900">{results?.question || question}</h2>
          </div>

          <div className="p-6 space-y-3">
            {results?.options.map((option) => (
              <button
                key={option.id}
                onClick={() => !hasVoted && setSelectedOption(option.id)}
                disabled={hasVoted}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg border-2 transition-all",
                  hasVoted
                    ? "cursor-not-allowed opacity-60"
                    : "hover:border-slate-300 hover:bg-slate-50",
                  selectedOption === option.id
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                    selectedOption === option.id
                      ? "border-slate-900 bg-slate-900"
                      : "border-slate-300"
                  )}>
                    {selectedOption === option.id && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-slate-700">
                    <span className="font-medium text-slate-900">{option.label})</span> {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="p-6 pt-0 flex gap-3">
            <button
              onClick={handleVote}
              disabled={!selectedOption || loading || hasVoted}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors",
                "bg-slate-900 text-white hover:bg-slate-800",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Vote className="w-4 h-4" />
              {hasVoted ? 'Už jste hlasoval/a' : loading ? 'Odesílám...' : 'Hlasovat'}
            </button>
            <button
              onClick={handleShowResults}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <BarChart3 className="w-4 h-4" />
              Výsledky
            </button>
          </div>
        </div>

        {/* Results Card */}
        {showResults && results && (
          <div className="mt-6 bg-white rounded-xl border shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <div className="p-6 border-b flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-500" />
              <h3 className="font-semibold text-slate-900">Výsledky</h3>
              <span className="ml-auto text-sm text-slate-500">
                {results.totalVotes} {results.totalVotes === 1 ? 'hlas' : results.totalVotes < 5 ? 'hlasy' : 'hlasů'}
              </span>
            </div>

            <div className="p-6 space-y-4">
              {results.options.map((option) => {
                const percentage = results.totalVotes > 0
                  ? Math.round((option.votes / results.totalVotes) * 100)
                  : 0;

                return (
                  <div key={option.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-slate-700">
                        <span className="font-medium">{option.label})</span> {option.text}
                      </span>
                      <span className="text-sm font-medium text-slate-900">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {option.votes} {option.votes === 1 ? 'hlas' : option.votes < 5 ? 'hlasy' : 'hlasů'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Admin Reset */}
        <div className="mt-6">
          <button
            onClick={() => setShowReset(!showReset)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span>Admin</span>
            <ChevronRight className={cn(
              "w-4 h-4 transition-transform",
              showReset && "rotate-90"
            )} />
          </button>

          {showReset && (
            <div className="mt-3 p-4 bg-white rounded-xl border shadow-sm animate-in fade-in slide-in-from-top-1">
              <div className="flex gap-3">
                <input
                  type="password"
                  placeholder="Reset token..."
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-center gap-4 text-sm text-slate-500">
          <span>2026 Kávová Anketa</span>
          <span className="text-slate-300">|</span>
          <Link href="/about" className="inline-flex items-center gap-1 hover:text-slate-700 transition-colors">
            <Info className="w-3.5 h-3.5" />
            O anketě
          </Link>
        </div>
      </footer>
    </div>
  );
}
