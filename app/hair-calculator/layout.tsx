import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '미용실 정산 계산기 - 수수료, 재료비, 인센티브 | 전부 계산',
  description: '미용실 매출에서 수수료, 재료비, 인센티브, 인턴비를 공제한 정산 금액을 계산합니다. 미용사 월급 계산 도구.',
  keywords: '미용실 정산, 미용사 급여, 수수료 계산, 인센티브, 재료비, 미용실 매출',
  openGraph: {
    title: '미용실 정산 계산기 | 전부 계산',
    description: '미용실 매출 정산 금액을 계산하세요',
    url: 'https://www.allcalculator.co.kr/hair-calculator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.allcalculator.co.kr/hair-calculator',
  },
};

export default function HairCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
