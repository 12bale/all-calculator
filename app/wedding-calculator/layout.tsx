import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '예식 비용 계산기 - 웨딩홀, 스드메, 축의금 견적 | 재테크 계산',
  description: '웨딩홀, 스드메, 예물, 신혼여행까지 총 예식 비용과 축의금 차감 후 실제 부담액을 계산하세요. 결혼 준비 필수 도구.',
  keywords: '예식 비용 계산기, 웨딩 견적, 스드메, 축의금, 결혼 비용, 웨딩홀, 신혼여행',
  openGraph: {
    title: '예식 비용 계산기 | 재테크 계산',
    description: '결혼 예식 총 비용과 실제 부담액을 계산하세요',
    url: 'https://www.allcalculator.co.kr/wedding-calculator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.allcalculator.co.kr/wedding-calculator',
  },
};

export default function WeddingCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
