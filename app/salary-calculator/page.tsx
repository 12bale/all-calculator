'use client';

import { useState, useMemo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Calculator, TrendingUp, TrendingDown, Info } from 'lucide-react';

type CalculationMode = 'grossToNet' | 'netToGross';

export default function SalaryCalculator() {
    // --- 상태 관리 ---
    const [mode, setMode] = useState<CalculationMode>('grossToNet');

    // 입력값 1: 연봉 (Gross)
    const [preTaxYearly, setPreTaxYearly] = useState(60000000);
    const [preTaxYearlyInput, setPreTaxYearlyInput] = useState('60,000,000');

    // 입력값 2: 희망 월 실수령액 (Target Net)
    const [targetMonthlyNet, setTargetMonthlyNet] = useState(4000000);
    const [targetMonthlyNetInput, setTargetMonthlyNetInput] = useState('4,000,000');

    // 공통 설정
    const [nonTaxable, setNonTaxable] = useState(200000);
    const [nonTaxableInput, setNonTaxableInput] = useState('200,000');
    const [dependents, setDependents] = useState(1);
    const [dependentsInput, setDependentsInput] = useState('1');

    // 콤마 포맷팅 헬퍼 함수
    const formatWithComma = (value: number) => value.toLocaleString('ko-KR');
    const parseNumber = (value: string) => {
        const num = parseInt(value.replace(/,/g, ''), 10);
        return isNaN(num) ? null : num;
    };

    // 입력 핸들러
    const handlePreTaxYearlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, '');
        if (raw === '') {
            setPreTaxYearlyInput('');
            return;
        }
        const num = parseNumber(raw);
        if (num !== null) {
            setPreTaxYearlyInput(formatWithComma(num));
            setPreTaxYearly(num);
        }
    };

    const handleTargetMonthlyNetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, '');
        if (raw === '') {
            setTargetMonthlyNetInput('');
            return;
        }
        const num = parseNumber(raw);
        if (num !== null) {
            setTargetMonthlyNetInput(formatWithComma(num));
            setTargetMonthlyNet(num);
        }
    };

    const handleNonTaxableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, '');
        if (raw === '') {
            setNonTaxableInput('');
            return;
        }
        const num = parseNumber(raw);
        if (num !== null) {
            setNonTaxableInput(formatWithComma(num));
            setNonTaxable(num);
        }
    };

    const handleDependentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        if (raw === '') {
            setDependentsInput('');
            return;
        }
        const num = parseInt(raw, 10);
        if (!isNaN(num)) {
            setDependentsInput(raw);
            setDependents(num);
        }
    };

    // --- 1. 정방향 계산 함수 (연봉 -> 실수령) ---
    const calculateNetPay = (yearlySalary: number) => {
        const monthlyTotal = yearlySalary / 12;
        const monthlyTaxable = monthlyTotal - nonTaxable;

        // 예외 처리 (음수 방지)
        if (monthlyTaxable <= 0) {
            return { monthlyTotal, netPay: monthlyTotal, totalDeduction: 0 };
        }

        // 국민연금 (4.5%, 상한 617만 기준)
        let pension = monthlyTaxable * 0.045;
        if (pension > 277650) pension = 277650;

        // 건강보험 (3.545%) & 장기요양 (12.95%)
        const health = monthlyTaxable * 0.03545;
        const care = health * 0.1295;

        // 고용보험 (0.9%)
        const employment = monthlyTaxable * 0.009;

        // 소득세 (간이세액 약식)
        let incomeTax = 0;
        const annualTaxable = monthlyTaxable * 12;

        if (annualTaxable <= 14000000) incomeTax = monthlyTaxable * 0.005;
        else if (annualTaxable <= 50000000) incomeTax = monthlyTaxable * 0.03;
        else if (annualTaxable <= 88000000) incomeTax = monthlyTaxable * 0.06;
        else if (annualTaxable <= 150000000) incomeTax = monthlyTaxable * 0.15;
        else incomeTax = monthlyTaxable * 0.22;

        if (dependents > 1) incomeTax = incomeTax * (1 - (dependents - 1) * 0.05);
        if (incomeTax < 0) incomeTax = 0;

        const localTax = incomeTax * 0.1;
        const totalDeduction = pension + health + care + employment + incomeTax + localTax;

        return {
            monthlyTotal,
            netPay: monthlyTotal - totalDeduction,
            totalDeduction,
            pension, health, care, employment, incomeTax, localTax // 상세 내역 반환
        };
    };

    // --- 2. 역방향 계산 함수 (실수령 -> 연봉) : 바이너리 서치 ---
    const calculateGrossFromNet = (targetNet: number) => {
        let low = 10000000;   // 최소 연봉 1천만원
        let high = 500000000; // 최대 연봉 5억
        let estimatedGross = low;
        let iterations = 0;

        // 50번 반복이면 1원 단위까지 충분히 찾음
        while (low <= high && iterations < 50) {
            const mid = Math.floor((low + high) / 2);
            const { netPay } = calculateNetPay(mid);

            if (Math.abs(netPay - targetNet) < 100) { // 오차 100원 이내면 종료
                return mid;
            }

            if (netPay < targetNet) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
            estimatedGross = mid;
            iterations++;
        }
        return estimatedGross;
    };

    // --- 결과 도출 ---
    // A. 연봉 입력 모드일 때의 결과
    const grossToNetResult = calculateNetPay(preTaxYearly);

    // B. 실수령 입력 모드일 때의 예상 연봉
    const estimatedGross = calculateGrossFromNet(targetMonthlyNet);
    const netToGrossResult = calculateNetPay(estimatedGross);

    // 최종적으로 보여줄 데이터 (모드에 따라 선택)
    const finalResult = mode === 'grossToNet' ? grossToNetResult : netToGrossResult;
    const currentGross = mode === 'grossToNet' ? preTaxYearly : estimatedGross;


    // --- 연봉표 데이터 ---
    const salaryTableData = useMemo(() => {
        const data = [];
        for (let salary = 24000000; salary <= 150000000; salary += (salary < 100000000 ? 2000000 : 5000000)) {
            const res = calculateNetPay(salary);
            data.push({ salary, ...res });
        }
        return data;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nonTaxable, dependents]);

    // 포맷팅 함수
    const formatMoney = (val: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(Math.floor(val));
    const formatSimple = (val: number) => (val / 10000).toLocaleString() + '만원';

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation />
            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* 페이지 헤더 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/10 mb-4">
                        <Calculator className="w-8 h-8 text-[var(--primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">연봉 실수령액 계산기</h1>
                    <p className="text-[var(--muted-foreground)]">
                        2025년 4대보험 요율 기준 정확한 실수령액을 계산합니다
                    </p>
                </div>

                {/* 탭 메뉴 */}
                <div className="flex bg-[var(--secondary)] p-1 rounded-xl mb-6">
                    <button
                        onClick={() => setMode('grossToNet')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'grossToNet' ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
                    >
                        <TrendingDown className="w-4 h-4" />
                        연봉 → 실수령
                    </button>
                    <button
                        onClick={() => setMode('netToGross')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'netToGross' ? 'bg-[var(--card)] text-[var(--accent)] shadow-sm' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
                    >
                        <TrendingUp className="w-4 h-4" />
                        실수령 → 연봉
                    </button>
                </div>

                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-8">
                    {/* 모드별 입력창 */}
                    {mode === 'grossToNet' ? (
                        <div className="mb-6">
                            <label className="text-sm font-bold text-[var(--foreground)] mb-2 block">현재 연봉</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={preTaxYearlyInput}
                                onChange={handlePreTaxYearlyChange}
                                className="w-full p-4 border border-[var(--border)] rounded-xl bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none text-right text-2xl font-extrabold text-[var(--primary)]"
                            />
                        </div>
                    ) : (
                        <div className="mb-6">
                            <label className="text-sm font-bold text-[var(--foreground)] mb-2 block">희망 월 실수령액</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={targetMonthlyNetInput}
                                onChange={handleTargetMonthlyNetChange}
                                className="w-full p-4 border border-[var(--border)] rounded-xl bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)] outline-none text-right text-2xl font-extrabold text-[var(--accent)]"
                            />
                            <p className="text-xs text-right text-[var(--muted-foreground)] mt-2">
                                월 {formatMoney(targetMonthlyNet)}을 받으려면 연봉이 얼마나 되어야 할까요?
                            </p>
                        </div>
                    )}

                    {/* 공통 설정 */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="text-xs text-[var(--muted-foreground)] block mb-1">비과세액 (월)</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={nonTaxableInput}
                                onChange={handleNonTaxableChange}
                                className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-right text-sm text-[var(--foreground)]"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-[var(--muted-foreground)] block mb-1">부양가족 수</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={dependentsInput}
                                onChange={handleDependentsChange}
                                className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-right text-sm text-[var(--foreground)]"
                            />
                        </div>
                    </div>

                    {/* 결과 표시 영역 */}
                    {mode === 'grossToNet' ? (
                        <div className="bg-[var(--primary)]/10 p-5 rounded-xl border border-[var(--primary)]/20">
                            <div className="flex justify-between items-center pb-3 border-b border-[var(--primary)]/20 mb-3">
                                <span className="text-[var(--foreground)] text-sm font-medium">월 예상 실수령액</span>
                                <span className="text-2xl font-extrabold text-[var(--primary)]">{formatMoney(finalResult.netPay)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
                                <span>월 공제액 합계</span>
                                <span className="text-red-500">-{formatMoney(finalResult.totalDeduction)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[var(--accent)]/10 p-5 rounded-xl border border-[var(--accent)]/20">
                            <div className="flex justify-between items-center pb-3 border-b border-[var(--accent)]/20 mb-3">
                                <span className="text-[var(--foreground)] text-sm font-medium">필요 연봉 (계약액)</span>
                                <span className="text-2xl font-extrabold text-[var(--accent)]">{formatMoney(estimatedGross)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
                                <span>월 실수령액 맞춤</span>
                                <span>{formatMoney(targetMonthlyNet)}</span>
                            </div>
                            <div className="mt-3 text-xs text-[var(--accent)] text-center bg-[var(--card)] rounded-lg py-2">
                                연봉 {formatSimple(Math.round(estimatedGross))} 계약 시 달성 가능
                            </div>
                        </div>
                    )}
                </div>

                {/* 공제 상세 내역 */}
                {finalResult.pension !== undefined && (
                    <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="w-5 h-5 text-[var(--muted-foreground)]" />
                            <h3 className="font-bold text-[var(--foreground)]">공제 상세 내역</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--muted-foreground)]">국민연금 (4.5%)</span>
                                <span className="text-[var(--foreground)]">{formatMoney(finalResult.pension || 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--muted-foreground)]">건강보험 (3.545%)</span>
                                <span className="text-[var(--foreground)]">{formatMoney(finalResult.health || 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--muted-foreground)]">장기요양 (12.95%)</span>
                                <span className="text-[var(--foreground)]">{formatMoney(finalResult.care || 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--muted-foreground)]">고용보험 (0.9%)</span>
                                <span className="text-[var(--foreground)]">{formatMoney(finalResult.employment || 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--muted-foreground)]">소득세</span>
                                <span className="text-[var(--foreground)]">{formatMoney(finalResult.incomeTax || 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--muted-foreground)]">지방소득세 (10%)</span>
                                <span className="text-[var(--foreground)]">{formatMoney(finalResult.localTax || 0)}</span>
                            </div>
                            <div className="pt-3 border-t border-[var(--border)] flex justify-between font-bold">
                                <span className="text-[var(--foreground)]">총 공제액</span>
                                <span className="text-red-500">-{formatMoney(finalResult.totalDeduction)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 연봉표 */}
                <div className="bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden">
                    <div className="p-4 bg-[var(--secondary)] border-b border-[var(--border)] flex justify-between items-center">
                        <h3 className="font-bold text-[var(--foreground)]">구간별 실수령액표</h3>
                    </div>

                    <div className="grid grid-cols-3 bg-[var(--muted)] p-3 text-xs font-bold text-[var(--muted-foreground)] text-center sticky top-0">
                        <div>연봉</div>
                        <div>월 실수령액</div>
                        <div>공제액</div>
                    </div>

                    <div>
                        {salaryTableData.map((row) => {
                            const isHighlight = Math.abs(row.salary - currentGross) < 1500000;
                            const highlightClass = mode === 'grossToNet'
                                ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                                : 'bg-[var(--accent)]/10 text-[var(--accent)]';

                            return (
                                <div
                                    key={row.salary}
                                    className={`grid grid-cols-3 p-3 text-sm text-center border-b border-[var(--border)] last:border-0 transition-colors ${isHighlight ? `${highlightClass} font-bold` : 'text-[var(--foreground)] hover:bg-[var(--secondary)]'}`}
                                >
                                    <div className="font-medium">{formatSimple(row.salary)}</div>
                                    <div>{formatMoney(row.netPay)}</div>
                                    <div className="text-[var(--muted-foreground)] text-xs flex items-center justify-center">
                                        -{formatMoney(row.totalDeduction)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}