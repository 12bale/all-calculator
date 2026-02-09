import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '단위 변환기 - 평/㎡, g/ml, 온도 변환 | 재테크 계산',
  description: '부동산 면적(평↔㎡), 요리 계량(g↔ml↔컵↔큰술), 길이, 무게, 온도 등 다양한 단위를 쉽게 변환하세요.',
  keywords: '단위변환, 평수계산, 평방미터, 요리계량, 그램, 밀리리터, 온도변환, 길이변환, 무게변환',
  openGraph: {
    title: '단위 변환기 | 재테크 계산',
    description: '부동산 면적, 요리 계량, 길이, 무게, 온도를 쉽게 변환하세요',
    url: 'https://www.allcalculator.co.kr/unit-converter',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.allcalculator.co.kr/unit-converter',
  },
};

export default function UnitConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
