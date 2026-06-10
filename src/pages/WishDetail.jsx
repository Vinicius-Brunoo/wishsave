import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { ArrowLeft, TrendingUp, DollarSign, Plus, Minus, Calendar } from "lucide-react";
import { formatCurrency, formatDate, calculatePercentage } from "../utils/helpers";
import Toast from "../components/Toast";
import LoadingScreen from "../components/LoadingScreen";

export default function WishDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aporteValue, setAporteValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados de feedback (Toast)
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  // Escuta em tempo real do documento do desejo
  useEffect(() => {
    const docRef = doc(db, "wishes", id);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setWish({ id: docSnap.id, ...docSnap.data() });
      } else {
        showToast("Desejo não encontrado ou excluído.", "error");
        setTimeout(() => navigate("/dashboard"), 2000);
      }
      setLoading(false);
    }, (err) => {
      console.error("Erro ao carregar detalhes:", err);
      showToast("Erro ao carregar dados.", "error");
      setLoading(false);
    });

    return unsubscribe;
  }, [id, navigate]);

  // Executa transação de aporte (depósito / retirada)
  async function handleAporte(type) {
    if (!aporteValue || isNaN(parseFloat(aporteValue))) {
      showToast("Insira um valor válido para aporte.", "error");
      return;
    }

    const value = parseFloat(aporteValue);
    if (value <= 0) {
      showToast("O valor deve ser maior do que zero.", "error");
      return;
    }

    setIsSubmitting(true);
    const docRef = doc(db, "wishes", id);

    let newSaved = wish.savedAmount;

    if (type === "deposit") {
      newSaved += value;
      if (newSaved > wish.targetPrice) {
        showToast(`Valor excede o preço alvo de ${formatCurrency(wish.targetPrice)}.`, "error");
        setIsSubmitting(false);
        return;
      }
    } else if (type === "withdraw") {
      newSaved -= value;
      if (newSaved < 0) {
        showToast("Você não pode retirar mais do que já economizou.", "error");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await updateDoc(docRef, {
        savedAmount: newSaved
      });
      showToast(
        type === "deposit" 
          ? `Aporte de ${formatCurrency(value)} adicionado!` 
          : `Retirada de ${formatCurrency(value)} efetuada!`
      );
      setAporteValue("");
    } catch (err) {
      console.error("Erro ao atualizar aporte:", err);
      showToast("Erro ao salvar transação.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!wish) {
    return (
      <div className="loading-container">
        <p>Carregando dados da meta...</p>
      </div>
    );
  }

  const percentage = calculatePercentage(wish.savedAmount, wish.targetPrice);
  const remaining = wish.targetPrice - wish.savedAmount;
  const isCompleted = wish.savedAmount >= wish.targetPrice;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-logo">
          <TrendingUp size={24} style={{ color: "var(--accent-color)" }} />
          <span>WishSave <span>//</span></span>
        </div>
        <button onClick={() => navigate("/dashboard")} className="logout-btn">
          <ArrowLeft size={16} />
          <span>Voltar ao painel</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <button onClick={() => navigate("/dashboard")} className="detail-back-btn">
          <ArrowLeft size={14} />
          <span>Painel Principal</span>
        </button>

        <div className="detail-container">
          
          {/* Coluna Principal: Detalhes e Aportes */}
          <section className="detail-main">
            <div className="detail-header">
              <div className="wish-badges" style={{ marginBottom: "12px" }}>
                <span className="badge badge-category">{wish.category}</span>
                <span className={`badge badge-priority-${wish.priority}`}>
                  Prioridade {wish.priority === "alta" ? "Alta" : wish.priority === "media" ? "Média" : "Baixa"}
                </span>
              </div>
              <h1 className="detail-title">{wish.title}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "var(--font-family-mono)" }}>
                <Calendar size={14} />
                <span>Adicionado em {formatDate(wish.createdAt)}</span>
              </div>
            </div>

            {/* Painel Financeiro */}
            <div className="detail-amount-card">
              <div>
                <span className="stat-lbl">Valor Economizado</span>
                <div className="detail-amount-val" style={{ color: "var(--accent-color)" }}>
                  {formatCurrency(wish.savedAmount)}
                </div>
              </div>
              <div>
                <span className="stat-lbl">Preço Alvo do Item</span>
                <div className="detail-amount-val">
                  {formatCurrency(wish.targetPrice)}
                </div>
              </div>
            </div>

            {/* Progresso Gráfico */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontFamily: "var(--font-family-mono)", fontSize: "0.85rem" }}>
                <span>Progresso da Meta</span>
                <span>{percentage}%</span>
              </div>
              <div className="progress-container" style={{ height: "12px" }}>
                <div 
                  className={`progress-bar ${isCompleted ? "completed" : wish.priority === "alta" ? "critical" : ""}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              {isCompleted ? (
                <div style={{
                  marginTop: "16px",
                  padding: "16px",
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  color: "var(--accent-color)",
                  fontFamily: "var(--font-family-mono)",
                  fontSize: "0.85rem",
                  textAlign: "center"
                }}>
                  🎉 PARABÉNS! VOCÊ ALCANÇOU ESTA META DE ECONOMIA!
                </div>
              ) : (
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "12px", textAlign: "right" }}>
                  Faltam <strong>{formatCurrency(remaining)}</strong> para resgatar este item.
                </div>
              )}
            </div>
          </section>

          {/* Coluna Lateral: Painel de Aportes Financeiros */}
          <aside className="sidebar-panel">
            <div className="panel-box">
              <h3 className="panel-title">Gerenciar Economias</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                Adicione ou retire valores específicos deste cofre conforme sua disponibilidade financeira.
              </p>

              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label className="form-label">Valor do Aporte (R$)</label>
                <div className="input-wrapper">
                  <span className="input-icon" style={{ left: "14px" }}><DollarSign size={18} /></span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="form-input"
                    value={aporteValue}
                    onChange={(e) => setAporteValue(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <button
                  onClick={() => handleAporte("deposit")}
                  className="auth-btn"
                  disabled={isSubmitting || isCompleted}
                  style={{ width: "100%", opacity: isCompleted ? 0.6 : 1 }}
                >
                  <Plus size={16} />
                  <span>Adicionar Aporte</span>
                </button>
                <button
                  onClick={() => handleAporte("withdraw")}
                  className="btn-secondary"
                  disabled={isSubmitting || wish.savedAmount <= 0}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <Minus size={16} />
                  <span>Retirar Valor</span>
                </button>
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* Notificações Flutuantes (Toasts) */}
      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}
