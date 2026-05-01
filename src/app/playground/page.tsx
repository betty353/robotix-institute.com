'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import { GlassCard, Badge, Button, Input } from '@/components/ui';
import { useAuth, useApi } from '@/hooks/useApi';
import {
  Play, Save, Share2, Trash2, Terminal,
  Code, ChevronDown, Copy, Check,
  FileCode, Sun, Moon, Folder
} from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANGUAGES = [
  { id: 'python', label: 'Python', icon: '🐍', defaultCode: `# Robotix Institute - Python Playground
# Welcome to the Coder Play Station!

def greet_robot(name):
    """Greet our robot friend"""
    return f"Hello, {name}! Welcome to Robotix Institute! 🤖"

# Robot movement simulation
class Robot:
    def __init__(self, name):
        self.name = name
        self.x = 0
        self.y = 0
        self.direction = "north"
    
    def move_forward(self, steps=1):
        if self.direction == "north":
            self.y += steps
        elif self.direction == "south":
            self.y -= steps
        elif self.direction == "east":
            self.x += steps
        elif self.direction == "west":
            self.x -= steps
        print(f"{self.name} moved {steps} step(s) {self.direction}")
        print(f"Position: ({self.x}, {self.y})")
    
    def turn_left(self):
        directions = ["north", "west", "south", "east"]
        idx = directions.index(self.direction)
        self.direction = directions[(idx + 1) % 4]
        print(f"{self.name} turned left, now facing {self.direction}")
    
    def scan_obstacle(self):
        import random
        distance = random.randint(5, 100)
        print(f"Obstacle detected at {distance}cm")
        return distance

# Create and control our robot
robot = Robot("ZamBot-1")
print(greet_robot(robot.name))
print("---")
robot.move_forward(3)
robot.turn_left()
robot.move_forward(2)
robot.scan_obstacle()
` },
  { id: 'javascript', label: 'JavaScript', icon: '📜', defaultCode: `// Robotix Institute - JavaScript Playground
// Welcome to the Coder Play Station!

class Robot {
  constructor(name) {
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.sensors = { ultrasonic: 0, ir: false, temperature: 25 };
  }

  moveForward(steps = 1) {
    this.y += steps;
    console.log(\`\${this.name} moved forward \${steps} steps\`);
    console.log(\`Position: (\${this.x}, \${this.y})\`);
  }

  turnLeft() {
    console.log(\`\${this.name} turned left\`);
  }

  turnRight() {
    console.log(\`\${this.name} turned right\`);
  }

  scanObstacle() {
    const distance = Math.floor(Math.random() * 100) + 5;
    this.sensors.ultrasonic = distance;
    console.log(\`Obstacle detected at \${distance}cm\`);
    return distance;
  }

  readTemperature() {
    const temp = (Math.random() * 15 + 20).toFixed(1);
    this.sensors.temperature = parseFloat(temp);
    console.log(\`Temperature: \${temp}°C\`);
    return temp;
  }

  getStatus() {
    return {
      name: this.name,
      position: { x: this.x, y: this.y },
      sensors: this.sensors
    };
  }
}

// Create robot and run commands
const robot = new Robot("ZamBot-JS");
console.log("🤖 Robot initialized:", robot.name);
console.log("---");

robot.moveForward(5);
robot.turnLeft();
robot.moveForward(3);

const distance = robot.scanObstacle();
if (distance < 30) {
  console.log("⚠️ Obstacle too close! Turning...");
  robot.turnRight();
} else {
  console.log("✅ Path is clear!");
}

robot.readTemperature();
console.log("\\nRobot Status:", JSON.stringify(robot.getStatus(), null, 2));
` },
  { id: 'cpp', label: 'C++', icon: '⚡', defaultCode: `// Robotix Institute - C++ Playground
// Arduino-style robot programming

#include <iostream>
#include <string>
#include <cstdlib>
#include <ctime>
using namespace std;

// Simulated Arduino functions
void delay(int ms) { /* simulated delay */ }
int analogRead(int pin) { return rand() % 1024; }
void digitalWrite(int pin, bool state) {
    cout << "Pin " << pin << " set to " << (state ? "HIGH" : "LOW") << endl;
}

class Robot {
    string name;
    int leftMotorPin = 5;
    int rightMotorPin = 6;
    int ultrasonicPin = 7;
    int irSensorPin = A0;

public:
    Robot(string n) : name(n) {
        srand(time(0));
        cout << "Robot " << name << " initialized!" << endl;
    }

    void moveForward() {
        digitalWrite(leftMotorPin, true);
        digitalWrite(rightMotorPin, true);
        cout << name << " moving forward" << endl;
    }

    void stop() {
        digitalWrite(leftMotorPin, false);
        digitalWrite(rightMotorPin, false);
        cout << name << " stopped" << endl;
    }

    void turnLeft() {
        digitalWrite(leftMotorPin, false);
        digitalWrite(rightMotorPin, true);
        cout << name << " turning left" << endl;
    }

    int scanDistance() {
        int distance = rand() % 200 + 2;
        cout << "Ultrasonic: " << distance << " cm" << endl;
        return distance;
    }

    int readLineSensor() {
        int value = analogRead(0);
        cout << "IR Sensor: " << value << endl;
        return value;
    }
};

int main() {
    cout << "=== Robotix Institute - C++ Robot ===" << endl;
    
    Robot robot("ZamBot-CPP");
    cout << "---" << endl;
    
    robot.moveForward();
    
    int distance = robot.scanDistance();
    if (distance < 30) {
        cout << "Obstacle detected! Avoiding..." << endl;
        robot.stop();
        robot.turnLeft();
        robot.moveForward();
    }
    
    robot.readLineSensor();
    robot.stop();
    
    cout << "\\nProgram complete!" << endl;
    return 0;
}
` },
  { id: 'arduino', label: 'Arduino', icon: '🔌', defaultCode: `// Robotix Institute - Arduino Playground
// Smart Robot Controller

#define MOTOR_LEFT 5
#define MOTOR_RIGHT 6
#define TRIG_PIN 9
#define ECHO_PIN 10
#define IR_SENSOR A0
#define LED_PIN 13

// Robot state
int robotSpeed = 200;
bool isRunning = false;

void setup() {
  Serial.begin(9600);
  
  pinMode(MOTOR_LEFT, OUTPUT);
  pinMode(MOTOR_RIGHT, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  
  Serial.println("=== Robotix Institute ===");
  Serial.println("Smart Robot Controller v1.0");
  Serial.println("Robot ready!");
  
  isRunning = true;
  blinkLED(3); // Signal ready
}

void loop() {
  if (!isRunning) return;
  
  int distance = getDistance();
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  
  if (distance < 20) {
    Serial.println("⚠️ Obstacle! Stopping...");
    stopMotors();
    delay(500);
    
    Serial.println("Turning right...");
    turnRight();
    delay(800);
  } else {
    moveForward();
  }
  
  // Read line sensor
  int lineValue = analogRead(IR_SENSOR);
  Serial.print("Line sensor: ");
  Serial.println(lineValue);
  
  delay(100);
}

int getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034 / 2;
}

void moveForward() {
  analogWrite(MOTOR_LEFT, robotSpeed);
  analogWrite(MOTOR_RIGHT, robotSpeed);
}

void turnRight() {
  analogWrite(MOTOR_LEFT, robotSpeed);
  analogWrite(MOTOR_RIGHT, 0);
}

void stopMotors() {
  analogWrite(MOTOR_LEFT, 0);
  analogWrite(MOTOR_RIGHT, 0);
}

void blinkLED(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(200);
    digitalWrite(LED_PIN, LOW);
    delay(200);
  }
}
` },
  { id: 'micropython', label: 'MicroPython', icon: '🐍', defaultCode: `# Robotix Institute - MicroPython Playground
# ESP32 Robot Controller

from machine import Pin, PWM, ADC
import time
import random

# Pin definitions
class RobotPins:
    MOTOR_LEFT = 5
    MOTOR_RIGHT = 6
    ULTRASONIC_TRIG = 12
    ULTRASONIC_ECHO = 14
    IR_SENSOR = 34
    LED = 2
    BUZZER = 15

class SmartRobot:
    def __init__(self, name="ZamBot-ESP32"):
        self.name = name
        self.speed = 512  # PWM duty (0-1023)
        self.is_running = False
        
        # Initialize LED
        self.led = Pin(RobotPins.LED, Pin.OUT)
        
        print(f"=== {self.name} ===")
        print("MicroPython Robot Controller v1.0")
        self.blink_led(3)
        self.is_running = True
        print("Robot ready! 🤖")
    
    def blink_led(self, times):
        for _ in range(times):
            self.led.value(1)
            time.sleep_ms(200)
            self.led.value(0)
            time.sleep_ms(200)
    
    def get_distance(self):
        """Read ultrasonic sensor"""
        distance = random.randint(5, 150)  # Simulated
        return distance
    
    def read_line_sensor(self):
        """Read IR line sensor"""
        value = random.randint(0, 4095)  # Simulated ADC
        return value
    
    def move_forward(self):
        print(f"{self.name}: Moving forward (speed={self.speed})")
    
    def turn_left(self):
        print(f"{self.name}: Turning left")
    
    def turn_right(self):
        print(f"{self.name}: Turning right")
    
    def stop(self):
        print(f"{self.name}: Stopped")
    
    def read_temperature(self):
        """Read onboard temperature sensor"""
        temp = round(random.uniform(20, 35), 1)
        print(f"Temperature: {temp}°C")
        return temp
    
    def run(self):
        print("\\n--- Starting autonomous mode ---")
        for i in range(5):
            distance = self.get_distance()
            line = self.read_line_sensor()
            
            print(f"\\nCycle {i+1}: Distance={distance}cm, Line={line}")
            
            if distance < 25:
                print("⚠️ Obstacle detected!")
                self.stop()
                self.turn_right()
            elif line > 2000:
                print("📏 Line detected - following...")
                self.move_forward()
            else:
                self.move_forward()
            
            time.sleep_ms(100)
        
        self.stop()
        self.read_temperature()
        print("\\n✅ Mission complete!")

# Run the robot
robot = SmartRobot()
robot.run()
` },
];

interface SavedProject {
  id: string;
  title: string;
  language: string;
  code: string;
  isPublic: boolean;
}

export default function PlaygroundPage() {
  const { isAuthenticated } = useAuth();
  const { get, post } = useApi();
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [darkEditor, setDarkEditor] = useState(true);
  const [title, setTitle] = useState('Untitled Project');
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [saving, setSaving] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  // Load saved projects when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    get<{ codeProjects?: SavedProject[] } | SavedProject[]>('/code-projects?limit=20')
      .then((res) => {
        const list: SavedProject[] = Array.isArray(res.data)
          ? (res.data as SavedProject[])
          : ((res.data as any)?.codeProjects ?? []);
        setProjects(list);
      })
      .catch(() => { /* ignore */ });
  }, [isAuthenticated, get]);

  const handleLanguageChange = (lang: typeof LANGUAGES[0]) => {
    setLanguage(lang);
    setCode(lang.defaultCode);
    setOutput('');
    setShowLangMenu(false);
  };

  // Lightweight in-browser execution. JavaScript runs in a sandboxed Function with
  // a timeout. Python uses Pyodide (loaded on demand). Others fall back to a
  // syntax/structure analysis with a friendly hint to upload to a real device.
  const runJavaScript = useCallback(async (src: string): Promise<string> => {
    const logs: string[] = [];
    const sandboxConsole = {
      log: (...a: unknown[]) => logs.push(a.map(String).join(' ')),
      info: (...a: unknown[]) => logs.push(a.map(String).join(' ')),
      warn: (...a: unknown[]) => logs.push('⚠ ' + a.map(String).join(' ')),
      error: (...a: unknown[]) => logs.push('✖ ' + a.map(String).join(' ')),
    };
    const noop = () => undefined;
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const fn = new Function('console', 'window', 'document', 'fetch', 'localStorage', 'sessionStorage', 'XMLHttpRequest', 'WebSocket', src);
    const exec = new Promise<void>((resolve, reject) => {
      try {
        const result = fn(sandboxConsole, undefined, undefined, noop, undefined, undefined, undefined, undefined);
        Promise.resolve(result).then(() => resolve()).catch(reject);
      } catch (e) { reject(e); }
    });
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Execution timeout (5s)')), 5000)
    );
    await Promise.race([exec, timeout]);
    return logs.join('\n');
  }, []);

  const runPython = useCallback(async (src: string): Promise<string> => {
    const w = window as any;
    if (!w.__pyodidePromise) {
      // Lazy-load Pyodide from CDN
      if (!document.getElementById('pyodide-script')) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.id = 'pyodide-script';
          s.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load Pyodide'));
          document.head.appendChild(s);
        });
      }
      w.__pyodidePromise = w.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
      });
    }
    const py = await w.__pyodidePromise;
    py.runPython(`import sys, io\nsys.stdout = io.StringIO()\nsys.stderr = sys.stdout`);
    try {
      await py.runPythonAsync(src);
    } catch (e: any) {
      return `${py.runPython('sys.stdout.getvalue()')}\n${e?.message || e}`;
    }
    return py.runPython('sys.stdout.getvalue()');
  }, []);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput(`[Robotix] Running ${language.label}…\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    const t0 = performance.now();
    try {
      let stdout = '';
      if (language.id === 'javascript') {
        stdout = await runJavaScript(code);
      } else if (language.id === 'python') {
        stdout = await runPython(code);
      } else {
        // C++ / Arduino / MicroPython: structural analysis only (no in-browser compiler)
        const lines = code.split('\n').filter((l) => l.trim().length > 0).length;
        const fns = (code.match(/\b(void|int|float|bool|String|double)\s+\w+\s*\(/g) || []).length;
        stdout = `✓ ${language.label} code analyzed.
Lines: ${lines}
Functions: ${fns}

This language can't be executed in the browser.
👉 Upload to a real ${language.id === 'arduino' ? 'Arduino' : language.id === 'micropython' ? 'ESP32 / ESP8266' : 'compiler'} to run it.`;
      }
      const ms = Math.round(performance.now() - t0);
      setOutput(
        (prev) =>
          prev + (stdout || '(no output)') + `\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n✅ Finished in ${ms}ms\n`
      );
    } catch (err: any) {
      const ms = Math.round(performance.now() - t0);
      setOutput(
        (prev) => prev + `\n❌ ${err?.message || err}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\nFailed after ${ms}ms\n`
      );
    } finally {
      setIsRunning(false);
    }
  }, [code, language, runJavaScript, runPython]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save your projects');
      return;
    }
    setSaving(true);
    try {
      const res = await post<SavedProject>('/code-projects', {
        title: title.trim() || 'Untitled Project',
        language: language.id,
        code,
        isPublic: false,
      });
      if (res.success && res.data) {
        toast.success('Project saved');
        setProjects((p) => [res.data!, ...p.filter((x) => x.id !== res.data!.id)]);
      }
    } catch (e: any) {
      toast.error(e?.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  }, [isAuthenticated, post, title, language.id, code]);

  const handleShare = useCallback(async () => {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ language: language.id, code }))));
    const url = `${window.location.origin}/playground?p=${payload}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Robotix code', url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Share link copied');
      }
    } catch {
      // user cancelled
    }
  }, [code, language.id]);

  // Restore shared snippet from URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const p = sp.get('p');
    if (!p) return;
    try {
      const decoded = JSON.parse(decodeURIComponent(escape(atob(p)))) as { language: string; code: string };
      const lang = LANGUAGES.find((l) => l.id === decoded.language);
      if (lang) setLanguage(lang);
      setCode(decoded.code);
      toast.success('Loaded shared snippet');
    } catch { /* ignore */ }
  }, []);

  const handleLoad = (proj: SavedProject) => {
    const lang = LANGUAGES.find((l) => l.id === proj.language) || LANGUAGES[0];
    setLanguage(lang);
    setCode(proj.code);
    setTitle(proj.title);
    setShowProjects(false);
    toast.success(`Loaded "${proj.title}"`);
  };

  return (
    <main className="bg-brand-dark min-h-screen flex flex-col">
      <Navbar />

      {/* Toolbar */}
      <div className="pt-16 border-b border-white/10 bg-brand-dark-surface">
        <div className="flex flex-wrap items-center justify-between px-4 py-2 gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-brand-accent" />
              <span className="font-heading font-semibold text-white text-sm">Coder Play Station</span>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Project title"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/40 w-48 focus:outline-none focus:border-brand-accent/50"
              placeholder="Project title"
            />

            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowProjects((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 hover:bg-white/10"
                  title="My projects"
                >
                  <Folder className="w-3.5 h-3.5" />
                  My Projects {projects.length > 0 && <span className="text-xs text-white/40">({projects.length})</span>}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showProjects && (
                  <div className="absolute top-full left-0 mt-1 w-72 max-h-72 overflow-y-auto bg-brand-dark-surface border border-white/10 rounded-xl shadow-glass z-50">
                    {projects.length === 0 ? (
                      <p className="p-4 text-xs text-white/40">No saved projects yet.</p>
                    ) : projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleLoad(p)}
                        className="w-full text-left px-4 py-2 hover:bg-white/5 border-b border-white/5 last:border-0"
                      >
                        <p className="text-sm text-white truncate">{p.title}</p>
                        <p className="text-[10px] text-white/40">{p.language}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors"
              >
                <span>{language.icon}</span>
                <span>{language.label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-1 w-48 bg-brand-dark-surface border border-white/10 rounded-xl shadow-glass overflow-hidden z-50"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                        language.id === lang.id
                          ? 'bg-brand-accent/10 text-brand-accent'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{lang.icon}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkEditor(!darkEditor)}
              icon={darkEditor ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            >
              {darkEditor ? 'Light' : 'Dark'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopy} icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare} icon={<Share2 className="w-4 h-4" />}>
              Share
            </Button>
            <Button variant="primary" size="sm" onClick={handleRun} loading={isRunning} icon={<Play className="w-4 h-4" />}>
              Run Code
            </Button>
          </div>
        </div>
      </div>

      {/* Editor + Output */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 min-h-[50vh] lg:min-h-0 border-r border-white/10">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
            <FileCode className="w-4 h-4 text-brand-accent" />
            <span className="text-xs text-white/50">main.{language.id === 'javascript' ? 'js' : language.id === 'cpp' ? 'cpp' : language.id === 'arduino' ? 'ino' : 'py'}</span>
          </div>
          <MonacoEditor
            height="calc(100vh - 140px)"
            language={language.id === 'arduino' ? 'cpp' : language.id === 'micropython' ? 'python' : language.id}
            value={code}
            onChange={(value: any) => setCode(value || '')}
            theme={darkEditor ? 'vs-dark' : 'light'}
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              padding: { top: 16 },
              lineNumbers: 'on',
              roundedSelection: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
            }}
          />
        </div>

        {/* Output Console */}
        <div className="flex-1 min-h-[30vh] lg:min-h-0 flex flex-col bg-[#0d0d0d]">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white/50">Output Console</span>
            {output && (
              <button
                onClick={() => setOutput('')}
                className="ml-auto text-xs text-white/30 hover:text-white/60 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <div className="flex-1 p-4 overflow-auto font-mono text-sm">
            {output ? (
              <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-white/20">
                <div className="text-center">
                  <Terminal className="w-12 h-12 mx-auto mb-3" />
                  <p>Click &quot;Run Code&quot; to see output</p>
                  <p className="text-xs mt-1">Supports Python, JavaScript, C++, Arduino & MicroPython</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
