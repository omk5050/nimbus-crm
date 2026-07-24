import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router';
import type { Location } from 'react-router';
import { LogIn } from 'lucide-react';
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  async function onSubmit(values: LoginFormValues) {
    await login(values);
    const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? ROUTES.DASHBOARD;
    navigate(redirectTo, { replace: true });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Sign in with your database credentials (Demo: <code className="font-mono text-xs">jordan@nimbus.example.com</code> / <code className="font-mono text-xs">Password123!</code>).
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
