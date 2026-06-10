import { useEffect } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">
        {type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
      </span>
      <span style={{ fontFamily: "var(--font-family-sans)" }}>{message}</span>
      <button 
        onClick={onClose} 
        style={{ 
          background: "none", 
          border: "none", 
          color: "var(--text-secondary)", 
          cursor: "pointer",
          marginLeft: "auto",
          display: "flex",
          alignItems: "center"
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
