'use client';

import { useState, useMemo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { TrendingUp, Target, Calendar, DollarSign, Sparkles } from 'lucide-react';

export default function DividendReinvestCalculator() {
    // 입력 값 상태
    const [initialInvestment, setInitialInvestment] = useState<string>('10000000');
    const [initialInvestmentDisplay, setInitialInvestmentDisplay] = useState<string>('10,000,000');
    const [monthlyContribution, setMonthlyContribution] = useState<string>('1000000');
    const [monthlyContributionDisplay, setMonthlyContributionDisplay] = useState<string>('1,000,000');
    const [dividendYield, setDividendYield] = useState<string>('4');
    const [dividendGrowthRate, setDividendGrowthRate] = useState<string>('8');
    const [investmentYears, setInvestmentYears] = useState<string>('10');
    const [targetMonthlyIncome, setTargetMonthlyIncome] = useState<string>('3000000');
    const [targetMonthlyIncomeDisplay, setTargetMonthlyIncomeDisplay] = useState<string>('3,000,000');

    // 콤마 포맷팅 헬퍼
    const formatWithComma = (value: string) => {
        const num = parseFloat(value.replace(/,/g, ''));
        if (isNaN(num)) return value;
        return num.toLocaleString('ko-KR');
    };

    const handleInputChange = (
        value: string,
        setDisplay: (v: string) => void,
        setRaw: (v: string) => void
    ) => {
        const raw = value.replace(/,/g, '');
        if (raw === '' || raw === '-') {
            setDisplay(raw);
            setRaw(raw);
            return;
        }
        const num = parseFloat(raw);
        if (!isNaN(num)) {
            setDisplay(num.toLocaleString('ko-KR'));
            setRaw(raw);
        }
    };

    // 시뮬레이션 계산
    const simulation = useMemo(() => {
        const initial = parseFloat(initialInvestment) || 0;
        const monthly = parseFloat(monthlyContribution) || 0;
        const yield_ = (parseFloat(dividendYield) || 0) / 100;
        const growth = (parseFloat(dividendGrowthRate) || 0) / 100;
        const years = parseInt(investmentYears) || 10;
        const targetIncome = parseFloat(targetMonthlyIncome) || 0;

        const yearlyData: {
            year: number;
            totalAsset: number;
            totalAssetWithoutReinvest: number;
            yearlyDividend: number;
            monthlyDividend: number;
            totalInvested: number;
            currentYield: number;
        }[] = [];

        let currentAsset = initial;
        let currentAssetWithoutReinvest = initial;
        let currentYield = yield_;
        let freedomYear: number | null = null;
        let freedomMonth: number | null = null;

        for (let year = 1; year <= years; year++) {
            // 매월 적립 (12개월)
            const yearlyContribution = monthly * 12;

            // 연간 배당금 계산 (배당 재투자 포함)
            const yearlyDividend = currentAsset * currentYield;

            // 배당 재투자 포함 자산
            currentAsset = currentAsset + yearlyContribution + yearlyDividend;

            // 배당 재투자 미포함 자산 (비교용)
            currentAssetWithoutReinvest = currentAssetWithoutReinvest + yearlyContribution;

            // 월 배당금
            const monthlyDividend = yearlyDividend / 12;

            // 경제적 자유 달성 시점 체크
            if (freedomYear === null && monthlyDividend >= targetIncome) {
                freedomYear = year;
                // 더 정확한 월 계산
                const prevYearAsset = yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].totalAsset : initial;
                const prevMonthlyDividend = yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].monthlyDividend : (initial * yield_) / 12;
                const monthlyGrowth = (monthlyDividend - prevMonthlyDividend) / 12;
                for (let m = 1; m <= 12; m++) {
                    const estimatedMonthly = prevMonthlyDividend + monthlyGrowth * m;
                    if (estimatedMonthly >= targetIncome) {
                        freedomMonth = m;
                        break;
                    }
                }
                if (freedomMonth === null) freedomMonth = 12;
            }

            yearlyData.push({
                year,
                totalAsset: currentAsset,
                totalAssetWithoutReinvest: currentAssetWithoutReinvest,
                yearlyDividend,
                monthlyDividend,
                totalInvested: initial + yearlyContribution * year,
                currentYield: currentYield * 100,
            });

            // 다음 해 배당률 증가
            currentYield = currentYield * (1 + growth);
        }

        const finalData = yearlyData[yearlyData.length - 1];
        const totalInvested = initial + monthly * 12 * years;
        const totalDividendEarned = yearlyData.reduce((sum, d) => sum + d.yearlyDividend, 0);
        const compoundEffect = finalData ? finalData.totalAsset - finalData.totalAssetWithoutReinvest : 0;

        return {
            yearlyData,
            finalAsset: finalData?.totalAsset || initial,
            finalMonthlyDividend: finalData?.monthlyDividend || 0,
            totalInvested,
            totalDividendEarned,
            compoundEffect,
            freedomYear,
            freedomMonth,
            isGoalAchievable: freedomYear !== null,
        };
    }, [initialInvestment, monthlyContribution, dividendYield, dividendGrowthRate, investmentYears, targetMonthlyIncome]);

    const formatMoney = (num: number) => {
        if (num >= 100000000) {
            return `${(num / 100000000).toFixed(1)}억`;
        } else if (num >= 10000) {
            return `${Math.round(num / 10000).toLocaleString()}만`;
        }
        return num.toLocaleString();
    };

    const formatMoneyFull = (num: number) => Math.round(num).toLocaleString();

    // 프리셋
    const presets = [
        { label: '직장인 기본', initial: '10000000', monthly: '500000', yield_: '4', growth: '8', years: '20' },
        { label: '공격적 투자', initial: '30000000', monthly: '2000000', yield_: '5', growth: '10', years: '15' },
        { label: '은퇴 준비', initial: '100000000', monthly: '3000000', yield_: '3.5', growth: '7', years: '10' },
        { label: 'SCHD 장기투자', initial: '20000000', monthly: '1000000', yield_: '3.5', growth: '12', years: '25' },
    ];

    const applyPreset = (preset: typeof presets[0]) => {
        setInitialInvestment(preset.initial);
        setInitialInvestmentDisplay(formatWithComma(preset.initial));
        setMonthlyContribution(preset.monthly);
        setMonthlyContributionDisplay(formatWithComma(preset.monthly));
        setDividendYield(preset.yield_);
        setDividendGrowthRate(preset.growth);
        setInvestmentYears(preset.years);
    };

    // 그래프 최대값 계산
    const maxAsset = Math.max(...simulation.yearlyData.map(d => d.totalAsset), 1);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation />
            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* 페이지 헤더 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/10 mb-4">
                        <TrendingUp className="w-8 h-8 text-[var(--primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">배당 재투자 시뮬레이터</h1>
                    <p className="text-[var(--muted-foreground)]">
                        배당금을 재투자하면 미래 자산이 얼마나 불어날까요?
                    </p>
                </div>

                {/* 프리셋 버튼 */}
                <div className="mb-6">
                    <p className="text-xs text-[var(--muted-foreground)] mb-2">빠른 설정</p>
                    <div className="flex flex-wrap gap-2">
                        {presets.map((preset, idx) => (
                            <button
                                key={idx}
                                onClick={() => applyPreset(preset)}
                                className="text-xs px-3 py-1.5 bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--foreground)] rounded-full transition-colors"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 입력 영역 */}
                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-6">
                    <h3 className="font-bold text-[var(--foreground)] mb-4">투자 조건 설정</h3>

                    <div className="space-y-4">
                        {/* 초기 투자금 */}
                        <div>
                            <label className="text-sm font-bold text-[var(--muted-foreground)] mb-2 block">
                                초기 투자금 (시드머니)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={initialInvestmentDisplay}
                                    onChange={(e) => handleInputChange(e.target.value, setInitialInvestmentDisplay, setInitialInvestment)}
                                    className="w-full p-4 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none text-right text-xl font-bold bg-[var(--background)] text-[var(--foreground)] pr-12"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">원</span>
                            </div>
                        </div>

                        {/* 월 적립 금액 */}
                        <div>
                            <label className="text-sm font-bold text-[var(--muted-foreground)] mb-2 block">
                                월 적립 금액
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={monthlyContributionDisplay}
                                    onChange={(e) => handleInputChange(e.target.value, setMonthlyContributionDisplay, setMonthlyContribution)}
                                    className="w-full p-4 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none text-right text-xl font-bold bg-[var(--background)] text-[var(--foreground)] pr-12"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">원</span>
                            </div>
                        </div>

                        {/* 배당 수익률 & 배당 성장률 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold text-[var(--muted-foreground)] mb-2 block">
                                    예상 배당 수익률
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={dividendYield}
                                        onChange={(e) => setDividendYield(e.target.value.replace(/[^0-9.]/g, ''))}
                                        className="w-full p-4 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none text-right text-xl font-bold bg-[var(--background)] text-[var(--foreground)] pr-12"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">%</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-[var(--muted-foreground)] mb-2 block">
                                    배당 성장률 (연)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={dividendGrowthRate}
                                        onChange={(e) => setDividendGrowthRate(e.target.value.replace(/[^0-9.]/g, ''))}
                                        className="w-full p-4 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none text-right text-xl font-bold bg-[var(--background)] text-[var(--foreground)] pr-12"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">%</span>
                                </div>
                            </div>
                        </div>

                        {/* 투자 기간 */}
                        <div>
                            <label className="text-sm font-bold text-[var(--muted-foreground)] mb-2 block">
                                투자 기간
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={investmentYears}
                                    onChange={(e) => setInvestmentYears(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="w-full p-4 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none text-right text-xl font-bold bg-[var(--background)] text-[var(--foreground)] pr-12"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">년</span>
                            </div>
                        </div>

                        {/* 목표 월 소득 */}
                        <div>
                            <label className="text-sm font-bold text-[var(--muted-foreground)] mb-2 block">
                                목표 월 배당 소득 (경제적 자유 기준)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={targetMonthlyIncomeDisplay}
                                    onChange={(e) => handleInputChange(e.target.value, setTargetMonthlyIncomeDisplay, setTargetMonthlyIncome)}
                                    className="w-full p-4 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none text-right text-xl font-bold bg-[var(--background)] text-[var(--foreground)] pr-12"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">원</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 핵심 결과 대시보드 */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg mb-6 text-white">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5" />
                        <h3 className="font-bold">{investmentYears}년 후 예상 결과</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                            <p className="text-sm text-white/80 mb-1">미래의 월 배당금</p>
                            <p className="text-2xl font-extrabold">
                                {formatMoney(simulation.finalMonthlyDividend)}원
                            </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                            <p className="text-sm text-white/80 mb-1">총 자산</p>
                            <p className="text-2xl font-extrabold">
                                {formatMoney(simulation.finalAsset)}원
                            </p>
                        </div>
                    </div>

                    {/* 경제적 자유 달성 시점 */}
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5" />
                            <p className="font-bold">경제적 자유 달성 시점</p>
                        </div>
                        {simulation.isGoalAchievable ? (
                            <p className="text-lg">
                                목표 월 {formatMoney(parseFloat(targetMonthlyIncome))}원까지{' '}
                                <span className="text-2xl font-extrabold">
                                    {simulation.freedomYear}년 {simulation.freedomMonth}개월
                                </span>
                            </p>
                        ) : (
                            <p className="text-lg">
                                {investmentYears}년 내 목표 달성이 어렵습니다. 투자 기간을 늘리거나 적립금을 올려보세요.
                            </p>
                        )}
                    </div>
                </div>

                {/* 상세 수치 */}
                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-6">
                    <h3 className="font-bold text-[var(--foreground)] mb-4">투자 분석</h3>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-[var(--secondary)] p-4 rounded-xl">
                            <p className="text-xs text-[var(--muted-foreground)] mb-1">총 투자 원금</p>
                            <p className="text-lg font-bold text-[var(--foreground)]">
                                {formatMoneyFull(simulation.totalInvested)}원
                            </p>
                        </div>
                        <div className="bg-[var(--secondary)] p-4 rounded-xl">
                            <p className="text-xs text-[var(--muted-foreground)] mb-1">누적 배당금</p>
                            <p className="text-lg font-bold text-[var(--foreground)]">
                                {formatMoneyFull(simulation.totalDividendEarned)}원
                            </p>
                        </div>
                    </div>

                    {/* 복리 효과 강조 */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <p className="font-bold text-purple-700 dark:text-purple-300">배당 재투자 복리 효과</p>
                        </div>
                        <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">
                            배당금을 재투자하지 않았다면 자산은{' '}
                            <span className="font-bold">{formatMoneyFull(simulation.yearlyData[simulation.yearlyData.length - 1]?.totalAssetWithoutReinvest || 0)}원</span>
                        </p>
                        <p className="text-lg font-extrabold text-purple-700 dark:text-purple-300">
                            복리로 <span className="text-2xl">+{formatMoney(simulation.compoundEffect)}원</span> 추가 수익!
                        </p>
                    </div>
                </div>

                {/* 자산 성장 그래프 */}
                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-6">
                    <h3 className="font-bold text-[var(--foreground)] mb-4">자산 성장 그래프</h3>

                    <div className="relative h-64 mb-4">
                        {/* Y축 라벨 */}
                        <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-[var(--muted-foreground)]">
                            <span>{formatMoney(maxAsset)}</span>
                            <span>{formatMoney(maxAsset / 2)}</span>
                            <span>0</span>
                        </div>

                        {/* 그래프 영역 */}
                        <div className="absolute left-16 right-0 top-0 bottom-8 border-l border-b border-[var(--border)]">
                            {/* 배당 재투자 포함 (곡선) */}
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* 원금 + 적립금만 (직선) */}
                                <polyline
                                    fill="none"
                                    stroke="#94a3b8"
                                    strokeWidth="0.5"
                                    strokeDasharray="2,2"
                                    points={simulation.yearlyData.map((d, i) => {
                                        const x = ((i + 1) / simulation.yearlyData.length) * 100;
                                        const y = 100 - (d.totalAssetWithoutReinvest / maxAsset) * 100;
                                        return `${x},${y}`;
                                    }).join(' ')}
                                />
                                {/* 배당 재투자 포함 */}
                                <polyline
                                    fill="none"
                                    stroke="#22c55e"
                                    strokeWidth="1"
                                    points={simulation.yearlyData.map((d, i) => {
                                        const x = ((i + 1) / simulation.yearlyData.length) * 100;
                                        const y = 100 - (d.totalAsset / maxAsset) * 100;
                                        return `${x},${y}`;
                                    }).join(' ')}
                                />
                            </svg>
                        </div>

                        {/* X축 라벨 */}
                        <div className="absolute left-16 right-0 bottom-0 h-8 flex justify-between items-center text-xs text-[var(--muted-foreground)] px-2">
                            <span>1년</span>
                            <span>{Math.ceil(simulation.yearlyData.length / 2)}년</span>
                            <span>{simulation.yearlyData.length}년</span>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-0.5 bg-green-500"></div>
                            <span className="text-[var(--muted-foreground)]">배당 재투자</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-0.5 bg-slate-400 border-dashed border-t"></div>
                            <span className="text-[var(--muted-foreground)]">원금만</span>
                        </div>
                    </div>
                </div>

                {/* 연도별 상세 */}
                <div className="bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden">
                    <div className="p-4 bg-[var(--secondary)] border-b border-[var(--border)]">
                        <h3 className="font-bold text-[var(--foreground)]">연도별 상세 내역</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border)]">
                                    <th className="p-3 text-left text-[var(--muted-foreground)]">년차</th>
                                    <th className="p-3 text-right text-[var(--muted-foreground)]">총 자산</th>
                                    <th className="p-3 text-right text-[var(--muted-foreground)]">연 배당금</th>
                                    <th className="p-3 text-right text-[var(--muted-foreground)]">월 배당금</th>
                                </tr>
                            </thead>
                            <tbody>
                                {simulation.yearlyData.map((data) => (
                                    <tr key={data.year} className="border-b border-[var(--border)] last:border-0">
                                        <td className="p-3 font-bold text-[var(--foreground)]">{data.year}년</td>
                                        <td className="p-3 text-right text-[var(--foreground)]">{formatMoney(data.totalAsset)}원</td>
                                        <td className="p-3 text-right text-green-600 dark:text-green-400">{formatMoney(data.yearlyDividend)}원</td>
                                        <td className="p-3 text-right font-bold text-green-700 dark:text-green-300">{formatMoney(data.monthlyDividend)}원</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 참고 정보 */}
                <div className="mt-6 bg-[var(--secondary)] p-4 rounded-xl">
                    <p className="text-xs text-[var(--muted-foreground)]">
                        * 본 시뮬레이션은 배당금 재투자와 배당 성장을 가정한 예상치입니다.<br />
                        * 실제 수익은 시장 상황, 세금, 수수료 등에 따라 달라질 수 있습니다.<br />
                        * SCHD 과거 10년 배당 성장률: 약 11~12%, 배당 수익률: 약 3~4%
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
