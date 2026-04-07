import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kofe House | Wake Up & Drink Up",
  description: "Scrollytelling e-commerce for Kofe House.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased font-sans no-scrollbar bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
