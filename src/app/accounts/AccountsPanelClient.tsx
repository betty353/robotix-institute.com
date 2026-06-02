'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge, Button, GlassCard, Input, Select, Textarea } from '@/components/ui';
import { useAuthStore } from '@/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Calculator, CreditCard, LockKeyhole, RefreshCw, ReceiptText } from 'lucide-react';

type AccountOrder = {
  id: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string | null;
  amountPaid: number;
  paymentReference?: string | null;
  accountsNotes?: string | null;
  paidAt?: string | null;
  address: string;
  phone: string;
  createdAt: string;
  user?: { firstName: string; lastName: string; email: string } | null;
  items?: Array<{ product?: { name: string } | null; quantity: number; price: number }>;
};

const orderStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const paymentStatusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PARTIAL', label: 'Partial' },
  { value: 'PAID', label: 'Paid' },
  { value: 'WAIVED', label: 'Waived' },
  { value: 'REFUNDED', label: 'Refunded' },
];

export default function AccountsPanelClient() {
  const { token, isAuthenticated, user } = useAuthStore();
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canAccess = user?.role === 'ADMIN' || user?.role === 'ACCOUNTANT';

  const totals = useMemo(
    () => ({
      orders: orders.length,
      paid: orders.reduce((sum, order) => sum + order.amountPaid, 0),
      due: orders.reduce((sum, order) => sum + Math.max(0, order.total - order.amountPaid), 0),
    }),
    [orders]
  );

  const loadOrders = async () => {
    if (!token || !canAccess) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/accounts/orders?limit=50', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.message || 'Accounts data could not be loaded.');
      setOrders(Array.isArray(json?.data?.orders) ? json.data.orders : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Accounts data could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, canAccess]);

  const updateOrder = (id: string, updates: Partial<AccountOrder>) => {
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, ...updates } : order)));
  };

  const saveOrder = async (event: FormEvent<HTMLFormElement>, order: AccountOrder) => {
    event.preventDefault();
    if (!token) return;

    setSavingId(order.id);
    setError(null);
    try {
      const response = await fetch('/api/accounts/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order.id,
          status: order.status,
          paymentStatus: order.paymentStatus,
          amountPaid: Number(order.amountPaid || 0),
          paymentMethod: order.paymentMethod || '',
          paymentReference: order.paymentReference || '',
          accountsNotes: order.accountsNotes || '',
        }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.message || 'Payment details could not be saved.');
      updateOrder(order.id, json.data);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Payment details could not be saved.');
    } finally {
      setSavingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <GlassCard className="p-8 text-center">
        <LockKeyhole className="mx-auto h-10 w-10 text-brand-secondary" />
        <h1 className="mt-5 font-heading text-3xl font-bold">Accounts login required</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/62">
          Sign in with an accountant or admin account to view payment records.
        </p>
        <Link href="/login?next=/accounts" className="mt-6 inline-flex">
          <Button>Sign in</Button>
        </Link>
      </GlassCard>
    );
  }

  if (!canAccess) {
    return (
      <GlassCard className="p-8 text-center">
        <LockKeyhole className="mx-auto h-10 w-10 text-brand-secondary" />
        <h1 className="mt-5 font-heading text-3xl font-bold">Accounts access only</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/62">
          This panel is reserved for Robotix accounts personnel.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="accent" className="mb-4">
            <ReceiptText className="mr-1 h-3 w-3" />
            Accounts Panel
          </Badge>
          <h1 className="font-heading text-4xl font-bold">Payments, balances, and order follow-up.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62">
            Online orders arrive here automatically as pending payments. If a parent pays offline, accounts staff can update the record manually.
          </p>
        </div>
        <Button variant="secondary" icon={<RefreshCw className="h-4 w-4" />} loading={loading} onClick={loadOrders}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Orders tracked', value: totals.orders.toString(), icon: ReceiptText },
          { label: 'Amount paid', value: formatCurrency(totals.paid), icon: CreditCard },
          { label: 'Balance due', value: formatCurrency(totals.due), icon: Calculator },
        ].map((item) => (
          <GlassCard key={item.label} className="p-5">
            <div className="rounded-2xl bg-brand-secondary/10 p-3 text-brand-secondary w-fit">
              <item.icon className="h-5 w-5" />
            </div>
            <div className="mt-5 text-3xl font-bold">{item.value}</div>
            <div className="mt-2 text-sm text-white/65">{item.label}</div>
          </GlassCard>
        ))}
      </div>

      {error ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5">
        {loading ? (
          <GlassCard className="p-5 text-sm text-white/55">Loading accounts records...</GlassCard>
        ) : null}
        {!loading && orders.length === 0 ? (
          <GlassCard className="p-5 text-sm text-white/55">No orders have been captured yet.</GlassCard>
        ) : null}
        {orders.map((order) => (
          <GlassCard key={order.id} className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-brand-secondary">Order #{order.id.slice(-8).toUpperCase()}</div>
                <h2 className="mt-2 font-heading text-2xl font-semibold">
                  {[order.user?.firstName, order.user?.lastName].filter(Boolean).join(' ') || 'Robotix parent'}
                </h2>
                <p className="mt-1 text-sm text-white/55">{order.user?.email} | {order.phone}</p>
                <p className="mt-2 text-sm text-white/45">Created {formatDate(order.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">{order.paymentStatus}</Badge>
                <Badge variant="accent">{formatCurrency(order.total)}</Badge>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-white/62">
                <div className="font-semibold text-white">Items</div>
                <div className="mt-3 space-y-2">
                  {order.items?.map((item, index) => (
                    <div key={`${order.id}-${index}`} className="flex justify-between gap-3">
                      <span>{item.product?.name || 'Robotix item'} x {item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-white/10 pt-3">
                  <div>Paid: {formatCurrency(order.amountPaid)}</div>
                  <div>Balance: {formatCurrency(Math.max(0, order.total - order.amountPaid))}</div>
                  <div className="mt-2 text-white/45">Address: {order.address}</div>
                </div>
              </div>

              <form onSubmit={(event) => saveOrder(event, order)} className="rounded-2xl border border-brand-secondary/15 bg-brand-secondary/8 p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <Select
                    label="Order status"
                    value={order.status}
                    onChange={(event) => updateOrder(order.id, { status: event.target.value })}
                    options={orderStatusOptions}
                  />
                  <Select
                    label="Payment status"
                    value={order.paymentStatus}
                    onChange={(event) => updateOrder(order.id, { paymentStatus: event.target.value })}
                    options={paymentStatusOptions}
                  />
                  <Input
                    label="Amount paid"
                    type="number"
                    min="0"
                    step="0.01"
                    value={order.amountPaid}
                    onChange={(event) => updateOrder(order.id, { amountPaid: Number(event.target.value) })}
                  />
                  <Input
                    label="Payment method"
                    value={order.paymentMethod || ''}
                    onChange={(event) => updateOrder(order.id, { paymentMethod: event.target.value })}
                    placeholder="Website, cash, bank transfer, mobile money"
                  />
                  <Input
                    label="Reference"
                    value={order.paymentReference || ''}
                    onChange={(event) => updateOrder(order.id, { paymentReference: event.target.value })}
                    placeholder="Receipt or transaction ID"
                    className="md:col-span-2"
                  />
                </div>
                <Textarea
                  label="Accounts notes"
                  value={order.accountsNotes || ''}
                  onChange={(event) => updateOrder(order.id, { accountsNotes: event.target.value })}
                  placeholder="Record parent payment notes, balance agreement, or receipt details..."
                  className="mt-3"
                />
                <Button type="submit" size="sm" className="mt-3" loading={savingId === order.id}>
                  Save payment update
                </Button>
              </form>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
