'use client';

import { useState, useMemo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { ArrowLeftRight, Home, ChefHat, Ruler, Thermometer, Weight } from 'lucide-react';

type CategoryKey = 'realestate' | 'cooking' | 'length' | 'weight' | 'temperature';

interface UnitGroup {
    label: string;
    icon: React.ReactNode;
    units: { id: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[];
}

const unitCategories: Record<CategoryKey, UnitGroup> = {
    realestate: {
        label: '부동산 면적',
        icon: <Home className="w-5 h-5" />,
        units: [
            { id: 'pyeong', label: '평', toBase: (v) => v * 3.305785, fromBase: (v) => v / 3.305785 },
            { id: 'sqm', label: '㎡ (제곱미터)', toBase: (v) => v, fromBase: (v) => v },
            { id: 'sqft', label: 'ft² (제곱피트)', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
            { id: '평방자', label: '평방자 (坪方尺)', toBase: (v) => v * 0.09182, fromBase: (v) => v / 0.09182 },
            { id: 'acre', label: '에이커', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
        ],
    },
    cooking: {
        label: '요리 계량',
        icon: <ChefHat className="w-5 h-5" />,
        units: [
            { id: 'g', label: 'g (그램)', toBase: (v) => v, fromBase: (v) => v },
            { id: 'kg', label: 'kg (킬로그램)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
            { id: 'ml', label: 'ml (밀리리터)', toBase: (v) => v, fromBase: (v) => v },
            { id: 'l', label: 'L (리터)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
            { id: 'cup', label: '컵 (200ml)', toBase: (v) => v * 200, fromBase: (v) => v / 200 },
            { id: 'tbsp', label: '큰술 (15ml)', toBase: (v) => v * 15, fromBase: (v) => v / 15 },
            { id: 'tsp', label: '작은술 (5ml)', toBase: (v) => v * 5, fromBase: (v) => v / 5 },
            { id: 'oz', label: 'oz (온스)', toBase: (v) => v * 28.3495, fromBase: (v) => v / 28.3495 },
        ],
    },
    length: {
        label: '길이',
        icon: <Ruler className="w-5 h-5" />,
        units: [
            { id: 'mm', label: 'mm (밀리미터)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
            { id: 'cm', label: 'cm (센티미터)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
            { id: 'm', label: 'm (미터)', toBase: (v) => v, fromBase: (v) => v },
            { id: 'km', label: 'km (킬로미터)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
            { id: 'inch', label: 'inch (인치)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
            { id: 'ft', label: 'ft (피트)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
            { id: 'mile', label: 'mile (마일)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
            { id: 'ja', label: '자 (尺, 30.3cm)', toBase: (v) => v * 0.303, fromBase: (v) => v / 0.303 },
        ],
    },
    weight: {
        label: '무게',
        icon: <Weight className="w-5 h-5" />,
        units: [
            { id: 'mg', label: 'mg (밀리그램)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
            { id: 'g_w', label: 'g (그램)', toBase: (v) => v, fromBase: (v) => v },
            { id: 'kg_w', label: 'kg (킬로그램)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
            { id: 't', label: 't (톤)', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
            { id: 'lb', label: 'lb (파운드)', toBase: (v) => v * 453.592, fromBase: (v) => v / 453.592 },
            { id: 'oz_w', label: 'oz (온스)', toBase: (v) => v * 28.3495, fromBase: (v) => v / 28.3495 },
            { id: 'geun', label: '근 (600g)', toBase: (v) => v * 600, fromBase: (v) => v / 600 },
            { id: 'don', label: '돈 (3.75g)', toBase: (v) => v * 3.75, fromBase: (v) => v / 3.75 },
        ],
    },
    temperature: {
        label: '온도',
        icon: <Thermometer className="w-5 h-5" />,
        units: [
            { id: 'celsius', label: '°C (섭씨)', toBase: (v) => v, fromBase: (v) => v },
            { id: 'fahrenheit', label: '°F (화씨)', toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
            { id: 'kelvin', label: 'K (켈빈)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
        ],
    },
};

// 자주 쓰는 빠른 변환
const quickConversions: { label: string; category: CategoryKey; from: string; to: string; value: string }[] = [
    { label: '25평 → ㎡', category: 'realestate', from: 'pyeong', to: 'sqm', value: '25' },
    { label: '33평 → ㎡', category: 'realestate', from: 'pyeong', to: 'sqm', value: '33' },
    { label: '84㎡ → 평', category: 'realestate', from: 'sqm', to: 'pyeong', value: '84' },
    { label: '1컵 → g', category: 'cooking', from: 'cup', to: 'g', value: '1' },
    { label: '큰술 3 → ml', category: 'cooking', from: 'tbsp', to: 'ml', value: '3' },
    { label: '180cm → ft', category: 'length', from: 'cm', to: 'ft', value: '180' },
    { label: '1근 → g', category: 'weight', from: 'geun', to: 'g_w', value: '1' },
    { label: '100°F → °C', category: 'temperature', from: 'fahrenheit', to: 'celsius', value: '100' },
];

export default function UnitConverter() {
    const [category, setCategory] = useState<CategoryKey>('realestate');
    const [fromUnit, setFromUnit] = useState<string>('pyeong');
    const [toUnit, setToUnit] = useState<string>('sqm');
    const [inputValue, setInputValue] = useState<string>('25');

    const currentGroup = unitCategories[category];

    // 카테고리 변경 시 기본 단위 설정
    const handleCategoryChange = (newCat: CategoryKey) => {
        setCategory(newCat);
        const units = unitCategories[newCat].units;
        setFromUnit(units[0].id);
        setToUnit(units[1].id);
        setInputValue('1');
    };

    // 단위 교체
    const swapUnits = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    // 변환 계산
    const result = useMemo(() => {
        const val = parseFloat(inputValue);
        if (isNaN(val)) return null;

        const from = currentGroup.units.find(u => u.id === fromUnit);
        const to = currentGroup.units.find(u => u.id === toUnit);
        if (!from || !to) return null;

        const baseValue = from.toBase(val);
        const converted = to.fromBase(baseValue);
        return converted;
    }, [inputValue, fromUnit, toUnit, currentGroup]);

    // 모든 단위로 변환
    const allConversions = useMemo(() => {
        const val = parseFloat(inputValue);
        if (isNaN(val)) return [];

        const from = currentGroup.units.find(u => u.id === fromUnit);
        if (!from) return [];

        const baseValue = from.toBase(val);
        return currentGroup.units
            .filter(u => u.id !== fromUnit)
            .map(u => ({
                label: u.label,
                value: u.fromBase(baseValue),
                id: u.id,
            }));
    }, [inputValue, fromUnit, currentGroup]);

    const formatResult = (num: number) => {
        if (Math.abs(num) >= 1000000) return num.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
        if (Math.abs(num) >= 1) return num.toLocaleString('ko-KR', { maximumFractionDigits: 4 });
        if (Math.abs(num) >= 0.01) return num.toLocaleString('ko-KR', { maximumFractionDigits: 6 });
        return num.toExponential(4);
    };

    const applyQuick = (q: typeof quickConversions[0]) => {
        setCategory(q.category);
        setFromUnit(q.from);
        setToUnit(q.to);
        setInputValue(q.value);
    };

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation />
            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* 페이지 헤더 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/10 mb-4">
                        <ArrowLeftRight className="w-8 h-8 text-[var(--primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">단위 변환기</h1>
                    <p className="text-[var(--muted-foreground)]">
                        부동산 면적, 요리 계량, 길이, 무게, 온도를 쉽게 변환하세요
                    </p>
                </div>

                {/* 카테고리 탭 */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                    {(Object.keys(unitCategories) as CategoryKey[]).map((key) => {
                        const group = unitCategories[key];
                        return (
                            <button
                                key={key}
                                onClick={() => handleCategoryChange(key)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                                    category === key
                                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg'
                                        : 'bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                                }`}
                            >
                                {group.icon}
                                {group.label}
                            </button>
                        );
                    })}
                </div>

                {/* 빠른 변환 */}
                <div className="mb-6">
                    <p className="text-xs text-[var(--muted-foreground)] mb-2">자주 쓰는 변환</p>
                    <div className="flex flex-wrap gap-2">
                        {quickConversions.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => applyQuick(q)}
                                className="text-xs px-3 py-1.5 bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--foreground)] rounded-full transition-colors"
                            >
                                {q.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 변환 입력 */}
                <div className="bg-[var(--card)] p-4 sm:p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-6">
                    {/* FROM */}
                    <div className="mb-4">
                        <label className="text-sm font-bold text-[var(--muted-foreground)] mb-2 block">변환할 값</label>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <select
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value)}
                                className="w-full sm:w-44 p-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] font-medium text-sm order-first"
                            >
                                {currentGroup.units.map(u => (
                                    <option key={u.id} value={u.id}>{u.label}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                inputMode="decimal"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value.replace(/[^0-9.\-]/g, ''))}
                                className="flex-1 p-3 sm:p-4 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none text-right text-xl sm:text-2xl font-bold bg-[var(--background)] text-[var(--foreground)]"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* 교체 버튼 */}
                    <div className="flex justify-center my-2 sm:my-3">
                        <button
                            onClick={swapUnits}
                            className="p-2.5 sm:p-3 bg-[var(--secondary)] hover:bg-[var(--muted)] rounded-full transition-all hover:scale-110 active:scale-95"
                        >
                            <ArrowLeftRight className="w-5 h-5 text-[var(--primary)]" />
                        </button>
                    </div>

                    {/* TO */}
                    <div className="mb-2">
                        <label className="text-sm font-bold text-[var(--muted-foreground)] mb-2 block">변환 결과</label>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <select
                                value={toUnit}
                                onChange={(e) => setToUnit(e.target.value)}
                                className="w-full sm:w-44 p-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] font-medium text-sm order-first"
                            >
                                {currentGroup.units.map(u => (
                                    <option key={u.id} value={u.id}>{u.label}</option>
                                ))}
                            </select>
                            <div className="flex-1 p-3 sm:p-4 border border-[var(--border)] rounded-xl bg-[var(--secondary)] text-right min-h-[52px] flex items-center justify-end">
                                <p className="text-xl sm:text-2xl font-extrabold text-[var(--primary)] break-all">
                                    {result !== null ? formatResult(result) : '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 변환 수식 */}
                    {result !== null && (
                        <p className="text-xs text-center text-[var(--muted-foreground)] mt-3 sm:mt-4 break-all">
                            {inputValue} {currentGroup.units.find(u => u.id === fromUnit)?.label} = {formatResult(result)} {currentGroup.units.find(u => u.id === toUnit)?.label}
                        </p>
                    )}
                </div>

                {/* 모든 단위 변환 결과 */}
                {allConversions.length > 0 && (
                    <div className="bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden mb-6">
                        <div className="p-4 bg-[var(--secondary)] border-b border-[var(--border)]">
                            <h3 className="font-bold text-[var(--foreground)]">
                                {inputValue} {currentGroup.units.find(u => u.id === fromUnit)?.label} =
                            </h3>
                        </div>
                        <div className="divide-y divide-[var(--border)]">
                            {allConversions.map((conv) => (
                                <div
                                    key={conv.id}
                                    className={`flex items-center justify-between p-4 ${
                                        conv.id === toUnit ? 'bg-[var(--primary)]/5' : ''
                                    }`}
                                >
                                    <span className="text-sm text-[var(--muted-foreground)]">{conv.label}</span>
                                    <span className={`font-bold ${
                                        conv.id === toUnit ? 'text-[var(--primary)] text-lg' : 'text-[var(--foreground)]'
                                    }`}>
                                        {formatResult(conv.value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 참고 정보 */}
                {category === 'realestate' && (
                    <div className="bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden mb-6">
                        <div className="p-4 bg-[var(--secondary)] border-b border-[var(--border)]">
                            <h3 className="font-bold text-[var(--foreground)]">자주 쓰는 부동산 면적</h3>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3">
                            {[
                                { label: '원룸/오피스텔', pyeong: '7~10평', sqm: '23~33㎡' },
                                { label: '국민평형 (소형)', pyeong: '18평', sqm: '59㎡' },
                                { label: '국민평형 (중형)', pyeong: '25평', sqm: '84㎡' },
                                { label: '국민평형 (대형)', pyeong: '34평', sqm: '114㎡' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-[var(--secondary)] p-3 rounded-lg">
                                    <p className="text-xs font-bold text-[var(--foreground)]">{item.label}</p>
                                    <p className="text-sm text-[var(--primary)] font-bold">{item.pyeong}</p>
                                    <p className="text-xs text-[var(--muted-foreground)]">{item.sqm}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {category === 'cooking' && (
                    <div className="bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden mb-6">
                        <div className="p-4 bg-[var(--secondary)] border-b border-[var(--border)]">
                            <h3 className="font-bold text-[var(--foreground)]">요리 계량 팁</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-[var(--foreground)] mb-2">기본 계량 기준 (한국)</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: '1컵', value: '200ml' },
                                        { label: '1큰술', value: '15ml' },
                                        { label: '1작은술', value: '5ml' },
                                        { label: '1종이컵', value: '180ml' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-[var(--secondary)] p-2 rounded-lg flex justify-between">
                                            <span className="text-xs font-bold text-[var(--foreground)]">{item.label}</span>
                                            <span className="text-xs text-[var(--primary)] font-bold">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[var(--foreground)] mb-2">재료별 1큰술 무게</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: '설탕', value: '12g' },
                                        { label: '소금 (굵은)', value: '15g' },
                                        { label: '밀가루', value: '8g' },
                                        { label: '간장', value: '17g' },
                                        { label: '식용유', value: '13g' },
                                        { label: '고춧가루', value: '8g' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-[var(--secondary)] p-2 rounded-lg flex justify-between">
                                            <span className="text-xs text-[var(--foreground)]">{item.label}</span>
                                            <span className="text-xs text-[var(--primary)] font-bold">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {category === 'temperature' && (
                    <div className="bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden mb-6">
                        <div className="p-4 bg-[var(--secondary)] border-b border-[var(--border)]">
                            <h3 className="font-bold text-[var(--foreground)]">온도 변환 참고</h3>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3">
                            {[
                                { label: '물 어는 점', celsius: '0°C', fahrenheit: '32°F' },
                                { label: '체온', celsius: '36.5°C', fahrenheit: '97.7°F' },
                                { label: '물 끓는 점', celsius: '100°C', fahrenheit: '212°F' },
                                { label: '오븐 (중온)', celsius: '180°C', fahrenheit: '356°F' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-[var(--secondary)] p-3 rounded-lg">
                                    <p className="text-xs font-bold text-[var(--foreground)]">{item.label}</p>
                                    <p className="text-sm text-[var(--primary)] font-bold">{item.celsius}</p>
                                    <p className="text-xs text-[var(--muted-foreground)]">{item.fahrenheit}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
