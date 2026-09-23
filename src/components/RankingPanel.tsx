import type { RankingEntry } from "../types";

interface Props {
  entradas: RankingEntry[];
}

export function RankingPanel({ entradas }: Props) {
  return (
    <div>
      <h3>Ranking da semana</h3>
      <div className="row-card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {entradas.map((entrada) => (
          <div key={entrada.user.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-muted)", width: 16 }}>
              {entrada.posicao}
            </span>
            <div className="avatar" style={{ width: 28, height: 28, background: "var(--bg-pro)", color: "var(--text-pro)", fontSize: 11 }}>
              {entrada.user.nome.charAt(0).toUpperCase()}
            </div>
            <span style={{ flex: 1, fontSize: 14 }}>{entrada.user.nome}</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{entrada.pontosSemana} pts</span>
          </div>
        ))}
        {entradas.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>Ninguém pontuou ainda esta semana.</p>
        )}
      </div>
    </div>
  );
}
