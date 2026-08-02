import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/component/Navbar";
import ThemeProvider from "@/component/ThemeProvider";
import NightFX from "@/component/NightFX";

// Inter stands in for SF Pro Display on non-Apple platforms — the CSS font
// stack prefers the system SF face when it's available.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Grimoire",
  description: "a feed for horror stories — haunting, cursed, and unsettling tales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resolve the clock-driven band before paint to avoid a flash of the
            wrong band. Mirrors bandForTime() in ThemeProvider: mode defaults to
            "auto", which maps the local hour to day/dusk/night. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('themeMode')||'auto';var b;if(m==='day'||m==='dusk'||m==='night'){b=m;}else{var d=new Date();var t=d.getHours()*60+d.getMinutes();b=(t>=420&&t<1020)?'day':(t>=1020&&t<1170)?'dusk':'night';}document.documentElement.setAttribute('data-theme',b);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased font-sans`}>
        <ThemeProvider>
          <NightFX />
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
