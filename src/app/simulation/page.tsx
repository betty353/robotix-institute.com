'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import { GlassCard, Badge, Button } from '@/components/ui';
import {
  Play, RotateCcw, ChevronRight, Terminal, Code,
  Cpu, Eye, Compass, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight
} from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const SimulationCanvas = dynamic(
  () => import('@/components/three/SimulationScene'),
  { ssr: false, loading: () => <div className="w-full h-full bg-brand-dark flex items-center justify-center text-white/20">Loading 3D environment...</div> }
);

const COMMANDS_HELP = [
  { cmd: 'moveForward()', desc: 'Move robot forward one step' },
  { cmd: 'moveForward(n)', desc: 'Move robot forward n steps' },
  { cmd: 'turnLeft()', desc: 'Rotate robot 90° left' },
  { cmd: 'turnRight()', desc: 'Rotate robot 90° right' },
  { cmd: 'scanObstacle()', desc: 'Scan for obstacles ahead' },
  { cmd: 'pickUp()', desc: 'Pick up an object' },
  { cmd: 'place()', desc: 'Place held object' },
  { cmd: 'wait(ms)', desc: 'Wait for milliseconds' },
];

const MISSIONS = [
  { id: 1, name: 'First Steps', desc: 'Move the robot to the goal marker', difficulty: 'Easy' },
  { id: 2, name: 'Obstacle Course', desc: 'Navigate around obstacles to reach the end', difficulty: 'Medium' },
  { id: 3, name: 'Maze Runner', desc: 'Find your way through the maze', difficulty: 'Hard' },
  { id: 4, name: 'Sensor Challenge', desc: 'Use scanObstacle() to navigate blindly', difficulty: 'Hard' },
];

const defaultCode = `// Robotix Simulation Lab
// Program your robot to complete the mission!

// Move forward 3 steps
moveForward(3);

// Turn left
turnLeft();

// Move forward 2 steps
moveForward(2);

// Scan for obstacles
scanObstacle();

// Turn right
turnRight();

// Move to goal
moveForward(4);
`;

export default function SimulationPage() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [robotState, setRobotState] = useState({
    x: 0, y: 0, z: 0,
    rotation: 0,
    sensorReading: -1,
    hasObject: false,
  });
  const [selectedMission, setSelectedMission] = useState(MISSIONS[0]);
  const [commandQueue, setCommandQueue] = useState<string[]>([]);

  const executeCode = useCallback(() => {
    setIsRunning(true);
    setOutput('');
    const commands: string[] = [];
    let log = '🤖 Starting simulation...\n━━━━━━━━━━━━━━━━━━━━━━━━\n';

    // Parse and simulate commands
    const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('//'));
    let rx = 0, ry = 0, dir = 0; // 0=north, 1=east, 2=south, 3=west
    const dirNames = ['North', 'East', 'South', 'West'];
    const dx = [0, 1, 0, -1];
    const dy = [1, 0, -1, 0];

    for (const line of lines) {
      const trimmed = line.trim();

      const moveMatch = trimmed.match(/moveForward\((\d*)\)/);
      if (moveMatch) {
        const steps = parseInt(moveMatch[1] || '1');
        for (let s = 0; s < steps; s++) {
          rx += dx[dir];
          ry += dy[dir];
          commands.push(`move_${dir}`);
        }
        log += `➡ moveForward(${steps}) → Position: (${rx}, ${ry})\n`;
        continue;
      }

      if (trimmed === 'turnLeft()') {
        dir = (dir + 3) % 4;
        commands.push('turn_left');
        log += `↩ turnLeft() → Facing: ${dirNames[dir]}\n`;
        continue;
      }

      if (trimmed === 'turnRight()') {
        dir = (dir + 1) % 4;
        commands.push('turn_right');
        log += `↪ turnRight() → Facing: ${dirNames[dir]}\n`;
        continue;
      }

      if (trimmed === 'scanObstacle()') {
        const dist = Math.floor(Math.random() * 80) + 10;
        commands.push('scan');
        log += `📡 scanObstacle() → Distance: ${dist}cm\n`;
        continue;
      }

      if (trimmed === 'pickUp()') {
        commands.push('pickup');
        log += `🤏 pickUp() → Object grabbed!\n`;
        continue;
      }

      if (trimmed === 'place()') {
        commands.push('place');
        log += `📦 place() → Object placed!\n`;
        continue;
      }

      const waitMatch = trimmed.match(/wait\((\d+)\)/);
      if (waitMatch) {
        commands.push(`wait_${waitMatch[1]}`);
        log += `⏳ wait(${waitMatch[1]}ms)\n`;
      }
    }

    log += '━━━━━━━━━━━━━━━━━━━━━━━━\n';
    log += `✅ Simulation complete! Final position: (${rx}, ${ry}) facing ${dirNames[dir]}\n`;

    setCommandQueue(commands);
    setRobotState(prev => ({ ...prev, x: rx, y: 0, z: ry, rotation: dir * 90 }));

    // Animate output
    let charIdx = 0;
    const interval = setInterval(() => {
      if (charIdx < log.length) {
        setOutput(log.substring(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 15);
  }, [code]);

  const resetSimulation = () => {
    setRobotState({ x: 0, y: 0, z: 0, rotation: 0, sensorReading: -1, hasObject: false });
    setCommandQueue([]);
    setOutput('');
    setIsRunning(false);
  };

  return (
    <main className="bg-brand-dark min-h-screen flex flex-col">
      <Navbar />

      {/* Toolbar */}
      <div className="pt-16 border-b border-white/10 bg-brand-dark-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-brand-accent" />
            <span className="font-heading font-semibold text-white text-sm">Robotics Simulation Lab</span>
            <Badge variant="accent">{selectedMission.name}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={resetSimulation} icon={<RotateCcw className="w-4 h-4" />}>
              Reset
            </Button>
            <Button variant="primary" size="sm" onClick={executeCode} loading={isRunning} icon={<Play className="w-4 h-4" />}>
              Run Simulation
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Code Editor */}
        <div className="w-full lg:w-[40%] flex flex-col border-r border-white/10">
          {/* Mission Selector */}
          <div className="p-3 border-b border-white/10 bg-white/[0.02]">
            <p className="text-xs text-white/40 mb-2">Select Mission:</p>
            <div className="flex flex-wrap gap-2">
              {MISSIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMission(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedMission.id === m.id
                      ? 'bg-brand-accent text-brand-dark'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-white/30 mt-2">{selectedMission.desc}</p>
          </div>

          {/* Editor */}
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language="javascript"
              value={code}
              onChange={(v: any) => setCode(v || '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                padding: { top: 12 },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Commands Reference */}
          <div className="p-3 border-t border-white/10 bg-white/[0.02] max-h-40 overflow-y-auto">
            <p className="text-xs text-white/40 mb-2 font-semibold">Available Commands:</p>
            <div className="grid grid-cols-2 gap-1">
              {COMMANDS_HELP.map((c) => (
                <div key={c.cmd} className="text-xs">
                  <code className="text-brand-accent">{c.cmd}</code>
                  <span className="text-white/30 ml-1">— {c.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: 3D Scene + Output */}
        <div className="flex-1 flex flex-col">
          {/* 3D Viewport */}
          <div className="flex-1 relative min-h-[300px]">
            <SimulationCanvas robotState={robotState} commands={commandQueue} />

            {/* Robot Status HUD */}
            <div className="absolute top-4 left-4 z-10">
              <GlassCard className="p-3 text-xs space-y-1">
                <div className="flex items-center gap-2 text-brand-accent font-heading font-semibold">
                  <Compass className="w-3 h-3" /> Robot Status
                </div>
                <div className="text-white/60">Position: ({robotState.x}, {robotState.z})</div>
                <div className="text-white/60">Rotation: {robotState.rotation}°</div>
                <div className="text-white/60">
                  Sensor: {robotState.sensorReading >= 0 ? `${robotState.sensorReading}cm` : '--'}
                </div>
              </GlassCard>
            </div>

            {/* Quick Controls */}
            <div className="absolute bottom-4 right-4 z-10">
              <GlassCard className="p-2">
                <div className="grid grid-cols-3 gap-1">
                  <div />
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60">
                    <ArrowUp className="w-4 h-4 mx-auto" />
                  </button>
                  <div />
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60">
                    <ArrowLeft className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="p-2 rounded-lg bg-brand-accent/20 text-brand-accent text-xs font-bold">
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60">
                    <ArrowRight className="w-4 h-4 mx-auto" />
                  </button>
                  <div />
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60">
                    <ArrowDown className="w-4 h-4 mx-auto" />
                  </button>
                  <div />
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Output Console */}
          <div className="h-48 border-t border-white/10 bg-[#0d0d0d] flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-xs text-white/50">Simulation Log</span>
            </div>
            <div className="flex-1 p-3 overflow-auto font-mono text-xs">
              {output ? (
                <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
              ) : (
                <span className="text-white/20">Run your code to see simulation output...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
