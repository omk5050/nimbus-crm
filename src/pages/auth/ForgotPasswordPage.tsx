import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { forgotPasswordSchema } from '@/pages/auth/auth.schemas';
import type { ForgotPasswordFormValues } from '@/types/auth.types';
import { TextField } from '@/components/inputs/TextField';
import { Button } from '@/components/buttons/Button';
import { ROUTES } from '@/constants/routes.constants';

const MOCK_DELAY_MS = 600;

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    setSentTo(values.email);
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
          If an account exists for <span className="font-medium text-foreground">{sentTo}</span>,
          we've sent a link to reset the password.
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Forgot your password?
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Enter the email tied to your workspace and we'll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-4">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-2">
          Send reset link
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
