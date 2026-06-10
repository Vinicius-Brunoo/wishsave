

export default function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {[1, 2, 3].map((n) => (
        <div key={n} className="skeleton-card">
          <div className="skeleton-text skeleton-title"></div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "16px 0" }}>
            <div className="skeleton-text skeleton-bar"></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="skeleton-text skeleton-small"></div>
              <div className="skeleton-text skeleton-small" style={{ width: "15%" }}></div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.02)", paddingTop: "16px" }}>
            <div className="skeleton-text skeleton-small" style={{ width: "30%" }}></div>
            <div style={{ display: "flex", gap: "8px" }}>
              <div className="skeleton-text" style={{ width: "34px", height: "34px", borderRadius: "2px" }}></div>
              <div className="skeleton-text" style={{ width: "34px", height: "34px", borderRadius: "2px" }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
