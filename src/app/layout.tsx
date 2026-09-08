import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: DATA.name,
  jobTitle: "Full Stack Developer",
  description: `${DATA.name} is a Full Stack Developer specializing in React, Next.js, Node.js, and MongoDB, focused on building scalable, efficient, and impactful web applications.`,
  url: DATA.url,
  image: `${DATA.url}${DATA.avatarUrl}`,
  sameAs: [
    DATA.contact.social.GitHub.url,
    DATA.contact.social.LinkedIn.url,
    DATA.contact.social.X.url,
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Odisha",
    addressRegion: "Odisha",
    addressCountry: "India",
  },
 knowsAbout: [
  "React.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "MySQL",
  "Java",
  "SQL",
  "JavaScript",
  "Full Stack Web Development",
  "REST APIs",
  "JWT Authentication",
  "Data Structures & Algorithms",
],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: `${DATA.name} | Full Stack Developer`,
    template: `%s | ${DATA.name}`,
  },
  description:
    `${DATA.name} is a Full Stack Developer specializing in React, Next.js, Node.js, and MongoDB, focused on building scalable, efficient, and impactful web applications.`,
  keywords: [
    DATA.name,
    "Srikanta Panigrahy",
    "Full Stack Developer",
    "React Developer",
    "Node.js Developer",
    "MERN Stack Developer",
    "Odisha developer",
    "Software Engineer",
    "Portfolio",
  ],
  alternates: {
    canonical: DATA.url,
  },
  authors: [{ name: DATA.name, url: DATA.url }],
  creator: DATA.name,
  publisher: DATA.name,
  category: "technology",
  applicationName: `${DATA.name} Portfolio`,
  openGraph: {
    title: `${DATA.name} | Full Stack Developer`,
    description:
      `${DATA.name} is a Full Stack Developer from Odisha, India, building modern web applications with React, Next.js, Node.js, MongoDB, and AI-powered products.`,
    url: DATA.url,
    siteName: `${DATA.name}`,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: DATA.avatarUrl,
        width: 1200,
        height: 630,
        alt: DATA.name,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${DATA.name} | Full Stack Developer`,
    description:
      `${DATA.name} is a Full Stack Developer from Odisha, India, building modern web applications with React, Next.js, Node.js, MongoDB, and AI-powered products.`,
    card: "summary_large_image",
    images: [DATA.avatarUrl],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    yandex: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased relative",
          geist.variable,
          geistMono.variable
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider delayDuration={0}>
            <div className="relative z-10 max-w-2xl mx-auto py-12 pb-24 sm:py-24 px-6">
              {children}
            </div>
            <Navbar />
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
