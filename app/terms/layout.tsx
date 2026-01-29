import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | 재테크 계산',
  description: '재테크 계산 서비스 이용약관입니다. 서비스 이용 전 반드시 확인해 주세요.',
  openGraph: {
    title: '이용약관 | 재테크 계산',
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
