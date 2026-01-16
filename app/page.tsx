'use client';

import { useState, useMemo } from 'react';

import WealthCalculator from './stack-calculator/page';       // 적립식 복리 계산기
import RealRateCalculator from './interest-rate-calculator/page';   // 실질금리 계산기
import SalaryCalculator from './salary-calculator/page';       // 연봉 계산기
import HairCalculator from './hair-calculator/page';       // 급여
import ArmyCalculator from './army-calculator/page';       // 전역일
import AgeCalculator from './age-calculator/page';       // 나이 계산기

type ToolType = 'home' | 'wealth' | 'rate' | 'salary' | 'hair' | 'army' | 'age';

// 카드 데이터 정의
const toolCards = [
  {
    id: 'wealth' as ToolType,
    title: '자산 성장 시뮬레이터',
    description: '매월 적립금과 배당 재투자를 고려한 10년 뒤 자산 가치를 계산합니다. (물가상승 반영)',
    icon: '📈',
    color: 'indigo',
    keywords: ['자산', '성장', '복리', '적립', '배당', '투자', 'SCHD', '시뮬레이터'],
  },
  {
    id: 'salary' as ToolType,
    title: '연봉/실수령 계산기',
    description: '"월 500 받으려면 연봉 얼마?" 4대보험과 세금을 공제한 실제 통장에 찍히는 돈을 확인하세요.',
    icon: '💼',
    color: 'green',
    keywords: ['연봉', '실수령', '월급', '세금', '4대보험', '급여', '소득'],
  },
  {
    id: 'rate' as ToolType,
    title: '실질 금리 계산기',
    description: '내 예금 이자가 물가상승률을 이길 수 있을까? 명목금리의 함정을 피하세요.',
    icon: '📉',
    color: 'red',
    keywords: ['금리', '이자', '물가', '인플레이션', '예금', '실질금리'],
  },
  {
    id: 'hair' as ToolType,
    title: '급여 계산기',
    description: '근무 시간과 매출을 기반으로 급여를 계산합니다.',
    icon: '💇',
    color: 'purple',
    keywords: ['급여', '미용', '헤어', '매출', '근무'],
  },
  {
    id: 'army' as ToolType,
    title: '전역일 계산기',
    description: '"나 언제 집에 가지?" 입대일만 넣으면 전역 D-Day와 계급별 진급일을 알려드립니다.',
    icon: '🪖',
    color: 'slate',
    keywords: ['전역', '군대', '입대', '진급', '병장', '상병', '일병', '이병'],
  },
  {
    id: 'age' as ToolType,
    title: '나이 계산기',
    description: '생년월일로 만 나이, 띠, 별자리, 살아온 날수를 확인하세요.',
    icon: '🎂',
    color: 'orange',
    keywords: ['나이', '생년월일', '띠', '별자리', '만나이', '세는나이', '생일'],
  },
];

export default function Dashboard() {
  const [activeTool, setActiveTool] = useState<ToolType>('home');

  // 도구 선택 시 화면 전환 함수
  const renderContent = () => {
    switch (activeTool) {
      case 'wealth':
        return <WealthCalculator />;
      case 'rate':
        return <RealRateCalculator />;
      case 'salary':
        return <SalaryCalculator />;
      case 'hair':
        return <HairCalculator />;
      case 'army':
        return <ArmyCalculator />;
      case 'age':
        return <AgeCalculator />;
      default:
        return <HomeGrid onNavigate={setActiveTool} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* 상단 네비게이션 바 */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div
              className="font-bold text-xl text-gray-900 cursor-pointer flex items-center gap-2"
              onClick={() => setActiveTool('home')}
            >
              <span className="bg-indigo-600 text-white p-1 rounded-lg">💰</span>
              <span>Finance Lab</span>
            </div>

            {activeTool !== 'home' && (
              <button
                onClick={() => setActiveTool('home')}
                className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition"
              >
                ← 메인으로 돌아가기
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 영역 */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {renderContent()}
      </main>

      {/* 푸터 */}
      <footer className="text-center text-gray-400 text-xs py-10">
        © 2026 Finance Lab. Built with Next.js & Tailwind CSS.
      </footer>
    </div>
  );
}

// 색상별 스타일 매핑
const colorStyles: Record<string, { border: string; bg: string; text: string; hoverText: string }> = {
  indigo: { border: 'bg-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-600', hoverText: 'group-hover:text-indigo-600' },
  green: { border: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-600', hoverText: 'group-hover:text-green-600' },
  red: { border: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-500', hoverText: 'group-hover:text-red-500' },
  purple: { border: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-600', hoverText: 'group-hover:text-purple-600' },
  slate: { border: 'bg-slate-600', bg: 'bg-slate-100', text: 'text-slate-600', hoverText: 'group-hover:text-slate-600' },
  orange: { border: 'bg-orange-500', bg: 'bg-orange-50', text: 'text-orange-600', hoverText: 'group-hover:text-orange-600' },
};

// 메인 그리드 컴포넌트 (진입 화면)
function HomeGrid({ onNavigate }: { onNavigate: (tool: ToolType) => void }) {
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
    <div className="space-y-8 animate-fade-in-up">
      {/* 히어로 섹션 */}
      <div className="text-center space-y-4 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          내 자산의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">진짜 가치</span>를<br />
          발견하세요.
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          복잡한 금융 계산은 도구에게 맡기고, 당신은 미래를 설계하세요.<br />
          SCHD 투자부터 연봉 협상까지, 모든 시나리오를 시뮬레이션합니다.
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
          <p className="text-gray-500">"{searchQuery}"에 대한 검색 결과가 없습니다.</p>
        </div>
      )}

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => {
          const style = colorStyles[card.color];
          return (
            <div
              key={card.id}
              onClick={() => onNavigate(card.id)}
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
            </div>
          );
        })}
      </div>

      {/* 빠른 링크 섹션 (Optional) */}
      <div className="mt-12 bg-gray-100 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="font-bold text-gray-800">🚀 아직 엑셀로 관리하시나요?</h4>
          <p className="text-sm text-gray-500">배당금 관리와 목표 달성률을 웹에서 바로 확인하세요.</p>
        </div>
        <button className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition shadow-lg">
          지금 시작하기
        </button>
      </div>
    </div>
  );
}