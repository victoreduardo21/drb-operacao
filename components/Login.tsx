import React, { useState } from 'react';
import { Truck, Mail, Lock, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { authenticateUser } from '../services/auth';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await authenticateUser(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError('Email ou senha incorretos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-['Inter']">
      
      {/* Lado Esquerdo - Branding com Efeito de Claridade (Spotlight) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#020617] relative overflow-hidden flex-col justify-between p-12 text-white border-r border-slate-900">
        
        {/* CONFIGURAÇÃO DA CLARIDADE (LUZ) */}
        {/* 1. Gradiente de fundo suave saindo do canto superior esquerdo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-900/30 via-[#020617] to-[#020617] z-0"></div>
        
        {/* 2. O ponto de luz forte (Spotlight) com blur alto */}
        <div className="absolute -top-[150px] -left-[150px] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 font-bold text-3xl tracking-wide">
             <div className="h-14 w-14 bg-blue-600/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
               <Truck className="h-8 w-8 text-white" />
             </div>
             <span>DRB Logística</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg mt-12">
          <h1 className="text-5xl font-bold mb-6 leading-tight tracking-tight">
            Sistema Operacional <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Inteligente
            </span>
          </h1>
          <p className="text-slate-400 text-lg font-light leading-relaxed">
            Controle total de viagens, monitoramento de frota e gestão logística da DRB Logística. Otimize sua operação com dados em tempo real.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-600 font-medium">
          © {new Date().getFullYear()} Global Tech Software. Todos os direitos reservados.
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white lg:bg-transparent">
        <div className="w-full max-w-sm lg:max-w-md space-y-8 animate-in slide-in-from-right duration-700">
          
          <div className="text-center lg:text-left">
            
            {/* CABEÇALHO EXCLUSIVO MOBILE: Estruturado e Arrumado */}
            <div className="lg:hidden flex flex-col items-center mb-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Truck className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">DRB Logística</span>
              </div>
              <div className="px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Sistema Operacional</span>
              </div>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Bem-vindo</h2>
            <p className="mt-2 text-slate-500 text-sm lg:text-base">Insira suas credenciais para acessar o painel.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Corporativo</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400 shadow-sm"
                    placeholder="nome@drblogistica.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400 shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-slate-600">Lembrar-me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-blue-600/30 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <span>Acessar Painel</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
             <p className="text-xs text-slate-400">Acesso restrito a colaboradores autorizados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};