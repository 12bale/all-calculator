import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '연봉 실수령액 계산기 - 4대보험, 세금 공제 후 월급 | 전부 계산',
  description: '2024년 최신 기준 연봉 실수령액을 계산하세요. 4대보험(국민연금, 건강보험, 고용보험, 산재보험)과 소득세를 공제한 실제 월급을 확인할 수 있습니다.',
  keywords: '연봉 계산기, 실수령액, 월급 계산, 4대보험, 세금 계산, 소득세, 국민연금, 건강보험',
  openGraph: {
    title: '연봉 실수령액 계산기 | 전부 계산',
    description: '4대보험과 세금을 공제한 실제 월급을 계산하세요',
    url: 'https://www.allcalculator.co.kr/salary-calculator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.allcalculator.co.kr/salary-calculator',
  },
};

export default function SalaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
