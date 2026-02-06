import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ETF 배당금 역산 계산기 - 목표 배당금 달성에 필요한 투자금 계산",
  description:
    "JEPI, SCHD, TIGER 배당 등 인기 ETF의 목표 월배당금을 설정하고, 필요한 투자 수량과 총 자금을 역산해보세요. 배당 수익률 기반 투자 계획을 세울 수 있습니다.",
  keywords: [
    "ETF 계산기",
    "배당금 계산기",
    "JEPI",
    "SCHD",
    "배당 투자",
    "월배당",
    "배당 수익률",
    "투자 계획",
    "패시브 인컴",
    "배당 역산",
  ],
  openGraph: {
    title: "ETF 배당금 역산 계산기",
    description:
      "목표 배당금 달성에 필요한 ETF 수량과 투자금을 계산하세요",
    type: "website",
  },
  alternates: {
    canonical: "https://allcalculator.co.kr/etf-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
