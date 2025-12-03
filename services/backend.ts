import { Terminal } from '../types';

/**
 * ==================================================================================
 * CÓDIGO GOOGLE APPS SCRIPT (Certifique-se que este código está na sua planilha)
 * ==================================================================================
 * 
 * function doGet(e) {
 *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Terminais");
 *   if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
 *   
 *   var data = sheet.getDataRange().getValues();
 *   if (data.length <= 1) return ContentService.createTextOutput("[]").setMimeType(ContentService.MimeType.JSON);
 *
 *   var headers = data[0];
 *   var rawRows = data.slice(1);
 *
 *   var result = rawRows.map(function(row) {
 *     var obj = {};
 *     headers.forEach(function(header, index) {
 *       if (header) {
 *         // Transforma em Maiúsculo para evitar erro (ex: "Terminal" -> "TERMINAL")
 *         var cleanHeader = header.toString().toUpperCase().trim();
 *         obj[cleanHeader] = row[index];
 *       }
 *     });
 *     return obj;
 *   });
 *
 *   return ContentService.createTextOutput(JSON.stringify(result))
 *     .setMimeType(ContentService.MimeType.JSON);
 * }
 */

// URL DA SUA PLANILHA (Atualizada)
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxALoRVfzvwz6Gfl5xhfvshRGMs3f6E7DGamtXYCIZ0x-d8oynUiNd42JsDcuGrrPMhaw/exec"; 

// DADOS DE TESTE (Caso a conexão falhe, agora inclui o DALASTRA que você pediu)
const MOCK_TERMINALS: any[] = [
  {
    "ID_TERMINAL": "7",
    "TERMINAL": "DEPOTCE/REDEX",
    "CIDADE": "CUBATÃO",
    "ENDEREÇO": "Av. Plínio de Queirós, Cubatão - SP",
    "CNPJ": "4533138000107",
    "RAIO": 0.1,
    "ENTRADA": "-23.825454, -46.364229"
  },
  {
    "ID_TERMINAL": "8",
    "TERMINAL": "DALASTRA LOGÍSTICA",
    "CIDADE": "SANTOS",
    "ENDEREÇO": "Rua Alemoa, Santos - SP",
    "CNPJ": "12345678000199",
    "RAIO": 0.1,
    "ENTRADA": "-23.935400, -46.345000" // Coordenada aproximada para demonstração
  }
];

// Função auxiliar para achar uma chave ignorando maiúsculas/minúsculas
const findValue = (obj: any, possibleKeys: string[]) => {
  const objKeys = Object.keys(obj);
  for (const key of possibleKeys) {
    // Procura a chave exata ou variação
    const found = objKeys.find(k => k.toUpperCase().trim() === key.toUpperCase().trim());
    if (found) return obj[found];
  }
  return null;
};

export const fetchTerminalsFromSheet = async (): Promise<Terminal[]> => {
  let rawData = [];

  try {
    // Adicionamos ?nocache para evitar que o navegador guarde dados velhos
    const urlWithCacheBuster = `${GOOGLE_SCRIPT_URL}?nocache=${Date.now()}`;
    console.log("🔄 Tentando conectar na planilha:", urlWithCacheBuster);
    
    const response = await fetch(urlWithCacheBuster);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const text = await response.text();
    
    // Tenta parsear o JSON
    try {
      rawData = JSON.parse(text);
      console.log("✅ Dados recebidos da planilha:", rawData);
    } catch (e) {
      console.error("❌ Erro ao ler JSON. Verifique Apps Script.", text);
      throw e;
    }

  } catch (error) {
    console.warn("⚠️ Falha na conexão com a planilha. Usando dados locais (MOCK) temporariamente.", error);
    rawData = MOCK_TERMINALS;
  }

  if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
    console.warn("⚠️ Planilha retornou lista vazia. Usando Mock.");
    rawData = MOCK_TERMINALS;
  }

  // MAPEAMENTO DOS DADOS
  return rawData.map((row: any) => {
    // 1. Coordenadas
    const coordString = findValue(row, ['ENTRADA', 'COORDENADAS', 'LATLNG']) || "0, 0";
    const [latStr, lngStr] = coordString.toString().split(',').map((s: string) => s.trim());

    // 2. Nome do Terminal (PRIORIDADE TOTAL PARA A COLUNA 'TERMINAL')
    const terminalName = findValue(row, ['TERMINAL', 'NOME', 'TITULO']) || 'Terminal Sem Nome';

    // 3. ID
    const id = findValue(row, ['ID_TERMINAL', 'ID', 'CODIGO']) || `T-${Math.random().toString(36).substr(2, 5)}`;

    return {
      id: id.toString(),
      name: terminalName.toString(),
      city: findValue(row, ['CIDADE', 'CITY']) || '',
      address: findValue(row, ['ENDEREÇO', 'ENDERECO', 'ADDRESS']) || '',
      cnpj: findValue(row, ['CNPJ', 'DOCUMENTO']) || '',
      lat: parseFloat(latStr) || 0,
      lng: parseFloat(lngStr) || 0,
      radius: parseFloat(findValue(row, ['RAIO', 'RADIUS']) || '0.1'),
      capacity: 100
    };
  });
};