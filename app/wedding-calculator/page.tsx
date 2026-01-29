'use client';

import { useState, useMemo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Heart, Users, Camera, Gem, Plane, Gift } from 'lucide-react';

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
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation />
            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* 페이지 헤더 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-500/10 mb-4">
                        <Heart className="w-8 h-8 text-pink-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">예식 비용 계산기</h1>
                    <p className="text-[var(--muted-foreground)]">
                        웨딩홀, 스드메, 예물 등 예식에 필요한 총 비용을 계산합니다
                    </p>
                </div>

                {/* 웨딩홀 & 식대 섹션 */}
                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-4">
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-500" />
                        웨딩홀 & 식대
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">웨딩홀 대관료</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={hallCostInput}
                                    onChange={createHandler(setHallCost, setHallCostInput)}
                                    className="w-full px-4 py-3 pr-10 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-right text-lg font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">원</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">식대 (1인)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={mealCostInput}
                                        onChange={createHandler(setMealCost, setMealCostInput)}
                                        className="w-full px-4 py-3 pr-10 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-right font-bold"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">원</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">
                                    <Users className="w-4 h-4 inline mr-1" />
                                    예상 하객 수
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={expectedGuestsInput}
                                        onChange={createHandler(setExpectedGuests, setExpectedGuestsInput)}
                                        className="w-full px-4 py-3 pr-10 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-right font-bold"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">명</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right text-sm text-[var(--muted-foreground)]">
                            총 식대: <span className="font-bold text-pink-500">{formatMoney(result.totalMealCost)}</span>
                        </div>
                    </div>
                </div>

                {/* 스드메 섹션 */}
                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-4">
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-purple-500" />
                        스드메 (스튜디오/드레스/메이크업)
                    </h3>

                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">스튜디오 촬영</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={studioCostInput}
                                    onChange={createHandler(setStudioCost, setStudioCostInput)}
                                    className="w-full px-4 py-3 pr-10 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-right font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">원</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">드레스</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={dressCostInput}
                                    onChange={createHandler(setDressCost, setDressCostInput)}
                                    className="w-full px-4 py-3 pr-10 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-right font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">원</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">헤어/메이크업</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={makeupCostInput}
                                    onChange={createHandler(setMakeupCost, setMakeupCostInput)}
                                    className="w-full px-4 py-3 pr-10 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-right font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">원</span>
                            </div>
                        </div>
                        <div className="text-right text-sm text-[var(--muted-foreground)]">
                            스드메 합계: <span className="font-bold text-pink-500">{formatMoney(result.sdm)}</span>
                        </div>
                    </div>
                </div>

                {/* 예물/예단 섹션 */}
                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-4">
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                        <Gem className="w-5 h-5 text-amber-500" />
                        예물 & 예단
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">예물 (반지 등)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={giftCostInput}
                                    onChange={createHandler(setGiftCost, setGiftCostInput)}
                                    className="w-full px-4 py-3 pr-10 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-right font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">원</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">예단</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={yedanInput}
                                    onChange={createHandler(setYedan, setYedanInput)}
                                    className="w-full px-4 py-3 pr-10 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-right font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">원</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 기타 비용 섹션 */}
                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-4">
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                        <Plane className="w-5 h-5 text-blue-500" />
                        신혼여행 & 기타
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">신혼여행</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={honeymoonCostInput}
                                    onChange={createHandler(setHoneymoonCost, setHoneymoonCostInput)}
                                    className="w-full px-4 py-3 pr-10 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-right font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">원</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">기타 (청첩장 등)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={etcCostInput}
                                    onChange={createHandler(setEtcCost, setEtcCostInput)}
                                    className="w-full px-4 py-3 pr-10 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-right font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">원</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 축의금 예상 섹션 */}
                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-6">
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                        <Gift className="w-5 h-5 text-green-500" />
                        예상 축의금
                    </h3>

                    <div>
                        <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">1인당 평균 축의금</label>
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={avgGiftMoneyInput}
                                onChange={createHandler(setAvgGiftMoney, setAvgGiftMoneyInput)}
                                className="w-full px-4 py-3 pr-10 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-right font-bold"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">원</span>
                        </div>
                        <div className="text-right text-sm text-[var(--muted-foreground)] mt-2">
                            예상 축의금 총액: <span className="font-bold text-green-500">{formatMoney(result.expectedIncome)}</span>
                        </div>
                    </div>
                </div>

                {/* 결과 섹션 */}
                <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 p-6 rounded-2xl shadow-lg border border-pink-500/20 mb-6">
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 text-center">예식 비용 총 정리</h3>

                    {/* 비용 상세 내역 */}
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center py-2 border-b border-pink-500/20">
                            <span className="text-[var(--muted-foreground)]">웨딩홀 대관료</span>
                            <span className="font-bold text-[var(--foreground)]">{formatMoney(result.hallCost)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-pink-500/20">
                            <span className="text-[var(--muted-foreground)]">총 식대 ({expectedGuests}명)</span>
                            <span className="font-bold text-[var(--foreground)]">{formatMoney(result.totalMealCost)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-pink-500/20">
                            <span className="text-[var(--muted-foreground)]">스드메</span>
                            <span className="font-bold text-[var(--foreground)]">{formatMoney(result.sdm)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-pink-500/20">
                            <span className="text-[var(--muted-foreground)]">예물/예단</span>
                            <span className="font-bold text-[var(--foreground)]">{formatMoney(result.giftAndYedan)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-pink-500/20">
                            <span className="text-[var(--muted-foreground)]">신혼여행</span>
                            <span className="font-bold text-[var(--foreground)]">{formatMoney(result.honeymoonCost)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-pink-500/20">
                            <span className="text-[var(--muted-foreground)]">기타 비용</span>
                            <span className="font-bold text-[var(--foreground)]">{formatMoney(result.etcCost)}</span>
                        </div>
                    </div>

                    {/* 총 비용 */}
                    <div className="bg-[var(--card)] p-4 rounded-xl mb-3 border border-[var(--border)]">
                        <div className="flex justify-between items-center">
                            <span className="text-[var(--foreground)] font-bold">총 예식 비용</span>
                            <span className="text-2xl font-extrabold text-pink-500">{formatMoney(result.totalExpense)}</span>
                        </div>
                        <div className="text-right text-sm text-[var(--muted-foreground)]">{formatSimple(result.totalExpense)}</div>
                    </div>

                    {/* 축의금 차감 */}
                    <div className="bg-green-500/10 p-4 rounded-xl mb-3 border border-green-500/20">
                        <div className="flex justify-between items-center">
                            <span className="text-green-600 dark:text-green-400 font-medium">예상 축의금 수입</span>
                            <span className="text-xl font-bold text-green-600 dark:text-green-400">+ {formatMoney(result.expectedIncome)}</span>
                        </div>
                    </div>

                    {/* 실제 부담 비용 */}
                    <div className={`p-4 rounded-xl ${result.netCost >= 0 ? 'bg-red-500/10 border border-red-500/20' : 'bg-blue-500/10 border border-blue-500/20'}`}>
                        <div className="flex justify-between items-center">
                            <span className={`font-bold ${result.netCost >= 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                실제 부담 비용
                            </span>
                            <span className={`text-2xl font-extrabold ${result.netCost >= 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                {formatMoney(Math.abs(result.netCost))}
                                {result.netCost < 0 && ' (흑자)'}
                            </span>
                        </div>
                        <div className={`text-right text-sm ${result.netCost >= 0 ? 'text-red-500/70' : 'text-blue-500/70'}`}>
                            {formatSimple(Math.abs(result.netCost))}
                        </div>
                    </div>
                </div>

                {/* 비용 비율 차트 */}
                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-6">
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">비용 항목별 비율</h3>

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
                                    <span className="text-[var(--muted-foreground)]">{item.label}</span>
                                    <span className="text-[var(--muted-foreground)]">{getPercentage(item.value)}%</span>
                                </div>
                                <div className="w-full bg-[var(--secondary)] rounded-full h-3">
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
                <div className="bg-[var(--secondary)] p-4 rounded-xl text-xs text-[var(--muted-foreground)] space-y-2 border border-[var(--border)]">
                    <p><strong>TIP:</strong> 스드메는 패키지 상품을 이용하면 개별 구매 대비 절약이 가능합니다.</p>
                    <p>비수기(평일, 11월~2월)에 예식하면 웨딩홀 비용을 20~30% 절감할 수 있습니다.</p>
                    <p>축의금은 하객 구성에 따라 크게 달라질 수 있으니 보수적으로 예상하세요.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
