/**
 * TasbihBeads — interactive prayer bead ring.
 * Physics: spring bounce on each tap, CSS ripple, milestone glow ring.
 * Respects prefers-reduced-motion: skips bead scale, keeps counter update.
 */
import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SPRING, DUR } from "../../lib/motion";

/* ─── Geometry ─────────────────────────────────────────────────── */
const R   = 88;   // ring radius
const C   = 110;  // SVG center
const VB  = 220;  // viewBox size

function beadXY(i: number, n: number) {
  const a = (i / n) * 2 * Math.PI - Math.PI / 2;
  return { x: +(C + R * Math.cos(a)).toFixed(2), y: +(C + R * Math.sin(a)).toFixed(2) };
}

/* ─── Types ────────────────────────────────────────────────────── */
interface Ripple { id: number; x: number; y: number }
interface Props {
  count: number;
  total: number;
  onTap: () => void;
  disabled?: boolean;
}

/* ─── Component ────────────────────────────────────────────────── */
export default function TasbihBeads({ count, total, onTap, disabled = false }: Props) {
  const prefersReduced = useReducedMotion();
  const [pressedIdx, setPressedIdx] = useState<number | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [milestone, setMilestone] = useState(false);
  const nextId = useRef(0);

  const beadsDone = count % total;
  const activeIdx = beadsDone;
  const remaining  = total - beadsDone;

  const handleTap = useCallback(() => {
    if (disabled) return;

    const idx = count % total;
    const { x, y } = beadXY(idx, total);

    if (!prefersReduced) {
      // Spring bounce on bead
      setPressedIdx(idx);
      setTimeout(() => setPressedIdx(null), 380);

      // Gold ripple
      const id = nextId.current++;
      setRipples((p) => [...p, { id, x, y }]);
      setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 550);
    }

    // Milestone ring — even with reduced-motion this is a meaningful signal
    if ((count + 1) % total === 0 && !prefersReduced) {
      setTimeout(() => {
        setMilestone(true);
        setTimeout(() => setMilestone(false), 1000);
      }, 200);
    }

    onTap();
  }, [count, total, onTap, disabled, prefersReduced]);

  return (
    <>
      <style>{`
        @keyframes tasbih-ripple {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(3.6); opacity: 0; }
        }
        @keyframes milestone-ring {
          0%   { opacity: 0.85; transform: scale(1); }
          60%  { opacity: 0.5;  transform: scale(1.07); }
          100% { opacity: 0;    transform: scale(1.16); }
        }
      `}</style>

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`عداد التسبيح — متبقي ${remaining} من ${total}`}
        aria-disabled={disabled}
        className="flex flex-col items-center gap-2 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full"
        onClick={handleTap}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleTap(); } }}
      >
        <div className="relative" style={{ width: VB, height: VB }}>
          {/* Milestone ring */}
          {milestone && (
            <div
              aria-hidden="true"
              className="absolute rounded-full border-4 border-yellow-400 pointer-events-none"
              style={{
                inset: C - R - 14,
                width: (R + 14) * 2,
                height: (R + 14) * 2,
                animation: "milestone-ring 1.0s ease-out forwards",
                boxShadow: "0 0 20px 4px rgba(212,170,59,0.4)",
              }}
            />
          )}

          {/* Ripples */}
          {ripples.map(({ id, x, y }) => (
            <div
              key={id}
              aria-hidden="true"
              className="absolute w-4 h-4 rounded-full bg-yellow-400 pointer-events-none"
              style={{
                left: x, top: y,
                animation: `tasbih-ripple ${DUR.slow}s ease-out forwards`,
              }}
            />
          ))}

          <svg
            width={VB}
            height={VB}
            viewBox={`0 0 ${VB} ${VB}`}
            className="overflow-visible"
            aria-hidden="true"
          >
            {/* Dashed cord */}
            <circle cx={C} cy={C} r={R} fill="none" strokeWidth="1.5" strokeDasharray="3 4"
              className="stroke-secondary-300 dark:stroke-secondary-600" />

            {/* Beads */}
            {Array.from({ length: total }, (_, i) => {
              const { x, y } = beadXY(i, total);
              const done     = i < beadsDone;
              const isActive = i === activeIdx;
              const isPressed = i === pressedIdx;

              return (
                <motion.circle
                  key={i}
                  cx={x} cy={y}
                  r={isActive ? 8 : 5.5}
                  fill={done ? "#158349" : isActive ? "#4db87e" : undefined}
                  className={!done && !isActive ? "fill-secondary-300 dark:fill-secondary-600" : ""}
                  animate={isPressed && !prefersReduced ? { scale: [1, 1.55, 0.9, 1] } : { scale: 1 }}
                  transition={
                    isPressed
                      ? { type: "tween", duration: 0.38, times: [0, 0.35, 0.7, 1], ease: "easeOut" }
                      : { duration: DUR.micro }
                  }
                  style={{ transformOrigin: `${x}px ${y}px` }}
                />
              );
            })}

            {/* Gold divider bead at 12 o'clock (index 0) */}
            <circle
              cx={beadXY(0, total).x} cy={beadXY(0, total).y}
              r={4} fill="#d4aa3b" stroke="#a07830" strokeWidth="0.8"
            />

            {/* Center — remaining count */}
            <text
              x={C} y={C - 10}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="32" fontWeight="800"
              className="fill-primary-700 dark:fill-primary-300"
              style={{ fontFamily: "Cairo, sans-serif" }}
            >
              {remaining}
            </text>
            <text
              x={C} y={C + 20}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="11"
              className="fill-secondary-400 dark:fill-secondary-500"
              style={{ fontFamily: "Cairo, sans-serif" }}
            >
              اضغط للتسبيح
            </text>
          </svg>
        </div>

        {count >= total && (
          <p
            aria-live="polite"
            className="text-xs font-semibold text-primary-600 dark:text-primary-400"
          >
            دورة {Math.floor(count / total)} مكتملة ✓
          </p>
        )}
      </div>
    </>
  );
}
