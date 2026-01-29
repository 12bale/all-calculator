'use client';

import React, { useState, useMemo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { TrendingDown, Info, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RealRateCalculator() {
    // 상태 관리
    const [nominalRate, setNominalRate] = useState<number>(5.0); // 명목금리 (예: 예금 금리)
    const [inflationRate, setInflationRate] = useState<number>(3.0); // 물가상승률

    // 실질금리 계산 (피셔 방정식 적용)
    const result = useMemo(() => {
        // 공식: (1 + 명목) / (1 + 물가) - 1
        const realRateDecimal =
            (1 + nominalRate / 100) / (1 + inflationRate / 100) - 1;

        // 단순 차감 계산 (비교용)
        const simpleDiff = nominalRate - inflationRate;

        return {
            realRate: (realRateDecimal * 100).toFixed(2), // 소수점 2자리
            simpleDiff: simpleDiff.toFixed(2),
            purchasingPowerRetained: (100 / (1 + inflationRate / 100)).toFixed(1), // 구매력 보존율
        };
    }, [nominalRate, inflationRate]);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation />
            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* 페이지 헤더 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/10 mb-4">
                        <TrendingDown className="w-8 h-8 text-[var(--primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">실질금리 계산기</h1>
                    <p className="text-[var(--muted-foreground)]">
                        인플레이션을 감안한 내 자산의 진짜 수익률
                    </p>
                </div>

                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-6">
                    {/* 입력 영역 */}
                    <div className="space-y-5">
                        <div>
                            <label className="flex justify-between text-sm font-medium text-[var(--foreground)] mb-1">
                                <span>명목금리 (은행/채권 금리)</span>
                                <span className="text-[var(--primary)] font-bold">{nominalRate}%</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="20"
                                step="0.1"
                                value={nominalRate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNominalRate(Number(e.target.value))}
                                className="w-full h-2 bg-[var(--primary)]/20 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                            />
                        </div>

                        <div>
                            <label className="flex justify-between text-sm font-medium text-[var(--foreground)] mb-1">
                                <span>물가상승률 (인플레이션)</span>
                                <span className="text-red-500 font-bold">{inflationRate}%</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="20"
                                step="0.1"
                                value={inflationRate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInflationRate(Number(e.target.value))}
                                className="w-full h-2 bg-red-500/20 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                        </div>
                    </div>

                    {/* 결과 영역 */}
                    <div className="mt-8 bg-[var(--secondary)] rounded-xl p-5 border border-[var(--border)]">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[var(--foreground)] font-medium">실질 금리</span>
                            <div className="text-right">
                                <span
                                    className={`text-3xl font-bold ${Number(result.realRate) > 0 ? 'text-green-500' : 'text-red-500'}`}
                                >
                                    {result.realRate}%
                                </span>
                            </div>
                        </div>

                        {/* 시각화 바 */}
                        <div className="relative h-4 bg-[var(--muted)] rounded-full overflow-hidden mb-2">
                            {/* 전체 바 (명목금리 기준 100%로 잡았을 때 시각적 비율 - 단순 예시용) */}
                            <div
                                className="absolute top-0 left-0 h-full bg-[var(--primary)]"
                                style={{ width: '100%' }}
                            />
                            {/* 인플레이션 잠식 부분 */}
                            <div
                                className="absolute top-0 right-0 h-full bg-red-400 opacity-80"
                                style={{
                                    width: `${Math.min((inflationRate / nominalRate) * 100, 100)}%`,
                                    display: nominalRate > 0 ? 'block' : 'none'
                                }}
                            />
                        </div>

                        <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
                            <span>수익 구간 (파랑)</span>
                            <span>물가 잠식 (빨강)</span>
                        </div>

                        <hr className="my-4 border-[var(--border)]" />

                        {/* 인사이트 텍스트 */}
                        <div className="text-sm text-[var(--foreground)] leading-relaxed">
                            {Number(result.realRate) <= 0 ? (
                                <div className="flex items-center gap-2 text-red-500 font-bold mb-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    자산 가치가 하락 중입니다.
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-green-500 font-bold mb-2">
                                    <CheckCircle className="w-4 h-4" />
                                    자산 가치가 상승 중입니다.
                                </div>
                            )}
                            <p className="text-[var(--muted-foreground)]">
                                명목상으로는 {nominalRate}% 수익이지만, 물가가 {inflationRate}% 올라서
                                실제 구매력은 <span className="font-bold text-[var(--foreground)]">{result.realRate}%</span>만큼만 증가했습니다.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 실질금리 설명 섹션 */}
                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-[var(--primary)]" />
                        <h3 className="font-bold text-[var(--foreground)]">실질금리란?</h3>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-3">
                        명목금리에서 물가상승률을 차감한 실제 구매력 기준 수익률입니다.
                        예금이나 채권에 투자할 때 인플레이션을 고려한 진짜 수익을 알 수 있습니다.
                    </p>
                    <div className="text-xs text-[var(--muted-foreground)] space-y-2">
                        <div className="flex items-start gap-2">
                            <span className="text-[var(--primary)]">•</span>
                            <span><strong className="text-[var(--foreground)]">피셔 방정식:</strong> (1+명목금리)/(1+물가상승률) - 1</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-[var(--primary)]">•</span>
                            <span>실질금리가 마이너스면 돈의 가치가 감소하는 것입니다</span>
                        </div>
                    </div>
                </div>

                {/* 물가상승률 설명 섹션 */}
                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingDown className="w-5 h-5 text-orange-500" />
                        <h3 className="font-bold text-[var(--foreground)]">인플레이션(물가상승률)이란?</h3>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-3">
                        시간이 지나면서 물건과 서비스의 가격이 전반적으로 오르는 현상입니다.
                        같은 돈으로 살 수 있는 물건이 줄어들어 화폐의 구매력이 떨어집니다.
                    </p>
                    <div className="text-xs text-[var(--muted-foreground)] space-y-2">
                        <div className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span><strong className="text-[var(--foreground)]">측정 방법:</strong> 소비자물가지수(CPI)로 측정합니다</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span><strong className="text-[var(--foreground)]">예시:</strong> 작년에 1만원이던 피자가 올해 1만3백원이면 3% 상승</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span><strong className="text-[var(--foreground)]">적정 수준:</strong> 2~3%가 경제 성장에 이상적입니다</span>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
