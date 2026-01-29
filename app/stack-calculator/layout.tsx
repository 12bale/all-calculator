import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '자산 성장 시뮬레이터 - 복리 계산, 배당 재투자 | 재테크 계산',
  description: '매월 적립금과 배당 재투자를 고려한 10년 뒤 자산 가치를 계산합니다. 물가상승률을 반영한 실질 수익률을 확인하세요.',
  keywords: '자산 성장, 복리 계산기, 배당 재투자, 투자 시뮬레이터, SCHD, 적립식 투자, 물가상승률',
  openGraph: {
    title: '자산 성장 시뮬레이터 | 재테크 계산',
    description: '복리와 배당 재투자로 자산이 얼마나 성장할지 계산하세요',
    url: 'https://www.allcalculator.co.kr/stack-calculator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.allcalculator.co.kr/stack-calculator',
  },
};

export default function StackCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
