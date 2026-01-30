"use client";

import { useState, useMemo } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  TrendingUp,
  DollarSign,
  Calculator,
  Info,
  ChevronDown,
  ChevronUp,
  Wallet,
  PiggyBank,
  Target,
  Building2,
} from "lucide-react";

// 인기 ETF 데이터 (2024년 기준 대략적인 수치)
const ETF_DATA = [
  {
    id: "jepi",
    name: "JEPI",
    fullName: "JPMorgan Equity Premium Income ETF",
    price: 56.5, // USD
    dividendYield: 7.5, // 연 배당수익률 %
    dividendFrequency: "monthly",
    currency: "USD",
    description: "월배당 고배당 ETF, 커버드콜 전략",
    category: "고배당",
  },
  {
    id: "jepq",
    name: "JEPQ",
    fullName: "JPMorgan Nasdaq Equity Premium Income ETF",
    price: 54.0,
    dividendYield: 9.0,
    dividendFrequency: "monthly",
    currency: "USD",
    description: "나스닥 기반 월배당 ETF",
    category: "고배당",
  },
  {
    id: "schd",
    name: "SCHD",
    fullName: "Schwab U.S. Dividend Equity ETF",
    price: 78.5,
    dividendYield: 3.5,
    dividendFrequency: "quarterly",
    currency: "USD",
    description: "배당성장 ETF, 분기배당",
    category: "배당성장",
  },
  {
    id: "vym",
    name: "VYM",
    fullName: "Vanguard High Dividend Yield ETF",
    price: 118.0,
    dividendYield: 3.0,
    dividendFrequency: "quarterly",
    currency: "USD",
    description: "뱅가드 고배당 ETF",
    category: "배당성장",
  },
  {
    id: "qyld",
    name: "QYLD",
    fullName: "Global X NASDAQ 100 Covered Call ETF",
    price: 17.5,
    dividendYield: 11.5,
    dividendFrequency: "monthly",
    currency: "USD",
    description: "나스닥100 커버드콜 월배당",
    category: "고배당",
  },
  {
    id: "tiger-dividend",
    name: "TIGER 미국배당다우존스",
    fullName: "TIGER 미국배당다우존스 ETF",
    price: 12500,
    dividendYield: 3.2,
    dividendFrequency: "monthly",
    currency: "KRW",
    description: "국내 상장 미국배당 ETF",
    category: "국내상장",
  },
  {
    id: "tiger-schd",
    name: "TIGER 미국배당+7%프리미엄다우존스",
    fullName: "TIGER 미국배당+7%프리미엄다우존스 ETF",
    price: 10200,
    dividendYield: 10.0,
    dividendFrequency: "monthly",
    currency: "KRW",
    description: "국내 상장 고배당 커버드콜",
    category: "국내상장",
  },
  {
    id: "kodex-dividend",
    name: "KODEX 미국배당프리미엄액티브",
    fullName: "KODEX 미국배당프리미엄액티브 ETF",
    price: 11000,
    dividendYield: 8.5,
    dividendFrequency: "monthly",
    currency: "KRW",
    description: "국내 상장 액티브 배당 ETF",
    category: "국내상장",
  },
  {
    id: "custom",
    name: "직접 입력",
    fullName: "사용자 지정 ETF",
    price: 0,
    dividendYield: 0,
    dividendFrequency: "monthly",
    currency: "USD",
    description: "ETF 정보를 직접 입력하세요",
    category: "커스텀",
  },
];

type CalculationMode = "monthly" | "yearly" | "total";

export default function ETFCalculatorPage() {
  // 선택된 ETF
  const [selectedETFId, setSelectedETFId] = useState("jepi");

  // 커스텀 ETF 입력값
  const [customPrice, setCustomPrice] = useState("");
  const [customYield, setCustomYield] = useState("");
  const [customCurrency, setCustomCurrency] = useState<"USD" | "KRW">("USD");

  // 목표 금액 관련
  const [calculationMode, setCalculationMode] =
    useState<CalculationMode>("monthly");
  const [targetAmount, setTargetAmount] = useState("");

  // 환율
  const [exchangeRate, setExchangeRate] = useState("1350");

  // 세금 옵션
  const [applyTax, setApplyTax] = useState(true);
  const taxRate = 15.4; // 배당소득세 15.4%

  // 상세 정보 토글
  const [showDetails, setShowDetails] = useState(false);

  // 선택된 ETF 정보
  const selectedETF = ETF_DATA.find((etf) => etf.id === selectedETFId)!;

  // 실제 사용할 ETF 값 (커스텀인 경우 입력값 사용)
  const effectivePrice =
    selectedETFId === "custom"
      ? parseFloat(customPrice.replace(/,/g, "")) || 0
      : selectedETF.price;

  const effectiveYield =
    selectedETFId === "custom"
      ? parseFloat(customYield) || 0
      : selectedETF.dividendYield;

  const effectiveCurrency =
    selectedETFId === "custom" ? customCurrency : selectedETF.currency;

  // 계산 로직
  const result = useMemo(() => {
    const target = parseFloat(targetAmount.replace(/,/g, "")) || 0;
    const rate = parseFloat(exchangeRate.replace(/,/g, "")) || 1350;

    if (target <= 0 || effectivePrice <= 0 || effectiveYield <= 0) {
      return null;
    }

    // 목표 금액을 연간 배당금으로 변환 (원화 기준)
    let targetYearlyKRW: number;
    if (calculationMode === "monthly") {
      targetYearlyKRW = target * 12;
    } else if (calculationMode === "yearly") {
      targetYearlyKRW = target;
    } else {
      // total: 목표 총 투자금액에서 발생하는 배당금 계산 (역방향)
      const totalInvestKRW = target;
      const priceKRW =
        effectiveCurrency === "USD" ? effectivePrice * rate : effectivePrice;
      const sharesFromTotal = Math.floor(totalInvestKRW / priceKRW);
      const actualInvestKRW = sharesFromTotal * priceKRW;
      const yearlyDividendKRW = actualInvestKRW * (effectiveYield / 100);
      const afterTaxYearlyKRW = applyTax
        ? yearlyDividendKRW * (1 - taxRate / 100)
        : yearlyDividendKRW;

      return {
        mode: "total" as const,
        shares: sharesFromTotal,
        totalInvestmentKRW: actualInvestKRW,
        totalInvestmentUSD:
          effectiveCurrency === "USD"
            ? sharesFromTotal * effectivePrice
            : actualInvestKRW / rate,
        yearlyDividendKRW: afterTaxYearlyKRW,
        monthlyDividendKRW: afterTaxYearlyKRW / 12,
        yearlyDividendUSD:
          effectiveCurrency === "USD"
            ? (sharesFromTotal *
                effectivePrice *
                (effectiveYield / 100) *
                (applyTax ? 1 - taxRate / 100 : 1))
            : afterTaxYearlyKRW / rate,
        monthlyDividendUSD:
          effectiveCurrency === "USD"
            ? (sharesFromTotal *
                effectivePrice *
                (effectiveYield / 100) *
                (applyTax ? 1 - taxRate / 100 : 1)) /
              12
            : afterTaxYearlyKRW / rate / 12,
        pricePerShareKRW: priceKRW,
        pricePerShareUSD:
          effectiveCurrency === "USD" ? effectivePrice : priceKRW / rate,
        exchangeRate: rate,
        taxDeducted: applyTax,
      };
    }

    // 세전 배당금으로 역산 (세금 적용 시)
    const targetYearlyBeforeTax = applyTax
      ? targetYearlyKRW / (1 - taxRate / 100)
      : targetYearlyKRW;

    // 필요한 총 투자금액 (원화)
    const requiredInvestmentKRW = targetYearlyBeforeTax / (effectiveYield / 100);

    // 주당 가격 (원화)
    const priceKRW =
      effectiveCurrency === "USD" ? effectivePrice * rate : effectivePrice;

    // 필요한 주식 수
    const requiredShares = Math.ceil(requiredInvestmentKRW / priceKRW);

    // 실제 투자금액 (정수 주식 기준)
    const actualInvestmentKRW = requiredShares * priceKRW;
    const actualInvestmentUSD =
      effectiveCurrency === "USD"
        ? requiredShares * effectivePrice
        : actualInvestmentKRW / rate;

    // 실제 예상 배당금
    const actualYearlyDividendKRW = actualInvestmentKRW * (effectiveYield / 100);
    const afterTaxYearlyKRW = applyTax
      ? actualYearlyDividendKRW * (1 - taxRate / 100)
      : actualYearlyDividendKRW;

    return {
      mode: calculationMode,
      shares: requiredShares,
      totalInvestmentKRW: actualInvestmentKRW,
      totalInvestmentUSD: actualInvestmentUSD,
      yearlyDividendKRW: afterTaxYearlyKRW,
      monthlyDividendKRW: afterTaxYearlyKRW / 12,
      yearlyDividendUSD:
        effectiveCurrency === "USD"
          ? requiredShares *
            effectivePrice *
            (effectiveYield / 100) *
            (applyTax ? 1 - taxRate / 100 : 1)
          : afterTaxYearlyKRW / rate,
      monthlyDividendUSD:
        effectiveCurrency === "USD"
          ? (requiredShares *
              effectivePrice *
              (effectiveYield / 100) *
              (applyTax ? 1 - taxRate / 100 : 1)) /
            12
          : afterTaxYearlyKRW / rate / 12,
      pricePerShareKRW: priceKRW,
      pricePerShareUSD:
        effectiveCurrency === "USD" ? effectivePrice : priceKRW / rate,
      exchangeRate: rate,
      taxDeducted: applyTax,
    };
  }, [
    targetAmount,
    exchangeRate,
    effectivePrice,
    effectiveYield,
    effectiveCurrency,
    calculationMode,
    applyTax,
  ]);

  // 숫자 포맷팅
  const formatKRW = (value: number) =>
    new Intl.NumberFormat("ko-KR").format(Math.floor(value)) + "원";

  const formatUSD = (value: number) =>
    "$" + new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("ko-KR").format(value);

  // 입력값 포맷팅 핸들러
  const handleAmountChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue) {
      setter(parseInt(numericValue).toLocaleString());
    } else {
      setter("");
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--background)] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">
              ETF 배당금 역산 계산기
            </h1>
            <p className="text-[var(--muted-foreground)]">
              목표 배당금을 설정하고 필요한 투자금을 계산하세요
            </p>
          </div>

          {/* ETF 선택 */}
          <div className="bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--border)] p-6 mb-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              ETF 선택
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {ETF_DATA.map((etf) => (
                <button
                  key={etf.id}
                  onClick={() => setSelectedETFId(etf.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    selectedETFId === etf.id
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-[var(--border)] hover:border-purple-300"
                  }`}
                >
                  <div className="font-medium text-[var(--foreground)] text-sm">
                    {etf.name}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {etf.id === "custom"
                      ? "직접 입력"
                      : `${etf.dividendYield}% · ${etf.currency}`}
                  </div>
                </button>
              ))}
            </div>

            {/* 선택된 ETF 정보 */}
            {selectedETFId !== "custom" && (
              <div className="bg-[var(--secondary)] rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-[var(--foreground)]">
                      {selectedETF.fullName}
                    </div>
                    <div className="text-sm text-[var(--muted-foreground)] mt-1">
                      {selectedETF.description}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      selectedETF.category === "고배당"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : selectedETF.category === "배당성장"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {selectedETF.category}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      현재가
                    </div>
                    <div className="font-semibold text-[var(--foreground)]">
                      {selectedETF.currency === "USD"
                        ? formatUSD(selectedETF.price)
                        : formatKRW(selectedETF.price)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      배당수익률
                    </div>
                    <div className="font-semibold text-purple-600">
                      {selectedETF.dividendYield}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      배당주기
                    </div>
                    <div className="font-semibold text-[var(--foreground)]">
                      {selectedETF.dividendFrequency === "monthly"
                        ? "월배당"
                        : "분기배당"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 커스텀 ETF 입력 */}
            {selectedETFId === "custom" && (
              <div className="space-y-4 bg-[var(--secondary)] rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      주당 가격
                    </label>
                    <input
                      type="text"
                      value={customPrice}
                      onChange={(e) =>
                        handleAmountChange(e.target.value, setCustomPrice)
                      }
                      placeholder="예: 50"
                      className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      연 배당수익률 (%)
                    </label>
                    <input
                      type="text"
                      value={customYield}
                      onChange={(e) => setCustomYield(e.target.value)}
                      placeholder="예: 7.5"
                      className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    통화
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCustomCurrency("USD")}
                      className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                        customCurrency === "USD"
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-[var(--border)]"
                      }`}
                    >
                      USD (달러)
                    </button>
                    <button
                      onClick={() => setCustomCurrency("KRW")}
                      className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                        customCurrency === "KRW"
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-[var(--border)]"
                      }`}
                    >
                      KRW (원)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 목표 설정 */}
          <div className="bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--border)] p-6 mb-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              목표 설정
            </h2>

            {/* 계산 모드 선택 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                계산 방식
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCalculationMode("monthly")}
                  className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                    calculationMode === "monthly"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 font-medium"
                      : "border-[var(--border)] hover:border-purple-300"
                  }`}
                >
                  월 배당금 목표
                </button>
                <button
                  onClick={() => setCalculationMode("yearly")}
                  className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                    calculationMode === "yearly"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 font-medium"
                      : "border-[var(--border)] hover:border-purple-300"
                  }`}
                >
                  연 배당금 목표
                </button>
                <button
                  onClick={() => setCalculationMode("total")}
                  className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                    calculationMode === "total"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 font-medium"
                      : "border-[var(--border)] hover:border-purple-300"
                  }`}
                >
                  투자금으로 계산
                </button>
              </div>
            </div>

            {/* 목표 금액 입력 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                {calculationMode === "monthly"
                  ? "목표 월 배당금 (원)"
                  : calculationMode === "yearly"
                  ? "목표 연 배당금 (원)"
                  : "총 투자 금액 (원)"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={targetAmount}
                  onChange={(e) =>
                    handleAmountChange(e.target.value, setTargetAmount)
                  }
                  placeholder={
                    calculationMode === "monthly"
                      ? "예: 1,000,000"
                      : calculationMode === "yearly"
                      ? "예: 12,000,000"
                      : "예: 100,000,000"
                  }
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
                  원
                </span>
              </div>
              {/* 빠른 입력 버튼 */}
              <div className="flex flex-wrap gap-2 mt-2">
                {calculationMode === "monthly" ? (
                  <>
                    {[500000, 1000000, 2000000, 3000000, 5000000].map((val) => (
                      <button
                        key={val}
                        onClick={() => setTargetAmount(val.toLocaleString())}
                        className="px-3 py-1 text-xs rounded-lg bg-[var(--secondary)] hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        {val >= 1000000
                          ? `${val / 10000}만원`
                          : `${val / 10000}만원`}
                      </button>
                    ))}
                  </>
                ) : calculationMode === "yearly" ? (
                  <>
                    {[6000000, 12000000, 24000000, 36000000, 60000000].map(
                      (val) => (
                        <button
                          key={val}
                          onClick={() => setTargetAmount(val.toLocaleString())}
                          className="px-3 py-1 text-xs rounded-lg bg-[var(--secondary)] hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                        >
                          {val >= 10000000
                            ? `${val / 100000000}억원`
                            : `${val / 10000}만원`}
                        </button>
                      )
                    )}
                  </>
                ) : (
                  <>
                    {[50000000, 100000000, 200000000, 500000000, 1000000000].map(
                      (val) => (
                        <button
                          key={val}
                          onClick={() => setTargetAmount(val.toLocaleString())}
                          className="px-3 py-1 text-xs rounded-lg bg-[var(--secondary)] hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                        >
                          {val >= 100000000
                            ? `${val / 100000000}억원`
                            : `${val / 10000}만원`}
                        </button>
                      )
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 환율 */}
            {effectiveCurrency === "USD" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  환율 (원/달러)
                </label>
                <input
                  type="text"
                  value={exchangeRate}
                  onChange={(e) =>
                    handleAmountChange(e.target.value, setExchangeRate)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}

            {/* 세금 옵션 */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyTax}
                  onChange={(e) => setApplyTax(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
              <span className="text-sm text-[var(--foreground)]">
                배당소득세 {taxRate}% 적용
              </span>
              <div className="group relative">
                <Info className="w-4 h-4 text-[var(--muted-foreground)] cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  해외 ETF 배당금에는 15.4%의 배당소득세가 부과됩니다
                </div>
              </div>
            </div>
          </div>

          {/* 결과 */}
          {result && (
            <div className="bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--border)] p-6 mb-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-500" />
                계산 결과
              </h2>

              {/* 핵심 결과 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white">
                  <div className="text-sm opacity-90">필요 수량</div>
                  <div className="text-3xl font-bold mt-1">
                    {formatNumber(result.shares)}
                    <span className="text-lg ml-1">주</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
                  <div className="text-sm opacity-90">총 투자금</div>
                  <div className="text-2xl font-bold mt-1">
                    {result.totalInvestmentKRW >= 100000000
                      ? `${(result.totalInvestmentKRW / 100000000).toFixed(2)}억원`
                      : `${Math.floor(result.totalInvestmentKRW / 10000).toLocaleString()}만원`}
                  </div>
                  {effectiveCurrency === "USD" && (
                    <div className="text-sm opacity-75 mt-1">
                      {formatUSD(result.totalInvestmentUSD)}
                    </div>
                  )}
                </div>
              </div>

              {/* 배당금 정보 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[var(--secondary)] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[var(--muted-foreground)] text-sm">
                    <Wallet className="w-4 h-4" />
                    예상 월 배당금
                  </div>
                  <div className="text-xl font-bold text-[var(--foreground)] mt-1">
                    {formatKRW(result.monthlyDividendKRW)}
                  </div>
                  {effectiveCurrency === "USD" && (
                    <div className="text-sm text-[var(--muted-foreground)]">
                      {formatUSD(result.monthlyDividendUSD)}
                    </div>
                  )}
                </div>
                <div className="bg-[var(--secondary)] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[var(--muted-foreground)] text-sm">
                    <PiggyBank className="w-4 h-4" />
                    예상 연 배당금
                  </div>
                  <div className="text-xl font-bold text-[var(--foreground)] mt-1">
                    {formatKRW(result.yearlyDividendKRW)}
                  </div>
                  {effectiveCurrency === "USD" && (
                    <div className="text-sm text-[var(--muted-foreground)]">
                      {formatUSD(result.yearlyDividendUSD)}
                    </div>
                  )}
                </div>
              </div>

              {/* 상세 정보 토글 */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-center gap-2 py-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                상세 정보
                {showDetails ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showDetails && (
                <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">
                      주당 가격
                    </span>
                    <span className="text-[var(--foreground)] font-medium">
                      {effectiveCurrency === "USD"
                        ? `${formatUSD(result.pricePerShareUSD)} (${formatKRW(result.pricePerShareKRW)})`
                        : formatKRW(result.pricePerShareKRW)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">
                      적용 배당수익률
                    </span>
                    <span className="text-[var(--foreground)] font-medium">
                      연 {effectiveYield}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">
                      배당소득세
                    </span>
                    <span className="text-[var(--foreground)] font-medium">
                      {result.taxDeducted ? `${taxRate}% 적용됨` : "미적용"}
                    </span>
                  </div>
                  {effectiveCurrency === "USD" && (
                    <div className="flex justify-between">
                      <span className="text-[var(--muted-foreground)]">
                        적용 환율
                      </span>
                      <span className="text-[var(--foreground)] font-medium">
                        {formatNumber(result.exchangeRate)}원/달러
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">
                      총 투자금 (원화)
                    </span>
                    <span className="text-[var(--foreground)] font-medium">
                      {formatKRW(result.totalInvestmentKRW)}
                    </span>
                  </div>
                  {effectiveCurrency === "USD" && (
                    <div className="flex justify-between">
                      <span className="text-[var(--muted-foreground)]">
                        총 투자금 (달러)
                      </span>
                      <span className="text-[var(--foreground)] font-medium">
                        {formatUSD(result.totalInvestmentUSD)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ETF 비교 테이블 */}
          <div className="bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--border)] p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-500" />
              인기 ETF 배당 정보 비교
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 px-2 text-[var(--muted-foreground)] font-medium">
                      ETF
                    </th>
                    <th className="text-right py-2 px-2 text-[var(--muted-foreground)] font-medium">
                      가격
                    </th>
                    <th className="text-right py-2 px-2 text-[var(--muted-foreground)] font-medium">
                      배당률
                    </th>
                    <th className="text-right py-2 px-2 text-[var(--muted-foreground)] font-medium">
                      주기
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ETF_DATA.filter((etf) => etf.id !== "custom").map((etf) => (
                    <tr
                      key={etf.id}
                      className={`border-b border-[var(--border)] last:border-0 cursor-pointer hover:bg-[var(--secondary)] transition-colors ${
                        selectedETFId === etf.id ? "bg-purple-50 dark:bg-purple-900/20" : ""
                      }`}
                      onClick={() => setSelectedETFId(etf.id)}
                    >
                      <td className="py-3 px-2">
                        <div className="font-medium text-[var(--foreground)]">
                          {etf.name}
                        </div>
                        <div className="text-xs text-[var(--muted-foreground)]">
                          {etf.description}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right text-[var(--foreground)]">
                        {etf.currency === "USD"
                          ? formatUSD(etf.price)
                          : formatKRW(etf.price)}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span
                          className={`font-semibold ${
                            etf.dividendYield >= 8
                              ? "text-red-500"
                              : etf.dividendYield >= 5
                              ? "text-orange-500"
                              : "text-green-500"
                          }`}
                        >
                          {etf.dividendYield}%
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right text-[var(--muted-foreground)]">
                        {etf.dividendFrequency === "monthly" ? "월" : "분기"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-[var(--muted-foreground)] mt-4">
              * 위 데이터는 참고용이며, 실제 가격과 배당률은 변동될 수 있습니다.
              투자 전 최신 정보를 확인하세요.
            </p>
          </div>

          {/* 안내 */}
          <div className="mt-6 p-4 bg-[var(--secondary)] rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[var(--muted-foreground)]">
                <p className="font-medium text-[var(--foreground)] mb-1">
                  계산기 사용 안내
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    배당금은 과거 데이터 기반 추정치이며, 실제 배당금은 달라질 수
                    있습니다.
                  </li>
                  <li>
                    해외 ETF의 경우 환율 변동에 따라 원화 기준 수익이 달라집니다.
                  </li>
                  <li>배당소득세 15.4%는 금융소득 2,000만원 이하 기준입니다.</li>
                  <li>
                    투자 결정 전 반드시 전문가 상담과 최신 ETF 정보를 확인하세요.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
