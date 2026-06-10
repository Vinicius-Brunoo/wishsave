import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Trash2, ArrowUpRight, Coins } from "lucide-react";
import { formatCurrency, calculatePercentage } from "../utils/helpers";

export default function WishCard({ wish, onEdit, onDelete }) {
  const navigate = useNavigate();
  const percentage = calculatePercentage(wish.savedAmount, wish.targetPrice);
  const isCompleted = wish.savedAmount >= wish.targetPrice;

  // Formata a prioridade para o display
  const priorityLabels = {
    alta: "Alta",
    media: "Média",
    baixa: "Baixa"
  };

  // Define a classe CSS da barra de progresso baseado na prioridade/conclusão
  const getProgressBarClass = () => {
    if (isCompleted) return "completed";
    if (wish.priority === "alta") return "critical"; // Laranja para alta prioridade
    return "";
  };

  return (
    <div className="wish-card">
      <div className="wish-card-header">
        <div>
          <h3 
            className="wish-card-title" 
            onClick={() => navigate(`/wish/${wish.id}`)}
          >
            {wish.title}
          </h3>
          <div style={{ marginTop: "6px" }} className="wish-badges">
            <span className="badge badge-category">{wish.category || "Outros"}</span>
            <span className={`badge badge-priority-${wish.priority}`}>
              {priorityLabels[wish.priority] || "Normal"}
            </span>
          </div>
        </div>
        
        <button 
          className="btn-icon" 
          onClick={() => navigate(`/wish/${wish.id}`)}
          title="Ver detalhes / Guardar dinheiro"
        >
          <Coins size={16} />
        </button>
      </div>

      <div className="wish-financials">
        <div className="fin-saved">
          {formatCurrency(wish.savedAmount)}
          <span> economizados</span>
        </div>
        <div className="fin-target">
          Meta: {formatCurrency(wish.targetPrice)}
        </div>
      </div>

      <div className="progress-container">
        <div 
          className={`progress-bar ${getProgressBarClass()}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-family-mono)", color: "var(--text-secondary)" }}>
          {percentage}% concluído
        </span>
        
        <div className="wish-actions">
          <button 
            className="btn-icon" 
            onClick={() => onEdit(wish)} 
            title="Editar item"
          >
            <Edit3 size={15} />
          </button>
          <button 
            className="btn-icon btn-icon-delete" 
            onClick={() => onDelete(wish.id)} 
            title="Excluir item"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
