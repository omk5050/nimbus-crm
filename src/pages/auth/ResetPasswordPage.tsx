import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { resetPasswordSchema } from '@/pages/auth/auth.schemas';
import type { ResetPasswordFormValues } from '@/types/auth.types';
import { TextField } from '@/components/inputs/TextField';
import { PasswordField } from '@/components/inputs/PasswordField';
import { Button } from '@/components/buttons/Button';
import { ROUTES } from '@/constants/routes.constants';
import { apiClient } from '@/services/api.client';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const [isComplete, setIsComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: initialEmail,
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    setErrorMessage(null);
    try {
      await apiClient.post('/auth/reset-password', {
        email: values.email.trim(),
        otp: values.otp.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      setIsComplete(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      if (msg) {
        setErrorMessage(msg);
      } else {
        setErrorMessage('Failed to reset password. The OTP verification code may be invalid or expired.');
      }
    }
  }

  if (isComplete) {
    return (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 size={22} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Password updated
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Your password has been reset successfully. You can now sign in with your new credentials.
        </p>
        <Link to={ROUTES.LOGIN}>
          <Button fullWidth className="mt-6">
            Continue to sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Set a new password
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Enter your 6-digit OTP code sent to your email, then choose a new password.
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

        <TextField
          label="6-Digit OTP Verification Code"
          type="text"
          placeholder="e.g. 482910"
          maxLength={6}
          className="font-mono tracking-widest text-center text-lg"
          error={errors.otp?.message}
          {...register('otp')}
        />

        <PasswordField
          label="New password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-2">
          Reset password
        </Button>

        <div className="mt-2 text-center">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs text-muted-foreground hover:text-primary hover:underline"
          >
            Didn't receive an OTP code? Request a new one
          </Link>
        </div>
      </form>
    </div>
  );
}
