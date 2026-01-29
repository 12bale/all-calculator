'use client';

import React, { useState, useMemo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Heart, Calendar, Gift, Star } from 'lucide-react';

// 결혼기념일 명칭
const anniversaryNames: Record<number, { name: string; gift: string }> = {
  1: { name: '지혼식 (紙婚式)', gift: '종이' },
  2: { name: '고혼식 (藁婚式)', gift: '짚, 면' },
  3: { name: '과혼식 (果婚式)', gift: '가죽' },
  4: { name: '혁혼식 (革婚式)', gift: '꽃, 과일' },
  5: { name: '목혼식 (木婚式)', gift: '나무' },
  6: { name: '철혼식 (鐵婚式)', gift: '철, 사탕' },
  7: { name: '동혼식 (銅婚式)', gift: '구리, 양모' },
  8: { name: '청동혼식', gift: '청동, 도자기' },
  9: { name: '도혼식 (陶婚式)', gift: '도자기, 버드나무' },
  10: { name: '석혼식 (錫婚式)', gift: '주석, 알루미늄' },
  11: { name: '강철혼식', gift: '강철' },
  12: { name: '견혼식 (絹婚式)', gift: '비단, 린넨' },
  13: { name: '레이스혼식', gift: '레이스' },
  14: { name: '상아혼식', gift: '상아' },
  15: { name: '수정혼식 (水晶婚式)', gift: '수정' },
  20: { name: '도자기혼식', gift: '도자기' },
  25: { name: '은혼식 (銀婚式)', gift: '은' },
  30: { name: '진주혼식 (珍珠婚式)', gift: '진주' },
  35: { name: '산호혼식', gift: '산호' },
  40: { name: '루비혼식', gift: '루비' },
  45: { name: '사파이어혼식', gift: '사파이어' },
  50: { name: '금혼식 (金婚式)', gift: '금' },
  55: { name: '에메랄드혼식', gift: '에메랄드' },
  60: { name: '다이아몬드혼식', gift: '다이아몬드' },
  70: { name: '백금혼식', gift: '백금' },
  75: { name: '다이아몬드-금혼식', gift: '다이아몬드, 금' },
};

export default function AnniversaryCalculator() {
  const [weddingDate, setWeddingDate] = useState<string>('');

  const result = useMemo(() => {
    if (!weddingDate) return null;

    const wedding = new Date(weddingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (wedding > today) return null;

    // 결혼 년수 계산
    let years = today.getFullYear() - wedding.getFullYear();
    const monthDiff = today.getMonth() - wedding.getMonth();
    const dayDiff = today.getDate() - wedding.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      years--;
    }

    // 결혼한 총 일수
    const totalDays = Math.floor(
      (today.getTime() - wedding.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 다음 기념일까지 남은 일수
    const nextAnniversary = new Date(today.getFullYear(), wedding.getMonth(), wedding.getDate());
    if (nextAnniversary <= today) {
      nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1);
    }
    const daysUntilAnniversary = Math.ceil(
      (nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 다음 기념일 년수
    const nextYears = nextAnniversary.getFullYear() - wedding.getFullYear();

    // 현재 기념일 이름
    const currentAnniversaryInfo = anniversaryNames[years] || null;

    // 다음 주요 기념일 찾기
    const majorYears = Object.keys(anniversaryNames).map(Number).sort((a, b) => a - b);
    const nextMajorYear = majorYears.find(y => y > years);
    const nextMajorAnniversary = nextMajorYear ? {
      years: nextMajorYear,
      ...anniversaryNames[nextMajorYear],
      date: new Date(wedding.getFullYear() + nextMajorYear, wedding.getMonth(), wedding.getDate()),
    } : null;

    // 특별한 일수 기념일 계산 (100일, 200일, 1000일 등)
    const specialDays = [100, 200, 300, 365, 500, 1000, 2000, 3000, 5000, 10000];
    const upcomingSpecialDays = specialDays
      .filter(d => d > totalDays)
      .slice(0, 3)
      .map(d => {
        const date = new Date(wedding.getTime() + d * 24 * 60 * 60 * 1000);
        const daysLeft = d - totalDays;
        return { days: d, date, daysLeft };
      });

    // 지난 특별 일수
    const passedSpecialDays = specialDays.filter(d => d <= totalDays);
    const lastSpecialDay = passedSpecialDays.length > 0 ? passedSpecialDays[passedSpecialDays.length - 1] : null;

    return {
      years,
      totalDays,
      daysUntilAnniversary,
      nextYears,
      currentAnniversaryInfo,
      nextMajorAnniversary,
      upcomingSpecialDays,
      lastSpecialDay,
      weddingDayOfWeek: wedding.toLocaleDateString('ko-KR', { weekday: 'long' }),
    };
  }, [weddingDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
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
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">결혼기념일 계산기</h1>
          <p className="text-[var(--muted-foreground)]">
            결혼일을 입력하면 다양한 기념일 정보를 확인할 수 있습니다
          </p>
        </div>

        <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)]">
          {/* 입력 영역 */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              결혼일
            </label>
            <input
              type="date"
              value={weddingDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeddingDate(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* 결과 영역 */}
          {result && (
            <div className="mt-8 space-y-4">
              {/* 메인 결과 */}
              <div className="bg-pink-500/10 rounded-xl p-5 border border-pink-500/20 text-center">
                <p className="text-[var(--muted-foreground)] text-sm mb-1">결혼한 지</p>
                <p className="text-4xl font-bold text-pink-500">
                  {result.years}년 {result.totalDays.toLocaleString()}일
                </p>
                {result.currentAnniversaryInfo && (
                  <p className="text-pink-400 text-sm mt-2">
                    {result.currentAnniversaryInfo.name}
                  </p>
                )}
              </div>

              {/* 다음 기념일 */}
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[var(--muted-foreground)] text-xs">다음 결혼기념일</p>
                    <p className="text-lg font-bold text-red-500">{result.nextYears}주년</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-500">D-{result.daysUntilAnniversary}</p>
                  </div>
                </div>
              </div>

              {/* 상세 정보 그리드 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--secondary)] rounded-lg p-4 text-center">
                  <p className="text-[var(--muted-foreground)] text-xs mb-1">결혼일</p>
                  <p className="text-sm font-bold text-[var(--foreground)]">{result.weddingDayOfWeek}</p>
                </div>
                {result.lastSpecialDay && (
                  <div className="bg-[var(--secondary)] rounded-lg p-4 text-center">
                    <p className="text-[var(--muted-foreground)] text-xs mb-1">지난 기념일</p>
                    <p className="text-sm font-bold text-[var(--foreground)]">{result.lastSpecialDay.toLocaleString()}일</p>
                  </div>
                )}
              </div>

              {/* 다가오는 특별한 날 */}
              {result.upcomingSpecialDays.length > 0 && (
                <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                  <p className="text-[var(--foreground)] text-sm font-medium mb-3 flex items-center gap-1">
                    <Star className="w-4 h-4 text-purple-500" />
                    다가오는 특별한 날
                  </p>
                  <div className="space-y-2">
                    {result.upcomingSpecialDays.map((special) => (
                      <div key={special.days} className="flex justify-between items-center text-sm">
                        <span className="text-purple-500 font-medium">{special.days.toLocaleString()}일</span>
                        <span className="text-[var(--muted-foreground)]">{formatDate(special.date)}</span>
                        <span className="text-purple-400 font-bold">D-{special.daysLeft}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 다음 주요 기념일 */}
              {result.nextMajorAnniversary && (
                <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                  <p className="text-[var(--foreground)] text-sm font-medium mb-2 flex items-center gap-1">
                    <Gift className="w-4 h-4 text-amber-500" />
                    다음 주요 기념일
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-amber-500 font-bold">{result.nextMajorAnniversary.years}주년</p>
                      <p className="text-amber-400 text-sm">{result.nextMajorAnniversary.name}</p>
                      <p className="text-[var(--muted-foreground)] text-xs">선물: {result.nextMajorAnniversary.gift}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--muted-foreground)]">{formatDate(result.nextMajorAnniversary.date)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!result && weddingDate && (
            <div className="mt-8 text-center text-red-500">
              결혼일이 오늘보다 미래입니다.
            </div>
          )}

          {!weddingDate && (
            <div className="mt-8 text-center text-[var(--muted-foreground)]">
              결혼일을 입력해주세요.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
