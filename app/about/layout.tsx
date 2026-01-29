import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '소개 | 재테크 계산',
  description: '재테크 계산은 연봉, 자산, 세금, 나이 등 일상에서 필요한 모든 계산기를 무료로 제공합니다. 복잡한 계산은 저희에게 맡기세요.',
  openGraph: {
    title: '소개 | 재테크 계산',
    description: '연봉, 자산, 세금, 나이 등 일상의 모든 계산을 한 곳에서 해결하세요.',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
