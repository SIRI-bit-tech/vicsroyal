import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Access | VIC ROYAL BEAUTY',
  description: 'VIC ROYAL BEAUTY administrative portal authentication.',
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
