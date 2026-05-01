'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminGameLabQueue from '@/components/admin/AdminGameLabQueue';
import { Section, GlassCard, Badge, Button, Input, ProgressBar } from '@/components/ui';
import {
  LayoutDashboard, Users, BookOpen, ShoppingCart, Trophy, Cpu,
  TrendingUp, TrendingDown, DollarSign, BarChart3, Activity,
  Settings, Bell, Search, ChevronRight, MoreVertical,
  UserPlus, GraduationCap, Package, MessageSquare, Eye, AlertTriangle
} from 'lucide-react';

const stats = [
  { label: 'Total Students', value: '2,547', change: '+12%', trend: 'up', icon: Users, color: 'from-blue-500 to-indigo-500' },
  { label: 'Active Courses', value: '45', change: '+3', trend: 'up', icon: BookOpen, color: 'from-green-500 to-emerald-500' },
  { label: 'Revenue (ZMW)', value: 'K 125,400', change: '+18%', trend: 'up', icon: DollarSign, color: 'from-yellow-500 to-orange-500' },
  { label: 'Competitions', value: '8', change: '+2', trend: 'up', icon: Trophy, color: 'from-purple-500 to-violet-500' },
];

const recentStudents = [
  { name: 'Mwila Chanda', email: 'mwila@example.com', enrolled: 'Arduino Robotics', date: '2 hours ago', status: 'active' },
  { name: 'Thandiwe Mulenga', email: 'thandiwe@example.com', enrolled: 'IoT with ESP32', date: '5 hours ago', status: 'active' },
  { name: 'Joseph Kabwe', email: 'joseph@example.com', enrolled: 'Python for Robotics', date: '1 day ago', status: 'active' },
  { name: 'Grace Njovu', email: 'grace@example.com', enrolled: 'AI & Computer Vision', date: '1 day ago', status: 'pending' },
  { name: 'David Musonda', email: 'david@example.com', enrolled: 'Drone Engineering', date: '2 days ago', status: 'active' },
];

const recentOrders = [
  { id: '#ORD-2401', customer: 'Mwila C.', items: 'Arduino Starter Kit', total: 'K450', status: 'delivered', date: 'Today' },
  { id: '#ORD-2400', customer: 'Grace N.', items: 'ESP32 Dev Board ×2', total: 'K170', status: 'shipped', date: 'Yesterday' },
  { id: '#ORD-2399', customer: 'Thandiwe M.', items: 'Sensor Mega Pack', total: 'K180', status: 'processing', date: 'Yesterday' },
  { id: '#ORD-2398', customer: 'Joseph K.', items: 'Robotic Arm Kit', total: 'K380', status: 'delivered', date: '2 days ago' },
];

const coursePerformance = [
  { name: 'Arduino Robotics Fundamentals', students: 340, completion: 78, revenue: 'K51,000', rating: 4.8 },
  { name: 'IoT with ESP32 & MQTT', students: 245, completion: 72, revenue: 'K36,750', rating: 4.7 },
  { name: 'Python for Robotics', students: 312, completion: 65, revenue: 'K28,080', rating: 4.6 },
  { name: 'AI & Computer Vision', students: 128, completion: 45, revenue: 'K25,600', rating: 4.9 },
];

const alerts = [
  { type: 'warning', text: 'ESP32 Dev Board stock running low (5 remaining)', time: '1h ago' },
  { type: 'info', text: 'New competition submission from Team Innovate', time: '3h ago' },
  { type: 'success', text: '12 new students enrolled today', time: '5h ago' },
];

const adminTabs = ['Overview', 'Users', 'Courses', 'Orders', 'Game Lab', 'Settings'];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <LayoutDashboard className="w-5 h-5 text-brand-accent" />
                <h1 className="font-heading text-2xl font-bold text-white">Admin Dashboard</h1>
              </div>
              <p className="text-sm text-white/40">Manage your Robotics Institute platform</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="max-w-xs">
                <Input placeholder="Search..." icon={<Search className="w-4 h-4" />} />
              </div>
              <button className="relative p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-brand-dark" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {adminTabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                  activeTab === tab
                    ? 'bg-white/5 text-brand-accent border-b-2 border-brand-accent'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >{tab}</button>
            ))}
          </div>
        </div>
      </section>

      {activeTab === 'Overview' && (
        <>
          {/* Stats Cards */}
          <Section className="py-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <GlassCard className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stat.change}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* Main content grid */}
          <Section className="py-4">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Students */}
              <div className="lg:col-span-2">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-semibold text-white flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-brand-accent" /> Recent Enrollments
                    </h3>
                    <Button variant="ghost" size="sm">View All <ChevronRight className="w-3 h-3 ml-1" /></Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left text-xs font-medium text-white/30 pb-3">Student</th>
                          <th className="text-left text-xs font-medium text-white/30 pb-3">Course</th>
                          <th className="text-left text-xs font-medium text-white/30 pb-3">Status</th>
                          <th className="text-left text-xs font-medium text-white/30 pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {recentStudents.map((s, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="py-3">
                              <div>
                                <p className="text-sm font-medium text-white">{s.name}</p>
                                <p className="text-xs text-white/30">{s.email}</p>
                              </div>
                            </td>
                            <td className="py-3 text-sm text-white/60">{s.enrolled}</td>
                            <td className="py-3">
                              <Badge variant={s.status === 'active' ? 'primary' : 'accent'}>{s.status}</Badge>
                            </td>
                            <td className="py-3 text-xs text-white/30">{s.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </div>

              {/* Alerts Sidebar */}
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-brand-accent" /> Alerts
                  </h3>
                  <div className="space-y-3">
                    {alerts.map((alert, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                        <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                          alert.type === 'warning' ? 'text-yellow-400' : alert.type === 'success' ? 'text-green-400' : 'text-blue-400'
                        }`} />
                        <div>
                          <p className="text-xs text-white/60">{alert.text}</p>
                          <p className="text-[10px] text-white/20 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Quick Stats */}
                <GlassCard className="p-6">
                  <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-accent" /> Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">Server Load</span>
                        <span className="text-white/30">34%</span>
                      </div>
                      <ProgressBar value={34} />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">Storage Used</span>
                        <span className="text-white/30">67%</span>
                      </div>
                      <ProgressBar value={67} />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">Active Users (now)</span>
                        <span className="text-white/30">142</span>
                      </div>
                      <ProgressBar value={28} />
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </Section>

          {/* Course Performance + Recent Orders */}
          <Section className="py-6 pb-12">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Course Performance */}
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-semibold text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-brand-accent" /> Course Performance
                  </h3>
                </div>
                <div className="space-y-4">
                  {coursePerformance.map((course, i) => (
                    <div key={i} className="p-3 rounded-lg bg-white/5">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-white">{course.name}</h4>
                        <div className="flex items-center gap-1 text-brand-accent text-xs">
                          ★ {course.rating}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/30 mb-2">
                        <span>{course.students} students</span>
                        <span>{course.revenue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ProgressBar value={course.completion} />
                        <span className="text-xs text-white/30 shrink-0">{course.completion}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Recent Orders */}
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-semibold text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-brand-accent" /> Recent Orders
                  </h3>
                  <Button variant="ghost" size="sm">View All <ChevronRight className="w-3 h-3 ml-1" /></Button>
                </div>
                <div className="space-y-3">
                  {recentOrders.map((order, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">{order.id}</p>
                          <Badge variant={
                            order.status === 'delivered' ? 'primary' :
                            order.status === 'shipped' ? 'accent' : 'danger'
                          } className="text-[10px]">{order.status}</Badge>
                        </div>
                        <p className="text-xs text-white/40 mt-0.5">{order.customer} — {order.items}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-white">{order.total}</p>
                        <p className="text-[10px] text-white/30">{order.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </Section>
        </>
      )}

      {activeTab === 'Users' && (
        <Section className="py-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-lg font-semibold text-white">User Management</h3>
              <div className="flex items-center gap-3">
                <Input placeholder="Search users..." icon={<Search className="w-4 h-4" />} />
                <Button size="sm"><UserPlus className="w-4 h-4 mr-1" /> Add User</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs font-medium text-white/30 pb-3">Name</th>
                    <th className="text-left text-xs font-medium text-white/30 pb-3">Email</th>
                    <th className="text-left text-xs font-medium text-white/30 pb-3">Role</th>
                    <th className="text-left text-xs font-medium text-white/30 pb-3">Courses</th>
                    <th className="text-left text-xs font-medium text-white/30 pb-3">Status</th>
                    <th className="text-left text-xs font-medium text-white/30 pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { name: 'Mwila Chanda', email: 'mwila@example.com', role: 'Student', courses: 4, status: 'active' },
                    { name: 'Dr. Bwalya Mutale', email: 'bwalya@example.com', role: 'Instructor', courses: 3, status: 'active' },
                    { name: 'Thandiwe Mulenga', email: 'thandiwe@example.com', role: 'Student', courses: 2, status: 'active' },
                    { name: 'Admin User', email: 'admin@robotix.zm', role: 'Admin', courses: 0, status: 'active' },
                    { name: 'Grace Njovu', email: 'grace@example.com', role: 'Student', courses: 1, status: 'pending' },
                  ].map((u, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-[10px] font-bold text-white">
                            {u.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-medium text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-white/40">{u.email}</td>
                      <td className="py-3">
                        <Badge variant={u.role === 'Admin' ? 'accent' : u.role === 'Instructor' ? 'primary' : 'primary'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm text-white/50">{u.courses}</td>
                      <td className="py-3">
                        <Badge variant={u.status === 'active' ? 'primary' : 'accent'}>{u.status}</Badge>
                      </td>
                      <td className="py-3">
                        <button className="text-white/30 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </Section>
      )}

      {activeTab === 'Courses' && (
        <Section className="py-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-lg font-semibold text-white">Course Management</h3>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Course</Button>
            </div>
            <div className="space-y-4">
              {coursePerformance.map((course, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-white/5">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white">{course.name}</h4>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-white/30">
                      <span>{course.students} students</span>
                      <span>★ {course.rating}</span>
                      <span>{course.revenue}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex-1 sm:w-32">
                      <ProgressBar value={course.completion} />
                    </div>
                    <span className="text-xs text-white/30">{course.completion}%</span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </Section>
      )}

      {activeTab === 'Orders' && (
        <Section className="py-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-lg font-semibold text-white">Order Management</h3>
              <Input placeholder="Search orders..." icon={<Search className="w-4 h-4" />} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs font-medium text-white/30 pb-3">Order ID</th>
                    <th className="text-left text-xs font-medium text-white/30 pb-3">Customer</th>
                    <th className="text-left text-xs font-medium text-white/30 pb-3">Items</th>
                    <th className="text-left text-xs font-medium text-white/30 pb-3">Total</th>
                    <th className="text-left text-xs font-medium text-white/30 pb-3">Status</th>
                    <th className="text-left text-xs font-medium text-white/30 pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((o, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 text-sm font-medium text-white">{o.id}</td>
                      <td className="py-3 text-sm text-white/50">{o.customer}</td>
                      <td className="py-3 text-sm text-white/50">{o.items}</td>
                      <td className="py-3 text-sm font-bold text-white">{o.total}</td>
                      <td className="py-3">
                        <Badge variant={o.status === 'delivered' ? 'primary' : o.status === 'shipped' ? 'accent' : 'danger'}>
                          {o.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-xs text-white/30">{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </Section>
      )}

      {activeTab === 'Settings' && (
        <Section className="py-8">
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="font-heading font-semibold text-white mb-4">Platform Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Institute Name</label>
                  <Input defaultValue="Robotix Institute Zambia" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Contact Email</label>
                  <Input defaultValue="info@robotix.zm" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Support Phone</label>
                  <Input defaultValue="+260 97 1234567" />
                </div>
                <Button>Save Changes</Button>
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="font-heading font-semibold text-white mb-4">Notifications</h3>
              <div className="space-y-3">
                {[
                  { label: 'New enrollment alerts', enabled: true },
                  { label: 'Order notifications', enabled: true },
                  { label: 'Low stock warnings', enabled: true },
                  { label: 'Competition submissions', enabled: false },
                  { label: 'Forum reports', enabled: true },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-white/60">{n.label}</span>
                    <button className={`w-10 h-6 rounded-full transition-colors ${n.enabled ? 'bg-brand-accent' : 'bg-white/10'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${n.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </Section>
      )}

      {activeTab === 'Game Lab' && <AdminGameLabQueue />}

      <Footer />
    </main>
  );
}

function Plus(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  );
}
