import React, { useState } from 'react';
import { Truck, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
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
    <div className="flex min-h-screen">
      
      {/* Left Column (Branding) - AGORA ESCURO (#020617) */}
      <div className="hidden lg:flex w-1/2 bg-[#020617] text-white flex-col justify-between p-12 relative overflow-hidden border-r border-slate-800">
        
        {/* Abstract Background Effect - (Visível apenas no lado escuro) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 mix-blend-screen rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        {/* Logo Area */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Truck className="text-white" size={24} />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">DRB Logística</span>
        </div>

        {/* Main Text */}
        <div className="relative z-10 mb-12">
          <h1 className="text-5xl font-bold leading-tight mb-6 text-white">
            Sistema Operacional <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Inteligente</span>
          </h1>
          <p className="text-slate-400 text-xl leading-relaxed max-w-lg">
            Controle total de viagens, monitoramento de frota e gestão logística da DRB Logística.
            Otimize sua operação com dados em tempo real.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-slate-500">
          © 2025 Global Tech Software. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Column (Form) - AGORA CLARO (bg-white) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative overflow-hidden text-slate-900">
        
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
          
          {/* Mobile Logo (Visible only on lg:hidden) - Cor ajustada para fundo claro */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Truck className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">DRB Logística</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Bem-vindo</h2>
            <p className="text-slate-500">Insira suas credenciais para acessar o painel operacional.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Corporativo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm hover:bg-slate-100 focus:bg-white"
                  placeholder="nome@drblogistica.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm hover:bg-slate-100 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center justify-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Verificando...
                </>
              ) : (
                <>
                  Acessar Painel
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Acesso restrito a colaboradores autorizados da DRB.
          </p>
        </div>
      </div>
    </div>
  );
};