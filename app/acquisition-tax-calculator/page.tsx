'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Building2, Info } from 'lucide-react';

type HousingCount = '1' | '2' | '3+' | 'corp';

interface TaxResult {
    acquisitionTax: number;
    acquisitionTaxRate: number;
    ruralTax: number;
    ruralTaxRate: number;
    educationTax: number;
    educationTaxRate: number;
    totalTax: number;
}

// 1주택 취득세율 계산 (6억~9억 구간 점진)
function getOneHouseTaxRate(price: number): number {
    if (price <= 600000000) return 0.01;
    if (price <= 900000000) {
        // 6억~9억: 1%~3% 선형 보간
        return ((price * 2) / 300000000 - 3) / 100;
    }
    return 0.03;
}

// 지방교육세율 계산
function getEducationTaxRate(acquisitionTaxRate: number): number {
    if (acquisitionTaxRate <= 0.03) return acquisitionTaxRate * 0.1 / acquisitionTaxRate || 0;
    // 표준: 취득세율의 10% (일반), 중과 시 별도
    if (acquisitionTaxRate <= 0.03) return 0.001 + (acquisitionTaxRate - 0.01) * 0.1;
    if (acquisitionTaxRate === 0.08) return 0.004;
    if (acquisitionTaxRate === 0.12) return 0.004;
    return 0.004;
}

function calculateTax(
    price: number,
    housingCount: HousingCount,
    isRegulated: boolean,
    isOver85: boolean,
): TaxResult {
    if (price <= 0) {
        return { acquisitionTax: 0, acquisitionTaxRate: 0, ruralTax: 0, ruralTaxRate: 0, educationTax: 0, educationTaxRate: 0, totalTax: 0 };
    }

    let acquisitionTaxRate: number;

    switch (housingCount) {
        case '1':
            acquisitionTaxRate = getOneHouseTaxRate(price);
            break;
        case '2':
            acquisitionTaxRate = isRegulated ? 0.08 : getOneHouseTaxRate(price);
            break;
        case '3+':
            acquisitionTaxRate = isRegulated ? 0.12 : 0.08;
            break;
        case 'corp':
            acquisitionTaxRate = 0.12;
            break;
        default:
            acquisitionTaxRate = 0.01;
    }

    const acquisitionTax = Math.floor(price * acquisitionTaxRate);

    // 농어촌특별세: 85㎡ 초과 시 0.2% (중과 시에도 0.2%, 단 2% 적용 케이스도 있으나 일반적으로 0.2%)
    const ruralTaxRate = isOver85 ? 0.002 : 0;
    const ruralTax = Math.floor(price * ruralTaxRate);

    // 지방교육세
    let educationTaxRate: number;
    if (acquisitionTaxRate <= 0.03) {
        // 일반세율: 취득세의 10%
        educationTaxRate = acquisitionTaxRate * 0.1;
    } else {
        // 중과세율: 0.4%
        educationTaxRate = 0.004;
    }
    const educationTax = Math.floor(price * educationTaxRate);

    const totalTax = acquisitionTax + ruralTax + educationTax;

    return {
        acquisitionTax,
        acquisitionTaxRate,
        ruralTax,
        ruralTaxRate,
        educationTax,
        educationTaxRate,
        totalTax,
    };
}

export default function AcquisitionTaxCalculator() {
    const [priceDisplay, setPriceDisplay] = useState('');
    const [priceRaw, setPriceRaw] = useState(0);
    const [housingCount, setHousingCount] = useState<HousingCount>('1');
    const [isRegulated, setIsRegulated] = useState(false);
    const [isOver85, setIsOver85] = useState(false);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        if (!raw) {
            setPriceDisplay('');
            setPriceRaw(0);
            return;
        }
        const num = parseInt(raw, 10);
        setPriceDisplay(num.toLocaleString());
        setPriceRaw(num);
    };

    const result = calculateTax(priceRaw, housingCount, isRegulated, isOver85);

    const housingOptions: { value: HousingCount; label: string }[] = [
        { value: '1', label: '1주택' },
        { value: '2', label: '2주택' },
        { value: '3+', label: '3주택 이상' },
        { value: 'corp', label: '법인' },
    ];

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation />
            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* 페이지 헤더 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 mb-4">
                        <Building2 className="w-8 h-8 text-orange-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">부동산 취득세 계산기</h1>
                    <p className="text-[var(--muted-foreground)]">
                        주택 매매 시 납부해야 할 취득세를 계산합니다
                    </p>
                </div>

                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)]">
                    {/* 매매가격 입력 */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
                            매매가격
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={priceDisplay}
                                onChange={handlePriceChange}
                                placeholder="매매가격을 입력하세요"
                                className="w-full text-right p-4 pr-12 text-xl font-bold border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[var(--background)] text-[var(--foreground)]"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-medium">
                                원
                            </span>
                        </div>
                        {priceRaw > 0 && (
                            <p className="text-xs text-[var(--muted-foreground)] mt-1 text-right">
                                {priceRaw >= 100000000
                                    ? `${Math.floor(priceRaw / 100000000)}억${priceRaw % 100000000 > 0 ? ` ${Math.floor((priceRaw % 100000000) / 10000).toLocaleString()}만` : ''} 원`
                                    : `${Math.floor(priceRaw / 10000).toLocaleString()}만 원`}
                            </p>
                        )}
                    </div>

                    {/* 주택 수 선택 */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
                            보유 주택 수
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {housingOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setHousingCount(opt.value)}
                                    className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                                        housingCount === opt.value
                                            ? 'bg-orange-500 text-white border-orange-500'
                                            : 'bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-orange-500/50'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 조정대상지역 토글 */}
                    {housingCount !== 'corp' && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between p-4 bg-[var(--background)] rounded-xl border border-[var(--border)]">
                                <span className="text-sm font-bold text-[var(--foreground)]">조정대상지역</span>
                                <button
                                    onClick={() => setIsRegulated(!isRegulated)}
                                    className={`relative w-12 h-7 rounded-full transition-colors ${
                                        isRegulated ? 'bg-orange-500' : 'bg-[var(--muted)]'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                                            isRegulated ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 전용면적 선택 */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
                            전용면적
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setIsOver85(false)}
                                className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                                    !isOver85
                                        ? 'bg-orange-500 text-white border-orange-500'
                                        : 'bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-orange-500/50'
                                }`}
                            >
                                85㎡ 이하
                            </button>
                            <button
                                onClick={() => setIsOver85(true)}
                                className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                                    isOver85
                                        ? 'bg-orange-500 text-white border-orange-500'
                                        : 'bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-orange-500/50'
                                }`}
                            >
                                85㎡ 초과
                            </button>
                        </div>
                    </div>

                    {/* 결과 섹션 */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-4 bg-[var(--secondary)] rounded-xl">
                            <span className="text-[var(--foreground)] text-sm font-medium">
                                취득세 ({(result.acquisitionTaxRate * 100).toFixed(1)}%)
                            </span>
                            <span className="text-lg font-bold text-[var(--foreground)]">
                                {result.acquisitionTax.toLocaleString()} 원
                            </span>
                        </div>

                        {result.ruralTaxRate > 0 && (
                            <div className="flex justify-between items-center p-4 bg-[var(--secondary)] rounded-xl">
                                <span className="text-[var(--foreground)] text-sm font-medium">
                                    농어촌특별세 ({(result.ruralTaxRate * 100).toFixed(1)}%)
                                </span>
                                <span className="text-lg font-bold text-[var(--foreground)]">
                                    {result.ruralTax.toLocaleString()} 원
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between items-center p-4 bg-[var(--secondary)] rounded-xl">
                            <span className="text-[var(--foreground)] text-sm font-medium">
                                지방교육세 ({(result.educationTaxRate * 100).toFixed(1)}%)
                            </span>
                            <span className="text-lg font-bold text-[var(--foreground)]">
                                {result.educationTax.toLocaleString()} 원
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-5 bg-orange-500/10 rounded-xl border border-orange-500/20">
                            <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">총 납부세액</span>
                            <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">
                                {result.totalTax.toLocaleString()} 원
                            </span>
                        </div>
                    </div>

                    {/* 안내 섹션 */}
                    <div className="mt-8 p-4 bg-[var(--secondary)] rounded-lg text-xs text-[var(--muted-foreground)]">
                        <div className="flex items-start gap-2 mb-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p><strong className="text-[var(--foreground)]">취득세란?</strong> 부동산을 취득할 때 납부하는 지방세로, 매매가격에 세율을 곱하여 산출합니다.</p>
                        </div>
                        <div className="flex items-start gap-2 mb-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p><strong className="text-[var(--foreground)]">조정대상지역이란?</strong> 부동산 가격 급등 지역으로, 다주택자에게 높은 취득세율이 적용됩니다.</p>
                        </div>
                        <div className="flex items-start gap-2 mb-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p><strong className="text-[var(--foreground)]">농어촌특별세</strong>는 전용면적 85㎡ 초과 주택에만 부과됩니다.</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p>본 계산기는 참고용이며, 정확한 세액은 관할 시·군·구청에 문의하세요.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
