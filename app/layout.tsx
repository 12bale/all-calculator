import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { UserDataProvider } from '@/context/UserDataContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: '재테크 계산 | 금융, 연봉, 투자, 자산 티어를 한 번에',
  description: '복잡한 계산은 가라! 연봉 실수령액, 자산 티어, 투자 시뮬레이션까지 누구나 쉽게 사용하는 필수 금융 계산기 모음.',
  keywords: [
    '계산기',
    '연봉 계산',
    '금리 계산',
    '나이 계산',
    '전역일 계산',
    '세금 계산',
    '자산 성장',
    '자산 티어',
    '자산 순위',
  ],
  authors: [{ name: '재테크 계산' }],
  creator: '재테크 계산',
  publisher: '재테크 계산',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: '재테크 계산',
    description: '연봉, 금리, 투자, 나이, 자산 티어 모든 것을 계산하세요',
    url: 'https://www.allcalculator.co.kr',
    type: 'website',
    locale: 'ko_KR',
    siteName: '재테크 계산',
    images: [
      {
        url: 'https://www.allcalculator.co.kr/og-image.png',
        width: 1200,
        height: 630,
        alt: '재테크 계산',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '재테크 계산',
    description: '복잡한 계산은 저희에게 맡기세요',
  },
  alternates: {
    canonical: '/',
  },
  category: 'finance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WTGGJ776');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Google tag (gtag.js) - GA4 */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-B691M5HP0M"
          strategy="afterInteractive"
        />
        <Script
          id="ga4-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-B691M5HP0M');`,
          }}
        />
        {/* End Google tag (gtag.js) */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="google-adsense-account" content="ca-pub-5682874697021791" />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: '재테크 계산',
              description: '일상의 모든 계산을 한 곳에서',
              url: 'https://www.allcalculator.co.kr',
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WTGGJ776"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5682874697021791"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <UserDataProvider>
          {children}
        </UserDataProvider>
      </body>
    </html>
  );
}
