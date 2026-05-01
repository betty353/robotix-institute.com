'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui';
import { Play, RotateCw, Trophy, Zap, Move } from 'lucide-react';

const CELL = 32;

// 0 = path, 1 = wall, 2 = start, 3 = goal
type Cell = 0 | 1 | 2 | 3;

const LEVELS: { name: string; grid: Cell[][] }[] = [
  {
    name: 'Warm-up',
    grid: [
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  {
    name: 'Twists & Turns',
    grid: [
      [2, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
    ],
  },
  {
    name: 'The Spiral',
    grid: [
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 1, 3, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
];

interface Pos { r: number; c: number }

function findCell(grid: Cell[][], v: Cell): Pos {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === v) return { r, c };
    }
  }
  return { r: 0, c: 0 };
}

function bfsDistance(grid: Cell[][], start: Pos, goal: Pos): number {
  const rows = grid.length;
  const cols = grid[0].length;
  const seen = new Set<string>();
  const q: { p: Pos; d: number }[] = [{ p: start, d: 0 }];
  while (q.length) {
    const { p, d } = q.shift()!;
    const k = `${p.r},${p.c}`;
    if (seen.has(k)) continue;
    seen.add(k);
    if (p.r === goal.r && p.c === goal.c) return d;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = p.r + dr, nc = p.c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (grid[nr][nc] === 1) continue;
      q.push({ p: { r: nr, c: nc }, d: d + 1 });
    }
  }
  return Infinity;
}

interface RobotMazeProps {
  onScore?: (payload: { score: number; level: number; time: number }) => void;
}

export default function RobotMaze({ onScore }: RobotMazeProps) {
  const [levelIdx, setLevelIdx] = useState(0);
  const level = LEVELS[levelIdx];
  const start = findCell(level.grid, 2);
  const goal = findCell(level.grid, 3);

  const [pos, setPos] = useState<Pos>(start);
  const [moves, setMoves] = useState(0);
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [now, setNow] = useState<number>(Date.now());
  const [finished, setFinished] = useState(false);
  const [bestPath, setBestPath] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const submittedRef = useRef(false);

  // Reset on level change
  useEffect(() => {
    setPos(findCell(level.grid, 2));
    setMoves(0);
    setStartedAt(Date.now());
    setFinished(false);
    setBestPath(bfsDistance(level.grid, start, goal));
    submittedRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelIdx]);

  // Tick clock
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [finished]);

  // Draw
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const w = level.grid[0].length * CELL;
    const h = level.grid.length * CELL;
    cv.width = w;
    cv.height = h;
    ctx.fillStyle = '#0B0638';
    ctx.fillRect(0, 0, w, h);

    for (let r = 0; r < level.grid.length; r++) {
      for (let c = 0; c < level.grid[r].length; c++) {
        const v = level.grid[r][c];
        const x = c * CELL, y = r * CELL;
        if (v === 1) {
          ctx.fillStyle = '#1A0E6B';
          ctx.fillRect(x, y, CELL, CELL);
          ctx.strokeStyle = '#2B1EA3';
          ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
        } else {
          ctx.fillStyle = '#15103F';
          ctx.fillRect(x, y, CELL, CELL);
          ctx.strokeStyle = '#1A0E6B';
          ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
        }
        if (v === 3) {
          ctx.fillStyle = '#F4B400';
          ctx.beginPath();
          ctx.arc(x + CELL / 2, y + CELL / 2, CELL / 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0B0638';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🏁', x + CELL / 2, y + CELL / 2);
        }
      }
    }

    // Robot
    const rx = pos.c * CELL, ry = pos.r * CELL;
    ctx.fillStyle = '#F4B400';
    ctx.beginPath();
    ctx.arc(rx + CELL / 2, ry + CELL / 2, CELL / 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0B0638';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🤖', rx + CELL / 2, ry + CELL / 2);
  }, [pos, level]);

  const tryMove = useCallback(
    (dr: number, dc: number) => {
      if (finished) return;
      setPos((p) => {
        const nr = p.r + dr, nc = p.c + dc;
        if (
          nr < 0 || nc < 0 ||
          nr >= level.grid.length || nc >= level.grid[0].length ||
          level.grid[nr][nc] === 1
        ) {
          return p;
        }
        setMoves((m) => m + 1);
        return { r: nr, c: nc };
      });
    },
    [finished, level]
  );

  // Detect goal
  useEffect(() => {
    if (pos.r === goal.r && pos.c === goal.c && !finished) {
      setFinished(true);
      const elapsed = Math.round((Date.now() - startedAt) / 1000);
      // Score: more for fewer moves and faster time, with a floor
      const moveBonus = Math.max(0, 100 - Math.max(0, moves - bestPath) * 5);
      const timeBonus = Math.max(0, 100 - elapsed);
      const finalScore = Math.min(1000, 400 + moveBonus * 4 + timeBonus * 2);
      if (!submittedRef.current && onScore) {
        submittedRef.current = true;
        onScore({ score: finalScore, level: levelIdx + 1, time: elapsed });
      }
    }
  }, [pos, goal, finished, startedAt, moves, bestPath, levelIdx, onScore]);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); tryMove(-1, 0); }
      else if (e.key === 'ArrowDown' || e.key === 's') { e.preventDefault(); tryMove(1, 0); }
      else if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); tryMove(0, -1); }
      else if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); tryMove(0, 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tryMove]);

  const elapsed = Math.round((now - startedAt) / 1000);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 justify-center">
        <span className="flex items-center gap-2"><Move className="w-4 h-4 text-brand-accent" /> Moves: <span className="text-white font-mono">{moves}</span></span>
        <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-brand-accent" /> Time: <span className="text-white font-mono">{elapsed}s</span></span>
        <span className="flex items-center gap-2"><Trophy className="w-4 h-4 text-brand-accent" /> Optimal: <span className="text-white font-mono">{Number.isFinite(bestPath) ? bestPath : '?'}</span></span>
      </div>

      <div className="rounded-2xl overflow-hidden border border-white/10 bg-brand-dark p-2">
        <canvas ref={canvasRef} className="block" />
      </div>

      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-2 max-w-[180px]">
        <span />
        <Button variant="ghost" size="sm" onClick={() => tryMove(-1, 0)} aria-label="Up">↑</Button>
        <span />
        <Button variant="ghost" size="sm" onClick={() => tryMove(0, -1)} aria-label="Left">←</Button>
        <Button variant="ghost" size="sm" onClick={() => tryMove(1, 0)} aria-label="Down">↓</Button>
        <Button variant="ghost" size="sm" onClick={() => tryMove(0, 1)} aria-label="Right">→</Button>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant="secondary"
          size="sm"
          icon={<RotateCw className="w-4 h-4" />}
          onClick={() => {
            setPos(findCell(level.grid, 2));
            setMoves(0);
            setStartedAt(Date.now());
            setFinished(false);
            submittedRef.current = false;
          }}
        >
          Restart
        </Button>
        {LEVELS.map((l, i) => (
          <Button
            key={l.name}
            variant={i === levelIdx ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setLevelIdx(i)}
          >
            {l.name}
          </Button>
        ))}
      </div>

      {finished && (
        <div className="text-center bg-brand-accent/10 border border-brand-accent/30 rounded-xl p-4 max-w-md">
          <p className="text-lg font-heading font-bold text-brand-accent">🎉 Level cleared!</p>
          <p className="text-sm text-white/60 mt-1">
            {moves} moves · {elapsed}s · {moves === bestPath ? 'Optimal solution!' : `${moves - bestPath} extra moves`}
          </p>
          {levelIdx < LEVELS.length - 1 && (
            <Button size="sm" className="mt-3" onClick={() => setLevelIdx(levelIdx + 1)} icon={<Play className="w-4 h-4" />}>
              Next Level
            </Button>
          )}
        </div>
      )}

      <p className="text-xs text-white/30 text-center">
        Use <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">WASD</kbd> or arrow keys.
      </p>
    </div>
  );
}
