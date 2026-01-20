'use client';

import { useState } from 'react';
import Header from '../components/Header';

type CalculationMode = 'findPercent' | 'findValue' | 'findChange' | 'findRatio';

export default function PercentCalculator() {
    const [mode, setMode] = useState<CalculationMode>('findPercent');

    // 콤마 포맷팅 헬퍼 함수
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
        // 소수점 처리
        if (raw.includes('.')) {
            const [integer, decimal] = raw.split('.');
            const formattedInteger = integer ? parseFloat(integer).toLocaleString('ko-KR') : '0';
            setDisplay(`${formattedInteger}.${decimal}`);
            setRaw(raw);
        } else {
            const num = parseFloat(raw);
            if (!isNaN(num)) {
                setDisplay(num.toLocaleString('ko-KR'));
                setRaw(raw);
            }
        }
    };

    // 모드 1: A의 B%는? (값 구하기)
    const [baseValueDisplay, setBaseValueDisplay] = useState<string>('100');
    const [baseValue, setBaseValue] = useState<string>('100');
    const [percentValueDisplay, setPercentValueDisplay] = useState<string>('25');
    const [percentValue, setPercentValue] = useState<string>('25');

    // 모드 2: A는 B의 몇 %? (퍼센트 구하기)
    const [partValueDisplay, setPartValueDisplay] = useState<string>('25');
    const [partValue, setPartValue] = useState<string>('25');
    const [wholeValueDisplay, setWholeValueDisplay] = useState<string>('100');
    const [wholeValue, setWholeValue] = useState<string>('100');

    // 모드 3: 증감률 계산
    const [originalValueDisplay, setOriginalValueDisplay] = useState<string>('100');
    const [originalValue, setOriginalValue] = useState<string>('100');
    const [newValueDisplay, setNewValueDisplay] = useState<string>('125');
    const [newValue, setNewValue] = useState<string>('125');

    // 모드 4: 비율 계산
    const [ratioA, setRatioA] = useState<string>('3');
    const [ratioB, setRatioB] = useState<string>('7');
    const [totalAmountDisplay, setTotalAmountDisplay] = useState<string>('1,000');
    const [totalAmount, setTotalAmount] = useState<string>('1000');

    // 계산 결과
    const calculateResult = () => {
        const fmt = (v: string) => formatWithComma(v);
        switch (mode) {
            case 'findPercent': {
                const base = parseFloat(baseValue) || 0;
                const percent = parseFloat(percentValue) || 0;
                return {
                    result: (base * percent) / 100,
                    formula: `${fmt(baseValue)} × ${percentValue}% = ${((base * percent) / 100).toLocaleString('ko-KR', { maximumFractionDigits: 2 })}`,
                    description: `${fmt(baseValue)}의 ${percentValue}%는`
                };
            }
            case 'findValue': {
                const part = parseFloat(partValue) || 0;
                const whole = parseFloat(wholeValue) || 0;
                const percent = whole !== 0 ? (part / whole) * 100 : 0;
                return {
                    result: percent,
                    formula: `${fmt(partValue)} ÷ ${fmt(wholeValue)} × 100 = ${percent.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}%`,
                    description: `${fmt(partValue)}은(는) ${fmt(wholeValue)}의`
                };
            }
            case 'findChange': {
                const original = parseFloat(originalValue) || 0;
                const newVal = parseFloat(newValue) || 0;
                const change = original !== 0 ? ((newVal - original) / original) * 100 : 0;
                const isIncrease = change >= 0;
                return {
                    result: change,
                    formula: `(${fmt(newValue)} - ${fmt(originalValue)}) ÷ ${fmt(originalValue)} × 100 = ${change >= 0 ? '+' : ''}${change.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}%`,
                    description: `${fmt(originalValue)}에서 ${fmt(newValue)}(으)로`,
                    isIncrease
                };
            }
            case 'findRatio': {
                const a = parseFloat(ratioA) || 0;
                const b = parseFloat(ratioB) || 0;
                const total = parseFloat(totalAmount) || 0;
                const sum = a + b;
                const amountA = sum !== 0 ? (a / sum) * total : 0;
                const amountB = sum !== 0 ? (b / sum) * total : 0;
                const percentA = sum !== 0 ? (a / sum) * 100 : 0;
                const percentB = sum !== 0 ? (b / sum) * 100 : 0;
                return {
                    result: { amountA, amountB, percentA, percentB },
                    formula: `${ratioA} : ${ratioB} 비율로 ${fmt(totalAmount)} 분배`,
                    description: `총 ${fmt(totalAmount)}을(를) ${ratioA}:${ratioB} 비율로 나누면`
                };
            }
        }
    };

    const result = calculateResult();

    const formatNumber = (num: number) => num.toLocaleString('ko-KR', { maximumFractionDigits: 2 });

    const modeConfig = {
        findPercent: { label: '값 구하기', color: 'green', description: 'A의 B%는 얼마?' },
        findValue: { label: '퍼센트 구하기', color: 'blue', description: 'A는 B의 몇 %?' },
        findChange: { label: '증감률 계산', color: 'purple', description: '변화율 계산하기' },
        findRatio: { label: '비율 분배', color: 'orange', description: '비율로 나누기' }
    };

    const currentConfig = modeConfig[mode];

    // 모드별 예시 데이터
    const examples = {
        findPercent: [
            { label: '월급의 10% 저축', base: '3000000', percent: '10', desc: '월급 300만원의 10%' },
            { label: '20% 할인가 계산', base: '50000', percent: '20', desc: '5만원의 20% 할인' },
            { label: '팁 15% 계산', base: '85000', percent: '15', desc: '식사비 8.5만원의 15%' },
            { label: '부가세 10%', base: '100000', percent: '10', desc: '10만원의 부가세' },
        ],
        findValue: [
            { label: '시험 점수 비율', part: '85', whole: '100', desc: '100점 만점에 85점' },
            { label: '목표 달성률', part: '750000', whole: '1000000', desc: '목표 100만원 중 75만원 달성' },
            { label: '출석률 계산', part: '18', whole: '20', desc: '20일 중 18일 출석' },
            { label: '할인율 역산', part: '8000', whole: '10000', desc: '1만원이 8천원으로 할인' },
        ],
        findChange: [
            { label: '월급 인상률', original: '3000000', newVal: '3300000', desc: '300만원 → 330만원' },
            { label: '주가 변동', original: '50000', newVal: '45000', desc: '5만원 → 4.5만원' },
            { label: '체중 변화', original: '70', newVal: '65', desc: '70kg → 65kg' },
            { label: '매출 성장률', original: '10000000', newVal: '15000000', desc: '1천만원 → 1.5천만원' },
        ],
        findRatio: [
            { label: '투자금 배분', ratioA: '6', ratioB: '4', total: '10000000', desc: '1천만원을 6:4로' },
            { label: '공동구매 분담', ratioA: '3', ratioB: '2', total: '50000', desc: '5만원을 3:2로' },
            { label: '상속 비율', ratioA: '1', ratioB: '1', total: '500000000', desc: '5억을 1:1로' },
            { label: '파트너 수익 배분', ratioA: '7', ratioB: '3', total: '1000000', desc: '100만원을 7:3으로' },
        ],
    };

    const applyExample = (example: typeof examples.findPercent[0] | typeof examples.findValue[0] | typeof examples.findChange[0] | typeof examples.findRatio[0]) => {
        if (mode === 'findPercent' && 'base' in example) {
            setBaseValue(example.base);
            setBaseValueDisplay(formatWithComma(example.base));
            setPercentValue(example.percent);
            setPercentValueDisplay(example.percent);
        } else if (mode === 'findValue' && 'part' in example) {
            setPartValue(example.part);
            setPartValueDisplay(formatWithComma(example.part));
            setWholeValue(example.whole);
            setWholeValueDisplay(formatWithComma(example.whole));
        } else if (mode === 'findChange' && 'original' in example) {
            setOriginalValue(example.original);
            setOriginalValueDisplay(formatWithComma(example.original));
            setNewValue(example.newVal);
            setNewValueDisplay(formatWithComma(example.newVal));
        } else if (mode === 'findRatio' && 'ratioA' in example) {
            setRatioA(example.ratioA);
            setRatioB(example.ratioB);
            setTotalAmount(example.total);
            setTotalAmountDisplay(formatWithComma(example.total));
        }
    };

    return (
        <>
            <Header />
            <div className="max-w-xl mx-auto my-10 font-sans px-4">
                {/* 탭 메뉴 */}
                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl mb-6">
                    {(Object.keys(modeConfig) as CalculationMode[]).map((key) => (
                        <button
                            key={key}
                            onClick={() => setMode(key)}
                            className={`py-3 rounded-lg text-sm font-bold transition-all ${
                                mode === key
                                    ? `bg-white text-${modeConfig[key].color}-700 shadow-sm`
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            style={mode === key ? { color: getColor(modeConfig[key].color) } : {}}
                        >
                            {modeConfig[key].label}
                        </button>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8">
                    <p className="text-sm text-gray-500 mb-4 text-center">{currentConfig.description}</p>

                    {/* 모드별 입력 영역 */}
                    {mode === 'findPercent' && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-600 mb-2 block">기준 값</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={baseValueDisplay}
                                    onChange={(e) => handleInputChange(e.target.value, setBaseValueDisplay, setBaseValue)}
                                    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-right text-2xl font-extrabold text-green-700"
                                    placeholder="100"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-600 mb-2 block">퍼센트 (%)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={percentValueDisplay}
                                        onChange={(e) => handleInputChange(e.target.value, setPercentValueDisplay, setPercentValue)}
                                        className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-right text-2xl font-extrabold text-green-700 pr-12"
                                        placeholder="25"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">%</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === 'findValue' && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-600 mb-2 block">부분 값 (A)</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={partValueDisplay}
                                    onChange={(e) => handleInputChange(e.target.value, setPartValueDisplay, setPartValue)}
                                    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-right text-2xl font-extrabold text-blue-700"
                                    placeholder="25"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-600 mb-2 block">전체 값 (B)</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={wholeValueDisplay}
                                    onChange={(e) => handleInputChange(e.target.value, setWholeValueDisplay, setWholeValue)}
                                    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-right text-2xl font-extrabold text-blue-700"
                                    placeholder="100"
                                />
                            </div>
                        </div>
                    )}

                    {mode === 'findChange' && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-600 mb-2 block">이전 값</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={originalValueDisplay}
                                    onChange={(e) => handleInputChange(e.target.value, setOriginalValueDisplay, setOriginalValue)}
                                    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-right text-2xl font-extrabold text-purple-700"
                                    placeholder="100"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-600 mb-2 block">현재 값</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={newValueDisplay}
                                    onChange={(e) => handleInputChange(e.target.value, setNewValueDisplay, setNewValue)}
                                    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-right text-2xl font-extrabold text-purple-700"
                                    placeholder="125"
                                />
                            </div>
                        </div>
                    )}

                    {mode === 'findRatio' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-600 mb-2 block">비율 A</label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={ratioA}
                                        onChange={(e) => setRatioA(e.target.value.replace(/[^0-9.]/g, ''))}
                                        className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-right text-xl font-extrabold text-orange-700"
                                        placeholder="3"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-600 mb-2 block">비율 B</label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={ratioB}
                                        onChange={(e) => setRatioB(e.target.value.replace(/[^0-9.]/g, ''))}
                                        className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-right text-xl font-extrabold text-orange-700"
                                        placeholder="7"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-600 mb-2 block">총 금액/수량</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={totalAmountDisplay}
                                    onChange={(e) => handleInputChange(e.target.value, setTotalAmountDisplay, setTotalAmount)}
                                    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-right text-2xl font-extrabold text-orange-700"
                                    placeholder="1,000"
                                />
                            </div>
                        </div>
                    )}

                        {/* 예시 버튼 */}
                    <div className="mt-4 mb-2">
                        <p className="text-xs text-gray-400 mb-2">예시를 클릭하면 자동 입력됩니다</p>
                        <div className="flex flex-wrap gap-2">
                            {examples[mode].map((example, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => applyExample(example)}
                                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                                    title={example.desc}
                                >
                                    {example.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 결과 표시 */}
                    <div className={`mt-6 p-5 rounded-xl border ${getResultStyle(currentConfig.color)}`}>
                        {mode === 'findPercent' && (
                            <>
                                <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                                <p className="text-3xl font-extrabold text-green-700">
                                    {formatNumber(result.result as number)}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">{result.formula}</p>
                            </>
                        )}

                        {mode === 'findValue' && (
                            <>
                                <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                                <p className="text-3xl font-extrabold text-blue-700">
                                    {formatNumber(result.result as number)}%
                                </p>
                                <p className="text-xs text-gray-400 mt-2">{result.formula}</p>
                            </>
                        )}

                        {mode === 'findChange' && (
                            <>
                                <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                                <p className={`text-3xl font-extrabold ${(result as { isIncrease: boolean }).isIncrease ? 'text-red-600' : 'text-blue-600'}`}>
                                    {(result.result as number) >= 0 ? '+' : ''}{formatNumber(result.result as number)}%
                                    <span className="text-lg ml-2">
                                        {(result as { isIncrease: boolean }).isIncrease ? '증가' : '감소'}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-400 mt-2">{result.formula}</p>
                            </>
                        )}

                        {mode === 'findRatio' && (
                            <>
                                <p className="text-sm text-gray-600 mb-3">{result.description}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">A의 몫</p>
                                        <p className="text-xl font-extrabold text-orange-700">
                                            {formatNumber((result.result as { amountA: number }).amountA)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            ({formatNumber((result.result as { percentA: number }).percentA)}%)
                                        </p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">B의 몫</p>
                                        <p className="text-xl font-extrabold text-orange-700">
                                            {formatNumber((result.result as { amountB: number }).amountB)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            ({formatNumber((result.result as { percentB: number }).percentB)}%)
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 퍼센트 예제 표 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-bold text-gray-700">자주 쓰는 퍼센트 계산</h3>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: '10% 할인', calc: '원가 × 0.9' },
                                { label: '20% 할인', calc: '원가 × 0.8' },
                                { label: '부가세 10%', calc: '금액 × 1.1' },
                                { label: '팁 15%', calc: '금액 × 1.15' },
                                { label: '50% 증가', calc: '원래 × 1.5' },
                                { label: '25% 감소', calc: '원래 × 0.75' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                    <p className="font-bold text-gray-700 text-sm">{item.label}</p>
                                    <p className="text-xs text-gray-500">{item.calc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function getColor(color: string): string {
    const colors: Record<string, string> = {
        green: '#15803d',
        blue: '#1d4ed8',
        purple: '#7e22ce',
        orange: '#c2410c'
    };
    return colors[color] || '#374151';
}

function getResultStyle(color: string): string {
    const styles: Record<string, string> = {
        green: 'bg-green-50 border-green-100',
        blue: 'bg-blue-50 border-blue-100',
        purple: 'bg-purple-50 border-purple-100',
        orange: 'bg-orange-50 border-orange-100'
    };
    return styles[color] || 'bg-gray-50 border-gray-100';
}
