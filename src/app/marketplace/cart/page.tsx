'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, GlassCard, Badge, Button, Input, Textarea, EmptyState } from '@/components/ui';
import { useCartStore } from '@/store';
import { useApi, useAuth } from '@/hooks/useApi';
import { ShoppingCart, X, ChevronRight, Truck, Shield, Package } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { post } = useApi();
  const { items, updateQuantity, removeItem, clearCart, total } = useCartStore();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const subtotal = total();
  const shipping = subtotal > 500 ? 0 : 50;
  const grandTotal = subtotal + shipping;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent('/marketplace/cart')}`);
      return;
    }
    if (!address || !phone) {
      toast.error('Please enter your delivery address and phone number');
      return;
    }
    setSubmitting(true);
    try {
      const res = await post('/orders', {
        items: items.map((it) => ({
          productId: it.product.id,
          quantity: it.quantity,
        })),
        address,
        phone,
      });
      if (res.success) {
        toast.success('Order placed! We will contact you shortly.');
        clearCart();
        router.push('/dashboard');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />

      <section className="pt-28 pb-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
            <Link href="/marketplace" className="hover:text-white">Marketplace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/60">Cart</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-brand-accent" />
            Your Cart {items.length > 0 && <Badge variant="accent">{items.length}</Badge>}
          </h1>
        </div>
      </section>

      {items.length === 0 ? (
        <Section>
          <EmptyState
            icon={<ShoppingCart className="w-8 h-8" />}
            title="Your cart is empty"
            description="Browse the marketplace and add some Arduino kits, sensors, or robot parts."
            action={<Link href="/marketplace"><Button>Continue Shopping</Button></Link>}
          />
        </Section>
      ) : (
        <Section className="py-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{item.product.name}</p>
                    <p className="text-xs text-white/40 line-clamp-1">{item.product.description}</p>
                    <p className="text-sm text-brand-accent font-medium mt-1">
                      K{(item.product.salePrice ?? item.product.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      aria-label="Decrease quantity"
                      className="w-8 h-8 rounded-lg bg-white/5 text-white/70 hover:bg-white/10"
                    >−</button>
                    <span className="w-7 text-center text-sm text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="w-8 h-8 rounded-lg bg-white/5 text-white/70 hover:bg-white/10"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    aria-label="Remove from cart"
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </GlassCard>
              </motion.div>
            ))}

            <div className="pt-4 grid sm:grid-cols-3 gap-3 text-xs">
              {[
                { icon: Package, label: 'Genuine Parts' },
                { icon: Truck, label: 'Nationwide Delivery' },
                { icon: Shield, label: 'Secure Checkout' },
              ].map((b) => (
                <GlassCard key={b.label} className="p-3 text-center">
                  <b.icon className="w-4 h-4 text-brand-accent mx-auto mb-1" />
                  <span className="text-white/60">{b.label}</span>
                </GlassCard>
              ))}
            </div>
          </div>

          <div>
            <GlassCard className="p-6 sticky top-20">
              <h3 className="font-heading text-lg font-bold text-white mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>K{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `K${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-white pt-2 border-t border-white/10 font-bold">
                  <span>Total</span>
                  <span className="text-brand-accent">K{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <Input
                  label="Phone (for delivery)"
                  placeholder="+260 9X XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Textarea
                  label="Delivery Address"
                  placeholder="Plot, street, area, town"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="min-h-[80px]"
                />
                <Input
                  label="Notes (optional)"
                  placeholder="Special instructions"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleCheckout}
                loading={submitting}
              >
                {isAuthenticated ? 'Place Order' : 'Sign in to Checkout'}
              </Button>
              <p className="text-[10px] text-white/30 text-center mt-3">
                Pay-on-delivery + MTN MoMo / Airtel Money supported.
              </p>
            </GlassCard>
          </div>
        </Section>
      )}

      <Footer />
    </main>
  );
}
