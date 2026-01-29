'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Briefcase, Info } from 'lucide-react';

export default function FreelancerTaxCalculator() {
    const [inputValue, setInputValue] = useState('');

    // 계산 결과 상태
    const [result, setResult] = useState({
        tax: 0,
        netIncome: 0,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 1. 입력값에서 숫자만 추출 (콤마 제거)
        const rawValue = e.target.value.replace(/[^0-9]/g, '');

        // 2. 숫자가 아니면 초기화
        if (!rawValue) {
            setInputValue('');
            setResult({ tax: 0, netIncome: 0 });
            return;
        }

        // 3. 계산 로직 (3.3% 공제)
        const amount = parseInt(rawValue, 10);
        const tax = Math.floor(amount * 0.033); // 원 단위 절사
        const netIncome = amount - tax;

        // 4. 상태 업데이트 (화면 표시용 콤마 포맷팅)
        setInputValue(Number(rawValue).toLocaleString());
        setResult({ tax, netIncome });
    };

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation />
            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* 페이지 헤더 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/10 mb-4">
                        <Briefcase className="w-8 h-8 text-[var(--primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">프리랜서 급여 계산기</h1>
                    <p className="text-[var(--muted-foreground)]">
                        3.3% 원천징수 후 실수령액을 계산합니다
                    </p>
                </div>

                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)]">
                    {/* 입력 섹션 */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                            계약 금액 (세전)
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder="금액을 입력하세요"
                                className="w-full text-right p-4 pr-12 text-xl font-bold border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--foreground)]"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-medium">
                                원
                            </span>
                        </div>
                    </div>

                    {/* 결과 섹션 */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                            <span className="text-red-600 dark:text-red-400 font-medium">떼이는 세금 (3.3%)</span>
                            <span className="text-xl font-bold text-red-600 dark:text-red-400">
                                - {result.tax.toLocaleString()} 원
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-[var(--primary)]/10 rounded-xl border border-[var(--primary)]/20">
                            <span className="text-[var(--primary)] font-bold text-lg">실제 통장에 꽂히는 돈</span>
                            <span className="text-2xl font-extrabold text-[var(--primary)]">
                                {result.netIncome.toLocaleString()} 원
                            </span>
                        </div>
                    </div>

                    {/* 팁 섹션 */}
                    <div className="mt-8 p-4 bg-[var(--secondary)] rounded-lg text-xs text-[var(--muted-foreground)]">
                        <div className="flex items-start gap-2 mb-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p><strong className="text-[var(--foreground)]">3.3%란?</strong> 사업소득세 3% + 지방소득세 0.3%를 합친 금액입니다.</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p>5월 종합소득세 신고 시, 소득 수준에 따라 이 세금을 환급받을 수도 있습니다.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
