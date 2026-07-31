export type UserRole = 'admin' | 'manager' | 'sales_rep' | 'support';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatarUrl?: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}
