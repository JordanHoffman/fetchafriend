import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/navbar";
import { LoginMonitor } from "@/components/loginMonitor";
import { theme } from "@/theme";

const fredoka = Fredoka({
	subsets: ["latin"],
	fallback: ['Arial Rounded MT Bold', 'Helvetica Rounded', 'Segoe UI', 'sans-serif']
})

export const metadata: Metadata = {
  title: "Fetch a Friend",
  description: "Adopt a new best doggy friend near you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-green-50">
      <body
        className={`${fredoka.className} ${theme.text} ${theme.border} antialiased container`}
      >
				<LoginMonitor />
				<NavBar />
				{children}
      </body>
    </html>
  );
}
