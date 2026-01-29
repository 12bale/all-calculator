'use client';

import { useState, useMemo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import {
  Sparkles,
  PiggyBank,
  Receipt,
  Home,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Calculator
} from 'lucide-react';

// 청년 정책 데이터 타입
interface YouthPolicy {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  minAge: number;
  maxAge: number;
  maxIncome: number; // 연소득 기준 (만원)
  incomeType: 'personal' | 'household'; // 개인소득 or 가구소득
  benefit: (income: number, age: number) => number; // 혜택 계산 함수
  benefitDescription: string;
  description: string;
  period: string; // 혜택 기간
  conditions: string[];
  link: string;
}

// 청년 정책 목록
const youthPolicies: YouthPolicy[] = [
  {
    id: 'youth-jump',
    name: '청년도약계좌',
    category: '저축',
    icon: <PiggyBank className="w-5 h-5" />,
    color: 'blue',
    minAge: 19,
    maxAge: 34,
    maxIncome: 7500, // 개인소득 7,500만원 이하
    incomeType: 'personal',
    benefit: (income) => {
      // 소득구간별 정부기여금 (월)
      // 2,400만원 이하: 월 40만원 납입 시 월 2.4만원
      // 3,600만원 이하: 월 50만원 납입 시 월 2.3만원
      // 4,800만원 이하: 월 60만원 납입 시 월 2.2만원
      // 6,000만원 이하: 월 70만원 납입 시 월 2.1만원
      // 7,500만원 이하: 비과세만 적용
      let monthlyContribution = 0;
      if (income <= 2400) monthlyContribution = 24000;
      else if (income <= 3600) monthlyContribution = 23000;
      else if (income <= 4800) monthlyContribution = 22000;
      else if (income <= 6000) monthlyContribution = 21000;
      else monthlyContribution = 0;

      // 5년간 총 정부기여금 + 이자소득 비과세 혜택 (약 100만원 추정)
      const totalContribution = monthlyContribution * 12 * 5;
      const taxBenefit = income <= 7500 ? 1000000 : 0;
      return totalContribution + taxBenefit;
    },
    benefitDescription: '정부기여금 + 이자소득 비과세',
    description: '5년간 매월 70만원 한도로 적금하면 정부기여금과 비과세 혜택을 받는 청년 목돈 마련 상품',
    period: '5년',
    conditions: [
      '만 19~34세 청년',
      '개인소득 7,500만원 이하',
      '가구소득 중위 250% 이하',
      '직전 3개년 중 1회 이상 금융소득종합과세 대상자 제외'
    ],
    link: 'https://www.kinfa.or.kr'
  },
  {
    id: 'youth-hope',
    name: '청년희망적금',
    category: '저축',
    icon: <PiggyBank className="w-5 h-5" />,
    color: 'green',
    minAge: 19,
    maxAge: 34,
    maxIncome: 3600,
    incomeType: 'personal',
    benefit: (income) => {
      // 2년 만기, 저축장려금 최대 36만원 + 이자소득 비과세
      if (income <= 3600) {
        return 360000 + 150000; // 저축장려금 + 비과세 혜택
      }
      return 0;
    },
    benefitDescription: '저축장려금 + 이자소득 비과세',
    description: '2년간 매월 50만원 한도로 적금하면 저축장려금과 비과세 혜택',
    period: '2년',
    conditions: [
      '만 19~34세 청년',
      '총급여 3,600만원 이하 또는 종합소득 2,600만원 이하',
      '직전 3개년 금융소득종합과세 대상자 제외'
    ],
    link: 'https://www.kinfa.or.kr'
  },
  {
    id: 'youth-income-tax',
    name: '청년 소득세 감면',
    category: '세금',
    icon: <Receipt className="w-5 h-5" />,
    color: 'purple',
    minAge: 15,
    maxAge: 34,
    maxIncome: 50000, // 사실상 제한 없음
    incomeType: 'personal',
    benefit: (income) => {
      // 소득세 90% 감면 (연 200만원 한도), 5년간
      // 대략적인 계산: 연소득의 약 3~5%가 소득세라고 가정
      const estimatedTax = income * 10000 * 0.04; // 4% 가정
      const reduction = Math.min(estimatedTax * 0.9, 2000000);
      return reduction * 5; // 5년간
    },
    benefitDescription: '소득세 90% 감면 (연 200만원 한도)',
    description: '중소기업 취업 청년의 소득세 90%를 5년간 감면 (연 200만원 한도)',
    period: '5년',
    conditions: [
      '만 15~34세 청년 (군복무기간 최대 6년 추가)',
      '중소기업 취업자',
      '감면기간 종료 후 2년 이내 재취업 시 잔여기간 적용'
    ],
    link: 'https://www.nts.go.kr'
  },
  {
    id: 'youth-housing',
    name: '청년 주거급여 분리지급',
    category: '주거',
    icon: <Home className="w-5 h-5" />,
    color: 'orange',
    minAge: 19,
    maxAge: 30,
    maxIncome: 2500, // 기준 중위소득 47%
    incomeType: 'household',
    benefit: () => {
      // 월 최대 약 32만원 (서울 기준)
      return 320000 * 12; // 연간
    },
    benefitDescription: '월 최대 32만원 (서울 기준)',
    description: '부모와 떨어져 사는 청년에게 주거급여를 별도 지급',
    period: '조건 충족 시 계속',
    conditions: [
      '만 19~30세 미혼 청년',
      '부모 가구가 주거급여 수급 가구',
      '부모와 별도 거주'
    ],
    link: 'https://www.myhome.go.kr'
  },
  {
    id: 'youth-intern',
    name: '청년내일채움공제',
    category: '취업',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'cyan',
    minAge: 15,
    maxAge: 34,
    maxIncome: 3500,
    incomeType: 'personal',
    benefit: () => {
      // 2년형: 본인 300만원 + 기업 300만원 + 정부 600만원 = 1,200만원
      return 12000000;
    },
    benefitDescription: '2년 후 1,200만원+ 목돈',
    description: '중소기업 취업 청년이 2년간 근속 시 본인·기업·정부가 공동 적립하여 목돈 마련',
    period: '2년',
    conditions: [
      '만 15~34세 청년',
      '중소·중견기업 정규직 취업자',
      '고용보험 가입 필수'
    ],
    link: 'https://www.work.go.kr/youngtomorrow'
  },
  {
    id: 'youth-loan',
    name: '청년전용 버팀목전세자금',
    category: '주거',
    icon: <Home className="w-5 h-5" />,
    color: 'indigo',
    minAge: 19,
    maxAge: 34,
    maxIncome: 5000,
    incomeType: 'personal',
    benefit: (income) => {
      // 연 1.8~2.4% 저금리 (시중금리 대비 약 2~3% 절감)
      // 최대 2억원 대출 시 연간 약 400~600만원 이자 절감
      if (income <= 2000) return 6000000 * 2; // 2년
      if (income <= 4000) return 5000000 * 2;
      return 4000000 * 2;
    },
    benefitDescription: '연 1.8~2.4% 저금리 전세대출',
    description: '청년에게 최대 2억원까지 저금리 전세자금 대출',
    period: '최초 2년 (4회 연장 가능)',
    conditions: [
      '만 19~34세 무주택 청년',
      '연소득 5,000만원 이하',
      '순자산 3.61억원 이하',
      '전세금 5억원 이하 주택'
    ],
    link: 'https://nhuf.molit.go.kr'
  },
  {
    id: 'national-scholarship',
    name: '국가장학금',
    category: '교육',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'pink',
    minAge: 18,
    maxAge: 30,
    maxIncome: 20000, // 8구간까지
    incomeType: 'household',
    benefit: (income) => {
      // 소득분위별 연간 장학금 (1년 기준, 4년제 기준)
      if (income <= 1500) return 7000000; // 1구간
      if (income <= 2500) return 7000000; // 2구간
      if (income <= 3500) return 7000000; // 3구간
      if (income <= 4500) return 5250000; // 4구간
      if (income <= 5500) return 4500000; // 5구간
      if (income <= 7000) return 3900000; // 6구간
      if (income <= 9000) return 3500000; // 7구간
      if (income <= 12000) return 1750000; // 8구간
      return 0;
    },
    benefitDescription: '연 최대 700만원 등록금 지원',
    description: '소득분위에 따라 대학 등록금 지원',
    period: '재학 중 매 학기',
    conditions: [
      '대한민국 국적 대학생',
      '소득 8구간 이하',
      '성적 기준 충족 (B학점 이상)'
    ],
    link: 'https://www.kosaf.go.kr'
  }
];

// 색상 스타일 매핑
const colorStyles: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-500' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-500' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-500' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-500' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-500' },
};

export default function YouthPolicyCalculator() {
  // 입력 상태
  const [age, setAge] = useState(27);
  const [ageInput, setAgeInput] = useState('27');
  const [income, setIncome] = useState(3500);
  const [incomeInput, setIncomeInput] = useState('3,500');
  const [isStudent, setIsStudent] = useState(false);
  const [isEmployed, setIsEmployed] = useState(true);
  const [isSME, setIsSME] = useState(false); // 중소기업 여부
  const [hasHouse, setHasHouse] = useState(false); // 주택 소유 여부

  // 결과 표시 상태
  const [showResults, setShowResults] = useState(false);
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);

  // 입력 핸들러
  const formatWithComma = (value: number) => value.toLocaleString('ko-KR');
  const parseNumber = (value: string) => {
    const num = parseInt(value.replace(/,/g, ''), 10);
    return isNaN(num) ? null : num;
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setAgeInput('');
      return;
    }
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setAgeInput(raw);
      setAge(num);
    }
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '');
    if (raw === '') {
      setIncomeInput('');
      return;
    }
    const num = parseNumber(raw);
    if (num !== null) {
      setIncomeInput(formatWithComma(num));
      setIncome(num);
    }
  };

  // 자격 요건 체크 및 혜택 계산
  const eligiblePolicies = useMemo(() => {
    return youthPolicies.map(policy => {
      const reasons: string[] = [];
      let isEligible = true;

      // 나이 체크
      if (age < policy.minAge || age > policy.maxAge) {
        isEligible = false;
        reasons.push(`연령 조건 미충족 (${policy.minAge}~${policy.maxAge}세)`);
      }

      // 소득 체크
      if (income > policy.maxIncome) {
        isEligible = false;
        reasons.push(`소득 조건 미충족 (${policy.maxIncome.toLocaleString()}만원 이하)`);
      }

      // 특수 조건 체크
      if (policy.id === 'youth-income-tax' && !isSME) {
        isEligible = false;
        reasons.push('중소기업 취업자만 해당');
      }

      if (policy.id === 'youth-intern' && !isSME) {
        isEligible = false;
        reasons.push('중소·중견기업 취업자만 해당');
      }

      if (policy.id === 'national-scholarship' && !isStudent) {
        isEligible = false;
        reasons.push('대학생만 해당');
      }

      if ((policy.id === 'youth-housing' || policy.id === 'youth-loan') && hasHouse) {
        isEligible = false;
        reasons.push('무주택자만 해당');
      }

      // 혜택 금액 계산
      const benefitAmount = isEligible ? policy.benefit(income, age) : 0;

      return {
        ...policy,
        isEligible,
        reasons,
        benefitAmount
      };
    });
  }, [age, income, isStudent, isSME, hasHouse]);

  // 총 예상 혜택
  const totalBenefit = useMemo(() => {
    return eligiblePolicies
      .filter(p => p.isEligible)
      .reduce((sum, p) => sum + p.benefitAmount, 0);
  }, [eligiblePolicies]);

  const eligibleCount = eligiblePolicies.filter(p => p.isEligible).length;

  const handleCalculate = () => {
    setShowResults(true);
  };

  const formatMoney = (val: number) => {
    if (val >= 10000) {
      return `${Math.floor(val / 10000).toLocaleString()}만원`;
    }
    return `${val.toLocaleString()}원`;
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            청년 정책 맞춤 계산기
          </h1>
          <p className="text-[var(--muted-foreground)]">
            나이와 소득을 입력하면 받을 수 있는 청년 정책 혜택을 계산해드립니다
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* 나이 입력 */}
            <div>
              <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">
                만 나이
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={ageInput}
                  onChange={handleAgeChange}
                  className="w-full p-4 pr-10 border border-[var(--border)] rounded-xl bg-[var(--background)]
                    focus:ring-2 focus:ring-blue-500 outline-none text-right text-xl font-bold text-[var(--foreground)]"
                  placeholder="27"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">세</span>
              </div>
            </div>

            {/* 연소득 입력 */}
            <div>
              <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">
                연소득 (총급여)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={incomeInput}
                  onChange={handleIncomeChange}
                  className="w-full p-4 pr-14 border border-[var(--border)] rounded-xl bg-[var(--background)]
                    focus:ring-2 focus:ring-blue-500 outline-none text-right text-xl font-bold text-[var(--foreground)]"
                  placeholder="3,500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">만원</span>
              </div>
            </div>
          </div>

          {/* 추가 조건 */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-[var(--muted-foreground)]">추가 조건 (해당하는 항목 선택)</p>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 bg-[var(--secondary)] rounded-xl cursor-pointer hover:bg-[var(--secondary)]/80 transition-colors">
                <input
                  type="checkbox"
                  checked={isStudent}
                  onChange={(e) => setIsStudent(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-500"
                />
                <span className="text-sm text-[var(--foreground)]">대학생</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[var(--secondary)] rounded-xl cursor-pointer hover:bg-[var(--secondary)]/80 transition-colors">
                <input
                  type="checkbox"
                  checked={isEmployed}
                  onChange={(e) => setIsEmployed(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-500"
                />
                <span className="text-sm text-[var(--foreground)]">취업자</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[var(--secondary)] rounded-xl cursor-pointer hover:bg-[var(--secondary)]/80 transition-colors">
                <input
                  type="checkbox"
                  checked={isSME}
                  onChange={(e) => setIsSME(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-500"
                />
                <span className="text-sm text-[var(--foreground)]">중소기업 근무</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[var(--secondary)] rounded-xl cursor-pointer hover:bg-[var(--secondary)]/80 transition-colors">
                <input
                  type="checkbox"
                  checked={hasHouse}
                  onChange={(e) => setHasHouse(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-500"
                />
                <span className="text-sm text-[var(--foreground)]">주택 소유</span>
              </label>
            </div>
          </div>

          {/* 계산하기 버튼 */}
          <button
            onClick={handleCalculate}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl
              font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            혜택 계산하기
          </button>
        </div>

        {/* 결과 */}
        {showResults && (
          <div className="space-y-6 animate-fade-in">
            {/* 총 혜택 요약 */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-6 rounded-2xl text-white">
              <div className="text-center">
                <p className="text-white/80 mb-1">예상 총 혜택 금액</p>
                <p className="text-4xl font-bold mb-2">
                  {totalBenefit > 0 ? formatMoney(totalBenefit) : '0원'}
                </p>
                <p className="text-white/80 text-sm">
                  {eligibleCount}개 정책 수혜 가능
                </p>
              </div>
            </div>

            {/* 수혜 가능한 정책 */}
            {eligibleCount > 0 && (
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  받을 수 있는 정책 ({eligibleCount}개)
                </h2>
                <div className="space-y-3">
                  {eligiblePolicies
                    .filter(p => p.isEligible)
                    .sort((a, b) => b.benefitAmount - a.benefitAmount)
                    .map(policy => {
                      const style = colorStyles[policy.color];
                      const isExpanded = expandedPolicy === policy.id;

                      return (
                        <div
                          key={policy.id}
                          className={`bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden`}
                        >
                          <button
                            onClick={() => setExpandedPolicy(isExpanded ? null : policy.id)}
                            className="w-full p-4 flex items-center gap-4 text-left hover:bg-[var(--secondary)] transition-colors"
                          >
                            <div className={`p-3 rounded-xl ${style.bg}`}>
                              <div className={style.text}>{policy.icon}</div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-[var(--foreground)]">{policy.name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                                  {policy.category}
                                </span>
                              </div>
                              <p className="text-sm text-[var(--muted-foreground)]">{policy.benefitDescription}</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${style.text}`}>
                                {formatMoney(policy.benefitAmount)}
                              </p>
                              <p className="text-xs text-[var(--muted-foreground)]">{policy.period}</p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-[var(--muted-foreground)]" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-[var(--muted-foreground)]" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="px-4 pb-4 border-t border-[var(--border)] pt-4">
                              <p className="text-sm text-[var(--muted-foreground)] mb-3">
                                {policy.description}
                              </p>
                              <div className="bg-[var(--secondary)] p-3 rounded-lg mb-3">
                                <p className="text-xs font-medium text-[var(--foreground)] mb-2">신청 조건</p>
                                <ul className="space-y-1">
                                  {policy.conditions.map((condition, idx) => (
                                    <li key={idx} className="text-xs text-[var(--muted-foreground)] flex items-start gap-2">
                                      <span className="text-green-500 mt-0.5">•</span>
                                      {condition}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <a
                                href={policy.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 text-sm font-medium ${style.text} hover:underline`}
                              >
                                자세히 알아보기 →
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 수혜 불가능한 정책 */}
            {eligiblePolicies.filter(p => !p.isEligible).length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  조건 미충족 정책
                </h2>
                <div className="space-y-2">
                  {eligiblePolicies
                    .filter(p => !p.isEligible)
                    .map(policy => {
                      const style = colorStyles[policy.color];

                      return (
                        <div
                          key={policy.id}
                          className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] opacity-60"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${style.bg}`}>
                              <div className={style.text}>{policy.icon}</div>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-[var(--foreground)]">{policy.name}</h3>
                              <p className="text-xs text-red-400">
                                {policy.reasons.join(', ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 안내 문구 */}
            <div className="bg-[var(--secondary)] p-4 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-[var(--muted-foreground)] mt-0.5 flex-shrink-0" />
              <div className="text-sm text-[var(--muted-foreground)]">
                <p className="mb-1">
                  <strong className="text-[var(--foreground)]">참고사항</strong>
                </p>
                <ul className="space-y-1">
                  <li>• 위 금액은 예상 혜택이며, 실제 금액은 개인 상황에 따라 달라질 수 있습니다.</li>
                  <li>• 일부 정책은 중복 수혜가 불가능할 수 있습니다.</li>
                  <li>• 정확한 자격 요건과 신청 방법은 각 정책 홈페이지에서 확인하세요.</li>
                  <li>• 2025년 기준 정책이며, 변경될 수 있습니다.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
