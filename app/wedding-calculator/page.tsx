'use client';

import { useState, useMemo } from 'react';
import Header from '../components/Header';

export default function WeddingCalculator() {
    // --- 웨딩홀 비용 ---
    const [hallCost, setHallCost] = useState(3000000);
    const [hallCostInput, setHallCostInput] = useState('3,000,000');

    // --- 식대 관련 ---
    const [mealCost, setMealCost] = useState(70000);
    const [mealCostInput, setMealCostInput] = useState('70,000');
    const [expectedGuests, setExpectedGuests] = useState(200);
    const [expectedGuestsInput, setExpectedGuestsInput] = useState('200');

    // --- 스드메 (스튜디오, 드레스, 메이크업) ---
    const [studioCost, setStudioCost] = useState(1500000);
    const [studioCostInput, setStudioCostInput] = useState('1,500,000');
    const [dressCost, setDressCost] = useState(2000000);
    const [dressCostInput, setDressCostInput] = useState('2,000,000');
    const [makeupCost, setMakeupCost] = useState(800000);
    const [makeupCostInput, setMakeupCostInput] = useState('800,000');

    // --- 예물/예단 ---
    const [giftCost, setGiftCost] = useState(5000000);
    const [giftCostInput, setGiftCostInput] = useState('5,000,000');
    const [yedan, setYedan] = useState(3000000);
    const [yedanInput, setYedanInput] = useState('3,000,000');

    // --- 기타 비용 ---
    const [honeymoonCost, setHoneymoonCost] = useState(5000000);
    const [honeymoonCostInput, setHoneymoonCostInput] = useState('5,000,000');
    const [etcCost, setEtcCost] = useState(2000000);
    const [etcCostInput, setEtcCostInput] = useState('2,000,000');

    // --- 축의금 예상 ---
    const [avgGiftMoney, setAvgGiftMoney] = useState(70000);
    const [avgGiftMoneyInput, setAvgGiftMoneyInput] = useState('70,000');

    // 콤마 포맷팅 헬퍼 함수
    const formatWithComma = (value: number) => value.toLocaleString('ko-KR');
    const parseNumber = (value: string) => {
        const num = parseInt(value.replace(/,/g, ''), 10);
        return isNaN(num) ? null : num;
    };

    // 공통 핸들러 생성 함수
    const createHandler = (
        setter: (v: number) => void,
        inputSetter: (v: string) => void
    ) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, '');
        if (raw === '') {
            inputSetter('');
            return;
        }
        const num = parseNumber(raw);
        if (num !== null) {
            inputSetter(formatWithComma(num));
            setter(num);
        }
    };

    // 계산 결과
    const result = useMemo(() => {
        const totalMealCost = mealCost * expectedGuests;
        const sdm = studioCost + dressCost + makeupCost;
        const giftAndYedan = giftCost + yedan;
        const totalExpense = hallCost + totalMealCost + sdm + giftAndYedan + honeymoonCost + etcCost;
        const expectedIncome = avgGiftMoney * expectedGuests;
        const netCost = totalExpense - expectedIncome;

        return {
            hallCost,
            totalMealCost,
            sdm,
            giftAndYedan,
            honeymoonCost,
            etcCost,
            totalExpense,
            expectedIncome,
            netCost
        };
    }, [hallCost, mealCost, expectedGuests, studioCost, dressCost, makeupCost, giftCost, yedan, honeymoonCost, etcCost, avgGiftMoney]);

    // 포맷팅 함수
    const formatMoney = (val: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(Math.floor(val));
    const formatSimple = (val: number) => {
        if (val >= 100000000) return (val / 100000000).toFixed(1) + '억원';
        return (val / 10000).toLocaleString() + '만원';
    };

    // 비용 항목별 비율 계산
    const getPercentage = (value: number) => {
        if (result.totalExpense === 0) return 0;
        return Math.round((value / result.totalExpense) * 100);
    };

    return (
        <>
            <Header />
            <div className="max-w-xl mx-auto my-10 font-sans px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    💒 예식 비용 견적 계산기
                </h2>

                {/* 웨딩홀 & 식대 섹션 */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-4">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                        🏛️ 웨딩홀 & 식대
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">웨딩홀 대관료</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={hallCostInput}
                                    onChange={createHandler(setHallCost, setHallCostInput)}
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-right text-lg font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">원</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">식대 (1인)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={mealCostInput}
                                        onChange={createHandler(setMealCost, setMealCostInput)}
                                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-right font-bold"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">예상 하객 수</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={expectedGuestsInput}
                                        onChange={createHandler(setExpectedGuests, setExpectedGuestsInput)}
                                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-right font-bold"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">명</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                            총 식대: <span className="font-bold text-pink-600">{formatMoney(result.totalMealCost)}</span>
                        </div>
                    </div>
                </div>

                {/* 스드메 섹션 */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-4">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                        📸 스드메 (스튜디오/드레스/메이크업)
                    </h3>

                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">스튜디오 촬영</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={studioCostInput}
                                    onChange={createHandler(setStudioCost, setStudioCostInput)}
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-right font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">드레스</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={dressCostInput}
                                    onChange={createHandler(setDressCost, setDressCostInput)}
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-right font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">헤어/메이크업</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={makeupCostInput}
                                    onChange={createHandler(setMakeupCost, setMakeupCostInput)}
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-right font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                            </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                            스드메 합계: <span className="font-bold text-pink-600">{formatMoney(result.sdm)}</span>
                        </div>
                    </div>
                </div>

                {/* 예물/예단 섹션 */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-4">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                        💍 예물 & 예단
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">예물 (반지 등)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={giftCostInput}
                                    onChange={createHandler(setGiftCost, setGiftCostInput)}
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-right font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">예단</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={yedanInput}
                                    onChange={createHandler(setYedan, setYedanInput)}
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-right font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 기타 비용 섹션 */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-4">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                        ✈️ 신혼여행 & 기타
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">신혼여행</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={honeymoonCostInput}
                                    onChange={createHandler(setHoneymoonCost, setHoneymoonCostInput)}
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-right font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">기타 (청첩장, 답례품 등)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={etcCostInput}
                                    onChange={createHandler(setEtcCost, setEtcCostInput)}
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-right font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 축의금 예상 섹션 */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-6">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                        🎁 예상 축의금
                    </h3>

                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">1인당 평균 축의금</label>
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={avgGiftMoneyInput}
                                onChange={createHandler(setAvgGiftMoney, setAvgGiftMoneyInput)}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-right font-bold"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                        </div>
                        <div className="text-right text-sm text-gray-500 mt-2">
                            예상 축의금 총액: <span className="font-bold text-green-600">{formatMoney(result.expectedIncome)}</span>
                        </div>
                    </div>
                </div>

                {/* 결과 섹션 */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl shadow-xl border border-pink-100 mb-6">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">📋 예식 비용 총 정리</h3>

                    {/* 비용 상세 내역 */}
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center py-2 border-b border-pink-100">
                            <span className="text-gray-600">웨딩홀 대관료</span>
                            <span className="font-bold">{formatMoney(result.hallCost)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-pink-100">
                            <span className="text-gray-600">총 식대 ({expectedGuests}명)</span>
                            <span className="font-bold">{formatMoney(result.totalMealCost)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-pink-100">
                            <span className="text-gray-600">스드메</span>
                            <span className="font-bold">{formatMoney(result.sdm)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-pink-100">
                            <span className="text-gray-600">예물/예단</span>
                            <span className="font-bold">{formatMoney(result.giftAndYedan)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-pink-100">
                            <span className="text-gray-600">신혼여행</span>
                            <span className="font-bold">{formatMoney(result.honeymoonCost)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-pink-100">
                            <span className="text-gray-600">기타 비용</span>
                            <span className="font-bold">{formatMoney(result.etcCost)}</span>
                        </div>
                    </div>

                    {/* 총 비용 */}
                    <div className="bg-white p-4 rounded-xl mb-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-bold">총 예식 비용</span>
                            <span className="text-2xl font-extrabold text-pink-600">{formatMoney(result.totalExpense)}</span>
                        </div>
                        <div className="text-right text-sm text-gray-400">{formatSimple(result.totalExpense)}</div>
                    </div>

                    {/* 축의금 차감 */}
                    <div className="bg-green-50 p-4 rounded-xl mb-3">
                        <div className="flex justify-between items-center">
                            <span className="text-green-700 font-medium">예상 축의금 수입</span>
                            <span className="text-xl font-bold text-green-600">+ {formatMoney(result.expectedIncome)}</span>
                        </div>
                    </div>

                    {/* 실제 부담 비용 */}
                    <div className={`p-4 rounded-xl ${result.netCost >= 0 ? 'bg-red-50' : 'bg-blue-50'}`}>
                        <div className="flex justify-between items-center">
                            <span className={`font-bold ${result.netCost >= 0 ? 'text-red-700' : 'text-blue-700'}`}>
                                실제 부담 비용
                            </span>
                            <span className={`text-2xl font-extrabold ${result.netCost >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                                {formatMoney(Math.abs(result.netCost))}
                                {result.netCost < 0 && ' (흑자)'}
                            </span>
                        </div>
                        <div className={`text-right text-sm ${result.netCost >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                            {formatSimple(Math.abs(result.netCost))}
                        </div>
                    </div>
                </div>

                {/* 비용 비율 차트 */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-6">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">📊 비용 항목별 비율</h3>

                    <div className="space-y-3">
                        {[
                            { label: '웨딩홀', value: result.hallCost, color: 'bg-pink-500' },
                            { label: '식대', value: result.totalMealCost, color: 'bg-rose-400' },
                            { label: '스드메', value: result.sdm, color: 'bg-purple-400' },
                            { label: '예물/예단', value: result.giftAndYedan, color: 'bg-amber-400' },
                            { label: '신혼여행', value: result.honeymoonCost, color: 'bg-blue-400' },
                            { label: '기타', value: result.etcCost, color: 'bg-gray-400' },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">{item.label}</span>
                                    <span className="text-gray-500">{getPercentage(item.value)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3">
                                    <div
                                        className={`${item.color} h-3 rounded-full transition-all duration-500`}
                                        style={{ width: `${getPercentage(item.value)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 팁 섹션 */}
                <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-500 space-y-2">
                    <p>💡 <strong>TIP:</strong> 스드메는 패키지 상품을 이용하면 개별 구매 대비 절약이 가능합니다.</p>
                    <p>💡 비수기(평일, 11월~2월)에 예식하면 웨딩홀 비용을 20~30% 절감할 수 있습니다.</p>
                    <p>💡 축의금은 하객 구성에 따라 크게 달라질 수 있으니 보수적으로 예상하세요.</p>
                </div>
            </div>
        </>
    );
}
