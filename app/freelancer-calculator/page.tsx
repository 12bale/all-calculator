'use client';

import { useState } from 'react';
import Header from '../components/Header';

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
        <>
            <Header />
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                💼 프리랜서 급여 계산기
            </h2>

            {/* 입력 섹션 */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                    계약 금액 (세전)
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="금액을 입력하세요"
                        className="w-full text-right p-4 pr-12 text-xl font-bold border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        원
                    </span>
                </div>
            </div>

            {/* 결과 섹션 */}
            <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
                    <span className="text-red-600 font-medium">떼이는 세금 (3.3%)</span>
                    <span className="text-xl font-bold text-red-700">
                        - {result.tax.toLocaleString()} 원
                    </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-blue-700 font-bold text-lg">실제 통장에 꽂히는 돈</span>
                    <span className="text-2xl font-extrabold text-blue-800">
                        {result.netIncome.toLocaleString()} 원
                    </span>
                </div>
            </div>

            {/* 팁 섹션 */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
                <p>💡 <strong>3.3%란?</strong> 사업소득세 3% + 지방소득세 0.3%를 합친 금액입니다.</p>
                <p className="mt-1">💡 5월 종합소득세 신고 시, 소득 수준에 따라 이 세금을 환급받을 수도 있습니다.</p>
            </div>
            </div>
        </>
    );
}