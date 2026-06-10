

export default function LoadingScreen() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ marginTop: "16px", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
        Carregando suas economias...
      </p>
    </div>
  );
}
