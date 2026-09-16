import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "TeamFlow — Work together, in flow",
  description:
    "TeamFlow is a real-time Kanban workspace for small teams: boards, tasks, comments and files, all updating live.",
};

// Without this, mobile browsers render the page at a fake desktop-width
// viewport (~980px) and scale it down — every responsive breakpoint in the
// app (sm:/lg: classes, the mobile sidebar drawer, the board's column
// layout) is written assuming the real device width, so pages looked
// "not responsive" on phones even though the Tailwind classes were correct.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-ink text-text antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
