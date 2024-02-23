import { redirect } from 'next/navigation';
import { env } from '~/env.mjs';

export default function App({ children }: { children: React.ReactNode }) {
  if (env.NODE_ENV === 'production') {
    return redirect('/');
  }
  return <>{children}</>;
}
