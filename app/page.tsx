'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// 카드 데이터 정의
const toolCards = [
  {
    id: 'salary',
    href: '/salary-calculator',
    title: '연봉/실수령 계산기',
    description: '"월 500 받으려면 연봉 얼마?" 4대보험과 세금을 공제한 실제 통장에 찍히는 돈을 확인하세요.',
    icon: '💼',
    color: 'green',
    keywords: ['연봉', '실수령', '월급', '세금', '4대보험', '급여', '소득'],
  },
  {
    id: 'wealth',
    href: '/stack-calculator',
    title: '자산 성장 시뮬레이터',
    description: '매월 적립금과 배당 재투자를 고려한 10년 뒤 자산 가치를 계산합니다. (물가상승 반영)',
    icon: '📈',
    color: 'indigo',
    keywords: ['자산', '성장', '복리', '적립', '배당', '투자', 'SCHD', '시뮬레이터'],
  },
  {
    id: 'rate',
    href: '/interest-rate-calculator',
    title: '실질 금리 계산기',
    description: '내 예금 이자가 물가상승률을 이길 수 있을까? 명목금리의 함정을 피하세요.',
    icon: '📉',
    color: 'red',
    keywords: ['금리', '이자', '물가', '인플레이션', '예금', '실질금리'],
  },
  {
    id: 'army',
    href: '/army-calculator',
    title: '전역일 계산기',
    description: '"나 언제 집에 가지?" 입대일만 넣으면 전역 D-Day와 계급별 진급일을 알려드립니다.',
    icon: '🪖',
    color: 'slate',
    keywords: ['전역', '군대', '입대', '진급', '병장', '상병', '일병', '이병'],
  },
  {
    id: 'age',
    href: '/age-calculator',
    title: '나이 계산기',
    description: '생년월일로 만 나이, 띠, 별자리, 살아온 날수를 확인하세요.',
    icon: '🎂',
    color: 'orange',
    keywords: ['나이', '생년월일', '띠', '별자리', '만나이', '세는나이', '생일'],
  },
  {
    id: 'anniversary',
    href: '/anniversary-calculator',
    title: '결혼기념일 계산기',
    description: '결혼일을 입력하면 몇 주년인지, 다음 기념일까지 D-Day를 알려드립니다.',
    icon: '💒',
    color: 'pink',
    keywords: ['결혼', '기념일', '주년', '은혼식', '금혼식', '웨딩', '부부'],
  },
  {
    id: 'freelancer',
    href: '/freelancer-calculator',
    title: '프리랜서 세금 계산기',
    description: '프리랜서 수입에서 3.3% 원천징수 세금을 계산하고 실수령액을 확인하세요.',
    icon: '💻',
    color: 'cyan',
    keywords: ['프리랜서', '세금', '3.3', '원천징수', '실수령', '개인사업자', '외주'],
  },
  {
    id: 'wedding',
    href: '/wedding-calculator',
    title: '예식 비용 견적 계산기',
    description: '웨딩홀, 스드메, 예물, 신혼여행까지 총 예식 비용과 축의금 차감 후 실제 부담액을 계산하세요.',
    icon: '💍',
    color: 'pink',
    keywords: ['결혼', '예식', '웨딩', '스드메', '예물', '축의금', '신혼여행', '웨딩홀'],
  },
  {
    id: 'percent',
    href: '/percent-calculator',
    title: '퍼센트 계산기',
    description: '퍼센트 값 구하기, 비율 계산, 증감률까지. 다양한 퍼센트 계산을 한 번에 해결하세요.',
    icon: '%',
    color: 'purple',
    keywords: ['퍼센트', '비율', '증감률', '할인', '부가세', '비율분배', '%'],
  },
];

// 색상별 스타일 매핑
const colorStyles: Record<string, { border: string; bg: string; text: string; hoverText: string }> = {
  indigo: { border: 'bg-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-600', hoverText: 'group-hover:text-indigo-600' },
  green: { border: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-600', hoverText: 'group-hover:text-green-600' },
  red: { border: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-500', hoverText: 'group-hover:text-red-500' },
  purple: { border: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-600', hoverText: 'group-hover:text-purple-600' },
  slate: { border: 'bg-slate-600', bg: 'bg-slate-100', text: 'text-slate-600', hoverText: 'group-hover:text-slate-600' },
  orange: { border: 'bg-orange-500', bg: 'bg-orange-50', text: 'text-orange-600', hoverText: 'group-hover:text-orange-600' },
  pink: { border: 'bg-pink-500', bg: 'bg-pink-50', text: 'text-pink-600', hoverText: 'group-hover:text-pink-600' },
  cyan: { border: 'bg-cyan-500', bg: 'bg-cyan-50', text: 'text-cyan-600', hoverText: 'group-hover:text-cyan-600' },
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* 상단 네비게이션 바 */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link
              href="/"
              className="font-bold text-xl text-gray-900 cursor-pointer flex items-center gap-2"
            >
              <span>🔢</span>
              <span>전부 계산</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 영역 */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8 animate-fade-in-up">
          {/* 히어로 섹션 */}
          <div className="text-center space-y-4 py-10 mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.3]">
              일상의 모든 계산,<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-500">한 곳에서</span> 해결하세요.
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              연봉, 나이, 기념일, 전역일까지 복잡한 계산은 저희에게 맡기세요.
            </p>
          </div>

          {/* 검색 바 */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="계산기 검색... (예: 연봉, 금리, 전역)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* 검색 결과 없음 */}
          {filteredCards.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">&quot;{searchQuery}&quot;에 대한 검색 결과가 없습니다.</p>
            </div>
          )}

          {/* 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => {
              const style = colorStyles[card.color];
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${style.border} group-hover:w-2 transition-all`}></div>
                  <div className={`mb-4 ${style.bg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <h3 className={`text-lg font-bold text-gray-900 mb-2 ${style.hoverText} transition-colors`}>
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {card.description}
                  </p>
                  <div className={`${style.text} text-sm font-semibold flex items-center`}>
                    계산하기 <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 빠른 링크 섹션 */}
          <div className="mt-12 bg-gray-100 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="font-bold text-gray-800">🧮 필요한 계산기가 없으신가요?</h4>
              <p className="text-sm text-gray-500">새로운 계산기를 요청해 주세요. 계속해서 추가됩니다!</p>
            </div>
            <Link href="https://forms.gle/BGuoqhngkSg1y7596" className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition shadow-lg">
              계산기 요청하기
            </Link>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="text-center text-gray-400 text-xs py-10">
        © 2026 전부 계산.
      </footer>
    </div>
  );
}
