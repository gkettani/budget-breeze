import { redirect } from 'next/navigation';

export default function App({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL_ENV === 'production') {
    return redirect('/');
  }
  return <>{children}</>;
}
