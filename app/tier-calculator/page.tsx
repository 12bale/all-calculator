"use client";

import { useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import InputForm from "@/app/components/InputForm";
import ResultCard from "@/app/components/ResultCard";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import ReportModal from "@/app/components/ReportModal";
import { calculateTier, TierResult } from "@/lib/data";
import { generateAnalysisReport, AnalysisReport } from "@/lib/report";
import { useUserData } from "@/context/UserDataContext";

export default function TierCalculatorPage() {
  const [result, setResult] = useState<TierResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [showReport, setShowReport] = useState(false);
  const { setUserData } = useUserData();

  const handleSubmit = (data: { age: number; netWorth: number; salary: number }) => {
    setIsLoading(true);

    // 약간의 딜레이로 로딩 효과
    setTimeout(() => {
      const tierResult = calculateTier(data.age, data.netWorth, data.salary);
      setResult(tierResult);
      // Context에 사용자 데이터 저장
      setUserData(data);
      setIsLoading(false);
    }, 800);
  };

  const handleReset = () => {
    setResult(null);
    setReport(null);
    setShowReport(false);
  };

  const handleShowReport = () => {
    if (result) {
      const generatedReport = generateAnalysisReport(result.netWorth, 100 - result.combinedPercentile);
      setReport(generatedReport);
      setShowReport(true);
    }
  };

  const handleCloseReport = () => {
    setShowReport(false);
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!result ? (
          <>
            {/* Hero Section */}
            <section className="text-center mb-10 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--secondary)] rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-sm text-[var(--secondary-foreground)]">
                  로그인 없이 10초 만에 확인
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
                나의 자산 티어는?
              </h1>
              <p className="text-[var(--muted-foreground)] max-w-md mx-auto mb-2">
                대한민국 연령별 자산 및 연봉 데이터를 비교하여
                <br />
                나의 재정 상태를 티어로 확인해보세요
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                2024년 통계청/한국은행 데이터 기준
              </p>
            </section>

            {/* Input Form Section */}
            <section className="bg-[var(--card)] rounded-2xl p-6 md:p-8 shadow-xl border border-[var(--border)] animate-slide-up">
              <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </section>

            {/* Features Section */}
            <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "연령별 맞춤 비교",
                  description: "같은 나이대와 비교하여 정확한 위치 파악",
                },
                {
                  title: "종합 티어 시스템",
                  description: "자산과 소득을 종합한 6단계 티어",
                },
                {
                  title: "공유하기",
                  description: "결과를 친구들과 공유하고 비교해보세요",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-4 bg-[var(--card)] rounded-xl border border-[var(--border)]
                    hover:border-[var(--primary)] transition-colors duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ChevronRight className="w-4 h-4 text-[var(--primary)]" />
                    <h3 className="font-semibold text-[var(--card-foreground)]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </section>
          </>
        ) : (
          <ResultCard result={result} onReset={handleReset} onShowReport={handleShowReport} />
        )}
      </div>

      {showReport && <ReportModal report={report} onClose={handleCloseReport} />}

      {/* Footer */}
      <Footer />
    </main>
  );
}
