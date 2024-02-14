import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from './components/navbar';
import Context from "./context/context"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF Editor",
  description: "Private PDF Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Context>
          <Navbar />
          {children}
        </Context>
      </body>
    </html>
  );
}
