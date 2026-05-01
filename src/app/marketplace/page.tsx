'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, SectionHeader, GlassCard, Badge, Button, Input } from '@/components/ui';
import { useCartStore } from '@/store';
import {
  ShoppingCart, Search, Star, SlidersHorizontal, Check, Plus,
  Package, Truck, Shield, HeadphonesIcon, ChevronRight, X
} from 'lucide-react';

interface Product {
  id: string; slug: string; name: string; description: string;
  price: number; originalPrice?: number; category: string;
  rating: number; reviews: number; image: string; inStock: boolean;
  tags: string[]; featured?: boolean;
}

const products: Product[] = [
  {
    id: '1', slug: 'arduino-starter-kit', name: 'Arduino Robotics Starter Kit',
    description: 'Complete beginner kit with Arduino Uno R3, sensors, motors, breadboard, jumper wires, and a 150-page project guide.',
    price: 450, originalPrice: 599, category: 'Kits',
    rating: 4.8, reviews: 124, image: '📦', inStock: true,
    tags: ['Beginner', 'Arduino', 'Best Seller'], featured: true,
  },
  {
    id: '2', slug: 'esp32-dev-board', name: 'ESP32 Development Board',
    description: 'WiFi + Bluetooth enabled microcontroller with 30 GPIO pins. Perfect for IoT and connected robotics projects.',
    price: 85, category: 'Boards',
    rating: 4.7, reviews: 89, image: '🔲', inStock: true,
    tags: ['IoT', 'WiFi', 'Bluetooth'],
  },
  {
    id: '3', slug: 'raspberry-pi-4-kit', name: 'Raspberry Pi 4 Complete Kit',
    description: '4GB RAM Raspberry Pi 4 with case, power supply, SD card, fan, and heatsinks. Run AI and computer vision.',
    price: 950, originalPrice: 1100, category: 'Boards',
    rating: 4.9, reviews: 76, image: '🖥️', inStock: true,
    tags: ['AI', 'Linux', 'Computer Vision'], featured: true,
  },
  {
    id: '4', slug: 'sensor-pack-20', name: 'Sensor Mega Pack (20 Sensors)',
    description: 'Collection of 20 different sensors including ultrasonic, IR, temperature, humidity, gas, light, sound, and more.',
    price: 180, originalPrice: 250, category: 'Sensors',
    rating: 4.6, reviews: 156, image: '📡', inStock: true,
    tags: ['Sensors', 'Value Pack'],
  },
  {
    id: '5', slug: 'robotic-arm-kit', name: '4-DOF Robotic Arm Kit',
    description: 'Acrylic robotic arm kit with 4 servo motors, mounting hardware, and Arduino compatible controller board.',
    price: 380, category: 'Kits',
    rating: 4.5, reviews: 67, image: '🦾', inStock: true,
    tags: ['Intermediate', 'Servos'],
  },
  {
    id: '6', slug: 'drone-build-kit', name: 'DIY Drone Frame Kit',
    description: 'F450 quadcopter frame with landing gear, propeller guards, and mounting plates for flight controller and camera.',
    price: 220, category: 'Drones',
    rating: 4.4, reviews: 43, image: '🚁', inStock: false,
    tags: ['Drones', 'Frame'],
  },
  {
    id: '7', slug: 'l298n-motor-driver', name: 'L298N Motor Driver Module',
    description: 'Dual H-Bridge motor driver for controlling two DC motors or one stepper motor. Up to 2A per channel.',
    price: 35, category: 'Components',
    rating: 4.7, reviews: 213, image: '⚡', inStock: true,
    tags: ['Motor Driver', 'DC Motors'],
  },
  {
    id: '8', slug: 'smart-car-chassis', name: 'Smart Car Chassis Kit',
    description: '2WD chassis with acrylic plates, DC motors, wheels, caster wheel, battery box, and mounting hardware.',
    price: 95, category: 'Kits',
    rating: 4.6, reviews: 178, image: '🏎️', inStock: true,
    tags: ['Beginner', 'Chassis'],
  },
];

const productCategories = ['All', 'Kits', 'Boards', 'Sensors', 'Components', 'Drones'];

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [cartOpen, setCartOpen] = useState(false);
  const { items, addItem, removeItem, updateQuantity, clearCart, total } = useCartStore();

  const filtered = products
    .filter((p) => {
      const matchS = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchC = selectedCategory === 'All' || p.category === selectedCategory;
      return matchS && matchC;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const handleAddToCart = (product: Product) => {
    // Adapter: convert local marketplace Product (emoji image) to the
    // canonical shared Product shape expected by the cart store.
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        salePrice: product.originalPrice && product.originalPrice > product.price ? product.price : undefined,
        category: product.category,
        thumbnail: undefined,
        images: [],
        stock: product.inStock ? 100 : 0,
        featured: !!product.featured,
      },
      1
    );
  };

  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="circuit-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="accent" className="mb-4">
              <ShoppingCart className="w-3 h-3 mr-1" /> Official Store
            </Badge>
            <h1 className="section-title mb-4">
              Robotics <span className="gradient-text">Marketplace</span>
            </h1>
            <p className="section-subtitle mx-auto">
              Quality robotics kits, components, sensors, and boards shipped across Zambia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust badges */}
      <Section className="py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Package, label: 'Genuine Parts', sub: 'Quality guaranteed' },
            { icon: Truck, label: 'Nationwide Delivery', sub: 'Lusaka & beyond' },
            { icon: Shield, label: 'Secure Checkout', sub: 'Protected payments' },
            { icon: HeadphonesIcon, label: 'Expert Support', sub: 'Technical assistance' },
          ].map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-4 text-center">
                <b.icon className="w-6 h-6 text-brand-accent mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">{b.label}</p>
                <p className="text-xs text-white/40">{b.sub}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Filters */}
      <Section className="py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative max-w-sm flex-1">
              <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} />
            </div>
            <div className="flex flex-wrap gap-2">
              {productCategories.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat ? 'bg-brand-accent text-brand-dark' : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >{cat}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-accent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <button onClick={() => setCartOpen(true)} className="relative btn-primary px-3 py-2">
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-brand-dark rounded-full text-xs flex items-center justify-center font-bold">
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </Section>

      {/* Products grid */}
      <Section className="py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => {
            const inCart = items.find((it) => it.product.id === product.id);
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <GlassCard hover className="p-5 h-full flex flex-col">
                  {product.featured && (
                    <Badge variant="accent" className="absolute top-3 right-3 text-[10px]">Featured</Badge>
                  )}
                  <div className="text-5xl text-center mb-4">{product.image}</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">{t}</span>
                    ))}
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-white mb-1">{product.name}</h3>
                  <p className="text-xs text-white/40 mb-3 flex-1 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3 h-3 text-brand-accent fill-brand-accent" />
                    <span className="text-xs text-white/60">{product.rating}</span>
                    <span className="text-xs text-white/30">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-white">K{product.price}</span>
                      {product.originalPrice && (
                        <span className="ml-2 text-xs text-white/30 line-through">K{product.originalPrice}</span>
                      )}
                    </div>
                    {product.inStock ? (
                      inCart ? (
                        <Badge variant="primary"><Check className="w-3 h-3 mr-1" /> In Cart</Badge>
                      ) : (
                        <Button size="sm" onClick={() => handleAddToCart(product)}>
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      )
                    ) : (
                      <Badge variant="danger">Sold Out</Badge>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50" onClick={() => setCartOpen(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-card border-l border-white/10 z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="font-heading text-lg font-bold text-white">Shopping Cart ({items.length})</h2>
                <button onClick={() => setCartOpen(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/30">Your cart is empty</p>
                  </div>
                ) : items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{item.product.name}</p>
                      <p className="text-xs text-white/50">K{item.product.salePrice ?? item.product.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        aria-label={`Decrease quantity of ${item.product.name}`}
                        className="w-7 h-7 rounded-lg bg-white/5 text-white/50 text-sm hover:bg-white/10 flex items-center justify-center">-</button>
                      <span className="text-sm text-white w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.product.name}`}
                        className="w-7 h-7 rounded-lg bg-white/5 text-white/50 text-sm hover:bg-white/10 flex items-center justify-center">+</button>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} aria-label={`Remove ${item.product.name}`} className="text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
              {items.length > 0 && (
                <div className="p-6 border-t border-white/10 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Subtotal</span>
                    <span className="text-white font-bold">K{total().toFixed(2)}</span>
                  </div>
                  <Link href="/marketplace/cart" onClick={() => setCartOpen(false)}>
                    <Button className="w-full">Proceed to Checkout</Button>
                  </Link>
                  <button onClick={clearCart} className="text-xs text-white/30 hover:text-white/50 w-full text-center">Clear Cart</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
