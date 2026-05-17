'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store';
import {
  Menu, X, ChevronDown,
  GraduationCap, Code, Cpu, Gamepad2, Trophy,
  Users, Bot, Briefcase, Wifi, BookOpen, Bell, Search,
  Map, Newspaper, BarChart3
} from 'lucide-react';

const navItems = [
  {
    label: 'Learn',
    children: [
      { label: 'Courses', href: '/courses', icon: GraduationCap },
      { label: 'Learning Paths', href: '/paths', icon: Map },
      { label: 'Project Library', href: '/projects', icon: BookOpen },
      { label: 'AI Tutor', href: '/ai-tutor', icon: Bot },
    ],
  },
  {
    label: 'Build',
    children: [
      { label: 'Game Lab (Phaser)', href: '/game-lab', icon: Gamepad2 },
      { label: 'Game Gallery', href: '/game-gallery', icon: Gamepad2 },
      { label: 'Coder Station', href: '/playground', icon: Code },
      { label: 'Simulation Lab', href: '/simulation', icon: Cpu },
      { label: 'IoT Control', href: '/iot', icon: Wifi },
    ],
  },
  {
    label: 'Compete',
    children: [
      { label: 'Game Arena', href: '/arena', icon: Gamepad2 },
      { label: 'Competitions', href: '/competitions', icon: Trophy },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Community', href: '/community' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const { isAuthenticated, user, token } = useAuthStore();
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch notifications.
  // Poll every 60s while the tab is visible. Pause polling when hidden to
  // save battery and avoid hammering the API. When tab returns to focus we
  // do an immediate fetch.
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    const fetchNotifs = async () => {
      if (typeof document !== 'undefined' && document.hidden) return;
      try {
        const res = await fetch('/api/notifications?unread=true&limit=10', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled && res.ok) {
          const data = await res.json();
          setNotifications(data.data?.notifications || []);
          setUnreadCount(data.data?.unreadCount || 0);
        }
      } catch {
        /* network errors are fine; we'll retry on the next tick */
      }
    };

    const start = () => {
      if (interval) return;
      fetchNotifs();
      interval = setInterval(fetchNotifs, 60_000);
    };
    const stop = () => {
      if (interval) clearInterval(interval);
      interval = null;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isAuthenticated, token]);

  // Global search
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.data?.results || []);
      }
    } catch {} finally {
      setSearchLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const markAllRead = async () => {
    if (!token) return;
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const typeIcons: Record<string, string> = {
    course: '📚', blog: '📰', project: '🔧', forum: '💬', path: '🗺️',
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-brand-dark/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/logo-white.png"
              alt="Robotix Institute"
              width={160}
              height={44}
              className="h-9 w-auto object-contain group-hover:brightness-110 transition-all"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-white/10 bg-brand-dark-surface/95 backdrop-blur-xl shadow-glass overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            {child.icon && <child.icon className="w-4 h-4 text-brand-accent" />}
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Global Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => { setSearchOpen(!searchOpen); setTimeout(() => searchInputRef.current?.focus(), 100); }}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                title="Search (Ctrl+K)"
              >
                <Search className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-96 rounded-xl border border-white/10 bg-brand-dark-surface/95 backdrop-blur-xl shadow-glass overflow-hidden"
                  >
                    <div className="p-3 border-b border-white/10">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search courses, projects, blog..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-12 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-brand-accent/50"
                        />
                        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-white/30 border border-white/10 rounded">ESC</kbd>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {searchLoading && (
                        <div className="p-4 text-center text-white/40 text-sm">Searching...</div>
                      )}
                      {!searchLoading && searchResults.length === 0 && searchQuery.length >= 2 && (
                        <div className="p-4 text-center text-white/40 text-sm">No results found</div>
                      )}
                      {!searchLoading && searchQuery.length < 2 && (
                        <div className="p-4 text-center text-white/40 text-sm">Type at least 2 characters...</div>
                      )}
                      {searchResults.map((result: any) => (
                        <Link
                          key={`${result.type}-${result.id}`}
                          href={result.url}
                          onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                        >
                          <span className="text-lg mt-0.5">{typeIcons[result.type] || '📄'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{result.title}</p>
                            <p className="text-xs text-white/40 truncate">{result.description}</p>
                          </div>
                          <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-white/5 text-white/30 font-medium whitespace-nowrap">
                            {result.type}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Bell */}
            {isAuthenticated && (
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-white/10 bg-brand-dark-surface/95 backdrop-blur-xl shadow-glass overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <h3 className="text-sm font-heading font-semibold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-brand-accent hover:text-brand-accent/80 transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-white/40 text-sm">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            No new notifications
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((notif: any) => (
                            <Link
                              key={notif.id}
                              href={notif.link || '#'}
                              onClick={() => setNotifOpen(false)}
                              className={`block px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${!notif.read ? 'bg-brand-accent/5' : ''}`}
                            >
                              <p className="text-sm font-medium text-white">{notif.title}</p>
                              <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{notif.message}</p>
                              <p className="text-[10px] text-white/30 mt-1">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </p>
                            </Link>
                          ))
                        )}
                      </div>
                      <Link
                        href="/notifications"
                        onClick={() => setNotifOpen(false)}
                        className="block px-4 py-2.5 text-center text-xs font-medium text-brand-accent hover:bg-white/5 border-t border-white/10 transition-colors"
                      >
                        View all notifications
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/analytics"
                  className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  title="My Analytics"
                >
                  <BarChart3 className="w-5 h-5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center text-xs font-bold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  <span>{user?.firstName}</span>
                </Link>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/login" className="btn-ghost text-sm py-2">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-brand-dark/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.label} className="space-y-1">
                    <p className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {child.icon && <child.icon className="w-4 h-4 text-brand-accent" />}
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <Link href="/login" className="block w-full text-center btn-ghost text-sm py-2">
                    Sign In
                  </Link>
                  <Link href="/register" className="block w-full text-center btn-primary text-sm py-2">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
