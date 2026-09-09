import Navbar from "@/components/navbar";
import ScrollProgress from "@/components/scroll-progress";
import BackToTop from "@/components/back-to-top";
import VisitorTracker from "@/components/visitor-tracker";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getPortfolioData } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolioData();
  const name = profile?.name || "Srikanta Panigrahy";
  const url = profile?.url || "https://srikantapanigrahy.com";
  const avatarUrl = profile?.avatarUrl || "/srikanta-panigrahy.png";
  const description =
    profile?.description ||
    `${name} is a Full Stack Developer specializing in React, Node.js, and MongoDB.`;

  return {
    metadataBase: new URL(url),
    title: {
      default: `${name} | Full Stack Developer`,
      template: `%s | ${name}`,
    },
    description,
    keywords: [
      name,
      "Full Stack Developer",
      "React Developer",
      "Node.js Developer",
      "MERN Stack Developer",
      "Odisha developer",
      "Software Engineer",
      "Portfolio",
    ],
    alternates: { canonical: url },
    authors: [{ name, url }],
    creator: name,
    publisher: name,
    category: "technology",
    applicationName: `${name} Portfolio`,
    openGraph: {
      title: `${name} | Full Stack Developer`,
      description,
      url,
      siteName: name,
      locale: "en_US",
      type: "website",
      images: [{ url: avatarUrl, width: 1200, height: 630, alt: name }],
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
      title: `${name} | Full Stack Developer`,
      description,
      card: "summary_large_image",
      images: [avatarUrl],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
      yandex: "",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profile } = await getPortfolioData();
  const name = profile?.name || "Srikanta Panigrahy";
  const url = profile?.url || "https://srikantapanigrahy.com";
  const avatarUrl = profile?.avatarUrl || "/srikanta-panigrahy.png";
  const socials = profile?.socials || [];

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: "Full Stack Developer",
    description: `${name} is a Full Stack Developer specializing in React, Node.js, and MongoDB, focused on building scalable, efficient, and impactful web applications.`,
    url,
    image: `${url}${avatarUrl}`,
    sameAs: socials.map((s) => s.url).filter((u) => u && u !== "#"),
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
            <ScrollProgress />
            <div className="relative z-10 max-w-2xl mx-auto py-12 pb-24 sm:py-24 px-6">
              {children}
            </div>
            <BackToTop />
            <Navbar socials={socials} />
          </TooltipProvider>
        </ThemeProvider>
        <VisitorTracker />
        <Analytics />
      </body>
    </html>
  );
}
