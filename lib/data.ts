// 대한민국 연령별 자산 및 연봉 통계 데이터 (2024-2025년 기준)
// 출처: 통계청 가계금융복지조사, 고용노동부 고용형태별근로실태조사
// 단위: 만원

import statsData from "@/data/stats.json";

export interface AgeGroupData {
  ageGroup: string;
  ageRange: [number, number];
  netWorthPercentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
  salaryPercentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
  averageNetWorth: number;
  averageSalary: number;
}

// JSON 데이터를 기반으로 연령대별 데이터 구성
export const ageGroupData: AgeGroupData[] = [
  {
    ageGroup: "20대",
    ageRange: [20, 29],
    netWorthPercentiles: {
      p10: -500,
      p25: statsData.ageGroups["20s"].cutlines.bronze.netWorth,
      p50: statsData.ageGroups["20s"].netWorth.top50,
      p75: statsData.ageGroups["20s"].cutlines.gold.netWorth,
      p90: statsData.ageGroups["20s"].cutlines.platinum.netWorth,
      p95: Math.round((statsData.ageGroups["20s"].cutlines.platinum.netWorth + statsData.ageGroups["20s"].cutlines.diamond.netWorth) / 2),
      p99: statsData.ageGroups["20s"].cutlines.diamond.netWorth,
    },
    salaryPercentiles: {
      p10: statsData.ageGroups["20s"].salary.top80,
      p25: statsData.ageGroups["20s"].cutlines.bronze.salary,
      p50: statsData.ageGroups["20s"].salary.top50,
      p75: statsData.ageGroups["20s"].cutlines.gold.salary,
      p90: statsData.ageGroups["20s"].cutlines.platinum.salary,
      p95: Math.round((statsData.ageGroups["20s"].cutlines.platinum.salary + statsData.ageGroups["20s"].cutlines.diamond.salary) / 2),
      p99: statsData.ageGroups["20s"].cutlines.diamond.salary,
    },
    averageNetWorth: statsData.ageGroups["20s"].netWorth.average,
    averageSalary: statsData.ageGroups["20s"].salary.average,
  },
  {
    ageGroup: "30대",
    ageRange: [30, 39],
    netWorthPercentiles: {
      p10: 500,
      p25: statsData.ageGroups["30s"].cutlines.bronze.netWorth,
      p50: statsData.ageGroups["30s"].netWorth.top50,
      p75: statsData.ageGroups["30s"].cutlines.gold.netWorth,
      p90: statsData.ageGroups["30s"].cutlines.platinum.netWorth,
      p95: Math.round((statsData.ageGroups["30s"].cutlines.platinum.netWorth + statsData.ageGroups["30s"].cutlines.diamond.netWorth) / 2),
      p99: statsData.ageGroups["30s"].cutlines.diamond.netWorth,
    },
    salaryPercentiles: {
      p10: statsData.ageGroups["30s"].salary.top80,
      p25: statsData.ageGroups["30s"].cutlines.bronze.salary,
      p50: statsData.ageGroups["30s"].salary.top50,
      p75: statsData.ageGroups["30s"].cutlines.gold.salary,
      p90: statsData.ageGroups["30s"].cutlines.platinum.salary,
      p95: Math.round((statsData.ageGroups["30s"].cutlines.platinum.salary + statsData.ageGroups["30s"].cutlines.diamond.salary) / 2),
      p99: statsData.ageGroups["30s"].cutlines.diamond.salary,
    },
    averageNetWorth: statsData.ageGroups["30s"].netWorth.average,
    averageSalary: statsData.ageGroups["30s"].salary.average,
  },
  {
    ageGroup: "40대",
    ageRange: [40, 49],
    netWorthPercentiles: {
      p10: 2000,
      p25: statsData.ageGroups["40s"].cutlines.bronze.netWorth,
      p50: statsData.ageGroups["40s"].netWorth.top50,
      p75: statsData.ageGroups["40s"].cutlines.gold.netWorth,
      p90: statsData.ageGroups["40s"].cutlines.platinum.netWorth,
      p95: Math.round((statsData.ageGroups["40s"].cutlines.platinum.netWorth + statsData.ageGroups["40s"].cutlines.diamond.netWorth) / 2),
      p99: statsData.ageGroups["40s"].cutlines.diamond.netWorth,
    },
    salaryPercentiles: {
      p10: statsData.ageGroups["40s"].salary.top80,
      p25: statsData.ageGroups["40s"].cutlines.bronze.salary,
      p50: statsData.ageGroups["40s"].salary.top50,
      p75: statsData.ageGroups["40s"].cutlines.gold.salary,
      p90: statsData.ageGroups["40s"].cutlines.platinum.salary,
      p95: Math.round((statsData.ageGroups["40s"].cutlines.platinum.salary + statsData.ageGroups["40s"].cutlines.diamond.salary) / 2),
      p99: statsData.ageGroups["40s"].cutlines.diamond.salary,
    },
    averageNetWorth: statsData.ageGroups["40s"].netWorth.average,
    averageSalary: statsData.ageGroups["40s"].salary.average,
  },
  {
    ageGroup: "50대 이상",
    ageRange: [50, 100],
    netWorthPercentiles: {
      p10: 5000,
      p25: statsData.ageGroups["50plus"].cutlines.bronze.netWorth,
      p50: statsData.ageGroups["50plus"].netWorth.top50,
      p75: statsData.ageGroups["50plus"].cutlines.gold.netWorth,
      p90: statsData.ageGroups["50plus"].cutlines.platinum.netWorth,
      p95: Math.round((statsData.ageGroups["50plus"].cutlines.platinum.netWorth + statsData.ageGroups["50plus"].cutlines.diamond.netWorth) / 2),
      p99: statsData.ageGroups["50plus"].cutlines.diamond.netWorth,
    },
    salaryPercentiles: {
      p10: statsData.ageGroups["50plus"].salary.top80,
      p25: statsData.ageGroups["50plus"].cutlines.bronze.salary,
      p50: statsData.ageGroups["50plus"].salary.top50,
      p75: statsData.ageGroups["50plus"].cutlines.gold.salary,
      p90: statsData.ageGroups["50plus"].cutlines.platinum.salary,
      p95: Math.round((statsData.ageGroups["50plus"].cutlines.platinum.salary + statsData.ageGroups["50plus"].cutlines.diamond.salary) / 2),
      p99: statsData.ageGroups["50plus"].cutlines.diamond.salary,
    },
    averageNetWorth: statsData.ageGroups["50plus"].netWorth.average,
    averageSalary: statsData.ageGroups["50plus"].salary.average,
  },
];

// 티어 정의 (JSON에서 가져오기)
export interface TierInfo {
  id: string;
  tier: string;
  tierEn: string;
  minPercentile: number;
  maxPercentile: number;
  color: string;
  gradient: string;
  className: string;
  icon: string;
  description: string;
}

export const tierList: TierInfo[] = statsData.tiers.map((tier) => ({
  id: tier.id,
  tier: tier.name,
  tierEn: tier.nameEn,
  minPercentile: tier.percentileMin,
  maxPercentile: tier.percentileMax,
  color: tier.color,
  gradient: tier.gradient,
  className: `tier-${tier.id}`,
  icon: tier.icon,
  description: `${tier.rank}`,
}));

export function getAgeGroup(age: number): AgeGroupData | null {
  return ageGroupData.find(
    (group) => age >= group.ageRange[0] && age <= group.ageRange[1]
  ) || null;
}

export function getAgeGroupKey(age: number): "20s" | "30s" | "40s" | "50plus" {
  if (age < 30) return "20s";
  if (age < 40) return "30s";
  if (age < 50) return "40s";
  return "50plus";
}

// 백분위 계산 함수 (선형 보간법 사용)
export function calculatePercentile(
  value: number,
  percentiles: { p10: number; p25: number; p50: number; p75: number; p90: number; p95: number; p99: number }
): number {
  const points = [
    { percentile: 0, value: percentiles.p10 * 0.3 },
    { percentile: 10, value: percentiles.p10 },
    { percentile: 25, value: percentiles.p25 },
    { percentile: 50, value: percentiles.p50 },
    { percentile: 75, value: percentiles.p75 },
    { percentile: 90, value: percentiles.p90 },
    { percentile: 95, value: percentiles.p95 },
    { percentile: 99, value: percentiles.p99 },
    { percentile: 100, value: percentiles.p99 * 1.5 },
  ];

  if (value <= points[0].value) {
    return 0;
  }

  if (value >= points[points.length - 1].value) {
    return 100;
  }

  for (let i = 0; i < points.length - 1; i++) {
    if (value >= points[i].value && value <= points[i + 1].value) {
      const range = points[i + 1].value - points[i].value;
      const position = value - points[i].value;
      const percentileRange = points[i + 1].percentile - points[i].percentile;
      return points[i].percentile + (position / range) * percentileRange;
    }
  }

  return 50;
}

export function getTierByPercentile(percentile: number): TierInfo {
  for (const tier of tierList) {
    if (percentile >= tier.minPercentile && percentile < tier.maxPercentile) {
      return tier;
    }
  }
  if (percentile >= 99) {
    return tierList[0];
  }
  return tierList[tierList.length - 1];
}

// 티어별 코멘트 가져오기
export function getTierComment(
  tierId: string,
  ageGroupKey: "20s" | "30s" | "40s" | "50plus",
  type: "asset" | "salary"
): string {
  const comments = statsData.tierComments[tierId as keyof typeof statsData.tierComments];
  if (!comments) return "";

  const ageComments = comments[ageGroupKey as keyof typeof comments];
  if (!ageComments) return "";

  const typeComments = ageComments[type as keyof typeof ageComments];
  if (!typeComments || !Array.isArray(typeComments)) return "";

  // 랜덤하게 코멘트 선택
  return typeComments[Math.floor(Math.random() * typeComments.length)];
}

// 연령대별 인사이트 가져오기
export function getAgeInsight(ageGroupKey: "20s" | "30s" | "40s" | "50plus"): { general: string; tip: string } {
  return statsData.insights[ageGroupKey];
}

export interface TierResult {
  age: number;
  ageGroup: string;
  ageGroupKey: "20s" | "30s" | "40s" | "50plus";
  netWorth: number;
  salary: number;
  netWorthPercentile: number;
  salaryPercentile: number;
  combinedPercentile: number;
  netWorthTier: TierInfo;
  salaryTier: TierInfo;
  combinedTier: TierInfo;
  comparisonData: {
    medianNetWorth: number;
    medianSalary: number;
    averageNetWorth: number;
    averageSalary: number;
  };
  comments: {
    netWorth: string;
    salary: string;
  };
  insight: {
    general: string;
    tip: string;
  };
}

export function calculateTier(
  age: number,
  netWorth: number,
  salary: number
): TierResult | null {
  const ageGroup = getAgeGroup(age);
  if (!ageGroup) return null;

  const ageGroupKey = getAgeGroupKey(age);

  const netWorthPercentile = calculatePercentile(
    netWorth,
    ageGroup.netWorthPercentiles
  );
  const salaryPercentile = calculatePercentile(
    salary,
    ageGroup.salaryPercentiles
  );

  // 종합 백분위: 자산 60%, 연봉 40% 가중치
  const combinedPercentile = netWorthPercentile * 0.6 + salaryPercentile * 0.4;

  const netWorthTier = getTierByPercentile(netWorthPercentile);
  const salaryTier = getTierByPercentile(salaryPercentile);
  const combinedTier = getTierByPercentile(combinedPercentile);

  return {
    age,
    ageGroup: ageGroup.ageGroup,
    ageGroupKey,
    netWorth,
    salary,
    netWorthPercentile: Math.round(netWorthPercentile * 10) / 10,
    salaryPercentile: Math.round(salaryPercentile * 10) / 10,
    combinedPercentile: Math.round(combinedPercentile * 10) / 10,
    netWorthTier,
    salaryTier,
    combinedTier,
    comparisonData: {
      medianNetWorth: ageGroup.netWorthPercentiles.p50,
      medianSalary: ageGroup.salaryPercentiles.p50,
      averageNetWorth: ageGroup.averageNetWorth,
      averageSalary: ageGroup.averageSalary,
    },
    comments: {
      netWorth: getTierComment(netWorthTier.id, ageGroupKey, "asset"),
      salary: getTierComment(salaryTier.id, ageGroupKey, "salary"),
    },
    insight: getAgeInsight(ageGroupKey),
  };
}

// 숫자 포맷팅 함수
export function formatCurrency(value: number): string {
  if (value >= 10000) {
    const billions = Math.floor(value / 10000);
    const millions = value % 10000;
    if (millions === 0) {
      return `${billions}억`;
    }
    return `${billions}억 ${millions.toLocaleString()}만`;
  }
  if (value < 0) {
    return `-${Math.abs(value).toLocaleString()}만원`;
  }
  return `${value.toLocaleString()}만원`;
}

export function formatCurrencyShort(value: number): string {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}억`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}천만`;
  }
  return `${value}만`;
}

// 데이터 소스 정보 내보내기
export const dataSource = statsData.source;
