// src/blockly/Sidebar.tsx
import { CATEGORIES } from "./categories";
import type { Category } from "./categories";

type Props = {
  onSelect: (contents: Category["contents"]) => void;
};

export default function Sidebar({ onSelect }: Props) {
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
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.contents)}
          style={{
            background: cat.color,
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
