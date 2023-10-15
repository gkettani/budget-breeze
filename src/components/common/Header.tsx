import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <div className="w-full h-16 bg-black text-white flex justify-center items-center">
      <div className="w-11/12 flex justify-between  items-center">
        <div>
          Logo
        </div>
        <ul className="flex gap-10 items-center">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/">Product</Link>
          </li>
          <li>
            <Link href="/">FAQs</Link>
          </li>
          <li>
            <Link href="/">Pricing</Link>
          </li>
          <li>
            {/* <Link href="/">Blog</Link> */}
            <button onClick={() => void signOut()}>Blog</button>
          </li>
          {session ? (
            <li>
              <Link href="/app" className="bg-slate-200 text-black py-1 px-2 border rounded">Open App</Link>
            </li>
          ) : (
            <>
              <li>
                <button onClick={() => void signIn()}>Login</button>
              </li>
              <li>
                <button className="bg-slate-200 text-black py-1 px-2 border rounded" onClick={() => void signIn()}>Register</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}