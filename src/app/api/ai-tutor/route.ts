import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createApiResponse, createErrorResponse, rateLimiter } from '@/lib/api-utils';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000, 'Message is too long'),
  context: z.object({
    topic: z.string().optional(),
    courseId: z.string().optional(),
    language: z.string().optional(),
  }).optional(),
});

// System prompt for the AI tutor
const SYSTEM_PROMPT = `You are an expert AI tutor for Robotix Institute, specializing in:
- Robotics fundamentals (sensors, actuators, control systems)
- Programming (Python, C++, Arduino, MicroPython)
- Electronics and circuit design
- IoT and embedded systems
- Machine learning for robotics

Guidelines:
1. Be friendly, patient, and encouraging
2. Explain concepts step by step with examples
3. Use analogies to make complex topics accessible
4. Provide code examples when relevant
5. Ask clarifying questions when the student's question is unclear
6. Encourage experimentation and hands-on learning
7. Reference common robotics components (Arduino, ESP32, Raspberry Pi)

Always respond in a helpful and educational manner.`;

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    // AI tutor can be used by unauthenticated users with rate limiting
    
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = user ? 60 : 10; // More requests for authenticated users
    if (!rateLimiter(ip, rateLimit, 60000)) {
      return NextResponse.json(
        createErrorResponse('Too many requests. Please wait a moment.'),
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = chatSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse('Validation failed', validation.error.errors.map(e => e.message)),
        { status: 400 }
      );
    }

    const { message, context } = validation.data;

    // Check for AI API configuration
    const aiApiKey = process.env.AI_API_KEY;
    const aiApiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1';

    if (!aiApiKey) {
      // Fallback to intelligent mock responses when no API key
      const mockResponse = generateMockResponse(message, context);
      return NextResponse.json(createApiResponse({
        message: mockResponse,
        source: 'mock',
      }));
    }

    // Make request to AI API (OpenAI compatible)
    try {
      const aiResponse = await fetch(`${aiApiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiApiKey}`,
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: message },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!aiResponse.ok) {
        throw new Error('AI API request failed');
      }

      const data = await aiResponse.json();
      const reply = data.choices?.[0]?.message?.content || 'I apologize, I couldn\'t generate a response. Please try again.';

      return NextResponse.json(createApiResponse({
        message: reply,
        source: 'ai',
        usage: data.usage,
      }));
    } catch (aiError) {
      console.error('AI API error:', aiError);
      // Fall back to mock response
      const mockResponse = generateMockResponse(message, context);
      return NextResponse.json(createApiResponse({
        message: mockResponse,
        source: 'fallback',
      }));
    }
  } catch (error) {
    console.error('AI Tutor error:', error);
    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}

// Generate intelligent mock responses based on keywords
function generateMockResponse(message: string, context?: { topic?: string; courseId?: string; language?: string }): string {
  const lowerMessage = message.toLowerCase();
  
  // Common robotics topics
  if (lowerMessage.includes('arduino')) {
    return `Arduino is a great platform for learning robotics! Here's what you need to know:

**Getting Started:**
1. Install the Arduino IDE from arduino.cc
2. Connect your Arduino board via USB
3. Select your board type and port in Tools menu

**Basic Structure:**
\`\`\`cpp
void setup() {
  // Runs once at startup
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // Runs repeatedly
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}
\`\`\`

Would you like to learn about sensors, motors, or a specific project?`;
  }
  
  if (lowerMessage.includes('esp32') || lowerMessage.includes('wifi') || lowerMessage.includes('iot')) {
    return `ESP32 is perfect for IoT projects! It has built-in WiFi and Bluetooth.

**Key Features:**
- Dual-core processor
- Built-in WiFi & Bluetooth
- Multiple GPIO pins
- Low power modes

**WiFi Example:**
\`\`\`cpp
#include <WiFi.h>

const char* ssid = "YourNetwork";
const char* password = "YourPassword";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected!");
  Serial.println(WiFi.localIP());
}
\`\`\`

What would you like to build with ESP32?`;
  }
  
  if (lowerMessage.includes('sensor') || lowerMessage.includes('ultrasonic')) {
    return `Sensors are the "eyes and ears" of your robot! Let me explain ultrasonic sensors:

**How They Work:**
- Emit ultrasonic sound waves
- Measure time for echo to return
- Calculate distance using speed of sound

**HC-SR04 Wiring:**
- VCC → 5V
- GND → GND
- TRIG → Digital pin (output)
- ECHO → Digital pin (input)

**Code Example:**
\`\`\`cpp
#define TRIG_PIN 9
#define ECHO_PIN 10

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  int distance = duration * 0.034 / 2;
  
  Serial.print("Distance: ");
  Serial.println(distance);
  delay(100);
}
\`\`\`

Would you like to learn about other sensors like IR, temperature, or accelerometers?`;
  }
  
  if (lowerMessage.includes('motor') || lowerMessage.includes('movement')) {
    return `Motors bring your robot to life! Here are the main types:

**DC Motors:**
- Simple on/off control
- Need motor driver (L298N, L293D)
- Control speed with PWM

**Servo Motors:**
- Precise position control (0-180°)
- Built-in driver
- Great for robot arms

**Stepper Motors:**
- Precise rotation in steps
- Good for 3D printers, CNC
- Need driver (A4988, DRV8825)

**Servo Example:**
\`\`\`cpp
#include <Servo.h>

Servo myServo;

void setup() {
  myServo.attach(9);
}

void loop() {
  myServo.write(0);   // Move to 0°
  delay(1000);
  myServo.write(90);  // Move to 90°
  delay(1000);
  myServo.write(180); // Move to 180°
  delay(1000);
}
\`\`\`

What type of movement does your robot need?`;
  }
  
  if (lowerMessage.includes('pid') || lowerMessage.includes('control')) {
    return `PID control is essential for smooth robot movement!

**What is PID?**
- **P**roportional: React to current error
- **I**ntegral: Account for past errors
- **D**erivative: Predict future errors

**Formula:** Output = Kp×error + Ki×∫error + Kd×(d/dt)error

**Simple Example:**
\`\`\`cpp
float Kp = 1.0, Ki = 0.1, Kd = 0.05;
float error, lastError = 0;
float integral = 0;

float computePID(float setpoint, float actual) {
  error = setpoint - actual;
  integral += error;
  float derivative = error - lastError;
  
  float output = Kp*error + Ki*integral + Kd*derivative;
  
  lastError = error;
  return output;
}
\`\`\`

**Tuning Tips:**
1. Start with Kp only (Ki=0, Kd=0)
2. Increase Kp until oscillation
3. Add Kd to dampen oscillation
4. Add small Ki to eliminate steady-state error

What are you trying to control?`;
  }
  
  if (lowerMessage.includes('python') || lowerMessage.includes('raspberry')) {
    return `Python is excellent for robotics, especially with Raspberry Pi!

**Getting Started:**
\`\`\`python
# Install GPIO library
# pip install RPi.GPIO

import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
LED_PIN = 17

GPIO.setup(LED_PIN, GPIO.OUT)

try:
    while True:
        GPIO.output(LED_PIN, GPIO.HIGH)
        time.sleep(1)
        GPIO.output(LED_PIN, GPIO.LOW)
        time.sleep(1)
except KeyboardInterrupt:
    GPIO.cleanup()
\`\`\`

**Popular Libraries:**
- RPi.GPIO - Basic GPIO control
- gpiozero - Simplified GPIO
- OpenCV - Computer vision
- TensorFlow Lite - ML on edge

What would you like to build with Python?`;
  }
  
  // Default response for generic questions
  return `Great question! I'm here to help you learn robotics.

**Topics I can help with:**
- 🤖 Robot building and design
- 💻 Programming (Arduino, Python, C++)
- ⚡ Electronics and circuits
- 📡 IoT and connectivity
- 🧠 Control systems (PID, etc.)
- 👁️ Sensors and actuators

**Getting Started Tips:**
1. Start with a simple project (LED blink, basic motor)
2. Understand the components before combining them
3. Use the simulation lab to test without hardware
4. Ask questions when you're stuck!

Could you tell me more about what you're trying to build or learn? I'll give you more specific guidance!`;
}
