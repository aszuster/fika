import { JetBrains_Mono } from "next/font/google";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import {ReactLenis} from "@/utils/lenis"
import Navbar from "@/components/navbar/Navbar";
import Scrollbar from "@/components/scrollbar/Scrollbar";



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
        {/* Scroll de la página: arranca debajo del navbar (h-12.5). */}
        <Scrollbar className="fixed top-12.5 right-0 h-[calc(100dvh-3.125rem)]" />
      </body>
      </ReactLenis>
    </html>
  );
}
