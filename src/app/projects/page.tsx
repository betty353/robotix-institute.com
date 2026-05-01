'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, SectionHeader, GlassCard, Badge, Button, Input } from '@/components/ui';
import { BookOpen, Search, Eye, Heart, Code, Video, Cpu, Wrench, ChevronRight, ExternalLink } from 'lucide-react';

const projects = [
  {
    id: '1', slug: 'line-follower-robot',
    title: 'Line Follower Robot',
    description: 'Build a robot that autonomously follows a black line on a white surface using IR sensors and PID control algorithm.',
    category: 'Robotics', difficulty: 'beginner',
    components: ['Arduino Uno', '2x IR Sensors', 'L298N Motor Driver', '2x DC Motors', 'Chassis Kit', '9V Battery'],
    likes: 342, views: 2890,
    hasVideo: true, hasCode: true, hasTutorial: true, hasDiagram: true,
    icon: '🤖',
  },
  {
    id: '2', slug: 'smart-irrigation-system',
    title: 'Smart Irrigation System',
    description: 'Automated plant watering system using soil moisture sensors, ESP32, and MQTT for remote monitoring and control.',
    category: 'Agriculture IoT', difficulty: 'intermediate',
    components: ['ESP32', 'Soil Moisture Sensor', 'Water Pump', 'Relay Module', 'DHT22 Sensor', 'Solar Panel'],
    likes: 528, views: 4120,
    hasVideo: true, hasCode: true, hasTutorial: true, hasDiagram: true,
    icon: '🌱',
  },
  {
    id: '3', slug: 'robotic-arm',
    title: 'Robotic Arm Controller',
    description: 'A 4-DOF robotic arm controlled via joystick and programmable for pick-and-place operations.',
    category: 'Automation', difficulty: 'intermediate',
    components: ['Arduino Mega', '4x Servo Motors', '2x Joystick Modules', 'PCA9685 Driver', '3D Printed Parts', '12V PSU'],
    likes: 456, views: 3560,
    hasVideo: true, hasCode: true, hasTutorial: true, hasDiagram: true,
    icon: '🦾',
  },
  {
    id: '4', slug: 'ai-object-detection-robot',
    title: 'AI Object Detection Robot',
    description: 'A mobile robot that detects and classifies objects using ESP32-CAM, TensorFlow Lite, and computer vision.',
    category: 'AI & Vision', difficulty: 'advanced',
    components: ['ESP32-CAM', 'L298N Motor Driver', '2x DC Motors', 'Chassis', 'Battery Pack', 'LED Indicators'],
    likes: 389, views: 3100,
    hasVideo: true, hasCode: true, hasTutorial: true, hasDiagram: true,
    icon: '👁️',
  },
  {
    id: '5', slug: 'weather-station',
    title: 'IoT Weather Station',
    description: 'Build a connected weather station that measures temperature, humidity, pressure, and rain, reporting to a web dashboard.',
    category: 'IoT', difficulty: 'beginner',
    components: ['ESP32', 'BME280 Sensor', 'Rain Sensor', 'Wind Speed Sensor', 'OLED Display', 'Solar Panel'],
    likes: 267, views: 2100,
    hasVideo: true, hasCode: true, hasTutorial: true, hasDiagram: false,
    icon: '🌤️',
  },
  {
    id: '6', slug: 'drone-flight-controller',
    title: 'DIY Drone Flight Controller',
    description: 'Build a custom flight controller for a quadcopter using Arduino and MPU6050 IMU for stabilization.',
    category: 'Drones', difficulty: 'advanced',
    components: ['Arduino Pro Mini', 'MPU6050 IMU', '4x ESC', '4x Brushless Motors', 'LiPo Battery', 'RC Receiver'],
    likes: 312, views: 2750,
    hasVideo: true, hasCode: true, hasTutorial: true, hasDiagram: true,
    icon: '🚁',
  },
];

const categories = ['All', 'Robotics', 'Agriculture IoT', 'Automation', 'AI & Vision', 'IoT', 'Drones'];

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />

      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="circuit-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="accent" className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" /> Knowledge Base
            </Badge>
            <h1 className="section-title mb-4">
              Robotics <span className="gradient-text">Project Library</span>
            </h1>
            <p className="section-subtitle mx-auto">
              Complete project guides with descriptions, components, circuit diagrams, source code, and video tutorials.
            </p>
          </motion.div>
        </div>
      </section>

      <Section className="py-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-accent text-brand-dark'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard hover className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{project.icon}</div>
                  <Badge variant={project.difficulty === 'beginner' ? 'primary' : project.difficulty === 'intermediate' ? 'accent' : 'danger'}>
                    {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
                  </Badge>
                </div>
                <Badge variant="primary" className="w-fit mb-2">{project.category}</Badge>
                <h3 className="font-heading text-lg font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-sm text-white/50 mb-4 flex-1">{project.description}</p>

                {/* Components preview */}
                <div className="mb-4">
                  <p className="text-xs text-white/30 mb-2">Components ({project.components.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {project.components.slice(0, 3).map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/50">{c}</span>
                    ))}
                    {project.components.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/40">
                        +{project.components.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Feature indicators */}
                <div className="flex items-center gap-3 mb-4 text-xs text-white/40">
                  {project.hasTutorial && <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Tutorial</span>}
                  {project.hasCode && <span className="flex items-center gap-1"><Code className="w-3 h-3" /> Code</span>}
                  {project.hasVideo && <span className="flex items-center gap-1"><Video className="w-3 h-3" /> Video</span>}
                  {project.hasDiagram && <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> Circuit</span>}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {project.likes}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {project.views}</span>
                  </div>
                  <Link href={`/projects/${project.slug}`} className="text-sm text-brand-accent flex items-center gap-1 hover:text-brand-accent-light">
                    View <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      <Footer />
    </main>
  );
}
