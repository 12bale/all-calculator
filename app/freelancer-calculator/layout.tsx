import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '프리랜서 세금 계산기 - 3.3% 원천징수 실수령액 | 재테크 계산',
  description: '프리랜서 수입에서 3.3% 원천징수 세금을 계산하고 실수령액을 확인하세요. 사업소득세와 지방소득세 자동 계산.',
  keywords: '프리랜서 세금, 3.3% 계산기, 원천징수, 실수령액, 사업소득세, 프리랜서 수입',
  openGraph: {
    title: '프리랜서 세금 계산기 | 재테크 계산',
    description: '3.3% 원천징수 후 실수령액을 계산하세요',
    url: 'https://www.allcalculator.co.kr/freelancer-calculator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.allcalculator.co.kr/freelancer-calculator',
  },
};

export default function FreelancerCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
