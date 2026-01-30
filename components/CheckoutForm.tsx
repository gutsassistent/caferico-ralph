'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useRouter, Link } from '@/i18n/routing';
import { useCart } from '@/components/CartProvider';
import { isCoffee } from '@/types/product';
import { calculateShipping, amountUntilFreeShipping } from '@/lib/shipping';

type CheckoutValues = {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
};

type FieldName = keyof CheckoutValues;

const initialValues: CheckoutValues = {
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  postalCode: '',
  city: '',
  country: 'BE',
  phone: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const postalCodePatterns: Record<string, RegExp> = {
  BE: /^\d{4}$/,
  NL: /^\d{4}\s?[A-Za-z]{2}$/,
  LU: /^\d{4}$/,
  DE: /^\d{5}$/,
};

const countries = [
  { code: 'BE', label: 'België' },
  { code: 'NL', label: 'Nederland' },
  { code: 'LU', label: 'Luxembourg' },
  { code: 'DE', label: 'Deutschland' },
];

export default function CheckoutForm() {
  const t = useTranslations('Checkout');
  const productT = useTranslations('Product');
  const locale = useLocale();
  const router = useRouter();
  const { items, subtotal } = useCart();
  const { data: session, status: authStatus } = useSession();

  const [values, setValues] = useState<CheckoutValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);

  // Pre-fill form with WooCommerce customer data when logged in
  useEffect(() => {
    if (authStatus !== 'authenticated' || prefilled) return;

    async function fetchCustomerData() {
      try {
        const res = await fetch('/api/account');
        if (!res.ok) return;
        const data = await res.json();
        const c = data.customer;
        if (!c) return;

        const billing = c.billing || {};
        setValues((prev) => ({
          firstName: billing.first_name || c.first_name || prev.firstName,
          lastName: billing.last_name || c.last_name || prev.lastName,
          email: billing.email || c.email || prev.email,
          street: billing.address_1 || prev.street,
          postalCode: billing.postcode || prev.postalCode,
          city: billing.city || prev.city,
          country: billing.country || prev.country,
          phone: billing.phone || prev.phone,
        }));
        setPrefilled(true);
      } catch {
        // Silently fail — user can fill in manually
      }
    }

    fetchCustomerData();
  }, [authStatus, prefilled]);

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR',
      }),
    [locale]
  );

  // Redirect to home if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.replace('/');
    }
  }, [items.length, router]);

  const validate = (draft: CheckoutValues) => {
    const nextErrors: Partial<Record<FieldName, string>> = {};

    if (!draft.firstName.trim()) {
      nextErrors.firstName = t('validation.firstNameRequired');
    }
    if (!draft.lastName.trim()) {
      nextErrors.lastName = t('validation.lastNameRequired');
    }
    if (!draft.email.trim()) {
      nextErrors.email = t('validation.emailRequired');
    } else if (!emailPattern.test(draft.email)) {
      nextErrors.email = t('validation.emailInvalid');
    }
    if (!draft.street.trim()) {
      nextErrors.street = t('validation.streetRequired');
    }
    if (!draft.postalCode.trim()) {
      nextErrors.postalCode = t('validation.postalCodeRequired');
    } else {
      const pattern = postalCodePatterns[draft.country] || /^\d{4,5}$/;
      if (!pattern.test(draft.postalCode.trim())) {
        nextErrors.postalCode = t('validation.postalCodeInvalid');
      }
    }
    if (!draft.city.trim()) {
      nextErrors.city = t('validation.cityRequired');
    }

    return nextErrors;
  };

  const handleChange =
    (field: FieldName) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const nextValues = { ...values, [field]: event.target.value };
      setValues(nextValues);
      if (submitAttempted) {
        setErrors(validate(nextValues));
      }
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setSubmitError(null);

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: String(item.id),
            slug: item.slug,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            grind: item.grind ?? null,
            weight: item.weight ?? null,
          })),
          customer: values,
          locale,
          ...(session?.wcCustomerId && { wcCustomerId: session.wcCustomerId }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.error || t('form.errorGeneric'));
        setIsLoading(false);
        return;
      }

      // Redirect to Mollie hosted checkout
      window.location.href = data.checkoutUrl;
    } catch {
      setSubmitError(t('form.errorGeneric'));
      setIsLoading(false);
    }
  };

  const fieldError = (field: FieldName) =>
    submitAttempted && errors[field] ? errors[field] : undefined;

  const inputBase =
    'w-full rounded-2xl border bg-noir/70 px-4 py-3 text-sm text-cream placeholder:text-cream/50 transition focus:border-gold/70 focus:outline-none';
  const inputError = 'border-rose-400/70 focus:border-rose-300';
  const inputDefault = 'border-cream/20';

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      {/* Form */}
      <div className="rounded-3xl border border-cream/10 bg-surface-darker p-8 shadow-[0_35px_80px_rgba(0,0,0,0.55)]">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
            {t('form.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl">{t('form.title')}</h2>
          <p className="text-sm text-cream/70 sm:text-base">
            {t('form.description')}
          </p>
        </div>

        {authStatus !== 'authenticated' && (
          <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-cream/80">
            <Link
              href={`/login?callbackUrl=/${locale}/checkout`}
              className="font-medium text-gold underline decoration-gold/40 underline-offset-2 transition hover:decoration-gold"
            >
              {t('form.loginPrompt')}
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Name row */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="checkout-firstName"
                className="text-xs uppercase tracking-[0.3em] text-cream/60"
              >
                {t('fields.firstName.label')}
              </label>
              <input
                id="checkout-firstName"
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
                value={values.firstName}
                onChange={handleChange('firstName')}
                className={`${inputBase} ${fieldError('firstName') ? inputError : inputDefault}`}
                placeholder={t('fields.firstName.placeholder')}
                aria-invalid={Boolean(fieldError('firstName'))}
                aria-describedby={
                  fieldError('firstName') ? 'checkout-firstName-error' : undefined
                }
              />
              {fieldError('firstName') ? (
                <p id="checkout-firstName-error" className="text-xs text-rose-200">
                  {fieldError('firstName')}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="checkout-lastName"
                className="text-xs uppercase tracking-[0.3em] text-cream/60"
              >
                {t('fields.lastName.label')}
              </label>
              <input
                id="checkout-lastName"
                name="lastName"
                type="text"
                required
                autoComplete="family-name"
                value={values.lastName}
                onChange={handleChange('lastName')}
                className={`${inputBase} ${fieldError('lastName') ? inputError : inputDefault}`}
                placeholder={t('fields.lastName.placeholder')}
                aria-invalid={Boolean(fieldError('lastName'))}
                aria-describedby={
                  fieldError('lastName') ? 'checkout-lastName-error' : undefined
                }
              />
              {fieldError('lastName') ? (
                <p id="checkout-lastName-error" className="text-xs text-rose-200">
                  {fieldError('lastName')}
                </p>
              ) : null}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="checkout-email"
              className="text-xs uppercase tracking-[0.3em] text-cream/60"
            >
              {t('fields.email.label')}
            </label>
            <input
              id="checkout-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={values.email}
              onChange={handleChange('email')}
              className={`${inputBase} ${fieldError('email') ? inputError : inputDefault}`}
              placeholder={t('fields.email.placeholder')}
              aria-invalid={Boolean(fieldError('email'))}
              aria-describedby={fieldError('email') ? 'checkout-email-error' : undefined}
            />
            {fieldError('email') ? (
              <p id="checkout-email-error" className="text-xs text-rose-200">
                {fieldError('email')}
              </p>
            ) : null}
          </div>

          {/* Street */}
          <div className="space-y-2">
            <label
              htmlFor="checkout-street"
              className="text-xs uppercase tracking-[0.3em] text-cream/60"
            >
              {t('fields.street.label')}
            </label>
            <input
              id="checkout-street"
              name="street"
              type="text"
              required
              autoComplete="street-address"
              value={values.street}
              onChange={handleChange('street')}
              className={`${inputBase} ${fieldError('street') ? inputError : inputDefault}`}
              placeholder={t('fields.street.placeholder')}
              aria-invalid={Boolean(fieldError('street'))}
              aria-describedby={fieldError('street') ? 'checkout-street-error' : undefined}
            />
            {fieldError('street') ? (
              <p id="checkout-street-error" className="text-xs text-rose-200">
                {fieldError('street')}
              </p>
            ) : null}
          </div>

          {/* Postal code + City row */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="checkout-postalCode"
                className="text-xs uppercase tracking-[0.3em] text-cream/60"
              >
                {t('fields.postalCode.label')}
              </label>
              <input
                id="checkout-postalCode"
                name="postalCode"
                type="text"
                required
                autoComplete="postal-code"
                value={values.postalCode}
                onChange={handleChange('postalCode')}
                className={`${inputBase} ${fieldError('postalCode') ? inputError : inputDefault}`}
                placeholder={t('fields.postalCode.placeholder')}
                aria-invalid={Boolean(fieldError('postalCode'))}
                aria-describedby={
                  fieldError('postalCode') ? 'checkout-postalCode-error' : undefined
                }
              />
              {fieldError('postalCode') ? (
                <p id="checkout-postalCode-error" className="text-xs text-rose-200">
                  {fieldError('postalCode')}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="checkout-city"
                className="text-xs uppercase tracking-[0.3em] text-cream/60"
              >
                {t('fields.city.label')}
              </label>
              <input
                id="checkout-city"
                name="city"
                type="text"
                required
                autoComplete="address-level2"
                value={values.city}
                onChange={handleChange('city')}
                className={`${inputBase} ${fieldError('city') ? inputError : inputDefault}`}
                placeholder={t('fields.city.placeholder')}
                aria-invalid={Boolean(fieldError('city'))}
                aria-describedby={fieldError('city') ? 'checkout-city-error' : undefined}
              />
              {fieldError('city') ? (
                <p id="checkout-city-error" className="text-xs text-rose-200">
                  {fieldError('city')}
                </p>
              ) : null}
            </div>
          </div>

          {/* Country + Phone row */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="checkout-country"
                className="text-xs uppercase tracking-[0.3em] text-cream/60"
              >
                {t('fields.country.label')}
              </label>
              <select
                id="checkout-country"
                name="country"
                autoComplete="country"
                value={values.country}
                onChange={handleChange('country')}
                className={`${inputBase} ${inputDefault} appearance-none`}
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code} className="bg-noir text-cream">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="checkout-phone"
                className="text-xs uppercase tracking-[0.3em] text-cream/60"
              >
                {t('fields.phone.label')}{' '}
                <span className="normal-case tracking-normal text-cream/40">
                  ({t('fields.phone.optional')})
                </span>
              </label>
              <input
                id="checkout-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={handleChange('phone')}
                className={`${inputBase} ${inputDefault}`}
                placeholder={t('fields.phone.placeholder')}
              />
            </div>
          </div>

          {/* Error message */}
          {submitError && (
            <div
              role="alert"
              className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
            >
              {submitError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-noir transition hover:bg-gold/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {t('form.submitting')}
              </>
            ) : (
              t('form.submit')
            )}
          </button>
        </form>
      </div>

      {/* Cart Summary */}
      <div className="lg:sticky lg:top-28">
        <div className="rounded-3xl border border-cream/10 bg-surface-darker p-8 shadow-[0_35px_80px_rgba(0,0,0,0.55)]">
          <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
            {t('summary.eyebrow')}
          </p>
          <h2 className="mt-3 font-serif text-2xl">{t('summary.title')}</h2>

          <div className="mt-6 space-y-5">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.grind}-${item.weight}`}
                className="flex items-start justify-between gap-4 border-b border-cream/10 pb-5 last:border-b-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-cream">{item.name}</p>
                  {isCoffee(item.collection) && item.grind && item.weight && (
                    <p className="text-xs text-cream/50">
                      {productT(`variants.grind.${item.grind}`)} ·{' '}
                      {productT(`variants.weight.${item.weight}`)}
                    </p>
                  )}
                  <p className="text-xs text-cream/50">
                    {t('summary.quantity')}: {item.quantity}
                  </p>
                </div>
                <p className="text-sm text-gold">
                  {priceFormatter.format(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-cream/10 pt-6">
            <div className="flex items-center justify-between text-sm text-cream/70">
              <span>{t('summary.subtotal')}</span>
              <span className="text-cream">{priceFormatter.format(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-cream/70">
              <span>{t('summary.shipping')}</span>
              {calculateShipping(subtotal) === 0 ? (
                <span className="font-medium text-green-400">{t('summary.freeShipping')}</span>
              ) : (
                <span className="text-cream">{priceFormatter.format(calculateShipping(subtotal))}</span>
              )}
            </div>
            {amountUntilFreeShipping(subtotal) > 0 && (
              <p className="text-xs text-cream/50">
                {t('summary.freeShippingRemaining', {
                  amount: priceFormatter.format(amountUntilFreeShipping(subtotal)),
                })}
              </p>
            )}
            <div className="flex items-center justify-between border-t border-cream/10 pt-3 text-base font-semibold text-gold">
              <span>{t('summary.total')}</span>
              <span>{priceFormatter.format(subtotal + calculateShipping(subtotal))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
