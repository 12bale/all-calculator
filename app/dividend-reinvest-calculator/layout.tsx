import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '배당 재투자 시뮬레이터 - 복리의 마법 | 재테크 계산',
  description: '배당금 재투자로 미래 자산이 얼마나 불어날까요? 초기 투자금, 월 적립금, 배당 수익률을 입력하면 경제적 자유 달성 시점을 계산합니다.',
  keywords: '배당 재투자, 복리 계산기, SCHD, 배당 성장, 경제적 자유, 월배당, 패시브인컴, 배당투자',
  openGraph: {
    title: '배당 재투자 시뮬레이터 | 재테크 계산',
    description: '배당금을 재투자하면 미래 자산이 얼마나 불어날까요?',
    url: 'https://www.allcalculator.co.kr/dividend-reinvest-calculator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.allcalculator.co.kr/dividend-reinvest-calculator',
  },
};

export default function DividendReinvestCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
