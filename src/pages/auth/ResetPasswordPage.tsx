import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import { resetPasswordSchema } from '@/pages/auth/auth.schemas';
import type { ResetPasswordFormValues } from '@/types/auth.types';
import { PasswordField } from '@/components/inputs/PasswordField';
import { Button } from '@/components/buttons/Button';
import { ROUTES } from '@/constants/routes.constants';

const MOCK_DELAY_MS = 600;

export default function ResetPasswordPage() {
  const [isComplete, setIsComplete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    setIsComplete(true);
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
          Your password has been reset. You can now sign in with your new password.
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
        Choose a new password for your account. Make it at least 8 characters.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-4">
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
      </form>
    </div>
  );
}
