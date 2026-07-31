import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router';
import type { Location } from 'react-router';
import { AlertCircle, LogIn, UserCheck, X } from 'lucide-react';
import { loginSchema } from '@/pages/auth/auth.schemas';
import type { LoginFormValues } from '@/types/auth.types';
import { TextField } from '@/components/inputs/TextField';
import { PasswordField } from '@/components/inputs/PasswordField';
import { Checkbox } from '@/components/inputs/Checkbox';
import { Button } from '@/components/buttons/Button';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/badges/Badge';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants/routes.constants';

interface LocationState {
  from?: Location;
}

interface SavedAccount {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
}

export default function LoginPage() {
  const { login, error: storeError, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(null);

  const [savedAccount, setSavedAccount] = useState<SavedAccount | null>(() => {
    try {
      const raw = localStorage.getItem('nimbus_remembered_account');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const cachedEmail = savedAccount?.email || localStorage.getItem('nimbus_remembered_email') || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: cachedEmail,
      password: '',
      rememberMe: Boolean(cachedEmail),
    },
  });

  const errorMessage = storeError || localErrorMessage;

  function handleClearSavedAccount() {
    localStorage.removeItem('nimbus_remembered_account');
    localStorage.removeItem('nimbus_remembered_email');
    setSavedAccount(null);
    setValue('email', '');
    setValue('rememberMe', false);
  }

  async function onSubmit(values: LoginFormValues) {
    clearError();
    setLocalErrorMessage(null);
    try {
      await login({
        ...values,
        email: values.email.trim(),
      });
      const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? ROUTES.DASHBOARD;
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      if (!err?.response) {
        setLocalErrorMessage('Server is waking up or deploying on Render. Please wait 10-15 seconds and try clicking Sign In again.');
      }
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Sign in with your database credentials (Demo: <code className="font-mono text-xs">jordan@nimbus.example.com</code> / <code className="font-mono text-xs">Password123!</code>).
      </p>

      {savedAccount && (
        <div className="mt-5 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3.5">
          <div className="flex items-center gap-3">
            <Avatar name={savedAccount.name} size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-foreground">{savedAccount.name}</p>
                <Badge tone="success" className="gap-1 text-[10px] py-0 px-1.5">
                  <UserCheck size={10} /> Remembered
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">{savedAccount.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearSavedAccount}
            title="Forget device account"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>
      )}

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
          <Checkbox label="Remember me on this device" {...register('rememberMe')} />
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-2">
          <LogIn size={16} />
          {savedAccount ? `Sign in as ${savedAccount.name.split(' ')[0]}` : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}

