import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '문의하기 | 재테크 계산',
  description: '재테크 계산 서비스 관련 문의, 계산기 요청, 버그 제보 등 언제든 연락해 주세요.',
  openGraph: {
    title: '문의하기 | 재테크 계산',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
