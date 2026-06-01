'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, GlassCard, Badge, Button, Input } from '@/components/ui';
import {
  Search,
  Star,
  Package,
  Truck,
  Shield,
  HeadphonesIcon,
  Mail,
} from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  inStock: boolean;
  tags: string[];
  featured?: boolean;
}

const products: Product[] = [
  {
    id: '1',
    slug: 'arduino-starter-kit',
    name: 'Arduino Robotics Starter Kit',
    description:
      'Complete beginner kit with Arduino Uno R3, sensors, motors, breadboard, jumper wires, and a 150-page project guide.',
    price: 450,
    originalPrice: 599,
    category: 'Kits',
    rating: 4.8,
    reviews: 124,
    image: 'Kit',
    inStock: true,
    tags: ['Beginner', 'Arduino', 'Best Seller'],
    featured: true,
  },
  {
    id: '2',
    slug: 'esp32-dev-board',
    name: 'ESP32 Development Board',
    description:
      'WiFi + Bluetooth enabled microcontroller with 30 GPIO pins. Perfect for IoT and connected robotics projects.',
    price: 85,
    category: 'Boards',
    rating: 4.7,
    reviews: 89,
    image: 'Board',
    inStock: true,
    tags: ['IoT', 'WiFi', 'Bluetooth'],
  },
  {
    id: '3',
    slug: 'raspberry-pi-4-kit',
    name: 'Raspberry Pi 4 Complete Kit',
    description:
      '4GB RAM Raspberry Pi 4 with case, power supply, SD card, fan, and heatsinks. Run AI and computer vision.',
    price: 950,
    originalPrice: 1100,
    category: 'Boards',
    rating: 4.9,
    reviews: 76,
    image: 'Pi',
    inStock: true,
    tags: ['AI', 'Linux', 'Computer Vision'],
    featured: true,
  },
  {
    id: '4',
    slug: 'sensor-pack-20',
    name: 'Sensor Mega Pack (20 Sensors)',
    description:
      'Collection of 20 different sensors including ultrasonic, IR, temperature, humidity, gas, light, sound, and more.',
    price: 180,
    originalPrice: 250,
    category: 'Sensors',
    rating: 4.6,
    reviews: 156,
    image: 'Sensors',
    inStock: true,
    tags: ['Sensors', 'Value Pack'],
  },
  {
    id: '5',
    slug: 'robotic-arm-kit',
    name: '4-DOF Robotic Arm Kit',
    description:
      'Acrylic robotic arm kit with 4 servo motors, mounting hardware, and Arduino compatible controller board.',
    price: 380,
    category: 'Kits',
    rating: 4.5,
    reviews: 67,
    image: 'Arm',
    inStock: true,
    tags: ['Intermediate', 'Servos'],
  },
  {
    id: '6',
    slug: 'drone-build-kit',
    name: 'DIY Drone Frame Kit',
    description:
      'F450 quadcopter frame with landing gear, propeller guards, and mounting plates for flight controller and camera.',
    price: 220,
    category: 'Drones',
    rating: 4.4,
    reviews: 43,
    image: 'Drone',
    inStock: false,
    tags: ['Drones', 'Frame'],
  },
  {
    id: '7',
    slug: 'l298n-motor-driver',
    name: 'L298N Motor Driver Module',
    description:
      'Dual H-Bridge motor driver for controlling two DC motors or one stepper motor. Up to 2A per channel.',
    price: 35,
    category: 'Components',
    rating: 4.7,
    reviews: 213,
    image: 'Driver',
    inStock: true,
    tags: ['Motor Driver', 'DC Motors'],
  },
  {
    id: '8',
    slug: 'smart-car-chassis',
    name: 'Smart Car Chassis Kit',
    description:
      '2WD chassis with acrylic plates, DC motors, wheels, caster wheel, battery box, and mounting hardware.',
    price: 95,
    category: 'Kits',
    rating: 4.6,
    reviews: 178,
    image: 'Chassis',
    inStock: true,
    tags: ['Beginner', 'Chassis'],
  },
];

const productCategories = ['All', 'Kits', 'Boards', 'Sensors', 'Components', 'Drones'];

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const filtered = products
    .filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  return (
    <main className="min-h-screen bg-brand-dark">
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="circuit-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="accent" className="mb-4">
              <Package className="mr-1 h-3 w-3" />
              Hardware Catalog
            </Badge>
            <h1 className="section-title mb-4">
              Robotics <span className="gradient-text">Marketplace</span>
            </h1>
            <p className="section-subtitle mx-auto">
              Browse Robotix hardware, compare kit options, and contact the team directly for availability,
              guidance, and purchase support.
            </p>
          </motion.div>
        </div>
      </section>

      <Section className="py-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Package, label: 'Genuine Parts', sub: 'Quality guaranteed' },
            { icon: Truck, label: 'Nationwide Delivery', sub: 'Lusaka and beyond' },
            { icon: Shield, label: 'Trusted Guidance', sub: 'Talk to Robotix first' },
            { icon: HeadphonesIcon, label: 'Expert Support', sub: 'Technical assistance' },
          ].map((item, index) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <GlassCard className="p-4 text-center">
                <item.icon className="mx-auto mb-2 h-6 w-6 text-brand-accent" />
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-white/40">{item.sub}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="py-4">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative max-w-sm flex-1">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {productCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-brand-accent text-brand-dark'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <Link href="/contact">
              <Button icon={<Mail className="h-4 w-4" />}>Ask Robotix</Button>
            </Link>
          </div>
        </div>
      </Section>

      <Section className="py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <GlassCard hover className="flex h-full flex-col p-5">
                {product.featured ? (
                  <Badge variant="accent" className="absolute top-3 right-3 text-[10px]">
                    Featured
                  </Badge>
                ) : null}
                <div className="mb-4 text-center text-3xl font-bold text-brand-accent">{product.image}</div>
                <div className="mb-2 flex flex-wrap gap-1">
                  {product.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="mb-1 font-heading text-sm font-semibold text-white">{product.name}</h3>
                <p className="mb-3 flex-1 line-clamp-2 text-xs text-white/40">{product.description}</p>
                <div className="mb-3 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-brand-accent text-brand-accent" />
                  <span className="text-xs text-white/60">{product.rating}</span>
                  <span className="text-xs text-white/30">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-lg font-bold text-white">K{product.price}</span>
                    {product.originalPrice ? (
                      <span className="ml-2 text-xs text-white/30 line-through">K{product.originalPrice}</span>
                    ) : null}
                  </div>
                  {product.inStock ? (
                    <Link href="/contact">
                      <Button size="sm" icon={<Mail className="h-3 w-3" />}>
                        Ask
                      </Button>
                    </Link>
                  ) : (
                    <Badge variant="danger">Sold Out</Badge>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="py-4">
        <GlassCard className="p-6 text-center">
          <Badge variant="accent" className="mb-3">
            <Mail className="mr-1 h-3 w-3" />
            Direct Ordering
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-white">No cart, just direct support from Robotix.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/60">
            If a family, school, or club wants hardware, the best next step is to contact Robotix directly for stock
            confirmation, kit guidance, and delivery arrangements.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <Button>Contact Robotix</Button>
            </Link>
            <Link href="/partners">
              <Button variant="secondary">See school programs</Button>
            </Link>
          </div>
        </GlassCard>
      </Section>

      <Footer />
    </main>
  );
}
