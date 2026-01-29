import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '청년 정책 맞춤 계산기 - 청년도약계좌, 소득세감면 혜택 | 재테크 계산',
  description: '나이와 소득만 입력하면 받을 수 있는 청년 정책 혜택을 한눈에! 청년도약계좌, 청년희망적금, 청년소득세감면, 청년내일채움공제 등 총 예상 혜택 금액을 계산해드립니다.',
  keywords: [
    '청년 정책',
    '청년도약계좌',
    '청년희망적금',
    '청년소득세감면',
    '청년내일채움공제',
    '청년 혜택',
    '청년 지원금',
    '청년 주거',
    '국가장학금',
  ],
  openGraph: {
    title: '청년 정책 맞춤 계산기 | 재테크 계산',
    description: '나이와 소득을 입력하면 받을 수 있는 청년 정책 혜택 총액을 계산해드립니다.',
  },
};

export default function YouthPolicyCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
