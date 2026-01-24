import { CATEGORIES } from "./categories";

type Props = {
  onSelect: (categoryId: string) => void;
  activeCategory?: string | null;
};

export default function Sidebar({ onSelect, activeCategory }: Props) {
  return (
    <div
      style={{
        width: "15%",
        background: "#fff",
        borderRight: "1px solid #ddd",
        padding: 8,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          style={{
            background: activeCategory === cat.id ? "#111" : cat.color,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 8px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
