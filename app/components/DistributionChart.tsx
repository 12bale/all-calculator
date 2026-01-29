"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatAmount } from "@/lib/calculator";

// Chart.js 플러그인 등록 (한 번만 실행)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DistributionChartProps {
  userValue: number; // 만원 단위
  percentile: number; // 0-100
  median: number;
  tierColor: string;
  type: "netWorth" | "salary";
  ageGroup: string;
}

// 정규분포 함수 (표준편차 기반)
function normalDistribution(x: number, mean: number, stdDev: number): number {
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

export default function DistributionChart({
  userValue,
  percentile,
  median,
  tierColor,
  type,
  ageGroup,
}: DistributionChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  // 분포 데이터 생성
  const { labels, data, userIndex, userY } = useMemo(() => {
    // 중위값을 기준으로 표준편차 추정 (IQR 기반)
    const stdDev = median * 0.8; // 대략적인 표준편차 추정
    const mean = median * 1.1; // 평균은 중위값보다 약간 높음 (우측 꼬리)

    // X축 범위 설정 (음수 자산 포함)
    const minX = type === "netWorth" ? -median * 0.5 : 0;
    const maxX = median * 5;
    const step = (maxX - minX) / 50;

    const labels: string[] = [];
    const data: number[] = [];

    for (let x = minX; x <= maxX; x += step) {
      labels.push(formatAmount(Math.round(x)));
      // 로그 정규분포에 가까운 형태로 조정
      const y = normalDistribution(x, mean, stdDev);
      data.push(y * 10000); // 스케일 조정
    }

    // 사용자 위치 찾기
    let closestIndex = 0;
    let closestDistance = Infinity;
    for (let i = 0; i < labels.length; i++) {
      const xValue = minX + i * step;
      const distance = Math.abs(xValue - userValue);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    return {
      labels,
      data,
      userIndex: closestIndex,
      userY: data[closestIndex],
    };
  }, [userValue, median, type]);

  // 차트 데이터
  const chartData = {
    labels,
    datasets: [
      {
        label: `${ageGroup} ${type === "netWorth" ? "순자산" : "연봉"} 분포`,
        data,
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "나의 위치",
        data: data.map((_, i) => (i === userIndex ? userY : null)),
        pointRadius: data.map((_, i) => (i === userIndex ? 12 : 0)),
        pointBackgroundColor: tierColor,
        pointBorderColor: "#fff",
        pointBorderWidth: 3,
        pointHoverRadius: 14,
        showLine: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          title: () => "",
          label: function (context: { datasetIndex: number; dataIndex: number }) {
            if (context.datasetIndex === 1 && context.dataIndex === userIndex) {
              return [
                `나의 ${type === "netWorth" ? "순자산" : "연봉"}: ${formatAmount(userValue)}`,
                `상위 ${(100 - percentile).toFixed(1)}%`,
              ];
            }
            return "";
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          display: true,
          maxTicksLimit: 5,
          color: "var(--muted-foreground)",
          font: { size: 10 },
          callback: function (_: unknown, index: number) {
            // 5개 정도만 레이블 표시
            if (index % Math.floor(labels.length / 4) === 0) {
              return labels[index];
            }
            return "";
          },
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--muted-foreground)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
