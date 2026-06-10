import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db, serverTimestamp } from "../config/firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { LogOut, TrendingUp, PlusCircle, AlertCircle, ShoppingBag } from "lucide-react";
import { formatCurrency, calculatePercentage } from "../utils/helpers";
import WishCard from "../components/WishCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import CategoryChart from "../components/CategoryChart";
import AddWishModal from "../components/AddWishModal";
import Toast from "../components/Toast";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWish, setEditingWish] = useState(null);

  // Estados de feedback (Toast)
  const [toast, setToast] = useState(null);

  // Mostra balão de notificação temporário
  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  // Sincronização em tempo real com Firestore
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "wishes"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedWishes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setWishes(fetchedWishes);
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao escutar dados do Firestore:", err);
        showToast("Erro ao carregar dados da nuvem.", "error");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  // Ação de Salvar / Atualizar Desejo
  async function handleSaveWish(wishData) {
    setIsModalOpen(false);
    
    try {
      if (editingWish) {
        // Modo Edição
        const docRef = doc(db, "wishes", editingWish.id);
        await updateDoc(docRef, wishData);
        showToast("Desejo atualizado com sucesso!");
      } else {
        // Modo Criação
        await addDoc(collection(db, "wishes"), {
          ...wishData,
          userId: currentUser.uid,
          createdAt: serverTimestamp()
        });
        showToast("Novo desejo adicionado!");
      }
    } catch (err) {
      console.error("Erro ao salvar desejo:", err);
      showToast("Erro ao salvar as informações. Tente novamente.", "error");
    } finally {
      setEditingWish(null);
    }
  }

  // Ação de Excluir Desejo
  async function handleDeleteWish(wishId) {
    const confirmDelete = window.confirm("Tem certeza que deseja remover este item da sua lista?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "wishes", wishId));
      showToast("Desejo removido com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir desejo:", err);
      showToast("Erro ao excluir o desejo.", "error");
    }
  }

  // Ação de preparar edição
  function handleOpenEdit(wish) {
    setEditingWish(wish);
    setIsModalOpen(true);
  }

  // Cálculos financeiros gerais
  const totalTarget = wishes.reduce((sum, w) => sum + w.targetPrice, 0);
  const totalSaved = wishes.reduce((sum, w) => sum + w.savedAmount, 0);
  const totalRemaining = totalTarget - totalSaved;
  const overallPercentage = calculatePercentage(totalSaved, totalTarget);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-logo">
          <TrendingUp size={24} style={{ color: "var(--accent-color)" }} />
          <span>WishSave <span>//</span></span>
        </div>
        <div className="user-profile">
          <span className="user-email">{currentUser?.email}</span>
          <button onClick={() => logout()} className="logout-btn">
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        
        {/* Brutalist Typographic Hero */}
        <section className="dashboard-hero">
          <div className="hero-main-info">
            <div className="hero-label">Status Geral de Economia</div>
            <div className="hero-number">
              {overallPercentage}<span>%</span>
            </div>
            <div className="hero-subtext">
              Você acumulou <strong>{formatCurrency(totalSaved)}</strong> de um total planejado de <strong>{formatCurrency(totalTarget)}</strong>. Falta guardar {formatCurrency(totalRemaining)}.
            </div>
          </div>
          
          <div className="hero-stats-box">
            <div className="stat-item">
              <span className="stat-val" style={{ color: "var(--accent-color)" }}>
                {formatCurrency(totalSaved)}
              </span>
              <span className="stat-lbl">Economizado</span>
            </div>
            <div className="stat-item">
              <span className="stat-val" style={{ color: "var(--alert-color)" }}>
                {formatCurrency(totalRemaining)}
              </span>
              <span className="stat-lbl">Restante</span>
            </div>
          </div>
        </section>

        {/* Dashboard Sections Grid */}
        <div className="dashboard-grid">
          
          {/* Coluna da Esquerda: Lista de Metas */}
          <section>
            <div className="section-header">
              <h2 className="section-title">
                Lista de Desejos <span>{wishes.length}</span>
              </h2>
              <button 
                className="add-btn"
                onClick={() => {
                  setEditingWish(null);
                  setIsModalOpen(true);
                }}
              >
                <PlusCircle size={16} />
                <span>Novo Desejo</span>
              </button>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : wishes.length === 0 ? (
              <div className="empty-state">
                <ShoppingBag size={48} className="empty-state-icon" />
                <h3 className="empty-state-title">Nenhum desejo adicionado</h3>
                <p className="empty-state-desc">
                  Adicione sua primeira meta de economia (um eletrônico, viagem ou qualquer sonho) clicando no botão acima.
                </p>
                <button 
                  className="add-btn" 
                  style={{ marginTop: "8px" }}
                  onClick={() => setIsModalOpen(true)}
                >
                  Criar Desejo
                </button>
              </div>
            ) : (
              <div className="wish-list">
                {wishes.map((wish) => (
                  <WishCard
                    key={wish.id}
                    wish={wish}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteWish}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Coluna da Direita: Painel Lateral com Gráficos */}
          <aside className="sidebar-panel">
            <div className="panel-box">
              <h3 className="panel-title">Meta vs. Economizado</h3>
              <CategoryChart wishes={wishes} />
            </div>

            <div className="panel-box" style={{ background: "transparent", borderStyle: "dashed" }}>
              <h3 className="panel-title" style={{ borderColor: "rgba(255,255,255,0.05)" }}>Dicas de Economia</h3>
              <ul style={{ listStyleType: "none", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "12px" }}>
                <li style={{ paddingLeft: "12px", borderLeft: "2px solid var(--accent-color)" }}>
                  Defina desejos de <strong>Alta Prioridade</strong> para direcionar seus aportes principais.
                </li>
                <li style={{ paddingLeft: "12px", borderLeft: "2px solid var(--alert-color)" }}>
                  Monitore a barra de progresso. Aportar pequenos valores recorrentes acelera suas metas.
                </li>
                <li style={{ paddingLeft: "12px", borderLeft: "2px solid var(--text-secondary)" }}>
                  Categorize seus desejos para enxergar de onde vem o maior consumo do seu orçamento planejado.
                </li>
              </ul>
            </div>
          </aside>

        </div>
      </main>

      {/* Modal de Adição/Edição */}
      <AddWishModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingWish(null);
        }}
        onSave={handleSaveWish}
        editingWish={editingWish}
      />

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
