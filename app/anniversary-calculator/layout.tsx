import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '결혼기념일 계산기 - 주년, D-Day, 기념일 명칭 | 전부 계산',
  description: '결혼일을 입력하면 몇 주년인지, 다음 기념일까지 D-Day, 은혼식/금혼식 등 기념일 명칭을 알려드립니다.',
  keywords: '결혼기념일 계산기, 주년 계산, 은혼식, 금혼식, 기념일 D-Day, 부부 기념일',
  openGraph: {
    title: '결혼기념일 계산기 | 전부 계산',
    description: '결혼 몇 주년인지, 다음 기념일까지 며칠인지 계산하세요',
    url: 'https://www.allcalculator.co.kr/anniversary-calculator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.allcalculator.co.kr/anniversary-calculator',
  },
};

export default function AnniversaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
