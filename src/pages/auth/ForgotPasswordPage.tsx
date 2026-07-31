import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { AlertCircle, ArrowLeft, KeyRound, MailCheck } from 'lucide-react';
import { forgotPasswordSchema } from '@/pages/auth/auth.schemas';
import type { ForgotPasswordFormValues } from '@/types/auth.types';
import { TextField } from '@/components/inputs/TextField';
import { Button } from '@/components/buttons/Button';
import { ROUTES } from '@/constants/routes.constants';
import { apiClient } from '@/services/api.client';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setErrorMessage(null);
    const cleanEmail = values.email.trim();

    try {
      await apiClient.post('/auth/forgot-password', { email: cleanEmail });
      setSentTo(cleanEmail);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      if (err.response?.status === 404 || msg?.toLowerCase().includes('not associated') || msg?.toLowerCase().includes('not found')) {
        setErrorMessage('This email is not associated with any account.');
      } else if (msg) {
        setErrorMessage(msg);
      } else {
        setErrorMessage('Failed to send reset code. Please verify your connection or try again.');
      }
    }
  }

  if (sentTo) {
    return (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">
          <MailCheck size={22} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Check your email
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          We've sent a 6-digit OTP verification code to <span className="font-semibold text-foreground">{sentTo}</span>.
        </p>

        <Button
          fullWidth
          className="mt-6 gap-2"
          onClick={() => navigate(`${ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(sentTo)}`)}
        >
          <KeyRound size={16} />
          Enter OTP & Reset Password
        </Button>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="text-primary hover:underline"
          >
            Use a different email
          </button>

          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <ArrowLeft size={12} />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Forgot your password?
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Enter the email tied to your workspace and we'll send you a 6-digit OTP verification code.
      </p>

      {errorMessage && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-4">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-2">
          Send OTP Verification Code
        </Button>

        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </form>
    </div>
  );
}
