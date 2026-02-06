'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, Search, X, ChevronRight, TrendingUp, Wallet, BarChart3, Calculator, Calendar, Shield, Cake, Heart, Laptop, Percent, Gift, Type } from 'lucide-react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// 카드 데이터 정의
const toolCards = [
  {
    id: 'tier',
    href: '/tier-calculator',
    title: '자산 티어 계산기',
    description: '"나는 상위 몇 %?" 대한민국 연령별 순자산, 연봉을 비교하여 나의 자산 티어를 확인하세요.',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'blue',
    featured: true,
    keywords: ['자산', '티어', '순위', '순자산', '연봉', '상위', '다이아몬드', '플래티넘', '골드'],
  },
  {
    id: 'salary',
    href: '/salary-calculator',
    title: '연봉/실수령 계산기',
    description: '"월 500 받으려면 연봉 얼마?" 4대보험과 세금을 공제한 실제 통장에 찍히는 돈을 확인하세요.',
    icon: <Wallet className="w-6 h-6" />,
    color: 'green',
    keywords: ['연봉', '실수령', '월급', '세금', '4대보험', '급여', '소득'],
  },
  {
    id: 'wealth',
    href: '/stack-calculator',
    title: '자산 성장 시뮬레이터',
    description: '매월 적립금과 배당 재투자를 고려한 10년 뒤 자산 가치를 계산합니다. (물가상승 반영)',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'indigo',
    keywords: ['자산', '성장', '복리', '적립', '배당', '투자', 'SCHD', '시뮬레이터'],
  },
  {
    id: 'rate',
    href: '/interest-rate-calculator',
    title: '실질 금리 계산기',
    description: '내 예금 이자가 물가상승률을 이길 수 있을까? 명목금리의 함정을 피하세요.',
    icon: <Percent className="w-6 h-6" />,
    color: 'red',
    keywords: ['금리', '이자', '물가', '인플레이션', '예금', '실질금리'],
  },
  {
    id: 'army',
    href: '/army-calculator',
    title: '전역일 계산기',
    description: '"나 언제 집에 가지?" 입대일만 넣으면 전역 D-Day와 계급별 진급일을 알려드립니다.',
    icon: <Shield className="w-6 h-6" />,
    color: 'slate',
    keywords: ['전역', '군대', '입대', '진급', '병장', '상병', '일병', '이병'],
  },
  {
    id: 'age',
    href: '/age-calculator',
    title: '나이 계산기',
    description: '생년월일로 만 나이, 띠, 별자리, 살아온 날수를 확인하세요.',
    icon: <Cake className="w-6 h-6" />,
    color: 'orange',
    keywords: ['나이', '생년월일', '띠', '별자리', '만나이', '세는나이', '생일'],
  },
  {
    id: 'anniversary',
    href: '/anniversary-calculator',
    title: '결혼기념일 계산기',
    description: '결혼일을 입력하면 몇 주년인지, 다음 기념일까지 D-Day를 알려드립니다.',
    icon: <Heart className="w-6 h-6" />,
    color: 'pink',
    keywords: ['결혼', '기념일', '주년', '은혼식', '금혼식', '웨딩', '부부'],
  },
  {
    id: 'freelancer',
    href: '/freelancer-calculator',
    title: '프리랜서 세금 계산기',
    description: '프리랜서 수입에서 3.3% 원천징수 세금을 계산하고 실수령액을 확인하세요.',
    icon: <Laptop className="w-6 h-6" />,
    color: 'cyan',
    keywords: ['프리랜서', '세금', '3.3', '원천징수', '실수령', '개인사업자', '외주'],
  },
  {
    id: 'wedding',
    href: '/wedding-calculator',
    title: '예식 비용 견적 계산기',
    description: '웨딩홀, 스드메, 예물, 신혼여행까지 총 예식 비용과 축의금 차감 후 실제 부담액을 계산하세요.',
    icon: <Calendar className="w-6 h-6" />,
    color: 'pink',
    keywords: ['결혼', '예식', '웨딩', '스드메', '예물', '축의금', '신혼여행', '웨딩홀'],
  },
  {
    id: 'percent',
    href: '/percent-calculator',
    title: '퍼센트 계산기',
    description: '퍼센트 값 구하기, 비율 계산, 증감률까지. 다양한 퍼센트 계산을 한 번에 해결하세요.',
    icon: <Calculator className="w-6 h-6" />,
    color: 'purple',
    keywords: ['퍼센트', '비율', '증감률', '할인', '부가세', '비율분배', '%'],
  },
  {
    id: 'youth-policy',
    href: '/youth-policy-calculator',
    title: '청년 정책 계산기',
    description: '나이와 소득만 입력하면 청년도약계좌, 소득세감면 등 받을 수 있는 혜택 총액을 계산합니다.',
    icon: <Gift className="w-6 h-6" />,
    color: 'indigo',
    keywords: ['청년', '청년도약계좌', '청년희망적금', '소득세감면', '청년정책', '청년혜택', '지원금'],
  },
  {
    id: 'character-counter',
    href: '/character-counter',
    title: '글자 수 세기',
    description: '자소서 작성이나 SMS/LMS 발송 시 필요한 글자 수(공백 포함/제외)와 바이트 용량을 계산합니다.',
    icon: <Type className="w-6 h-6" />,
    color: 'cyan',
    keywords: ['글자수', '바이트', 'SMS', 'LMS', '자소서', '문자', '글자세기', '텍스트'],
  },
];

// 색상별 스타일 매핑
const colorStyles: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500', iconBg: 'bg-blue-500' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-500', iconBg: 'bg-green-500' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-500', iconBg: 'bg-indigo-500' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-500', iconBg: 'bg-red-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-500', iconBg: 'bg-purple-500' },
  slate: { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-500', iconBg: 'bg-slate-600' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-500', iconBg: 'bg-orange-500' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-500', iconBg: 'bg-pink-500' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-500', iconBg: 'bg-cyan-500' },
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  // 검색 필터링
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return toolCards;

    const query = searchQuery.toLowerCase();
    return toolCards.filter(card =>
      card.title.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query) ||
      card.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Featured 카드와 일반 카드 분리
  const featuredCard = toolCards.find(card => card.featured);
  const regularCards = filteredCards.filter(card => !card.featured);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--secondary)] rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm text-[var(--secondary-foreground)]">
              10개 이상의 계산기를 한 곳에서
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4 line-height-1.2 leading-tight">
            일상의 모든 계산,<br />
            <span className="text-[var(--primary)]">한 곳에서</span> 해결하세요
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-md mx-auto">
            연봉, 자산, 나이, 기념일, 전역일까지
            <br />
            복잡한 계산은 저희에게 맡기세요
          </p>
        </section>

        {/* 검색 바 */}
        <div className="relative max-w-md mx-auto mb-8 animate-slide-up">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="계산기 검색... (예: 연봉, 금리, 전역)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-[var(--card)] border border-[var(--border)] rounded-xl
                focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent
                text-[var(--card-foreground)] placeholder:text-[var(--muted-foreground)]
                transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Featured Card - 자산 티어 계산기 */}
        {featuredCard && !searchQuery && (
          <Link
            href={featuredCard.href}
            className="block mb-8 group animate-slide-up"
          >
            <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 shadow-xl border border-[var(--border)]
              bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-blue-500/10
              hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-64 h-64 opacity-10 blur-3xl bg-blue-500" />

              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="p-4 bg-blue-500 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform">
                  {featuredCard.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-500 rounded-full">
                      NEW
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">추천</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--card-foreground)] mb-2">
                    {featuredCard.title}
                  </h2>
                  <p className="text-[var(--muted-foreground)]">
                    {featuredCard.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-blue-500 font-medium">
                  <span>계산하기</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* 검색 결과 없음 */}
        {filteredCards.length === 0 && (
          <div className="text-center py-10">
            <p className="text-[var(--muted-foreground)]">
              &quot;{searchQuery}&quot;에 대한 검색 결과가 없습니다.
            </p>
          </div>
        )}

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(searchQuery ? filteredCards : regularCards).map((card) => {
            const style = colorStyles[card.color];
            return (
              <Link
                key={card.id}
                href={card.href}
                className="group bg-[var(--card)] p-5 rounded-xl shadow-lg border border-[var(--border)]
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`mb-4 ${style.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-white
                  group-hover:scale-110 transition-transform`}
                >
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-[var(--card-foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-4 line-clamp-2">
                  {card.description}
                </p>
                <div className={`${style.text} text-sm font-semibold flex items-center`}>
                  계산하기
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* 빠른 링크 섹션 */}
        <div className="mt-12 bg-[var(--secondary)] rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="font-bold text-[var(--foreground)]">필요한 계산기가 없으신가요?</h4>
            <p className="text-sm text-[var(--muted-foreground)]">새로운 계산기를 요청해 주세요. 계속해서 추가됩니다!</p>
          </div>
          <a
            href="https://forms.gle/BGuoqhngkSg1y7596"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl
              font-semibold hover:opacity-90 transition-all shadow-lg"
          >
            계산기 요청하기
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
