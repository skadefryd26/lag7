type Props = {
  verdier: number[];
  bredde?: number;
  hoyde?: number;
};

// Enkel linjegraf i ren SVG — ingen ekstra avhengigheter.
// Viser hvordan beløpet har endret seg for hvert prompt.
export function BelopGraf({ verdier, bredde = 320, hoyde = 120 }: Props) {
  if (verdier.length === 0) {
    return (
      <div
        style={{
          height: hoyde,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9a8b73",
          fontSize: 13,
          opacity: 0.6,
        }}
      >
        Grafen tegner seg når du begynner å chatte.
      </div>
    );
  }

  const pad = 8;
  const min = Math.min(...verdier);
  const max = Math.max(...verdier);
  const span = max - min || 1;

  const punkt = (v: number, i: number) => {
    const x =
      verdier.length === 1
        ? bredde / 2
        : pad + (i / (verdier.length - 1)) * (bredde - pad * 2);
    const y = hoyde - pad - ((v - min) / span) * (hoyde - pad * 2);
    return { x, y };
  };

  const punkter = verdier.map(punkt);
  const linje = punkter.map((p) => `${p.x},${p.y}`).join(" ");
  const areal =
    `${pad},${hoyde - pad} ` +
    punkter.map((p) => `${p.x},${p.y}`).join(" ") +
    ` ${bredde - pad},${hoyde - pad}`;

  const siste = punkter[punkter.length - 1];
  const stigende =
    verdier.length >= 2 && verdier[verdier.length - 1] >= verdier[0];
  const farge = stigende ? "#2f9e44" : "#c92a2a";

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${bredde} ${hoyde}`}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="grafFyll" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={farge} stopOpacity="0.22" />
          <stop offset="100%" stopColor={farge} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areal} fill="url(#grafFyll)" />
      <polyline
        points={linje}
        fill="none"
        stroke={farge}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {punkter.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={farge} />
      ))}
      <circle
        cx={siste.x}
        cy={siste.y}
        r={5}
        fill={farge}
        stroke="#fffdf8"
        strokeWidth={2}
      />
    </svg>
  );
}
