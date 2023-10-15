import { type AppType } from "next/app";
import { Inter as FontSans } from "next/font/google";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-inter",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${fontSans.style.fontFamily};
        }
      `}</style>
      <main className="min-h-screen antialiased">
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </main>
    </>
  );
};

export default api.withTRPC(MyApp);
