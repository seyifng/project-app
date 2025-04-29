import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { Toaster } from "sonner"; // ADD THIS!

export const metadata = {
  title: "Scheduler",
  description: "Meeting Scheduler",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          {children}
        </main>
        <footer className="bg-blue-100 text-white py-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>Made with Entergalactic Coders</p>
          </div>
        </footer>

        {/* Add Toaster */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
