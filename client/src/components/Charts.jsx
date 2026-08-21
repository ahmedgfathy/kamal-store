export function AreaChart({ data, color = "#2E86AB", height = 180, format = (v) => v }) {
  if (!data?.length) return null;
  const w = 600, h = height, pad = 8;
  const max = Math.max(...data.map(d => d.value), 1);
  const step = (w - pad * 2) / (data.length - 1 || 1);
  const pts = data.map((d, i) => [pad + i * step, h - pad - (d.value / max) * (h - pad * 3)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${h - pad} L${pts[0][0].toFixed(1)},${h - pad} Z`;
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".35" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
        {[0.25, 0.5, 0.75].map(f => <line key={f} x1={pad} x2={w - pad} y1={pad + f * (h - pad * 3)} y2={pad + f * (h - pad * 3)} stroke="#E5EAF0" strokeWidth="1" />)}
        <path d={area} fill="url(#ag)" />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#fff" stroke={color} strokeWidth="2" />)}
      </svg>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
        {data.filter((_, i) => i % Math.ceil(data.length / 7) === 0).map(d => <span key={d.label}>{d.label}</span>)}
      </div>
    </div>
  );
}

export function BarChart({ data, color = "#01BAEF", height = 180, format = (v) => v }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map(d => (
          <div key={d.label} className="flex-1 flex flex-col justify-end items-center gap-1 group relative">
            <span className="absolute -top-5 hidden group-hover:block bg-primary text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap z-10">{format(d.value)}</span>
            <div className="w-full rounded-t-md transition-all hover:opacity-80" style={{ height: `${Math.max(4, (d.value / max) * 100)}%`, background: `linear-gradient(180deg, ${color}, ${color}88)` }} />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-1">
        {data.map((d, i) => <span key={d.label} className="flex-1 text-center text-[9px] text-gray-400 truncate">{i % 2 === 0 ? d.label : ""}</span>)}
      </div>
    </div>
  );
}

const DONUT_COLORS = ["#0C2D48", "#2E86AB", "#01BAEF", "#7A8FA3", "#EF4444", "#F59E0B", "#10B981", "#8B5CF6"];

export function DonutChart({ data, size = 170 }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 60, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-6 flex-wrap justify-center">
      <svg width={size} height={size} viewBox="0 0 160 160" className="-rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#EDF2F7" strokeWidth="22" />
        {data.map((d, i) => {
          const len = (d.value / total) * c;
          const el = <circle key={d.label} cx="80" cy="80" r={r} fill="none" stroke={DONUT_COLORS[i % DONUT_COLORS.length]} strokeWidth="22" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />;
          offset += len;
          return el;
        })}
      </svg>
      <div className="space-y-1.5">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-sm" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
            <span className="text-gray-600 capitalize">{d.label.replace(/_/g, " ")}</span>
            <b className="ms-auto ps-4">{d.value}</b>
            <span className="text-gray-400">{Math.round((d.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
