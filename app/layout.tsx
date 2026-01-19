import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] });

// 🛠️ 여기를 수정하세요
// export const metadata: Metadata = {
//   title: '모두의 계산기 | 금융, 연봉, 투자를 한 번에',
//   description: '복잡한 계산은 가라! 연봉 실수령액부터 투자 시뮬레이션까지, 누구나 쉽게 사용하는 필수 금융 계산기 모음.',
//   icons: {
//     icon: '/favicon.ico',
//   },
// };
export const metadata: Metadata = {
  title: '전부 계산 | 금융, 연봉, 투자를 한 번에',
  description: '복잡한 계산은 가라! 연봉 실수령액부터 투자 시뮬레이션까지, 누구나 쉽게 사용하는 필수 금융 계산기 모음.',
  keywords: '계산기, 연봉 계산, 금리 계산, 나이 계산, 전역일 계산, 세금 계산, 자산 성장',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: '전부 계산',
    description: '연봉, 금리, 투자, 나이 모든 것을 계산하세요',
    url: 'https://www.allcalculator.co.kr',
    type: 'website',
    images: [
      {
        url: 'https://www.allcalculator.co.kr/og-image.png',
        width: 1200,
        height: 630,
        alt: '전부 계산',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '전부 계산',
    description: '복잡한 계산은 저희에게 맡기세요',
  },
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1.0',
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 구조화된 데이터 (Schema.org) */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: '전부 계산',
              description: '일상의 모든 계산을 한 곳에서',
              url: 'https://www.allcalculator.co.kr',
            }),
          }}
        />
        {/* Google Search Console */}
        <meta name="google-site-verification" content="ca-pub-5682874697021791" />
      </head>
      <body className={inter.className}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5682874697021791"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}