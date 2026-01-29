"use client";

import { useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { TierResult, formatCurrency, tierList, dataSource } from "@/lib/data";
import TierBadge from "./TierBadge";
import {
  TrendingUp,
  Wallet,
  BarChart3,
  Share2,
  RefreshCw,
  Users,
  MessageCircle,
  Lightbulb,
  Info,
  Download,
  Check,
  Loader2,
  Activity,
  FileText,
} from "lucide-react";

// 동적 임포트로 DistributionChart 로드 (SSR 비활성화)
const DistributionChart = dynamic(() => import("./DistributionChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
    </div>
  ),
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

interface ResultCardProps {
  result: TierResult;
  onReset: () => void;
  onShowReport: () => void;
}

export default function ResultCard({ result, onReset, onShowReport }: ResultCardProps) {
  const resultRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 이미지로 저장
  const handleSaveImage = useCallback(async () => {
    if (!captureRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 600,
      });

      // 다운로드
      const link = document.createElement("a");
      link.download = `wealth-tier-${result.combinedTier.tierEn.toLowerCase()}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("이미지 저장 실패:", error);
      alert("이미지 저장에 실패했습니다.");
    } finally {
      setIsCapturing(false);
    }
  }, [result.combinedTier.tierEn, isCapturing]);

  // 텍스트 공유
  const handleShareText = async () => {
    const shareText = `나의 자산 티어: ${result.combinedTier.tier}

${result.ageGroup} 기준 상위 ${(100 - result.combinedPercentile).toFixed(1)}%

순자산: ${formatCurrency(result.netWorth)} (상위 ${(100 - result.netWorthPercentile).toFixed(1)}%)
연봉: ${formatCurrency(result.salary)} (상위 ${(100 - result.salaryPercentile).toFixed(1)}%)

#자산티어 #WealthTier #재테크`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "나의 자산 티어 결과",
          text: shareText,
        });
        return;
      } catch {
        // 공유 취소 또는 실패 시 클립보드로 폴백
      }
    }

    await navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 비교 차트 데이터
  const comparisonChartData = {
    labels: ["순자산", "연봉"],
    datasets: [
      {
        label: "나",
        data: [result.netWorth, result.salary],
        backgroundColor: result.combinedTier.color,
        borderRadius: 8,
      },
      {
        label: `${result.ageGroup} 중위값`,
        data: [
          result.comparisonData.medianNetWorth,
          result.comparisonData.medianSalary,
        ],
        backgroundColor: "rgba(156, 163, 175, 0.4)",
        borderRadius: 8,
      },
    ],
  };

  const comparisonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "var(--foreground)",
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: { dataset: { label?: string }; raw: unknown }) {
            const value = context.raw as number;
            return `${context.dataset.label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "var(--muted-foreground)" },
      },
      y: {
        grid: { color: "rgba(156, 163, 175, 0.2)" },
        ticks: {
          color: "var(--muted-foreground)",
          callback: function (value: string | number) {
            const numValue = typeof value === "string" ? parseFloat(value) : value;
            if (numValue >= 10000) return `${(numValue / 10000).toFixed(0)}억`;
            return `${(numValue / 1000).toFixed(0)}천만`;
          },
        },
      },
    },
  };

  // 백분위 도넛 차트
  const percentileChartData = {
    labels: ["나", "나머지"],
    datasets: [
      {
        data: [100 - result.combinedPercentile, result.combinedPercentile],
        backgroundColor: [result.combinedTier.color, "rgba(156, 163, 175, 0.15)"],
        borderWidth: 0,
        cutout: "78%",
      },
    ],
  };

  const percentileChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div ref={resultRef} className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* 캡처 영역 시작 */}
      <div
        ref={captureRef}
        className="space-y-6 bg-[var(--background)] p-1 rounded-2xl"
      >
        {/* 메인 티어 카드 */}
        <div
          className="relative overflow-hidden rounded-2xl p-6 md:p-8 shadow-2xl border border-[var(--border)]"
          style={{
            background: `linear-gradient(135deg, var(--card) 0%, var(--card) 60%, ${result.combinedTier.color}15 100%)`,
          }}
        >
          {/* 배경 장식 */}
          <div
            className="absolute top-0 right-0 w-64 h-64 opacity-10 blur-3xl"
            style={{ background: result.combinedTier.color }}
          />

          <div className="relative text-center space-y-6">
            <div className="space-y-2">
              <p className="text-[var(--muted-foreground)] text-sm font-medium">
                {result.ageGroup} 기준 종합 티어
              </p>
              <TierBadge tier={result.combinedTier} size="xl" animated />
            </div>

            {/* 도넛 차트 */}
            <div className="relative w-44 h-44 mx-auto">
              <Doughnut data={percentileChartData} options={percentileChartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p
                  className="text-4xl font-black"
                  style={{ color: result.combinedTier.color }}
                >
                  {(100 - result.combinedPercentile).toFixed(1)}
                  <span className="text-lg">%</span>
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">상위</p>
              </div>
            </div>

            <p className="text-[var(--card-foreground)] font-medium">
              {result.combinedTier.description}
            </p>
          </div>
        </div>

        {/* 분석 코멘트 카드 */}
        <div className="bg-[var(--card)] rounded-xl p-5 shadow-lg border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2.5 rounded-xl"
              style={{ backgroundColor: `${result.combinedTier.color}20` }}
            >
              <MessageCircle className="w-5 h-5" style={{ color: result.combinedTier.color }} />
            </div>
            <h3 className="font-bold text-lg text-[var(--card-foreground)]">분석 코멘트</h3>
          </div>
          <div className="space-y-4">
            {result.comments.netWorth && (
              <div className="p-4 bg-[var(--secondary)] rounded-xl border-l-4 border-[var(--primary)]">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-sm font-semibold text-[var(--card-foreground)]">
                    순자산 티어: {result.netWorthTier.tier}
                  </span>
                </div>
                <p className="text-[var(--card-foreground)] leading-relaxed">
                  {result.comments.netWorth}
                </p>
              </div>
            )}
            {result.comments.salary && (
              <div className="p-4 bg-[var(--secondary)] rounded-xl border-l-4 border-[var(--accent)]">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-sm font-semibold text-[var(--card-foreground)]">
                    연봉 티어: {result.salaryTier.tier}
                  </span>
                </div>
                <p className="text-[var(--card-foreground)] leading-relaxed">
                  {result.comments.salary}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 상세 분석 리포트 버튼 */}
        <div className="bg-[var(--card)] rounded-xl p-5 shadow-lg border border-[var(--border)] text-center">
          <button
            onClick={onShowReport}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-lg shadow-md transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FileText className="w-5 h-5" />
            <span>상세 분석 리포트 보기</span>
          </button>
          <p className="mt-3 text-xs text-[var(--muted-foreground)]">
            AI가 분석한 내 자산 수준과 맞춤 전략을 확인해보세요.
          </p>
        </div>

        {/* 정규분포 차트 - 순자산 */}
        <div className="bg-[var(--card)] rounded-xl p-5 shadow-lg border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-[var(--primary)]/10 rounded-xl">
              <Activity className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[var(--card-foreground)]">순자산 분포</h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                빨간 점이 나의 위치입니다
              </p>
            </div>
          </div>
          <div className="h-48">
            <DistributionChart
              userValue={result.netWorth}
              percentile={result.netWorthPercentile}
              median={result.comparisonData.medianNetWorth}
              tierColor={result.netWorthTier.color}
              type="netWorth"
              ageGroup={result.ageGroup}
            />
          </div>
        </div>

        {/* 정규분포 차트 - 연봉 */}
        <div className="bg-[var(--card)] rounded-xl p-5 shadow-lg border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-[var(--accent)]/10 rounded-xl">
              <Activity className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[var(--card-foreground)]">연봉 분포</h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                빨간 점이 나의 위치입니다
              </p>
            </div>
          </div>
          <div className="h-48">
            <DistributionChart
              userValue={result.salary}
              percentile={result.salaryPercentile}
              median={result.comparisonData.medianSalary}
              tierColor={result.salaryTier.color}
              type="salary"
              ageGroup={result.ageGroup}
            />
          </div>
        </div>

        {/* 상세 정보 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 순자산 카드 */}
          <div className="bg-[var(--card)] rounded-xl p-5 shadow-lg border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
                <Wallet className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--card-foreground)]">순자산</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--card-foreground)]">
                  {formatCurrency(result.netWorth)}
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: result.netWorthTier.color }}
                >
                  상위 {(100 - result.netWorthPercentile).toFixed(1)}%
                </p>
              </div>
              <TierBadge tier={result.netWorthTier} size="sm" showLabel={false} />
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">중위값</span>
                <span className="font-medium text-[var(--card-foreground)]">
                  {formatCurrency(result.comparisonData.medianNetWorth)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">평균</span>
                <span className="font-medium text-[var(--card-foreground)]">
                  {formatCurrency(result.comparisonData.averageNetWorth)}
                </span>
              </div>
            </div>
          </div>

          {/* 연봉 카드 */}
          <div className="bg-[var(--card)] rounded-xl p-5 shadow-lg border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <h3 className="font-semibold text-[var(--card-foreground)]">연봉</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--card-foreground)]">
                  {formatCurrency(result.salary)}
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: result.salaryTier.color }}
                >
                  상위 {(100 - result.salaryPercentile).toFixed(1)}%
                </p>
              </div>
              <TierBadge tier={result.salaryTier} size="sm" showLabel={false} />
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">중위값</span>
                <span className="font-medium text-[var(--card-foreground)]">
                  {formatCurrency(result.comparisonData.medianSalary)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">평균</span>
                <span className="font-medium text-[var(--card-foreground)]">
                  {formatCurrency(result.comparisonData.averageSalary)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 인사이트 섹션 */}
        <div
          className="rounded-xl p-5 shadow-lg border border-[var(--border)]"
          style={{
            background: `linear-gradient(135deg, ${result.combinedTier.color}10 0%, ${result.combinedTier.color}05 100%)`,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2.5 rounded-xl"
              style={{ backgroundColor: `${result.combinedTier.color}20` }}
            >
              <Lightbulb className="w-5 h-5" style={{ color: result.combinedTier.color }} />
            </div>
            <h3 className="font-bold text-lg text-[var(--card-foreground)]">
              {result.ageGroup} 인사이트
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-[var(--card-foreground)] leading-relaxed">
              {result.insight.general}
            </p>
            <div className="p-4 bg-[var(--card)] rounded-xl border border-[var(--border)]">
              <p className="text-sm">
                <span
                  className="font-bold"
                  style={{ color: result.combinedTier.color }}
                >
                  TIP:
                </span>{" "}
                <span className="text-[var(--card-foreground)]">{result.insight.tip}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 비교 차트 */}
        <div className="bg-[var(--card)] rounded-xl p-5 shadow-lg border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--secondary)] rounded-lg">
              <BarChart3 className="w-5 h-5 text-[var(--secondary-foreground)]" />
            </div>
            <h3 className="font-semibold text-[var(--card-foreground)]">
              {result.ageGroup} 중위값과 비교
            </h3>
          </div>
          <div className="h-64">
            <Bar data={comparisonChartData} options={comparisonChartOptions} />
          </div>
        </div>

        {/* 전체 티어 */}
        <div className="bg-[var(--card)] rounded-xl p-5 shadow-lg border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--secondary)] rounded-lg">
              <Users className="w-5 h-5 text-[var(--secondary-foreground)]" />
            </div>
            <h3 className="font-semibold text-[var(--card-foreground)]">전체 티어 시스템</h3>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {tierList.map((tier) => (
              <div
                key={tier.tier}
                className={`p-3 rounded-xl text-center transition-all duration-300 ${
                  tier.tier === result.combinedTier.tier
                    ? "ring-2 ring-offset-2 scale-110 shadow-lg"
                    : "opacity-50 hover:opacity-70"
                }`}
                style={{
                  // @ts-expect-error ringColor is a valid CSS custom property
                  "--tw-ring-color": tier.tier === result.combinedTier.tier ? tier.color : undefined,
                  backgroundColor:
                    tier.tier === result.combinedTier.tier ? `${tier.color}15` : undefined,
                }}
              >
                <TierBadge tier={tier} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 캡처 영역 끝 */}

      {/* 공유 버튼들 */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={handleSaveImage}
          disabled={isCapturing}
          className="py-3 px-4 bg-[var(--primary)] text-[var(--primary-foreground)]
            font-semibold rounded-xl hover:opacity-90 transition-all duration-200
            flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {isCapturing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">{isCapturing ? "저장 중..." : "이미지 저장"}</span>
        </button>
        <button
          onClick={handleShareText}
          className="py-3 px-4 bg-[var(--accent)] text-[var(--accent-foreground)]
            font-semibold rounded-xl hover:opacity-90 transition-all duration-200
            flex items-center justify-center gap-2 shadow-lg"
        >
          {isCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          <span className="hidden sm:inline">{isCopied ? "복사됨!" : "공유하기"}</span>
        </button>
        <button
          onClick={onReset}
          className="py-3 px-4 bg-[var(--secondary)] text-[var(--secondary-foreground)]
            font-semibold rounded-xl hover:bg-[var(--muted)] transition-all duration-200
            flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span className="hidden sm:inline">다시하기</span>
        </button>
      </div>

      {/* 데이터 출처 */}
      <div className="flex items-start gap-3 p-4 bg-[var(--secondary)] rounded-xl">
        <Info className="w-4 h-4 text-[var(--muted-foreground)] mt-0.5 flex-shrink-0" />
        <div className="text-xs text-[var(--muted-foreground)]">
          <p className="font-semibold mb-1">데이터 출처</p>
          <p>{dataSource.name}</p>
          <p>기준연도: {dataSource.year}</p>
          <p className="mt-2 text-[10px] leading-relaxed">
            * 본 결과는 통계 데이터를 기반으로 한 추정치이며, 실제 개인의 재정 상황과 다를 수
            있습니다. 재미로만 참고해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
