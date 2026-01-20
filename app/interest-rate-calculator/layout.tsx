import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '실질 금리 계산기 - 물가상승률 반영 실제 이자 | 전부 계산',
  description: '명목금리에서 물가상승률을 차감한 실질금리를 계산하세요. 내 예금이 실제로 돈을 벌고 있는지 확인할 수 있습니다.',
  keywords: '실질금리, 금리 계산기, 물가상승률, 인플레이션, 예금 이자, 명목금리',
  openGraph: {
    title: '실질 금리 계산기 | 전부 계산',
    description: '물가상승률을 반영한 실제 이자 수익을 계산하세요',
    url: 'https://www.allcalculator.co.kr/interest-rate-calculator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.allcalculator.co.kr/interest-rate-calculator',
  },
};

export default function InterestRateCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
