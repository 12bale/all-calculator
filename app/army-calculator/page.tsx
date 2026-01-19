'use client';

import { useState, useMemo } from 'react';
import Header from '../components/Header';

type BranchType = 'army' | 'navy' | 'airforce' | 'marine' | 'social';

// --- 군별 복무 설정 (개월 수) ---
const branchConfig = {
    army: { name: '육군', months: 18, color: 'bg-green-600', text: 'text-green-600' },
    marine: { name: '해병대', months: 18, color: 'bg-red-600', text: 'text-red-600' },
    navy: { name: '해군', months: 20, color: 'bg-blue-600', text: 'text-blue-600' },
    airforce: { name: '공군', months: 21, color: 'bg-sky-500', text: 'text-sky-500' },
    social: { name: '사회복무', months: 21, color: 'bg-indigo-500', text: 'text-indigo-500' },
};

// 초기 날짜 계산 함수
const getInitialDate = () => new Date().toISOString().split('T')[0];

export default function MilitaryCalculator() {
    // --- 상태 관리 ---
    const [enlistDate, setEnlistDate] = useState<string>(getInitialDate); // 입대일 (YYYY-MM-DD)
    const [branch, setBranch] = useState<BranchType>('army');
    const [usedVacation, setUsedVacation] = useState<number>(0); // 사용한 휴가일수

    // --- 계산 로직 ---
    const result = useMemo(() => {
        if (!enlistDate) return null;

        const start = new Date(enlistDate);
        start.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. 전역일 계산
        const end = new Date(start);
        end.setMonth(start.getMonth() + branchConfig[branch].months);
        // 전역일은 복무기간이 끝나는 다음날이 아니라 꽉 채운 날짜 기준
        end.setDate(end.getDate() - 1);

        // 2. 날짜 차이 계산
        const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const servedDays = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const remainDays = totalDays - servedDays;

        // 3. 퍼센트 (0~100 제한)
        let percent = (servedDays / totalDays) * 100;
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;

        // 4. 계급 추정 (육군 기준 일반적 기간: 2/6/6/4개월)
        // 실제로는 부대마다 다르지만 통상적인 기준으로 시각화
        const rankData = [
            { name: '이병', months: 2 },
            { name: '일병', months: 6 },
            { name: '상병', months: 6 },
            { name: '병장', months: branchConfig[branch].months - 14 }, // 남은 기간
        ];

        // 계급별 누적 % 계산
        let accumulatedMonths = 0;
        const ranks = rankData.map(r => {
            accumulatedMonths += r.months;
            const rankPercent = (accumulatedMonths / branchConfig[branch].months) * 100;
            return { ...r, percent: rankPercent };
        });

        // 5. 실질 남은 일수 (남은 일수 - 휴가)
        const actualRemainDays = Math.max(0, remainDays - usedVacation);

        return {
            endDate: end,
            totalDays,
            servedDays: servedDays > totalDays ? totalDays : (servedDays < 0 ? 0 : servedDays),
            remainDays: remainDays < 0 ? 0 : remainDays,
            actualRemainDays,
            percent,
            ranks
        };
    }, [enlistDate, branch, usedVacation]);

    // 날짜 포맷팅
    const formatDate = (date: Date) =>
        `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

    const config = branchConfig[branch];

    return (
        <>
            <Header />
            <div className="max-w-xl mx-auto my-10 font-sans px-4">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
                        🪖 전역일 계산기
                    </h2>

                    {/* 입력 영역 */}
                    <div className="space-y-4 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-bold text-gray-600 mb-1 block">군별 선택</label>
                                <select
                                    value={branch}
                                    onChange={(e) => setBranch(e.target.value as BranchType)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white"
                                >
                                    <option value="army">육군 (18개월)</option>
                                    <option value="marine">해병대 (18개월)</option>
                                    <option value="navy">해군 (20개월)</option>
                                    <option value="airforce">공군 (21개월)</option>
                                    <option value="social">사회복무요원 (21개월)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-600 mb-1 block">입대일</label>
                                <input
                                    type="date"
                                    value={enlistDate}
                                    onChange={(e) => setEnlistDate(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-600 mb-1 block">사용 휴가 (일)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={usedVacation || ''}
                                    onChange={(e) => setUsedVacation(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 결과 영역 */}
                    {result && (
                        <div>

                            {/* D-Day 배지 */}
                            <div className="text-center mb-8">
                                <span className="text-gray-500 text-sm font-medium mb-1 block">전역 예정일</span>
                                <div className="text-2xl font-bold text-gray-800 mb-2">
                                    {formatDate(result.endDate)}
                                    <span className="text-sm text-gray-400 font-normal ml-2">
                                        ({['일', '월', '화', '수', '목', '금', '토'][result.endDate.getDay()]}요일)
                                    </span>
                                </div>

                                <div className={`inline-block px-6 py-2 rounded-full text-2xl font-extrabold text-white shadow-lg ${config.color}`}>
                                    {result.remainDays > 0 ? `D - ${result.remainDays}` : '전역을 축하합니다! 🎉'}
                                </div>
                            </div>

                            {/* 프로그레스 바 */}
                            <div className="mb-8">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>입대 ({formatDate(new Date(enlistDate))})</span>
                                    <span className={`font-bold ${config.text}`}>{result.percent.toFixed(1)}% 달성</span>
                                    <span>전역</span>
                                </div>
                                <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
                                    {/* 메인 진행바 */}
                                    <div
                                        className={`h-full ${config.color} transition-all duration-1000 ease-out`}
                                        style={{ width: `${result.percent}%` }}
                                    >
                                        {/* 스트라이프 효과 (장식) */}
                                        <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>
                                    </div>

                                    {/* 계급 눈금 표시 (작대기) */}
                                    {result.ranks.slice(0, 3).map((rank) => (
                                        <div
                                            key={rank.name}
                                            className="absolute top-0 bottom-0 w-px bg-white/50 z-10 border-l border-dashed border-gray-400"
                                            style={{ left: `${rank.percent}%` }}
                                        >
                                            <div className="absolute top-5 -left-2 text-[10px] text-gray-400">{rank.name}진급</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 상세 정보 그리드 */}
                            <div className="grid grid-cols-3 gap-2 text-center bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="border-r border-gray-200 last:border-0">
                                    <div className="text-xs text-gray-500 mb-1">총 복무일</div>
                                    <div className="font-bold text-gray-700">{result.totalDays}일</div>
                                </div>
                                <div className="border-r border-gray-200 last:border-0">
                                    <div className="text-xs text-gray-500 mb-1">현재 복무</div>
                                    <div className={`font-bold ${config.text}`}>{result.servedDays}일</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">남은 기간</div>
                                    <div className="font-bold text-gray-700">{result.remainDays}일</div>
                                </div>
                            </div>

                            {/* 실질 남은 일수 (휴가 차감) */}
                            {result.remainDays > 0 && usedVacation > 0 && (
                                <div className="mt-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                                    <div className="text-center">
                                        <p className="text-gray-600 text-sm mb-2">🏖️ 휴가 차감 후 실질 남은 일수</p>
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="text-gray-500">{result.remainDays}일</span>
                                            <span className="text-gray-400">-</span>
                                            <span className="text-emerald-600 font-medium">{usedVacation}일</span>
                                            <span className="text-gray-400">=</span>
                                            <span className="text-2xl font-bold text-emerald-700">{result.actualRemainDays}일</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            휴가를 다 쓰면 실제로 {result.actualRemainDays}일만 더 있으면 됩니다!
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* 재미 요소 (짬밥 계산) */}
                            {result.remainDays > 0 && (
                                <div className="mt-6 text-center text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                    🍴 앞으로 짬밥을 약 <span className="font-bold text-yellow-700">{result.remainDays * 3}끼</span> 더 드셔야 집에 갑니다.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}