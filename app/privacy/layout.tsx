import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 재테크 계산',
  description: '재테크 계산의 개인정보처리방침입니다. 사용자의 개인정보 보호를 위한 정책을 안내합니다.',
  openGraph: {
    title: '개인정보처리방침 | 재테크 계산',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
