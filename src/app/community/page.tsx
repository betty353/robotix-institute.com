'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, GlassCard, Badge, Button, Input } from '@/components/ui';
import {
  MessageSquare, Users, Search, ThumbsUp, MessageCircle, Eye, Pin,
  TrendingUp, Clock, Star, ChevronRight, Plus, Hash, Flame, Award
} from 'lucide-react';

const forumCategories = [
  { id: '1', name: 'General Discussion', icon: '💬', description: 'Introduce yourself and chat about anything robotics-related', posts: 342, color: 'from-blue-500 to-indigo-500' },
  { id: '2', name: 'Arduino & Microcontrollers', icon: '🔲', description: 'Help and discussion about Arduino, ESP32, Raspberry Pi, and more', posts: 567, color: 'from-green-500 to-emerald-500' },
  { id: '3', name: 'IoT & Smart Devices', icon: '📡', description: 'Internet of Things projects, MQTT, sensors, and connectivity', posts: 234, color: 'from-purple-500 to-violet-500' },
  { id: '4', name: 'AI & Computer Vision', icon: '🧠', description: 'Machine learning, TensorFlow, OpenCV, and AI-powered robots', posts: 178, color: 'from-pink-500 to-rose-500' },
  { id: '5', name: 'Project Showcase', icon: '🏆', description: 'Share your finished projects and get feedback from the community', posts: 145, color: 'from-yellow-500 to-orange-500' },
  { id: '6', name: 'Troubleshooting', icon: '🔧', description: 'Get help debugging your circuits, code, and robot designs', posts: 890, color: 'from-red-500 to-pink-500' },
];

const trendingPosts = [
  {
    id: '1', title: 'How I built a solar-powered farm monitoring system for K500',
    author: 'Mwila C.', avatar: 'MC', category: 'IoT & Smart Devices',
    likes: 89, replies: 34, views: 1200, isPinned: true,
    timeAgo: '2 hours ago', tags: ['ESP32', 'Solar', 'Agriculture'],
  },
  {
    id: '2', title: 'Best resources for learning ROS2 on Raspberry Pi?',
    author: 'Thandiwe M.', avatar: 'TM', category: 'General Discussion',
    likes: 45, replies: 22, views: 890, isPinned: false,
    timeAgo: '5 hours ago', tags: ['ROS2', 'Raspberry Pi', 'Learning'],
  },
  {
    id: '3', title: 'PID Controller tuning guide for line follower robots',
    author: 'Joseph K.', avatar: 'JK', category: 'Arduino & Microcontrollers',
    likes: 67, replies: 18, views: 1450, isPinned: true,
    timeAgo: '1 day ago', tags: ['PID', 'Arduino', 'Tutorial'],
  },
  {
    id: '4', title: 'ESP32-CAM object detection with TensorFlow Lite — complete guide',
    author: 'Grace N.', avatar: 'GN', category: 'AI & Computer Vision',
    likes: 112, replies: 41, views: 2300, isPinned: false,
    timeAgo: '2 days ago', tags: ['TensorFlow', 'ESP32-CAM', 'AI'],
  },
  {
    id: '5', title: 'Troubleshooting L298N motor driver — motors not spinning',
    author: 'David M.', avatar: 'DM', category: 'Troubleshooting',
    likes: 23, replies: 15, views: 560, isPinned: false,
    timeAgo: '3 days ago', tags: ['L298N', 'Motors', 'Help'],
  },
];

const topContributors = [
  { name: 'Mwila C.', avatar: 'MC', points: 2450, posts: 89, badge: 'Expert' },
  { name: 'Grace N.', avatar: 'GN', points: 2100, posts: 76, badge: 'Expert' },
  { name: 'Joseph K.', avatar: 'JK', points: 1800, posts: 65, badge: 'Advanced' },
  { name: 'Thandiwe M.', avatar: 'TM', points: 1450, posts: 52, badge: 'Advanced' },
  { name: 'David M.', avatar: 'DM', points: 1200, posts: 44, badge: 'Intermediate' },
];

const mentors = [
  { name: 'Dr. Bwalya Mutale', specialty: 'Robotics & Automation', avatar: 'BM', available: true },
  { name: 'Eng. Sarah Lungu', specialty: 'IoT & Embedded Systems', avatar: 'SL', available: true },
  { name: 'Prof. James Mwanza', specialty: 'AI & Computer Vision', avatar: 'JM', available: false },
];

const tabs = ['Forums', 'Trending', 'Mentors'];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('Forums');
  const [search, setSearch] = useState('');

  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="circuit-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="accent" className="mb-4">
              <Users className="w-3 h-3 mr-1" /> Community Hub
            </Badge>
            <h1 className="section-title mb-4">
              Robotics <span className="gradient-text">Community</span>
            </h1>
            <p className="section-subtitle mx-auto">
              Connect, collaborate, and learn with Zambia&apos;s growing robotics community.
            </p>
            {/* Community stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              {[
                { label: 'Members', value: '2,500+' },
                { label: 'Forum Posts', value: '3,400+' },
                { label: 'Projects Shared', value: '450+' },
                { label: 'Mentors', value: '15+' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs + Content */}
      <Section className="py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 border-b border-white/10 pb-2">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                  activeTab === tab ? 'text-brand-accent border-b-2 border-brand-accent -mb-[2px]' : 'text-white/40 hover:text-white/60'
                }`}
              >{tab}</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="max-w-xs">
              <Input placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} />
            </div>
            <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Post</Button>
          </div>
        </div>

        {activeTab === 'Forums' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forumCategories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <GlassCard hover className="p-6 cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shrink-0`}>
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-white group-hover:text-brand-accent transition-colors">{cat.name}</h3>
                      <p className="text-xs text-white/40 mt-1 line-clamp-2">{cat.description}</p>
                      <p className="text-xs text-white/30 mt-2 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> {cat.posts} posts
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-brand-accent transition-colors shrink-0 mt-1" />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'Trending' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Posts */}
            <div className="lg:col-span-2 space-y-4">
              {trendingPosts.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <GlassCard hover className="p-5 cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {post.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {post.isPinned && <Pin className="w-3 h-3 text-brand-accent" />}
                          <h4 className="font-heading font-semibold text-white text-sm hover:text-brand-accent transition-colors line-clamp-1">{post.title}</h4>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.tags.map((t) => (
                            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 flex items-center gap-0.5">
                              <Hash className="w-2 h-2" />{t}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/30">
                          <span>{post.author}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.timeAgo}</span>
                          <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{post.likes}</span>
                          <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.replies}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Sidebar — Top Contributors */}
            <div className="space-y-6">
              <GlassCard className="p-6">
                <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-brand-accent" /> Top Contributors
                </h3>
                <div className="space-y-3">
                  {topContributors.map((user, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <span className="text-xs font-bold text-white/30 w-5">{i + 1}</span>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-[10px] font-bold text-white">
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-white/30">{user.points} pts · {user.posts} posts</p>
                      </div>
                      <Badge variant={user.badge === 'Expert' ? 'accent' : 'primary'} className="text-[10px]">{user.badge}</Badge>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {activeTab === 'Mentors' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-xl font-bold text-white mx-auto mb-4">
                    {mentor.avatar}
                  </div>
                  <h3 className="font-heading font-semibold text-white">{mentor.name}</h3>
                  <p className="text-xs text-white/40 mb-3">{mentor.specialty}</p>
                  <Badge variant={mentor.available ? 'primary' : 'danger'} className="mb-4">
                    {mentor.available ? 'Available' : 'Busy'}
                  </Badge>
                  <div>
                    <Button size="sm" variant={mentor.available ? 'primary' : 'ghost'} disabled={!mentor.available} className="w-full">
                      {mentor.available ? 'Book Session' : 'Not Available'}
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}

            {/* Become a mentor CTA */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <GlassCard className="p-6 text-center border-2 border-dashed border-white/10 flex flex-col items-center justify-center h-full">
                <Award className="w-10 h-10 text-brand-accent mb-4" />
                <h3 className="font-heading font-semibold text-white mb-2">Become a Mentor</h3>
                <p className="text-xs text-white/40 mb-4">Share your expertise and guide the next generation of robotics engineers in Zambia.</p>
                <Button variant="secondary" size="sm">Apply Now</Button>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </Section>

      <Footer />
    </main>
  );
}
