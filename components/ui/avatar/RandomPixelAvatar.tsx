import React from "react";

/** Simple seeded RNG so the avatar doesn't change during re-renders */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Get a cryptographically strong random 32-bit seed once (per mount) */
function randomSeed() {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] || 1;
}

type Props = {
  size?: number;          // pixel size of the final image
  cell?: number;          // size of each grid cell in the SVG
  rows?: number;          // grid rows (mirrored horizontally)
  cols?: number;          // grid cols (should be even for clean mirror)
  bg?: string | null;     // background color (null = transparent)
  palette?: string[];     // colors to sample from
  density?: number;       // 0..1 probability a cell is filled
  className?: string;
  title?: string;
  seed?: number;          // optional fixed seed for consistent avatars
};

const DEFAULT_PALETTE = [
  "#5b8def", "#f45d48", "#08c6ab", "#f7b801", "#8e7dbe", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"
];

const WEB3_PALETTE = [
  "#00d4aa", "#ff6b35", "#f7931e", "#8b5cf6", "#06ffa5", "#ff3366", "#00d4ff", "#ffd700", "#ff1744", "#00e676"
];

const STELLAR_PALETTE = [
  "#7b68ee", "#ffd700", "#00bfff", "#ff6347", "#32cd32", "#ff1493", "#00ced1", "#ffa500", "#9370db", "#20b2aa"
];

const RandomPixelAvatar: React.FC<Props> = ({
  size = 96,
  cell = 8,
  rows = 8,
  cols = 8,
  bg = null,
  palette = DEFAULT_PALETTE,
  density = 0.65,
  className,
  title = "Avatar",
  seed,
}) => {
  // Use provided seed or generate a random one
  const avatarSeed = React.useMemo(() => seed || randomSeed(), [seed]);
  const rnd = React.useMemo(() => mulberry32(avatarSeed), [avatarSeed]);

  // ensure even columns for a neat mirror
  const C = cols % 2 === 0 ? cols : cols + 1;
  const half = C / 2;

  const width = C * cell;
  const height = rows * cell;

  // pick a main color and an accent for variety
  const main = palette[Math.floor(rnd() * palette.length)];
  const accent = palette[Math.floor(rnd() * palette.length)];

  // build rects (mirror horizontally)
  const rects: JSX.Element[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < half; x++) {
      if (rnd() < density) {
        const color = rnd() < 0.25 ? accent : main;
        const rx = x * cell;
        const ry = y * cell;

        // left side
        rects.push(
          <rect key={`L-${x}-${y}`} x={rx} y={ry} width={cell} height={cell} fill={color} />
        );
        // mirror to right
        const mx = (C - 1 - x) * cell;
        rects.push(
          <rect key={`R-${x}-${y}`} x={mx} y={ry} width={cell} height={cell} fill={color} />
        );
      }
    }
  }

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={size}
      className={className}
      style={{ imageRendering: "pixelated" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {bg ? <rect x="0" y="0" width={width} height={height} fill={bg} /> : null}
      {rects}
    </svg>
  );
};

// Predefined avatar styles
export const AvatarStyles = {
  default: { palette: DEFAULT_PALETTE, density: 0.65 },
  web3: { palette: WEB3_PALETTE, density: 0.7 },
  stellar: { palette: STELLAR_PALETTE, density: 0.6 },
  minimal: { palette: ["#333", "#666", "#999"], density: 0.4 },
  vibrant: { palette: ["#ff0080", "#00ff80", "#8000ff", "#ff8000", "#0080ff"], density: 0.8 },
} as const;

export default RandomPixelAvatar;
