'use client';

import { useState, useMemo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { TrendingUp, Wallet, Calendar, Percent, Info } from 'lucide-react';

export default function WealthCalculator() {
    // --- 상태 관리 ---
    const [initialPrincipal, setInitialPrincipal] = useState(10000000);
    const [monthlyContribution, setMonthlyContribution] = useState(500000);
    const [years, setYears] = useState(10);
    const [annualRate, setAnnualRate] = useState(9.0);
    const [inflationRate, setInflationRate] = useState(2.3);
    const [applyTax, setApplyTax] = useState(true);
    const [applyInflation, setApplyInflation] = useState(false);

    // --- 계산 로직 (차트 데이터 생성 포함) ---
    const { result, yearlyData } = useMemo(() => {
        let currentBalance = initialPrincipal;
        let totalPrincipal = initialPrincipal;

        const data = [];

        data.push({
            year: 0,
            principal: initialPrincipal,
            interest: 0,
            total: initialPrincipal,
        });

        const monthlyRate = annualRate / 100 / 12;

        for (let year = 1; year <= years; year++) {
            for (let month = 1; month <= 12; month++) {
                const interest = currentBalance * monthlyRate;
                currentBalance += interest;
                currentBalance += monthlyContribution;
                totalPrincipal += monthlyContribution;
            }

            const rawInterest = currentBalance - totalPrincipal;
            const tax = applyTax ? rawInterest * 0.154 : 0;
            let netBalance = currentBalance - tax;
            let netInterest = rawInterest - tax;
            let netPrincipal = totalPrincipal;

            if (applyInflation) {
                const discountFactor = Math.pow(1 + inflationRate / 100, year);
                netBalance = netBalance / discountFactor;
                netPrincipal = totalPrincipal / discountFactor;
                netInterest = netBalance - netPrincipal;
            }

            data.push({
                year,
                principal: netPrincipal,
                interest: netInterest,
                total: netBalance,
            });
        }

        const lastData = data[data.length - 1];

        return {
            yearlyData: data,
            result: {
                totalPrincipal: lastData.principal,
                finalInterest: lastData.interest,
                finalAmount: lastData.total,
                yieldRate: ((lastData.total - lastData.principal) / lastData.principal) * 100
            }
        };
    }, [initialPrincipal, monthlyContribution, years, annualRate, inflationRate, applyTax, applyInflation]);

    // 화폐 포맷팅
    const formatMoney = (val: number) =>
        new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(Math.round(val));

    // 입력용 포맷팅 (천단위 콤마)
    const formatNumberInput = (val: number) => val ? val.toLocaleString('ko-KR') : '';
    const parseNumberInput = (val: string) => {
        const num = val.replace(/,/g, '');
        return num === '' ? 0 : Number(num);
    };

    // 차트 최대 높이 계산용 (Y축 스케일)
    const maxChartValue = yearlyData[yearlyData.length - 1].total * 1.1;

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation />
            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* 페이지 헤더 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/10 mb-4">
                        <TrendingUp className="w-8 h-8 text-[var(--primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">자산 성장 시뮬레이터</h1>
                    <p className="text-[var(--muted-foreground)]">
                        초기 투자금과 적립금으로 자산이 얼마나 성장하는지 확인하세요
                    </p>
                </div>

                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-6">
                    {/* --- 입력 폼 --- */}
                    <div className="space-y-6 bg-[var(--secondary)] p-6 rounded-xl border border-[var(--border)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1 block">
                                    <Wallet className="w-4 h-4 inline mr-1" />
                                    초기 투자금
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={formatNumberInput(initialPrincipal)}
                                    onChange={(e) => setInitialPrincipal(parseNumberInput(e.target.value))}
                                    className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none text-right"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1 block">
                                    <Wallet className="w-4 h-4 inline mr-1" />
                                    매월 적립금
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={formatNumberInput(monthlyContribution)}
                                    onChange={(e) => setMonthlyContribution(parseNumberInput(e.target.value))}
                                    className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none text-right"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1 block">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    기간 (년)
                                </label>
                                <input
                                    type="number"
                                    value={years || ''}
                                    onChange={(e) => setYears(e.target.value === '' ? 0 : Number(e.target.value))}
                                    className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none text-right"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1 block">
                                    <Percent className="w-4 h-4 inline mr-1" />
                                    연 수익률(%)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={annualRate || ''}
                                    onChange={(e) => setAnnualRate(e.target.value === '' ? 0 : Number(e.target.value))}
                                    className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-blue-600 dark:text-blue-400 font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-right"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1 block">
                                    <Info className="w-4 h-4 inline mr-1" />
                                    물가상승(%)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={inflationRate || ''}
                                    onChange={(e) => setInflationRate(e.target.value === '' ? 0 : Number(e.target.value))}
                                    className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-right"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2 justify-center">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={applyTax}
                                    onChange={(e) => setApplyTax(e.target.checked)}
                                    className="accent-[var(--primary)] w-4 h-4"
                                />
                                <span className="text-sm text-[var(--foreground)]">이자 과세 (15.4%)</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={applyInflation}
                                    onChange={(e) => setApplyInflation(e.target.checked)}
                                    className="accent-red-500 w-4 h-4"
                                />
                                <span className="text-sm text-[var(--foreground)]">물가상승 반영</span>
                            </label>
                        </div>
                    </div>

                    {/* --- 차트 영역 --- */}
                    <div className="mt-8">
                        <h3 className="text-sm font-bold text-[var(--muted-foreground)] mb-4">연도별 자산 추이</h3>
                        <div className="relative h-64 border-b border-l border-[var(--border)] flex items-end justify-between px-2 gap-1 md:gap-2">
                            {yearlyData.map((data, index) => {
                                const heightPercent = (data.total / maxChartValue) * 100;
                                const principalPercent = data.total > 0 ? (data.principal / data.total) * 100 : 0;
                                const interestPercent = 100 - principalPercent;
                                const showLabel = years > 20 ? index % 5 === 0 : true;

                                return (
                                    <div
                                        key={data.year}
                                        className="relative flex-1 flex flex-col justify-end group"
                                        style={{ height: `${heightPercent}%` }}
                                    >
                                        {/* 툴팁 */}
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[var(--foreground)] text-[var(--background)] text-xs rounded py-1 px-2 whitespace-nowrap z-10 shadow-lg pointer-events-none">
                                            <div className="font-bold">{data.year}년차</div>
                                            <div>총액: {formatMoney(data.total)}</div>
                                            <div className="opacity-70">원금: {formatMoney(data.principal)}</div>
                                            <div className="text-yellow-400">수익: {formatMoney(data.interest)}</div>
                                        </div>

                                        {/* 막대 그래프 */}
                                        <div className="w-full h-full rounded-t-sm overflow-hidden flex flex-col-reverse shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-[var(--secondary)]">
                                            <div style={{ height: `${principalPercent}%` }} className="bg-[var(--primary)]/40 w-full transition-all duration-500"></div>
                                            <div style={{ height: `${interestPercent}%` }} className="bg-[var(--primary)] w-full transition-all duration-500"></div>
                                        </div>

                                        {/* X축 라벨 */}
                                        {showLabel && (
                                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] text-[var(--muted-foreground)] whitespace-nowrap">
                                                {data.year === 0 ? '시작' : `${data.year}년`}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* --- 최종 결과 요약 --- */}
                    <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col items-center">
                        <p className="text-[var(--muted-foreground)] text-sm mb-1">{years}년 후 예상 수령액</p>
                        <div className="text-4xl font-extrabold text-[var(--primary)] mb-2">
                            {formatMoney(result.finalAmount)}
                        </div>
                        <div className="flex gap-4 text-sm">
                            <span className="text-[var(--muted-foreground)]">원금: {formatMoney(result.totalPrincipal)}</span>
                            <span className="text-[var(--primary)] font-bold">수익: +{formatMoney(result.finalInterest)}</span>
                        </div>
                        <div className="mt-2 text-xs text-[var(--muted-foreground)]">
                            총 수익률: <span className={result.yieldRate > 0 ? "text-red-500" : "text-blue-500"}>{result.yieldRate.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                {/* 페이지 설명 섹션 */}
                <div className="bg-[var(--secondary)] p-4 rounded-xl text-sm text-[var(--muted-foreground)] leading-relaxed border border-[var(--border)]">
                    <h3 className="text-base font-bold text-[var(--foreground)] mb-2">자산 성장 시뮬레이터 설명</h3>
                    <p className="mb-2">
                        초기 투자금, 매월 적립금, 연 수익률, 기간을 입력하면 월복리로 자산이 얼마나 커지는지 시뮬레이션합니다.
                        세금(이자과세 15.4%)과 물가상승률 적용 여부를 선택해 실질 구매력 기준 결과도 확인할 수 있습니다.
                    </p>
                    <p className="text-xs">
                        그래프는 연도별 총액을 원금(연한 색)과 수익(진한 색)으로 나누어 보여주며,
                        툴팁으로 각 연도의 세부 금액을 확인할 수 있습니다.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
