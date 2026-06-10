import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function CategoryChart({ wishes }) {
  // Agrupar e somar valores por categoria
  const categoryData = wishes.reduce((acc, wish) => {
    const cat = wish.category || "Outros";
    const existing = acc.find((item) => item.name === cat);
    
    if (existing) {
      existing.meta += wish.targetPrice;
      existing.economizado += wish.savedAmount;
    } else {
      acc.push({
        name: cat,
        meta: wish.targetPrice,
        economizado: wish.savedAmount
      });
    }
    return acc;
  }, []);

  // Formatador de valores BRL para o Tooltip
  const formatTooltipValue = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: "var(--panel-bg)",
          border: "2px solid var(--border-color)",
          padding: "12px",
          fontFamily: "var(--font-family-mono)",
          fontSize: "0.8rem"
        }}>
          <p style={{ fontWeight: "bold", marginBottom: "8px", color: "var(--text-primary)" }}>{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color, margin: "4px 0" }}>
              {item.name}: {formatTooltipValue(item.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (categoryData.length === 0) {
    return (
      <div style={{
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-secondary)",
        fontSize: "0.85rem",
        border: "1px dashed var(--border-color)"
      }}>
        Sem dados para gerar gráfico.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={categoryData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <XAxis 
            dataKey="name" 
            stroke="var(--text-secondary)"
            fontSize={11}
            tickLine={false}
            fontFamily="var(--font-family-sans)"
          />
          <YAxis 
            stroke="var(--text-secondary)"
            fontSize={10}
            tickLine={false}
            fontFamily="var(--font-family-mono)"
            tickFormatter={(val) => `R$ ${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
          <Legend 
            verticalAlign="top"
            height={36}
            iconSize={10}
            iconType="square"
            fontFamily="var(--font-family-mono)"
            wrapperStyle={{ fontSize: "0.75rem", textTransform: "uppercase" }}
          />
          <Bar 
            dataKey="meta" 
            name="Valor Meta" 
            fill="var(--border-color)" 
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="economizado" 
            name="Economizado" 
            fill="var(--accent-color)" 
            radius={[0, 0, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
