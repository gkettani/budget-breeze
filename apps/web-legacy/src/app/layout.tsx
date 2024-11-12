import { Inter as FontSans, Rubik } from "next/font/google";
import { Analytics } from "~/components/analytics";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import "~/styles/globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fontHeading = Rubik({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "500",
});

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Budgeting",
    "Expense Tracking",
    "Easy Budgeting",
    "Saving Money",
    "Personal Finance",
    "Budgeting App",
  ],
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "white" },
  //   // { media: "(prefers-color-scheme: dark)", color: "black" },
  // ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
