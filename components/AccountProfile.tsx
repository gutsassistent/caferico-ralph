'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import Image from 'next/image';

interface CustomerData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    address_1: string;
    city: string;
    postcode: string;
    country: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    postcode: string;
    country: string;
  };
}

interface OrderItem {
  name: string;
  quantity: number;
  total: string;
}

interface Order {
  id: number;
  number: string;
  status: string;
  date: string;
  total: string;
  currency: string;
  itemCount: number;
  items: OrderItem[];
}

type Tab = 'profile' | 'orders';

const STATUS_COLORS: Record<string, string> = {
  processing: 'bg-gold/20 text-gold',
  completed: 'bg-emerald-500/20 text-emerald-400',
  'on-hold': 'bg-amber-500/20 text-amber-400',
  pending: 'bg-amber-500/20 text-amber-400',
  cancelled: 'bg-rose-500/20 text-rose-400',
  refunded: 'bg-cream/10 text-cream/50',
  failed: 'bg-rose-500/20 text-rose-400',
};

export default function AccountProfile() {
  const t = useTranslations('Account');
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [editingBilling, setEditingBilling] = useState(false);
  const [editingShipping, setEditingShipping] = useState(false);
  const [billingForm, setBillingForm] = useState<CustomerData['billing'] | null>(null);
  const [shippingForm, setShippingForm] = useState<CustomerData['shipping'] | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await fetch('/api/account');
        if (res.ok) {
          const data = await res.json();
          setCustomer(data.customer);
        }
      } catch {
        // silently fail, show session data
      } finally {
        setIsLoading(false);
      }
    }
    fetchCustomer();
  }, []);

  useEffect(() => {
    if (activeTab !== 'orders' || ordersLoaded) return;
    async function fetchOrders() {
      setOrdersLoading(true);
      try {
        const res = await fetch('/api/account/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders);
        }
      } catch {
        // silently fail
      } finally {
        setOrdersLoading(false);
        setOrdersLoaded(true);
      }
    }
    fetchOrders();
  }, [activeTab, ordersLoaded]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleSaveAddress = async (type: 'billing' | 'shipping') => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const body = type === 'billing' ? { billing: billingForm } : { shipping: shippingForm };
      const res = await fetch('/api/account/address', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer);
        if (type === 'billing') setEditingBilling(false);
        else setEditingShipping(false);
        setSaveMessage({ type: 'success', text: t('saveSuccess') });
      } else {
        setSaveMessage({ type: 'error', text: t('saveError') });
      }
    } catch {
      setSaveMessage({ type: 'error', text: t('saveError') });
    } finally {
      setSaving(false);
    }
  };

  const startEditBilling = () => {
    setBillingForm(customer?.billing ?? { first_name: '', last_name: '', email: '', address_1: '', city: '', postcode: '', country: '', phone: '' });
    setEditingBilling(true);
    setSaveMessage(null);
  };

  const startEditShipping = () => {
    setShippingForm(customer?.shipping ?? { first_name: '', last_name: '', address_1: '', city: '', postcode: '', country: '' });
    setEditingShipping(true);
    setSaveMessage(null);
  };

  const displayName =
    customer?.first_name && customer?.last_name
      ? `${customer.first_name} ${customer.last_name}`
      : session?.user?.name ?? '';

  const displayEmail = customer?.email ?? session?.user?.email ?? '';
  const avatarUrl = session?.user?.image;
  const initial = (displayName || displayEmail).charAt(0).toUpperCase();

  const billing = customer?.billing;
  const shipping = customer?.shipping;

  const hasBillingAddress = billing?.address_1;
  const hasShippingAddress = shipping?.address_1;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 animate-pulse rounded-full bg-cream/10" />
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-cream/10" />
            <div className="h-4 w-56 animate-pulse rounded bg-cream/10" />
          </div>
        </div>
        <div className="h-px bg-cream/10" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-32 animate-pulse rounded-2xl bg-cream/5" />
          <div className="h-32 animate-pulse rounded-2xl bg-cream/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-2xl font-serif text-gold">
              {initial}
            </div>
          )}
          <div>
            <h2 className="text-xl font-serif">{displayName || displayEmail}</h2>
            {displayName && (
              <p className="text-sm text-cream/60">{displayEmail}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full border border-cream/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cream/70 transition hover:border-cream/40 hover:text-cream active:scale-95"
        >
          {t('logout')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-cream/10">
        {(['profile', 'orders'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium transition ${
              activeTab === tab
                ? 'border-b-2 border-gold text-gold'
                : 'text-cream/50 hover:text-cream/80'
            }`}
          >
            {t(`tabs.${tab}`)}
          </button>
        ))}
      </div>

      {/* Save message */}
      {saveMessage && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            saveMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-rose-500/10 text-rose-400'
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      {/* Tab content */}
      {activeTab === 'profile' && (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Billing address */}
          <div className="rounded-2xl border border-cream/10 bg-surface-darker p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">
                {t('billingAddress')}
              </h3>
              {!editingBilling && (
                <button
                  onClick={startEditBilling}
                  className="text-xs font-medium text-gold/70 transition hover:text-gold"
                >
                  {t('edit')}
                </button>
              )}
            </div>
            {editingBilling && billingForm ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-xs text-cream/50">{t('fields.firstName')}</span>
                    <input
                      type="text"
                      value={billingForm.first_name}
                      onChange={(e) => setBillingForm({ ...billingForm, first_name: e.target.value })}
                      className="w-full rounded-lg border border-cream/10 bg-noir px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-cream/50">{t('fields.lastName')}</span>
                    <input
                      type="text"
                      value={billingForm.last_name}
                      onChange={(e) => setBillingForm({ ...billingForm, last_name: e.target.value })}
                      className="w-full rounded-lg border border-cream/10 bg-noir px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs text-cream/50">{t('fields.email')}</span>
                  <input
                    type="email"
                    value={billingForm.email}
                    onChange={(e) => setBillingForm({ ...billingForm, email: e.target.value })}
                    className="w-full rounded-lg border border-cream/10 bg-noir px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-cream/50">{t('fields.address')}</span>
                  <input
                    type="text"
                    value={billingForm.address_1}
                    onChange={(e) => setBillingForm({ ...billingForm, address_1: e.target.value })}
                    className="w-full rounded-lg border border-cream/10 bg-noir px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-xs text-cream/50">{t('fields.postcode')}</span>
                    <input
                      type="text"
                      value={billingForm.postcode}
                      onChange={(e) => setBillingForm({ ...billingForm, postcode: e.target.value })}
                      className="w-full rounded-lg border border-cream/10 bg-noir px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-cream/50">{t('fields.city')}</span>
                    <input
                      type="text"
                      value={billingForm.city}
                      onChange={(e) => setBillingForm({ ...billingForm, city: e.target.value })}
                      className="w-full rounded-lg border border-cream/10 bg-noir px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs text-cream/50">{t('fields.country')}</span>
                  <input
                    type="text"
                    value={billingForm.country}
                    onChange={(e) => setBillingForm({ ...billingForm, country: e.target.value })}
                    className="w-full rounded-lg border border-cream/10 bg-noir px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-cream/50">{t('fields.phone')}</span>
                  <input
                    type="tel"
                    value={billingForm.phone}
                    onChange={(e) => setBillingForm({ ...billingForm, phone: e.target.value })}
                    className="w-full rounded-lg border border-cream/10 bg-noir px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
                  />
                </label>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => handleSaveAddress('billing')}
                    disabled={saving}
                    className="rounded-full bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-noir transition hover:bg-gold/90 disabled:opacity-50"
                  >
                    {saving ? t('saving') : t('save')}
                  </button>
                  <button
                    onClick={() => setEditingBilling(false)}
                    className="rounded-full border border-cream/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cream/70 transition hover:border-cream/40 hover:text-cream"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            ) : hasBillingAddress ? (
              <div className="space-y-1 text-sm text-cream/80">
                <p>{billing.first_name} {billing.last_name}</p>
                <p>{billing.address_1}</p>
                <p>{billing.postcode} {billing.city}</p>
                <p>{billing.country}</p>
                {billing.phone && <p className="mt-2 text-cream/50">{billing.phone}</p>}
              </div>
            ) : (
              <p className="text-sm text-cream/40">{t('noAddress')}</p>
            )}
          </div>

          {/* Shipping address */}
          <div className="rounded-2xl border border-cream/10 bg-surface-darker p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">
                {t('shippingAddress')}
              </h3>
              {!editingShipping && (
                <button
                  onClick={startEditShipping}
                  className="text-xs font-medium text-gold/70 transition hover:text-gold"
                >
                  {t('edit')}
                </button>
              )}
            </div>
            {editingShipping && shippingForm ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-xs text-cream/50">{t('fields.firstName')}</span>
                    <input
                      type="text"
                      value={shippingForm.first_name}
                      onChange={(e) => setShippingForm({ ...shippingForm, first_name: e.target.value })}
                      className="w-full rounded-lg border border-cream/10 bg-noir px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-cream/50">{t('fields.lastName')}</span>
                    <input
                      type="text"
                      value={shippingForm.last_name}
                      onChange={(e) => setShippingForm({ ...shippingForm, last_name: e.target.value })}
                      className="w-full rounded-lg border border-cream/10 bg-noir px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs text-cream/50">{t('fields.address')}</span>
                  <input
                    type="text"
                    value={shippingForm.address_1}
                    onChange={(e) => setShippingForm({ ...shippingForm, address_1: e.target.value })}
                    className="w-full rounded-lg border border-cream/10 bg-noir px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-xs text-cream/50">{t('fields.postcode')}</span>
                    <input
                      type="text"
                      value={shippingForm.postcode}
                      onChange={(e) => setShippingForm({ ...shippingForm, postcode: e.target.value })}
                      className="w-full rounded-lg border border-cream/10 bg-noir px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-cream/50">{t('fields.city')}</span>
                    <input
                      type="text"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      className="w-full rounded-lg border border-cream/10 bg-noir px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs text-cream/50">{t('fields.country')}</span>
                  <input
                    type="text"
                    value={shippingForm.country}
                    onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                    className="w-full rounded-lg border border-cream/10 bg-noir px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
                  />
                </label>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => handleSaveAddress('shipping')}
                    disabled={saving}
                    className="rounded-full bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-noir transition hover:bg-gold/90 disabled:opacity-50"
                  >
                    {saving ? t('saving') : t('save')}
                  </button>
                  <button
                    onClick={() => setEditingShipping(false)}
                    className="rounded-full border border-cream/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cream/70 transition hover:border-cream/40 hover:text-cream"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            ) : hasShippingAddress ? (
              <div className="space-y-1 text-sm text-cream/80">
                <p>{shipping.first_name} {shipping.last_name}</p>
                <p>{shipping.address_1}</p>
                <p>{shipping.postcode} {shipping.city}</p>
                <p>{shipping.country}</p>
              </div>
            ) : (
              <p className="text-sm text-cream/40">{t('noAddress')}</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {ordersLoading && (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-cream/5" />
              ))}
            </div>
          )}

          {!ordersLoading && orders.length === 0 && (
            <div className="rounded-2xl border border-cream/10 bg-surface-darker p-8 text-center">
              <p className="text-sm text-cream/50">{t('orders.empty')}</p>
            </div>
          )}

          {!ordersLoading && orders.length > 0 && orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const statusClass = STATUS_COLORS[order.status] || 'bg-cream/10 text-cream/50';
            const dateStr = new Date(order.date).toLocaleDateString('nl-BE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <div key={order.id} className="rounded-2xl border border-cream/10 bg-surface-darker overflow-hidden">
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-cream/[0.02]"
                >
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="text-sm font-semibold text-cream">
                      #{order.number}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}>
                      {t(`orders.status.${order.status}`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="hidden text-cream/50 sm:inline">{dateStr}</span>
                    <span className="font-serif text-gold">€{parseFloat(order.total).toFixed(2)}</span>
                    <svg
                      className={`h-4 w-4 text-cream/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-cream/10 px-5 pb-5 pt-4">
                    <p className="mb-3 text-xs text-cream/50 sm:hidden">{dateStr}</p>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold/70">
                      {t('orders.items')} ({order.itemCount})
                    </p>
                    <ul className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-cream/80">
                            {item.quantity}× {item.name}
                          </span>
                          <span className="text-cream/50">€{parseFloat(item.total).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-center justify-between border-t border-cream/10 pt-3 text-sm">
                      <span className="font-medium text-cream/60">{t('orders.total')}</span>
                      <span className="font-serif text-gold">€{parseFloat(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
