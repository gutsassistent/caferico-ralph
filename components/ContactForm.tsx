'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/components/Toast';

type ContactValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FieldName = keyof ContactValues;

const initialValues: ContactValues = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const t = useTranslations('Contact');
  const { showToast } = useToast();
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (draft: ContactValues) => {
    const nextErrors: Partial<Record<FieldName, string>> = {};

    if (!draft.name.trim()) {
      nextErrors.name = t('form.validation.nameRequired');
    }

    if (!draft.email.trim()) {
      nextErrors.email = t('form.validation.emailRequired');
    } else if (!emailPattern.test(draft.email)) {
      nextErrors.email = t('form.validation.emailInvalid');
    }

    if (!draft.subject.trim()) {
      nextErrors.subject = t('form.validation.subjectRequired');
    }

    if (!draft.message.trim()) {
      nextErrors.message = t('form.validation.messageRequired');
    }

    return nextErrors;
  };

  const handleChange =
    (field: FieldName) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValues = { ...values, [field]: event.target.value };
      setValues(nextValues);

      if (submitAttempted) {
        setErrors(validate(nextValues));
      }

      if (isSuccess) {
        setIsSuccess(false);
      }
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === 'rate_limit') {
          showToast(t('form.errorRateLimit'), 'error');
        } else {
          showToast(t('form.errorGeneric'), 'error');
        }
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setIsSuccess(true);
      showToast(t('form.successTitle'), 'success');
      setSubmitAttempted(false);
      setValues(initialValues);
      setErrors({});
    } catch {
      setIsLoading(false);
      showToast(t('form.errorGeneric'), 'error');
    }
  };

  const fieldError = (field: FieldName) =>
    submitAttempted && errors[field] ? errors[field] : undefined;

  const inputBase =
    'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 transition focus:border-gold/70 focus:outline-none';
  const inputError = 'border-rose-400/70 focus:border-rose-300';
  const inputDefault = 'border-ink/20';

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-inkMuted">{t('form.eyebrow')}</p>
        <h2 className="font-serif text-3xl text-ink">{t('form.title')}</h2>
        <p className="text-sm text-ink/70 sm:text-base">{t('form.description')}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {isSuccess ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-gold/30 bg-gold/10 p-4"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-inkMuted">
              {t('form.successTitle')}
            </p>
            <p className="mt-2 text-sm text-ink/70">{t('form.successMessage')}</p>
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="contact-name"
              className="text-xs uppercase tracking-[0.3em] text-ink/60"
            >
              {t('form.fields.name.label')}
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={values.name}
              onChange={handleChange('name')}
              className={`${inputBase} ${fieldError('name') ? inputError : inputDefault}`}
              placeholder={t('form.fields.name.placeholder')}
              aria-invalid={Boolean(fieldError('name'))}
              aria-describedby={fieldError('name') ? 'contact-name-error' : undefined}
            />
            {fieldError('name') ? (
              <p id="contact-name-error" className="text-xs text-rose-600">
                {fieldError('name')}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contact-email"
              className="text-xs uppercase tracking-[0.3em] text-ink/60"
            >
              {t('form.fields.email.label')}
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={values.email}
              onChange={handleChange('email')}
              className={`${inputBase} ${fieldError('email') ? inputError : inputDefault}`}
              placeholder={t('form.fields.email.placeholder')}
              aria-invalid={Boolean(fieldError('email'))}
              aria-describedby={fieldError('email') ? 'contact-email-error' : undefined}
            />
            {fieldError('email') ? (
              <p id="contact-email-error" className="text-xs text-rose-600">
                {fieldError('email')}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="contact-subject"
            className="text-xs uppercase tracking-[0.3em] text-ink/60"
          >
            {t('form.fields.subject.label')}
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            value={values.subject}
            onChange={handleChange('subject')}
            className={`${inputBase} ${fieldError('subject') ? inputError : inputDefault}`}
            placeholder={t('form.fields.subject.placeholder')}
            aria-invalid={Boolean(fieldError('subject'))}
            aria-describedby={fieldError('subject') ? 'contact-subject-error' : undefined}
          />
          {fieldError('subject') ? (
            <p id="contact-subject-error" className="text-xs text-rose-600">
              {fieldError('subject')}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="contact-message"
            className="text-xs uppercase tracking-[0.3em] text-ink/60"
          >
            {t('form.fields.message.label')}
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            value={values.message}
            onChange={handleChange('message')}
            className={`${inputBase} min-h-[160px] resize-none ${
              fieldError('message') ? inputError : inputDefault
            }`}
            placeholder={t('form.fields.message.placeholder')}
            aria-invalid={Boolean(fieldError('message'))}
            aria-describedby={fieldError('message') ? 'contact-message-error' : undefined}
          />
          {fieldError('message') ? (
            <p id="contact-message-error" className="text-xs text-rose-600">
              {fieldError('message')}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gold/60 bg-gold/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('form.submitting')}
            </>
          ) : (
            t('form.submit')
          )}
        </button>
      </form>
    </div>
  );
}
