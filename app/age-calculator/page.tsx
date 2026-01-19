'use client';

import React, { useState, useMemo } from 'react';
import Header from '../components/Header';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const result = useMemo(() => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (birth > target) return null;

    // 만 나이 계산
    let koreanAge = target.getFullYear() - birth.getFullYear();
    const monthDiff = target.getMonth() - birth.getMonth();
    const dayDiff = target.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      koreanAge--;
    }

    // 연 나이 (한국식 세는 나이 - 2023년부터 만 나이 통일)
    const yearAge = target.getFullYear() - birth.getFullYear() + 1;

    // 다음 생일까지 남은 일수
    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= target) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil(
      (nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 살아온 일수
    const totalDays = Math.floor(
      (target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 살아온 주
    const totalWeeks = Math.floor(totalDays / 7);

    // 살아온 개월
    const totalMonths =
      (target.getFullYear() - birth.getFullYear()) * 12 +
      (target.getMonth() - birth.getMonth());

    // 띠 계산
    const zodiacAnimals = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양'];
    const zodiac = zodiacAnimals[birth.getFullYear() % 12];

    // 별자리 계산
    const month = birth.getMonth() + 1;
    const day = birth.getDate();
    let constellation = '';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) constellation = '물병자리';
    else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) constellation = '물고기자리';
    else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) constellation = '양자리';
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) constellation = '황소자리';
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) constellation = '쌍둥이자리';
    else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) constellation = '게자리';
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) constellation = '사자자리';
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) constellation = '처녀자리';
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) constellation = '천칭자리';
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) constellation = '전갈자리';
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) constellation = '사수자리';
    else constellation = '염소자리';

    // 띠동갑 계산 (12년 주기)
    const birthYear = birth.getFullYear();
    const olderTtidongGap = birthYear - 12; // 위 띠동갑 (12살 위)
    const youngerTtidongGap = birthYear + 12; // 아래 띠동갑 (12살 아래)

    return {
      koreanAge,
      yearAge,
      totalDays,
      totalWeeks,
      totalMonths,
      daysUntilBirthday,
      zodiac,
      constellation,
      birthYear,
      olderTtidongGap,
      youngerTtidongGap,
    };
  }, [birthDate, targetDate]);

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        🎂 나이 계산기
      </h2>
      <p className="text-center text-gray-500 text-sm mb-6">
        생년월일을 입력하면 다양한 나이 정보를 확인할 수 있습니다
      </p>

      {/* 입력 영역 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            생년월일
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            기준일 (오늘)
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="mt-8 space-y-4">
          {/* 메인 나이 표시 */}
          <div className="bg-orange-50 rounded-xl p-5 border border-orange-200 text-center">
            <p className="text-gray-600 text-sm mb-1">만 나이</p>
            <p className="text-4xl font-bold text-orange-600">{result.koreanAge}세</p>
            <p className="text-gray-500 text-xs mt-2">
              (세는 나이: {result.yearAge}세)
            </p>
          </div>

          {/* 상세 정보 그리드 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-xs mb-1">살아온 날</p>
              <p className="text-xl font-bold text-gray-800">{result.totalDays.toLocaleString()}일</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-xs mb-1">살아온 주</p>
              <p className="text-xl font-bold text-gray-800">{result.totalWeeks.toLocaleString()}주</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-xs mb-1">살아온 개월</p>
              <p className="text-xl font-bold text-gray-800">{result.totalMonths.toLocaleString()}개월</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-xs mb-1">다음 생일까지</p>
              <p className="text-xl font-bold text-blue-600">D-{result.daysUntilBirthday}</p>
            </div>
          </div>

          {/* 띠와 별자리 */}
          <div className="flex gap-3">
            <div className="flex-1 bg-yellow-50 rounded-lg p-4 text-center border border-yellow-200">
              <p className="text-gray-500 text-xs mb-1">띠</p>
              <p className="text-lg font-bold text-yellow-700">{result.zodiac}띠</p>
            </div>
            <div className="flex-1 bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
              <p className="text-gray-500 text-xs mb-1">별자리</p>
              <p className="text-lg font-bold text-purple-700">{result.constellation}</p>
            </div>
          </div>

          {/* 띠동갑 정보 */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
            <p className="text-center text-gray-600 text-sm font-medium mb-3">
              🐾 띠동갑 ({result.zodiac}띠)
            </p>
            <div className="flex gap-3">
              <div className="flex-1 bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-gray-500 text-xs mb-1">위 띠동갑</p>
                <p className="text-lg font-bold text-amber-700">{result.olderTtidongGap}년생</p>
                <p className="text-gray-400 text-xs mt-1">12살 위</p>
              </div>
              <div className="flex-1 bg-amber-100 rounded-lg p-3 text-center">
                <p className="text-gray-500 text-xs mb-1">본인</p>
                <p className="text-lg font-bold text-amber-800">{result.birthYear}년생</p>
                <p className="text-gray-400 text-xs mt-1">{result.zodiac}띠</p>
              </div>
              <div className="flex-1 bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-gray-500 text-xs mb-1">아래 띠동갑</p>
                <p className="text-lg font-bold text-amber-700">{result.youngerTtidongGap}년생</p>
                <p className="text-gray-400 text-xs mt-1">12살 아래</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && birthDate && (
        <div className="mt-8 text-center text-red-500">
          기준일이 생년월일보다 이전입니다.
        </div>
      )}

      {!birthDate && (
        <div className="mt-8 text-center text-gray-400">
          생년월일을 입력해주세요.
        </div>
      )}
      </div>
    </>
  );
}
