/**
 * Formata um número para o formato de moeda brasileiro (BRL).
 * @param {number} value - O valor a ser formatado.
 * @returns {string} - Valor formatado em BRL (Ex: R$ 1.250,00)
 */
export function formatCurrency(value) {
  if (value === undefined || value === null || isNaN(value)) {
    return "R$ 0,00";
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Formata uma data do Firebase Firestore (Timestamp) ou JavaScript Date para string legível pt-BR.
 * @param {object|Date} timestamp - O timestamp do Firestore ou objeto Date.
 * @returns {string} - Data formatada (Ex: 09/06/2026)
 */
export function formatDate(timestamp) {
  if (!timestamp) return "...";
  
  // Se for Timestamp do Firestore
  if (timestamp && typeof timestamp.toDate === "function") {
    return timestamp.toDate().toLocaleDateString("pt-BR");
  }
  
  // Se for objeto Date
  if (timestamp instanceof Date) {
    return timestamp.toLocaleDateString("pt-BR");
  }
  
  // Se for string de data ISO
  return new Date(timestamp).toLocaleDateString("pt-BR");
}

/**
 * Calcula a porcentagem economizada.
 * Retorna no máximo 100%.
 */
export function calculatePercentage(saved, target) {
  if (!target || target <= 0) return 0;
  const percentage = (saved / target) * 100;
  return Math.min(Math.round(percentage), 100);
}
