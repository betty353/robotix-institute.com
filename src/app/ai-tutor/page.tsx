'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, GlassCard, Badge, Button } from '@/components/ui';
import {
  Bot, Send, User, Sparkles, Code, Cpu, Lightbulb, BookOpen,
  Wrench, Zap, Copy, Check, RotateCcw, ChevronRight
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  { icon: Code, text: 'Explain how PID control works for a line follower robot', category: 'Robotics' },
  { icon: Cpu, text: 'Write Arduino code to read an ultrasonic sensor', category: 'Code' },
  { icon: Lightbulb, text: 'How do I connect an ESP32 to WiFi and send data via MQTT?', category: 'IoT' },
  { icon: Wrench, text: 'My L298N motor driver is getting hot — how do I troubleshoot?', category: 'Debug' },
  { icon: BookOpen, text: 'What sensors do I need for an autonomous drone?', category: 'Learning' },
  { icon: Zap, text: 'Explain PWM and how to control servo motor speed', category: 'Electronics' },
];

const aiResponses: Record<string, string> = {
  'pid': `## PID Control for Line Follower Robots 🤖

PID stands for **Proportional-Integral-Derivative** — a control algorithm that helps your robot follow a line smoothly.

### How it works:
1. **Proportional (P)**: Corrects based on the *current error* — how far off the line the robot is
2. **Integral (I)**: Corrects based on *accumulated past errors* — fixes persistent drift
3. **Derivative (D)**: Corrects based on the *rate of change* — prevents overshooting

### Arduino Code Example:
\`\`\`cpp
float Kp = 25.0, Ki = 0.5, Kd = 15.0;
float error, lastError = 0, integral = 0;

void loop() {
  int sensorValue = readLineSensor(); // -100 to 100
  error = 0 - sensorValue; // Target is center (0)
  
  integral += error;
  float derivative = error - lastError;
  
  float correction = Kp*error + Ki*integral + Kd*derivative;
  
  int leftSpeed = baseSpeed + correction;
  int rightSpeed = baseSpeed - correction;
  
  setMotors(leftSpeed, rightSpeed);
  lastError = error;
}
\`\`\`

### Tuning Tips:
- Start with only **P** (set I=0, D=0) and increase until the robot oscillates
- Add **D** to dampen oscillation
- Add small **I** only if there's persistent offset

Would you like me to explain any part in more detail?`,

  'ultrasonic': `## Reading an Ultrasonic Sensor with Arduino 📡

Here's how to use the HC-SR04 ultrasonic sensor to measure distance:

### Wiring:
- **VCC** → 5V
- **GND** → GND
- **Trig** → Pin 9
- **Echo** → Pin 10

### Code:
\`\`\`cpp
#define TRIG_PIN 9
#define ECHO_PIN 10

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  // Send ultrasonic pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Read echo duration
  long duration = pulseIn(ECHO_PIN, HIGH);
  
  // Calculate distance in cm
  float distance = duration * 0.034 / 2;
  
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  
  delay(100);
}
\`\`\`

### How it works:
1. The sensor sends an ultrasonic pulse (40kHz)
2. The pulse bounces off an object and returns
3. We measure the time taken and calculate distance using: **distance = (time × speed of sound) / 2**

The speed of sound is ~343 m/s or 0.034 cm/μs.

Need help with obstacle avoidance using this sensor?`,

  'default': `Great question! Let me help you with that.

As your AI Robotics Tutor, I can assist with:
- **Code writing & debugging** — Arduino, Python, C++, MicroPython
- **Circuit design** — Wiring diagrams and component selection  
- **Robotics concepts** — PID control, kinematics, sensor fusion
- **IoT guidance** — MQTT, WiFi connectivity, cloud dashboards
- **Project planning** — Component lists, architecture, best practices

I'm trained on thousands of robotics projects and documentation to give you accurate, practical guidance tailored for the Zambian robotics community.

What specific topic would you like to explore?`
};

function getAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes('pid') || lower.includes('line follower')) return aiResponses['pid'];
  if (lower.includes('ultrasonic') || lower.includes('sensor') && lower.includes('arduino')) return aiResponses['ultrasonic'];
  return aiResponses['default'];
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0', role: 'assistant',
      content: `Hello! 👋 I'm **RoboTutor**, your AI-powered robotics assistant.\n\nI can help you with:\n- Writing Arduino, Python, and MicroPython code\n- Debugging circuits and robot designs\n- Explaining robotics concepts (PID, kinematics, sensor fusion)\n- IoT connectivity (ESP32, MQTT, WiFi)\n- Project planning and component selection\n\nHow can I help you today?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = {
      id: Date.now().toString(), role: 'user',
      content: msg, timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: getAIResponse(msg), timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([messages[0]]);
  };

  return (
    <main className="bg-brand-dark min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col pt-20">
        {/* Header */}
        <div className="border-b border-white/10 bg-brand-dark/80 backdrop-blur-md">
          <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-yellow-300 flex items-center justify-center">
                <Bot className="w-5 h-5 text-brand-dark" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-white text-lg">RoboTutor AI</h1>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleReset}
                className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                title="Reset conversation">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
            {messages.map((msg) => (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent to-yellow-300 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-brand-dark" />
                  </div>
                )}
                <div className={`max-w-[80%] ${msg.role === 'user'
                  ? 'bg-brand-primary rounded-2xl rounded-tr-md px-4 py-3'
                  : 'bg-white/5 rounded-2xl rounded-tl-md px-4 py-3'
                }`}>
                  <div className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed prose prose-invert prose-sm max-w-none
                    [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-2 [&_h2]:mb-2
                    [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-2 [&_h3]:mb-1
                    [&_strong]:text-white [&_strong]:font-semibold
                    [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-brand-accent [&_code]:text-xs
                    [&_pre]:bg-black/30 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:my-3 [&_pre]:overflow-x-auto
                    [&_pre_code]:bg-transparent [&_pre_code]:p-0
                    [&_ul]:space-y-1 [&_ul]:my-2 [&_li]:text-white/70
                    [&_ol]:space-y-1 [&_ol]:my-2
                  ">
                    {msg.content}
                  </div>
                  {msg.role === 'assistant' && msg.id !== '0' && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5">
                      <button onClick={() => handleCopy(msg.content, msg.id)}
                        className="text-xs text-white/20 hover:text-white/50 flex items-center gap-1 transition-colors">
                        {copiedId === msg.id ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                      </button>
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/50 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-white/60" />
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent to-yellow-300 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-brand-dark" />
                </div>
                <div className="bg-white/5 rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 1 && (
          <div className="mx-auto max-w-4xl px-4 pb-4">
            <p className="text-xs text-white/30 mb-3 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Suggested questions</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {suggestedPrompts.map((prompt, i) => (
                <motion.button key={i}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => handleSend(prompt.text)}
                  className="text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-accent/30 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <prompt.icon className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-white/60 group-hover:text-white/80 line-clamp-2">{prompt.text}</p>
                      <Badge variant="primary" className="mt-1 text-[10px]">{prompt.category}</Badge>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-white/10 bg-brand-dark/80 backdrop-blur-md">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                  }}
                  placeholder="Ask me anything about robotics, code, circuits..."
                  rows={1}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-white/30
                    focus:outline-none focus:border-brand-accent resize-none"
                />
              </div>
              <Button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-white/20 mt-2 text-center">
              RoboTutor is an AI assistant. Always verify critical information for safety-sensitive robotics applications.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
