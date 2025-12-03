import { User } from '../types';
import { GOOGLE_SCRIPT_URL } from './backend';

// Mock user for fallback/testing
const MOCK_USER: User = {
  id: 'u-admin',
  name: 'Administrador Operacional',
  email: 'admin@drblogistica.com',
  role: 'Gerente',
  avatar: 'A'
};

export const authenticateUser = async (email: string, password: string): Promise<User> => {
  try {
    // Adiciona o param type=users conforme seu script backend
    const url = `${GOOGLE_SCRIPT_URL}?type=users&nocache=${Date.now()}`;
    
    console.log("🔐 Tentando autenticar em:", url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Falha na conexão com servidor de autenticação');
    }

    const users = await response.json();
    console.log("👥 Usuários carregados:", users.length);

    // Procura usuário compatível (Case insensitive para email)
    // O backend retorna chaves em MAIÚSCULO: EMAIL, SENHA, NOME, SOBRENOME
    const userFound = users.find((u: any) => 
      u.EMAIL && 
      u.EMAIL.toString().toLowerCase().trim() === email.toLowerCase().trim() &&
      u.SENHA && 
      u.SENHA.toString() === password
    );

    if (userFound) {
      return {
        id: userFound.ID || 'u-google',
        name: `${userFound.NOME} ${userFound.SOBRENOME || ''}`.trim(),
        email: userFound.EMAIL,
        role: userFound.SETOR || 'Operação',
        avatar: userFound.NOME ? userFound.NOME.charAt(0).toUpperCase() : 'U'
      };
    }

    // Fallback para teste se for o admin padrão e não estiver na planilha
    if (email === MOCK_USER.email && password === '123456') {
        console.warn("⚠️ Usando usuário MOCK para login.");
        return MOCK_USER;
    }

    throw new Error('Credenciais inválidas');
  } catch (error) {
    console.error("Erro no login:", error);
    
    // Se der erro de rede, permite o mock para não travar o desenvolvimento
    if (email === MOCK_USER.email && password === '123456') {
        return MOCK_USER;
    }
    
    throw error;
  }
};