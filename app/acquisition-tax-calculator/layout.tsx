import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '부동산 취득세 계산기 - 주택 매매 취득세 자동 계산 | 재테크 계산',
  description: '주택 매매가격과 보유 주택 수를 입력하면 취득세, 농어촌특별세, 지방교육세를 자동으로 계산합니다. 조정대상지역 여부에 따른 중과세율도 확인하세요.',
  keywords: '취득세 계산기, 부동산 취득세, 주택 취득세, 다주택 취득세, 조정대상지역, 농어촌특별세, 지방교육세',
  openGraph: {
    title: '부동산 취득세 계산기 | 재테크 계산',
    description: '주택 매매 시 내야 할 취득세를 간편하게 계산하세요',
    url: 'https://www.allcalculator.co.kr/acquisition-tax-calculator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.allcalculator.co.kr/acquisition-tax-calculator',
  },
};

export default function AcquisitionTaxCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
