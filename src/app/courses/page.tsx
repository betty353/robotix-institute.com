'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Section, SectionHeader, GlassCard, Badge, Button, Input
} from '@/components/ui';
import {
  Search, Filter, Clock, Users, Star, ChevronRight,
  GraduationCap, BookOpen, Cpu, Wifi, Bot, Rocket, Zap
} from 'lucide-react';

const courses = [
  {
    id: '1', slug: 'robotics-fundamentals',
    title: 'Robotics Fundamentals',
    description: 'Master the core foundations of robotics — mechanics, electronics, sensors, actuators, and basic programming for beginners.',
    category: 'Robotics Fundamentals', level: 'beginner', duration: 24,
    students: 856, rating: 4.9, price: 0,
    instructor: { name: 'Dr. Mwape Chilongo', avatar: 'MC' },
    icon: <Cpu className="w-8 h-8" />,
  },
  {
    id: '2', slug: 'arduino-robotics',
    title: 'Arduino Robotics',
    description: 'Build intelligent robots using Arduino microcontrollers. Hands-on projects including line followers, obstacle avoiders, and robotic arms.',
    category: 'Arduino Robotics', level: 'intermediate', duration: 32,
    students: 612, rating: 4.8, price: 150,
    instructor: { name: 'Eng. Bwalya Mwansa', avatar: 'BM' },
    icon: <Zap className="w-8 h-8" />,
  },
  {
    id: '3', slug: 'esp32-iot-systems',
    title: 'ESP32 IoT Systems',
    description: 'Connect robots to the internet with ESP32. Build smart IoT solutions with WiFi, Bluetooth, MQTT, and cloud dashboards.',
    category: 'ESP32 IoT Systems', level: 'intermediate', duration: 28,
    students: 478, rating: 4.7, price: 200,
    instructor: { name: 'Mr. Kalaba Tembo', avatar: 'KT' },
    icon: <Wifi className="w-8 h-8" />,
  },
  {
    id: '4', slug: 'ai-robotics',
    title: 'AI Robotics',
    description: 'Integrate machine learning and computer vision into robotic systems. Object detection, path planning, and autonomous navigation.',
    category: 'AI Robotics', level: 'advanced', duration: 40,
    students: 324, rating: 4.9, price: 350,
    instructor: { name: 'Dr. Mutale Zulu', avatar: 'MZ' },
    icon: <Bot className="w-8 h-8" />,
  },
  {
    id: '5', slug: 'drone-programming',
    title: 'Drone Programming',
    description: 'Program autonomous drones for navigation, aerial mapping, surveillance, and precision agriculture missions.',
    category: 'Drone Programming', level: 'advanced', duration: 36,
    students: 256, rating: 4.8, price: 300,
    instructor: { name: 'Capt. Lubinda Phiri', avatar: 'LP' },
    icon: <Rocket className="w-8 h-8" />,
  },
  {
    id: '6', slug: 'smart-agriculture-automation',
    title: 'Smart Agriculture Automation',
    description: 'Automate farming with robotics, environment sensors, smart irrigation, and data-driven crop management systems.',
    category: 'Smart Agriculture', level: 'intermediate', duration: 30,
    students: 389, rating: 4.7, price: 175,
    instructor: { name: 'Dr. Namukolo Sinyinza', avatar: 'NS' },
    icon: <BookOpen className="w-8 h-8" />,
  },
];

const categories = [
  'All', 'Robotics Fundamentals', 'Arduino Robotics', 'ESP32 IoT Systems',
  'AI Robotics', 'Drone Programming', 'Smart Agriculture',
];

const levels = ['All', 'beginner', 'intermediate', 'advanced'];

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const filtered = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="circuit-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge variant="accent" className="mb-4">
              <GraduationCap className="w-3 h-3 mr-1" /> Learning Management System
            </Badge>
            <h1 className="section-title mb-4">
              Master <span className="gradient-text">Robotics & Engineering</span>
            </h1>
            <p className="section-subtitle mx-auto mb-8">
              Expert-led courses with video lessons, hands-on assignments, quizzes, and certificates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <Section className="py-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedLevel === level
                    ? 'bg-brand-accent text-brand-dark'
                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                {level === 'All' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-secondary text-white'
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/courses/${course.slug}`}>
                <GlassCard hover className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                      {course.icon}
                    </div>
                    {course.price === 0 ? (
                      <Badge variant="success">Free</Badge>
                    ) : (
                      <span className="text-lg font-heading font-bold text-brand-accent">
                        K{course.price}
                      </span>
                    )}
                  </div>

                  <Badge
                    variant={course.level === 'beginner' ? 'primary' : course.level === 'intermediate' ? 'accent' : 'danger'}
                    className="w-fit mb-3"
                  >
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </Badge>

                  <h3 className="font-heading text-lg font-semibold text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-white/50 mb-4 flex-1">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {course.duration}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {course.students}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-brand-accent" /> {course.rating}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-secondary flex items-center justify-center text-[10px] font-bold text-white">
                        {course.instructor.avatar}
                      </div>
                      <span className="text-xs text-white/50">{course.instructor.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-accent" />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <GraduationCap className="w-12 h-12 mx-auto text-white/20 mb-4" />
            <p className="text-white/50">No courses found matching your criteria.</p>
          </div>
        )}
      </Section>

      <Footer />
    </main>
  );
}
