/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddWishModal({ isOpen, onClose, onSave, editingWish }) {
  const [title, setTitle] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [savedAmount, setSavedAmount] = useState("0");
  const [category, setCategory] = useState("Tecnologia");
  const [priority, setPriority] = useState("media");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingWish) {
      setTitle(editingWish.title || "");
      setTargetPrice(editingWish.targetPrice || "");
      setSavedAmount(editingWish.savedAmount || "0");
      setCategory(editingWish.category || "Tecnologia");
      setPriority(editingWish.priority || "media");
    } else {
      setTitle("");
      setTargetPrice("");
      setSavedAmount("0");
      setCategory("Tecnologia");
      setPriority("media");
    }
    setError("");
  }, [editingWish, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const parsedTarget = parseFloat(targetPrice);
    const parsedSaved = parseFloat(savedAmount);

    if (!title.trim()) {
      setError("O nome do item é obrigatório.");
      return;
    }

    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      setError("A meta de preço deve ser um valor maior que zero.");
      return;
    }

    if (isNaN(parsedSaved) || parsedSaved < 0) {
      setError("O valor economizado deve ser maior ou igual a zero.");
      return;
    }

    if (parsedSaved > parsedTarget) {
      setError("O valor economizado não pode exceder o valor total do item.");
      return;
    }

    onSave({
      title: title.trim(),
      targetPrice: parsedTarget,
      savedAmount: parsedSaved,
      category,
      priority
    });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {editingWish ? "Editar Desejo" : "Novo Desejo"}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: "16px" }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Nome do Item</label>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "14px" }}
              placeholder="Ex: PlayStation 5, Viagem para Orlando..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Preço Alvo (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                style={{ paddingLeft: "14px" }}
                placeholder="0.00"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Já economizado (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                style={{ paddingLeft: "14px" }}
                placeholder="0.00"
                value={savedAmount}
                onChange={(e) => setSavedAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select
                className="form-input"
                style={{ paddingLeft: "14px", background: "var(--panel-bg)" }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Tecnologia">Tecnologia</option>
                <option value="Viagens">Viagens</option>
                <option value="Casa">Casa</option>
                <option value="Veículos">Veículos</option>
                <option value="Vestuário">Vestuário</option>
                <option value="Educação">Educação</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Prioridade</label>
              <select
                className="form-input"
                style={{ paddingLeft: "14px", background: "var(--panel-bg)" }}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="auth-btn" style={{ width: "auto" }}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
