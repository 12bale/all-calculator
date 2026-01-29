import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '나이 계산기 - 만나이, 띠, 별자리 계산 | 재테크 계산',
  description: '생년월일을 입력하면 만 나이, 세는 나이, 띠, 별자리, 살아온 날수를 한 번에 계산합니다. 2023년 만 나이 통일법 적용.',
  keywords: '나이 계산기, 만나이, 세는나이, 띠 계산, 별자리, 생년월일, 만나이 통일법',
  openGraph: {
    title: '나이 계산기 | 재테크 계산',
    description: '만 나이, 띠, 별자리를 한 번에 계산하세요',
    url: 'https://www.allcalculator.co.kr/age-calculator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.allcalculator.co.kr/age-calculator',
  },
};

export default function AgeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
