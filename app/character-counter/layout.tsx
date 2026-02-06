import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '글자 수 세기 - 바이트, SMS/LMS 계산기 | 재테크 계산',
  description: '글자 수(공백 포함/제외), 바이트 용량, SMS/LMS 건수를 계산합니다. 자소서 작성, 문자 발송 시 필요한 글자 수를 쉽게 확인하세요.',
  keywords: '글자 수 세기, 바이트 계산기, SMS 글자수, LMS 글자수, 자소서 글자수, 문자 글자수',
  openGraph: {
    title: '글자 수 세기 | 재테크 계산',
    description: '글자 수, 바이트, SMS/LMS 건수를 쉽게 계산하세요',
    url: 'https://www.allcalculator.co.kr/character-counter',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.allcalculator.co.kr/character-counter',
  },
};

export default function CharacterCounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
