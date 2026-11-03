import { JetBrains_Mono } from "next/font/google";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import {ReactLenis} from "@/utils/lenis"
import Navbar from "@/components/navbar/Navbar";
import Scrollbar from "@/components/scrollbar/Scrollbar";
import LenisAutoResize from "@/components/lenis/LenisAutoResize";



const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});
const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fika",
  description: "Fika website",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jetBrainsMono.variable} ${publicSans.variable} h-full antialiased no-scrollbar`}
    >
      <ReactLenis root>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        {/* Scroll de la página: arranca donde indica --page-scrollbar-top (globals.css). */}
        <Scrollbar className="fixed top-(--page-scrollbar-top) right-0 h-[calc(100dvh-var(--page-scrollbar-top))]" />
        <LenisAutoResize />
      </body>
      </ReactLenis>
    </html>
  );
}
