import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '퍼센트 계산기 - 비율, 증감률, 할인율 계산 | 재테크 계산',
  description: '퍼센트 값 구하기, 비율 계산, 증감률 계산을 한 번에. 할인율, 부가세, 팁 계산 등 다양한 퍼센트 계산이 가능합니다.',
  keywords: '퍼센트 계산기, 비율 계산, 증감률, 할인율 계산, 부가세 계산, % 계산',
  openGraph: {
    title: '퍼센트 계산기 | 재테크 계산',
    description: '퍼센트, 비율, 증감률을 쉽게 계산하세요',
    url: 'https://www.allcalculator.co.kr/percent-calculator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.allcalculator.co.kr/percent-calculator',
  },
};

export default function PercentCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
