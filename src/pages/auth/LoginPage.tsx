import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router';
import type { Location } from 'react-router';
import { AlertCircle, LogIn } from 'lucide-react';
import { loginSchema } from '@/pages/auth/auth.schemas';
import type { LoginFormValues } from '@/types/auth.types';
import { TextField } from '@/components/inputs/TextField';
import { PasswordField } from '@/components/inputs/PasswordField';
import { Checkbox } from '@/components/inputs/Checkbox';
import { Button } from '@/components/buttons/Button';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants/routes.constants';

interface LocationState {
  from?: Location;
}

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  async function onSubmit(values: LoginFormValues) {
    setErrorMessage(null);
    try {
      await login({
        ...values,
        email: values.email.trim(),
      });
      const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? ROUTES.DASHBOARD;
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid email or password. Please check your credentials and try again.';
      setErrorMessage(msg);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Sign in with your database credentials (Demo: <code className="font-mono text-xs">jordan@nimbus.example.com</code> / <code className="font-mono text-xs">Password123!</code>).
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

        <PasswordField
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" {...register('rememberMe')} />
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-2">
          <LogIn size={16} />
          Sign in
        </Button>
      </form>
    </div>
  );
}
