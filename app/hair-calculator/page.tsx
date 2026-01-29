'use client';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Scissors, Banknote } from 'lucide-react';

const formatNumber = (num: number) => {
  return Math.floor(num).toLocaleString();
};

// 입력용 포맷팅 (천단위 콤마)
const formatNumberInput = (val: number) => val ? val.toLocaleString('ko-KR') : '';
const parseNumberInput = (val: string) => {
  const num = val.replace(/,/g, '');
  return num === '' ? 0 : Number(num);
};

export default function Home() {
  const {
    totalSales,
    commission,
    incentiveRate,
    incentive,
    materialCost,
    internFee,
    tax,
    settlementAmount,
    setTotalSales,
    setIncentiveRate,
    setInternFee,
    calculate
  } = useCalculatorStore()

  const handleTotalSalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseNumberInput(e.target.value);
    setTotalSales(value);
  };

  const handleIncentiveRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
    setIncentiveRate(value);
  };

  const handleInternFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseNumberInput(e.target.value);
    setInternFee(value);
  };

  useEffect(() => {
    calculate();
  }, [totalSales, incentiveRate, internFee, calculate]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/10 mb-4">
            <Scissors className="w-8 h-8 text-[var(--primary)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">미용실 급여 계산기</h1>
          <p className="text-[var(--muted-foreground)]">
            매출에서 수수료, 재료비, 세금 등을 제외한 정산 금액을 계산합니다
          </p>
        </div>

        <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)]">
          <div className="space-y-4">
            {/* 입력 섹션 */}
            <div className="pb-4 border-b border-[var(--border)]">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                <Banknote className="w-4 h-4 inline mr-1" />
                총매출
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={formatNumberInput(totalSales)}
                onChange={handleTotalSalesChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none text-right text-xl font-bold"
              />
            </div>

            <div className="pb-4 border-b border-[var(--border)]">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                인센티브율 (%)
              </label>
              <input
                type="number"
                value={incentiveRate || ''}
                onChange={handleIncentiveRateChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none text-right"
              />
            </div>

            <div className="pb-4 border-b border-[var(--border)]">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                인턴비
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={formatNumberInput(internFee)}
                onChange={handleInternFeeChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none text-right"
              />
            </div>

            {/* 계산 결과 섹션 */}
            <div className="pt-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--muted-foreground)]">수수료 (85%)</span>
                <span className="font-medium text-red-500">-{formatNumber(commission)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--muted-foreground)]">인센티브</span>
                <span className="font-medium text-red-500">-{formatNumber(incentive)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--muted-foreground)]">재료비 (10%)</span>
                <span className="font-medium text-red-500">-{formatNumber(materialCost)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--muted-foreground)]">인턴비</span>
                <span className="font-medium text-red-500">-{formatNumber(internFee)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--muted-foreground)]">세금 (3.3%)</span>
                <span className="font-medium text-red-500">-{formatNumber(tax)}</span>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-[var(--border)]">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[var(--foreground)]">정산 금액</span>
                  <span className="text-2xl font-bold text-[var(--primary)]">{formatNumber(settlementAmount)}원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
