'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, Search, X, ChevronRight, TrendingUp, Wallet, BarChart3, Calculator, Calendar, Shield, Cake, Heart, Laptop, Percent, Gift, Building2, Type, RefreshCw, DollarSign, Users, Wrench, ArrowLeftRight } from 'lucide-react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// 카테고리 정의
type Category = 'finance' | 'life' | 'utility';

const categories: { id: Category; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'finance', label: '재테크', icon: <DollarSign className="w-5 h-5" />, description: '자산, 투자, 세금 계산' },
  { id: 'life', label: '생활', icon: <Users className="w-5 h-5" />, description: '나이, 기념일, 결혼' },
  { id: 'utility', label: '유틸리티', icon: <Wrench className="w-5 h-5" />, description: '퍼센트, 글자수 등' },
];

// 카드 데이터 정의
const toolCards = [
  // 재테크 카테고리
  {
    id: 'tier',
    href: '/tier-calculator',
    title: '자산 티어 계산기',
    description: '"나는 상위 몇 %?" 대한민국 연령별 순자산, 연봉을 비교하여 나의 자산 티어를 확인하세요.',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'blue',
    featured: true,
    category: 'finance' as Category,
    keywords: ['자산', '티어', '순위', '순자산', '연봉', '상위', '다이아몬드', '플래티넘', '골드'],
  },
  {
    id: 'salary',
    href: '/salary-calculator',
    title: '연봉/실수령 계산기',
    description: '"월 500 받으려면 연봉 얼마?" 4대보험과 세금을 공제한 실제 통장에 찍히는 돈을 확인하세요.',
    icon: <Wallet className="w-6 h-6" />,
    color: 'green',
    category: 'finance' as Category,
    keywords: ['연봉', '실수령', '월급', '세금', '4대보험', '급여', '소득'],
  },
  {
    id: 'wealth',
    href: '/stack-calculator',
    title: '자산 성장 시뮬레이터',
    description: '매월 적립금과 배당 재투자를 고려한 10년 뒤 자산 가치를 계산합니다. (물가상승 반영)',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'indigo',
    category: 'finance' as Category,
    keywords: ['자산', '성장', '복리', '적립', '배당', '투자', 'SCHD', '시뮬레이터'],
  },
  {
    id: 'etf',
    href: '/etf-calculator',
    title: 'ETF 배당금 역산 계산기',
    description: '"월 100만원 배당 받으려면?" JEPI, SCHD 등 인기 ETF로 목표 배당금에 필요한 투자금을 계산하세요.',
    icon: <Building2 className="w-6 h-6" />,
    color: 'purple',
    category: 'finance' as Category,
    keywords: ['ETF', 'JEPI', 'SCHD', 'JEPQ', '배당', '배당금', '월배당', '투자', '패시브인컴', '배당투자'],
  },
  {
    id: 'dividend-reinvest',
    href: '/dividend-reinvest-calculator',
    title: '배당 재투자 시뮬레이터',
    description: '배당금 재투자의 복리 효과를 시뮬레이션하고 경제적 자유 달성 시점을 계산합니다.',
    icon: <RefreshCw className="w-6 h-6" />,
    color: 'green',
    category: 'finance' as Category,
    keywords: ['배당', '재투자', '복리', 'SCHD', '경제적자유', '월배당', '패시브인컴', '배당성장'],
  },
  {
    id: 'rate',
    href: '/interest-rate-calculator',
    title: '실질 금리 계산기',
    description: '내 예금 이자가 물가상승률을 이길 수 있을까? 명목금리의 함정을 피하세요.',
    icon: <Percent className="w-6 h-6" />,
    color: 'red',
    category: 'finance' as Category,
    keywords: ['금리', '이자', '물가', '인플레이션', '예금', '실질금리'],
  },
  {
    id: 'freelancer',
    href: '/freelancer-calculator',
    title: '프리랜서 세금 계산기',
    description: '프리랜서 수입에서 3.3% 원천징수 세금을 계산하고 실수령액을 확인하세요.',
    icon: <Laptop className="w-6 h-6" />,
    color: 'cyan',
    category: 'finance' as Category,
    keywords: ['프리랜서', '세금', '3.3', '원천징수', '실수령', '개인사업자', '외주'],
  },
  {
    id: 'youth-policy',
    href: '/youth-policy-calculator',
    title: '청년 정책 계산기',
    description: '나이와 소득만 입력하면 청년도약계좌, 소득세감면 등 받을 수 있는 혜택 총액을 계산합니다.',
    icon: <Gift className="w-6 h-6" />,
    color: 'indigo',
    category: 'finance' as Category,
    keywords: ['청년', '청년도약계좌', '청년희망적금', '소득세감면', '청년정책', '청년혜택', '지원금'],
  },

  // 생활 카테고리
  {
    id: 'army',
    href: '/army-calculator',
    title: '전역일 계산기',
    description: '"나 언제 집에 가지?" 입대일만 넣으면 전역 D-Day와 계급별 진급일을 알려드립니다.',
    icon: <Shield className="w-6 h-6" />,
    color: 'slate',
    category: 'life' as Category,
    keywords: ['전역', '군대', '입대', '진급', '병장', '상병', '일병', '이병'],
  },
  {
    id: 'age',
    href: '/age-calculator',
    title: '나이 계산기',
    description: '생년월일로 만 나이, 띠, 별자리, 살아온 날수를 확인하세요.',
    icon: <Cake className="w-6 h-6" />,
    color: 'orange',
    category: 'life' as Category,
    keywords: ['나이', '생년월일', '띠', '별자리', '만나이', '세는나이', '생일'],
  },
  {
    id: 'anniversary',
    href: '/anniversary-calculator',
    title: '결혼기념일 계산기',
    description: '결혼일을 입력하면 몇 주년인지, 다음 기념일까지 D-Day를 알려드립니다.',
    icon: <Heart className="w-6 h-6" />,
    color: 'pink',
    category: 'life' as Category,
    keywords: ['결혼', '기념일', '주년', '은혼식', '금혼식', '웨딩', '부부'],
  },
  {
    id: 'wedding',
    href: '/wedding-calculator',
    title: '예식 비용 견적 계산기',
    description: '웨딩홀, 스드메, 예물, 신혼여행까지 총 예식 비용과 축의금 차감 후 실제 부담액을 계산하세요.',
    icon: <Calendar className="w-6 h-6" />,
    color: 'pink',
    category: 'life' as Category,
    keywords: ['결혼', '예식', '웨딩', '스드메', '예물', '축의금', '신혼여행', '웨딩홀'],
  },

  // 유틸리티 카테고리
  {
    id: 'percent',
    href: '/percent-calculator',
    title: '퍼센트 계산기',
    description: '퍼센트 값 구하기, 비율 계산, 증감률까지. 다양한 퍼센트 계산을 한 번에 해결하세요.',
    icon: <Calculator className="w-6 h-6" />,
    color: 'purple',
    category: 'utility' as Category,
    keywords: ['퍼센트', '비율', '증감률', '할인', '부가세', '비율분배', '%'],
  },
  {
    id: 'character-counter',
    href: '/character-counter',
    title: '글자 수 세기',
    description: '자소서 작성이나 SMS/LMS 발송 시 필요한 글자 수(공백 포함/제외)와 바이트 용량을 계산합니다.',
    icon: <Type className="w-6 h-6" />,
    color: 'cyan',
    category: 'utility' as Category,
    keywords: ['글자수', '바이트', 'SMS', 'LMS', '자소서', '문자', '글자세기', '텍스트'],
  },
  {
    id: 'unit-converter',
    href: '/unit-converter',
    title: '단위 변환기',
    description: '부동산 면적(평↔㎡), 요리 계량(g↔ml↔컵), 길이, 무게, 온도 등 다양한 단위를 변환합니다.',
    icon: <ArrowLeftRight className="w-6 h-6" />,
    color: 'orange',
    category: 'utility' as Category,
    keywords: ['단위', '변환', '평', '제곱미터', '그램', '밀리리터', '온도', '길이', '무게', '컵', '큰술'],
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
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  // 검색 및 카테고리 필터링
  const filteredCards = useMemo(() => {
    let cards = toolCards;

    if (selectedCategory !== 'all') {
      cards = cards.filter(card => card.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      cards = cards.filter(card =>
        card.title.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query) ||
        card.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }

    return cards;
  }, [searchQuery, selectedCategory]);

  const featuredCard = toolCards.find(card => card.featured);

  const categoryCounts = useMemo(() => {
    const counts: Record<Category | 'all', number> = {
      all: toolCards.length,
      finance: toolCards.filter(c => c.category === 'finance').length,
      life: toolCards.filter(c => c.category === 'life').length,
      utility: toolCards.filter(c => c.category === 'utility').length,
    };
    return counts;
  }, []);

  const isSearching = searchQuery.trim() !== '';

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Hero Section */}
        <section className="text-center mb-8 sm:mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--secondary)] rounded-full mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-xs sm:text-sm text-[var(--secondary-foreground)]">
              15개 이상의 계산기를 한 곳에서
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-3 sm:mb-4 leading-tight">
            일상의 모든 계산,<br />
            <span className="text-[var(--primary)]">한 곳에서</span> 해결하세요
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-md mx-auto">
            연봉, 자산, 나이, 기념일, 전역일까지
            <br />
            복잡한 계산은 저희에게 맡기세요
          </p>
        </section>

        {/* 검색 바 */}
        <div className="relative max-w-md mx-auto mb-6 sm:mb-8 animate-slide-up">
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
                transition-all duration-200 text-sm sm:text-base"
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

        {/* Featured Card */}
        {featuredCard && !isSearching && selectedCategory === 'all' && (
          <Link
            href={featuredCard.href}
            className="block mb-6 sm:mb-8 group animate-slide-up"
          >
            <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl border border-[var(--border)]
              bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-blue-500/10
              hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 opacity-10 blur-3xl bg-blue-500" />

              <div className="relative flex items-center gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 bg-blue-500 rounded-xl sm:rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  {featuredCard.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-500 rounded-full">
                      NEW
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">추천</span>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--card-foreground)] mb-1">
                    {featuredCard.title}
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                    {featuredCard.description}
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-blue-500 font-medium flex-shrink-0">
                  <span>계산하기</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* 사이드바 + 메인 콘텐츠 레이아웃 */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* 모바일: 가로 스크롤 카테고리 탭 */}
          <div className="lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md'
                    : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                전체
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  selectedCategory === 'all' ? 'bg-white/20' : 'bg-[var(--secondary)]'
                }`}>{categoryCounts.all}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md'
                      : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    selectedCategory === cat.id ? 'bg-white/20' : 'bg-[var(--secondary)]'
                  }`}>{categoryCounts[cat.id]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 데스크톱: 왼쪽 사이드바 */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden">
                <div className="p-4 bg-[var(--secondary)] border-b border-[var(--border)]">
                  <h3 className="font-bold text-[var(--foreground)]">카테고리</h3>
                </div>

                <nav className="p-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all mb-1 ${
                      selectedCategory === 'all'
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                        : 'hover:bg-[var(--secondary)] text-[var(--foreground)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-medium">전체</span>
                    </div>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${
                      selectedCategory === 'all'
                        ? 'bg-white/20'
                        : 'bg-[var(--secondary)]'
                    }`}>
                      {categoryCounts.all}
                    </span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all mb-1 ${
                        selectedCategory === cat.id
                          ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                          : 'hover:bg-[var(--secondary)] text-[var(--foreground)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {cat.icon}
                        <div className="text-left">
                          <span className="font-medium block">{cat.label}</span>
                          <span className={`text-xs ${
                            selectedCategory === cat.id
                              ? 'text-white/70'
                              : 'text-[var(--muted-foreground)]'
                          }`}>
                            {cat.description}
                          </span>
                        </div>
                      </div>
                      <span className={`text-sm px-2 py-0.5 rounded-full ${
                        selectedCategory === cat.id
                          ? 'bg-white/20'
                          : 'bg-[var(--secondary)]'
                      }`}>
                        {categoryCounts[cat.id]}
                      </span>
                    </button>
                  ))}
                </nav>

                <div className="p-4 border-t border-[var(--border)]">
                  <a
                    href="https://forms.gle/BGuoqhngkSg1y7596"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2.5 bg-[var(--secondary)] hover:bg-[var(--muted)]
                      text-[var(--foreground)] rounded-xl text-sm font-medium transition-all"
                  >
                    + 계산기 요청하기
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* 오른쪽 메인 콘텐츠 */}
          <div className="flex-1 min-w-0">
            {/* 현재 카테고리 헤더 */}
            {!isSearching && (
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--primary)]/10 rounded-lg text-[var(--primary)]">
                    {selectedCategory === 'all' ? (
                      <Sparkles className="w-5 h-5" />
                    ) : (
                      categories.find(c => c.id === selectedCategory)?.icon
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
                      {selectedCategory === 'all' ? '전체 계산기' : categories.find(c => c.id === selectedCategory)?.label}
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                      {selectedCategory === 'all'
                        ? '모든 계산기를 한눈에 확인하세요'
                        : categories.find(c => c.id === selectedCategory)?.description}
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                  {filteredCards.length}개
                </span>
              </div>
            )}

            {/* 검색 결과 헤더 */}
            {isSearching && (
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
                  &quot;{searchQuery}&quot; 검색 결과
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                  {filteredCards.length}개의 계산기를 찾았습니다
                </p>
              </div>
            )}

            {/* 검색 결과 없음 */}
            {filteredCards.length === 0 && (
              <div className="text-center py-12 sm:py-16 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-[var(--secondary)] rounded-full flex items-center justify-center">
                  <Search className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--muted-foreground)]" />
                </div>
                <p className="text-[var(--foreground)] font-medium mb-2">
                  검색 결과가 없습니다
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  다른 키워드로 검색해 보세요
                </p>
              </div>
            )}

            {/* 카드 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {filteredCards
                .filter(card => isSearching || selectedCategory !== 'all' || !card.featured)
                .map((card) => {
                  const style = colorStyles[card.color];
                  return (
                    <Link
                      key={card.id}
                      href={card.href}
                      className="group bg-[var(--card)] p-4 sm:p-5 rounded-xl shadow-lg border border-[var(--border)]
                        hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`${style.iconBg} w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-white
                          group-hover:scale-110 transition-transform flex-shrink-0`}
                        >
                          {card.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-[var(--card-foreground)] mb-0.5 sm:mb-1 group-hover:text-[var(--primary)] transition-colors truncate">
                            {card.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] line-clamp-2 mb-2 sm:mb-3">
                            {card.description}
                          </p>
                          <div className={`${style.text} text-xs sm:text-sm font-semibold flex items-center`}>
                            계산하기
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>

            {/* 모바일 계산기 요청 */}
            <div className="lg:hidden mt-8 bg-[var(--secondary)] rounded-xl p-5 text-center">
              <h4 className="font-bold text-[var(--foreground)] mb-1">필요한 계산기가 없으신가요?</h4>
              <p className="text-xs text-[var(--muted-foreground)] mb-3">새로운 계산기를 요청해 주세요!</p>
              <a
                href="https://forms.gle/BGuoqhngkSg1y7596"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl
                  font-semibold hover:opacity-90 transition-all shadow-lg text-sm"
              >
                계산기 요청하기
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
