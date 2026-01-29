/**
 * 자산 티어 계산기 - 핵심 계산 로직
 *
 * 사용자가 입력한 나이와 순자산/연봉을 stats.json과 비교하여
 * 상위 n%를 선형 보간법으로 정밀하게 계산합니다.
 */

import statsData from "@/data/stats.json";

// 연령대 키 타입
export type AgeGroupKey = "20s" | "30s" | "40s" | "50plus";

// 금액 파싱 결과
export interface ParsedAmount {
  value: number; // 만원 단위로 변환된 값
  original: string; // 원본 입력값
  formatted: string; // 포맷된 표시값
}

// 백분위 계산 결과
export interface PercentileResult {
  percentile: number; // 백분위 (0-100)
  topPercent: number; // 상위 n% (100 - percentile)
  tier: string; // 티어 ID
  tierName: string; // 티어 한글명
  nearestCutline: {
    above: { label: string; value: number } | null; // 바로 위 커트라인
    below: { label: string; value: number } | null; // 바로 아래 커트라인
  };
  comparisonToMedian: number; // 중위값 대비 비율 (1.0 = 100%)
  comparisonToAverage: number; // 평균 대비 비율
}

/**
 * 금액 문자열을 만원 단위 숫자로 파싱
 *
 * 지원 형식:
 * - "1억" -> 10000
 * - "1억 5000만원" -> 15000
 * - "1.5억" -> 15000
 * - "5000만원" -> 5000
 * - "5000만" -> 5000
 * - "5000" -> 5000 (기본 만원 단위)
 * - "-5000" -> -5000 (마이너스 지원)
 * - "1억5천만" -> 15000
 * - "1억5천" -> 15000
 */
export function parseAmount(input: string): ParsedAmount {
  const original = input.trim();
  let value = 0;

  // 빈 문자열 체크
  if (!original) {
    return { value: 0, original, formatted: "0만원" };
  }

  // 마이너스 부호 처리
  const isNegative = original.startsWith("-") || original.startsWith("−");
  const cleanInput = original.replace(/^[-−]/, "").trim();

  // 콤마 제거
  const normalized = cleanInput.replace(/,/g, "");

  // 억 단위 처리
  const billionMatch = normalized.match(/(\d+(?:\.\d+)?)\s*억/);
  if (billionMatch) {
    value += parseFloat(billionMatch[1]) * 10000;
  }

  // 천만 단위 처리 (억 뒤에 오는 경우)
  const tenMillionMatch = normalized.match(/억\s*(\d+(?:\.\d+)?)\s*천/);
  if (tenMillionMatch) {
    value += parseFloat(tenMillionMatch[1]) * 1000;
  }

  // 만원 단위 처리 (억 뒤에 오는 경우, 천만이 아닌 경우)
  const millionAfterBillionMatch = normalized.match(/억\s*(\d+)\s*만/);
  if (millionAfterBillionMatch && !tenMillionMatch) {
    value += parseInt(millionAfterBillionMatch[1], 10);
  }

  // 억이 없는 경우의 처리
  if (!billionMatch) {
    // 천만 단위
    const standaloneTenMillionMatch = normalized.match(/(\d+(?:\.\d+)?)\s*천\s*만?/);
    if (standaloneTenMillionMatch) {
      value += parseFloat(standaloneTenMillionMatch[1]) * 1000;

      // 천 뒤의 추가 만원
      const additionalMillionMatch = normalized.match(/천\s*(\d+)\s*만?/);
      if (additionalMillionMatch && additionalMillionMatch[1] !== standaloneTenMillionMatch[1]) {
        value += parseInt(additionalMillionMatch[1], 10);
      }
    }
    // 만원 단위 (천만이 아닌 경우)
    else {
      const millionMatch = normalized.match(/(\d+(?:\.\d+)?)\s*만/);
      if (millionMatch) {
        value += parseFloat(millionMatch[1]);
      }
      // 숫자만 있는 경우 (만원 단위로 가정)
      else {
        const pureNumber = normalized.match(/^(\d+(?:\.\d+)?)$/);
        if (pureNumber) {
          value = parseFloat(pureNumber[1]);
        }
      }
    }
  }

  // 마이너스 적용
  if (isNegative) {
    value = -value;
  }

  // 포맷된 값 생성
  const formatted = formatAmount(value);

  return { value, original, formatted };
}

/**
 * 만원 단위 숫자를 읽기 쉬운 문자열로 포맷
 */
export function formatAmount(value: number): string {
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  if (absValue >= 10000) {
    const billions = Math.floor(absValue / 10000);
    const millions = Math.round(absValue % 10000);

    if (millions === 0) {
      return `${isNegative ? "-" : ""}${billions}억`;
    }
    return `${isNegative ? "-" : ""}${billions}억 ${millions.toLocaleString()}만원`;
  }

  if (absValue === 0) {
    return "0만원";
  }

  return `${isNegative ? "-" : ""}${absValue.toLocaleString()}만원`;
}

/**
 * 나이를 연령대 키로 변환
 */
export function getAgeGroupKey(age: number): AgeGroupKey {
  if (age < 30) return "20s";
  if (age < 40) return "30s";
  if (age < 50) return "40s";
  return "50plus";
}

/**
 * 연령대 레이블 반환
 */
export function getAgeGroupLabel(ageGroupKey: AgeGroupKey): string {
  return statsData.ageGroups[ageGroupKey].label;
}

/**
 * 선형 보간법을 사용한 정밀 백분위 계산
 *
 * @param value - 사용자 입력값 (만원 단위)
 * @param ageGroupKey - 연령대 키
 * @param type - "netWorth" (순자산) 또는 "salary" (연봉)
 * @returns 백분위 계산 결과
 */
export function calculatePercentile(
  value: number,
  ageGroupKey: AgeGroupKey,
  type: "netWorth" | "salary"
): PercentileResult {
  const ageData = statsData.ageGroups[ageGroupKey];
  const data = ageData[type];
  const cutlines = ageData.cutlines;

  // 커트라인 포인트 정의 (백분위, 값)
  // 상위 n% = 100 - 백분위
  const points: { percentile: number; value: number; label: string }[] = [
    { percentile: 99, value: cutlines.diamond[type], label: "상위 1% (다이아몬드)" },
    { percentile: 90, value: cutlines.platinum[type], label: "상위 10% (플래티넘)" },
    { percentile: 70, value: cutlines.gold[type], label: "상위 30% (골드)" },
    { percentile: 50, value: cutlines.silver[type], label: "상위 50% (실버)" },
    { percentile: 20, value: cutlines.bronze[type], label: "상위 80% (브론즈)" },
  ];

  // 추가 보간 포인트 (중위값, 평균 등)
  const median = data.median;
  const average = data.average;

  // 하위 극단값 추정 (브론즈 아래)
  const lowestEstimate = type === "netWorth"
    ? Math.min(cutlines.bronze[type] * 0.1, -1000) // 순자산은 마이너스 가능
    : cutlines.bronze[type] * 0.3; // 연봉은 최저임금 수준

  // 상위 극단값 추정 (다이아몬드 위)
  const highestEstimate = cutlines.diamond[type] * 2;

  // 전체 보간 포인트 (백분위 오름차순 정렬)
  const allPoints = [
    { percentile: 0, value: lowestEstimate, label: "최하위" },
    { percentile: 20, value: cutlines.bronze[type], label: "상위 80% (브론즈)" },
    { percentile: 50, value: median, label: "중위값" },
    { percentile: 70, value: cutlines.gold[type], label: "상위 30% (골드)" },
    { percentile: 90, value: cutlines.platinum[type], label: "상위 10% (플래티넘)" },
    { percentile: 99, value: cutlines.diamond[type], label: "상위 1% (다이아몬드)" },
    { percentile: 100, value: highestEstimate, label: "최상위" },
  ].sort((a, b) => a.value - b.value);

  // 선형 보간으로 백분위 계산
  let percentile: number = 50; // 기본값
  let nearestAbove: { label: string; value: number } | null = null;
  let nearestBelow: { label: string; value: number } | null = null;

  if (value <= allPoints[0].value) {
    // 최소값 이하
    percentile = 0;
    nearestAbove = { label: allPoints[1].label, value: allPoints[1].value };
  } else if (value >= allPoints[allPoints.length - 1].value) {
    // 최대값 이상
    percentile = 100;
    nearestBelow = { label: allPoints[allPoints.length - 2].label, value: allPoints[allPoints.length - 2].value };
  } else {
    // 구간 내 선형 보간
    for (let i = 0; i < allPoints.length - 1; i++) {
      const lower = allPoints[i];
      const upper = allPoints[i + 1];

      if (value >= lower.value && value <= upper.value) {
        // 선형 보간 공식
        const ratio = (value - lower.value) / (upper.value - lower.value);
        percentile = lower.percentile + ratio * (upper.percentile - lower.percentile);

        // 가장 가까운 커트라인 찾기
        if (upper.percentile <= 99) {
          nearestAbove = { label: upper.label, value: upper.value };
        }
        if (lower.percentile >= 20) {
          nearestBelow = { label: lower.label, value: lower.value };
        }
        break;
      }
    }
  }

  // 백분위 값 확인 (이미 기본값 설정됨)

  // 상위 n% 계산
  const topPercent = Math.max(0, Math.min(100, 100 - percentile));

  // 티어 결정
  const tier = getTierFromPercentile(percentile);

  // 중위값/평균 대비 비율
  const comparisonToMedian = median !== 0 ? value / median : 0;
  const comparisonToAverage = average !== 0 ? value / average : 0;

  return {
    percentile: Math.round(percentile * 100) / 100,
    topPercent: Math.round(topPercent * 100) / 100,
    tier: tier.id,
    tierName: tier.name,
    nearestCutline: {
      above: nearestAbove,
      below: nearestBelow,
    },
    comparisonToMedian: Math.round(comparisonToMedian * 1000) / 1000,
    comparisonToAverage: Math.round(comparisonToAverage * 1000) / 1000,
  };
}

/**
 * 백분위로부터 티어 결정
 */
function getTierFromPercentile(percentile: number): { id: string; name: string } {
  const tiers = statsData.tiers;

  for (const tier of tiers) {
    if (percentile >= tier.percentileMin && percentile < tier.percentileMax) {
      return { id: tier.id, name: tier.name };
    }
  }

  // 기본값
  if (percentile >= 99) return { id: "diamond", name: "다이아몬드" };
  return { id: "iron", name: "아이언" };
}

/**
 * 종합 티어 계산 (순자산 + 연봉)
 *
 * @param age - 나이
 * @param netWorthInput - 순자산 입력값 (문자열 또는 숫자)
 * @param salaryInput - 연봉 입력값 (문자열 또는 숫자)
 * @param weights - 가중치 { netWorth: 0.6, salary: 0.4 }
 */
export function calculateCombinedTier(
  age: number,
  netWorthInput: string | number,
  salaryInput: string | number,
  weights: { netWorth: number; salary: number } = { netWorth: 0.6, salary: 0.4 }
) {
  const ageGroupKey = getAgeGroupKey(age);
  const ageGroupLabel = getAgeGroupLabel(ageGroupKey);

  // 금액 파싱
  const netWorth = typeof netWorthInput === "string"
    ? parseAmount(netWorthInput)
    : { value: netWorthInput, original: String(netWorthInput), formatted: formatAmount(netWorthInput) };

  const salary = typeof salaryInput === "string"
    ? parseAmount(salaryInput)
    : { value: salaryInput, original: String(salaryInput), formatted: formatAmount(salaryInput) };

  // 각각의 백분위 계산
  const netWorthResult = calculatePercentile(netWorth.value, ageGroupKey, "netWorth");
  const salaryResult = calculatePercentile(salary.value, ageGroupKey, "salary");

  // 종합 백분위 (가중 평균)
  const combinedPercentile =
    netWorthResult.percentile * weights.netWorth +
    salaryResult.percentile * weights.salary;

  const combinedTopPercent = 100 - combinedPercentile;
  const combinedTier = getTierFromPercentile(combinedPercentile);

  // 해당 연령대 통계
  const ageData = statsData.ageGroups[ageGroupKey];

  return {
    input: {
      age,
      ageGroupKey,
      ageGroupLabel,
      netWorth,
      salary,
    },
    netWorth: netWorthResult,
    salary: salaryResult,
    combined: {
      percentile: Math.round(combinedPercentile * 100) / 100,
      topPercent: Math.round(combinedTopPercent * 100) / 100,
      tier: combinedTier.id,
      tierName: combinedTier.name,
    },
    statistics: {
      netWorth: {
        median: ageData.netWorth.median,
        average: ageData.netWorth.average,
      },
      salary: {
        median: ageData.salary.median,
        average: ageData.salary.average,
      },
    },
    weights,
  };
}

/**
 * 다음 티어까지 필요한 금액 계산
 */
export function getAmountToNextTier(
  currentValue: number,
  ageGroupKey: AgeGroupKey,
  type: "netWorth" | "salary"
): { nextTier: string; amountNeeded: number; formatted: string } | null {
  const cutlines = statsData.ageGroups[ageGroupKey].cutlines;

  const tierOrder = [
    { id: "bronze", value: cutlines.bronze[type] },
    { id: "silver", value: cutlines.silver[type] },
    { id: "gold", value: cutlines.gold[type] },
    { id: "platinum", value: cutlines.platinum[type] },
    { id: "diamond", value: cutlines.diamond[type] },
  ];

  for (const tier of tierOrder) {
    if (currentValue < tier.value) {
      const amountNeeded = tier.value - currentValue;
      return {
        nextTier: tier.id,
        amountNeeded,
        formatted: formatAmount(amountNeeded),
      };
    }
  }

  return null; // 이미 다이아몬드
}

// 테스트용 예시
export const examples = {
  parseAmount: [
    { input: "1억", expected: 10000 },
    { input: "1억 5000만원", expected: 15000 },
    { input: "1.5억", expected: 15000 },
    { input: "5000만원", expected: 5000 },
    { input: "5000", expected: 5000 },
    { input: "-5000만원", expected: -5000 },
    { input: "1억5천만", expected: 15000 },
    { input: "3억 2천만원", expected: 32000 },
  ],
};
