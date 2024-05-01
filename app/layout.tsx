import Header from "@/components/header";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Fantasy Premier League Team Builder",
  description:
    "Create your optimal fantasy team based on real-life player stats and performance metrics.",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="bg-gradient-to-tr from-[rgb(15,23,42)] from-40% to-[#182b45] to-60%%"
    >
      <body className={inter.variable}>
        <Header />
        {children}
      </body>
    </html>
  );
}
