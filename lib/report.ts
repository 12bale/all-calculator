import reportTemplates from "@/data/report-templates.json";

export interface AnalysisReport {
  title: string;
  content: string;
}

/**
 * 사용자의 자산과 백분위에 따라 상세 분석 리포트를 생성합니다.
 *
 * @param asset - 사용자의 총 순자산 (원).
 * @param percentile - 사용자의 자산이 속하는 상위 백분위 (%).
 * @returns 생성된 리포트의 제목과 HTML 내용.
 */
export function generateAnalysisReport(asset: number, percentile: number): AnalysisReport {
  let tier: 'top10' | 'top50' | 'below50';

  if (percentile <= 10) {
    tier = 'top10';
  } else if (percentile <= 50) {
    tier = 'top50';
  } else {
    tier = 'below50';
  }

  const template = reportTemplates[tier];

  const formattedAsset = new Intl.NumberFormat('ko-KR').format(asset);

  const content = template.content
    .replace(/\$\{percentile\}/g, percentile.toFixed(1))
    .replace(/\$\{asset\}/g, formattedAsset);

  return {
    title: template.title,
    content: content,
  };
}
