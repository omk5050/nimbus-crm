import { Outlet } from 'react-router';
import { APP_NAME, APP_TAGLINE } from '@/constants/app.constants';
import logoMark from '@/assets/logo-mark.svg';

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh bg-background">
      {/* Brand panel — desktop only */}
      <div className="relative hidden w-1/2 overflow-hidden bg-brand-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(129,140,248,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(99,102,241,0.3), transparent 50%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative flex items-center gap-2.5">
          <img src={logoMark} alt="" className="h-9 w-9 rounded-lg" />
          <span className="text-lg font-semibold tracking-tight text-white">{APP_NAME}</span>
        </div>

        <div className="relative max-w-md">
          <p className="text-3xl font-semibold leading-tight tracking-tight text-white">
            {APP_TAGLINE}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-brand-300">
            One workspace for pipeline, customers, and the whole team — built to stay out of
            your way.
          </p>
        </div>

        <p className="relative text-xs text-brand-400">
          &copy; {new Date().getFullYear()} {APP_NAME}
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <img src={logoMark} alt="" className="h-8 w-8 rounded-lg" />
          <span className="text-base font-semibold tracking-tight text-foreground">
            {APP_NAME}
          </span>
        </div>

        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
