import { CATEGORIES } from "./categories";

type Props = {
  onSelect: (categoryId: string) => void;
  activeCategory?: string | null;
};

export default function Sidebar({ onSelect, activeCategory }: Props) {
  return (
    <div
      style={{
        width: 220,
        background: "#fff",
        borderRight: "1px solid #ddd",
        padding: 8,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {CATEGORIES.map(cat => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            style={{
              background: isActive ? cat.color : cat.color,
              border: isActive ? "2px solid orange" : "transparent",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderRadius: 10,
              padding: "10px 12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <Icon size={18} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
