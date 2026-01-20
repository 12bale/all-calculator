import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '전역일 계산기 - D-Day, 진급일, 복무율 계산 | 전부 계산',
  description: '입대일을 입력하면 전역일 D-Day와 계급별 진급일(이병, 일병, 상병, 병장)을 자동으로 계산합니다. 육군, 해군, 공군, 해병대 지원.',
  keywords: '전역일 계산기, 군대 계산기, 진급일, D-Day, 육군, 해군, 공군, 해병대, 병장, 상병',
  openGraph: {
    title: '전역일 계산기 | 전부 계산',
    description: '입대일만 입력하면 전역일과 진급일을 알려드립니다',
    url: 'https://www.allcalculator.co.kr/army-calculator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.allcalculator.co.kr/army-calculator',
  },
};

export default function ArmyCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
