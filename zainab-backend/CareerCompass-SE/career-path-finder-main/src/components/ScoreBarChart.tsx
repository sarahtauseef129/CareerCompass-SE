import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CareerResult } from "@/types/career";

const COLORS = [
  "hsl(243, 76%, 58%)",
  "hsl(239, 84%, 67%)",
  "hsl(173, 80%, 40%)",
  "hsl(243, 76%, 72%)",
  "hsl(173, 60%, 55%)",
];

export function ScoreBarChart({ results }: { results: CareerResult[] }) {
  const data = results.slice(0, 5).map((r) => ({
    name: r.career.title.length > 15 ? r.career.title.slice(0, 15) + "…" : r.career.title,
    score: Math.round(r.finalScore),
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(val: number) => [`${val}%`, "Score"]} />
          <Bar dataKey="score" radius={[8, 8, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
