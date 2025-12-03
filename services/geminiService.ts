import { GoogleGenAI } from "@google/genai";
import { LogisticsData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeOperations = async (data: LogisticsData): Promise<string> => {
  try {
    // Preparar resumo dos dados para economizar tokens e ser direto
    const dataSummary = JSON.stringify({
      trips_active: data.trips.filter(t => t.status !== 'Finalizado' && t.status !== 'Pendente').length,
      trips_pending: data.trips.filter(t => t.status === 'Pendente').length,
      drivers_free: data.drivers.filter(d => d.status === 'Livre').length,
      drivers_busy: data.drivers.filter(d => d.status === 'Ocupado').length,
      terminals: data.terminals.map(t => ({ name: t.name, capacity: t.capacity })),
      alerts: "Verificar se há muitos motoristas no mesmo terminal ou viagens atrasadas."
    });

    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model: model,
      contents: `
        Atue como o Gerente Operacional Sênior da DRB Logística.
        
        Analise os dados operacionais abaixo (JSON) e forneça um relatório tático de 3 pontos curtos e diretos.
        Não use formatação complexa (markdown), use apenas texto corrido com quebras de linha.
        
        Foco da análise:
        1. Identificar gargalos (ex: falta de motoristas livres).
        2. Eficiência dos Terminais.
        3. Ação recomendada imediata para o operador.

        Dados: ${dataSummary}
      `,
      config: {
        temperature: 0.4, // Temperatura mais baixa para ser mais analítico e menos criativo
      }
    });

    return response.text || "Análise indisponível no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Erro de conexão com o Analista IA. Tente novamente.";
  }
};