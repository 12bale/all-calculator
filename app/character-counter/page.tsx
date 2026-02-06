'use client';

import { useState, useMemo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Type, Copy, Check, RotateCcw } from 'lucide-react';

export default function CharacterCounter() {
    const [text, setText] = useState<string>('');
    const [copied, setCopied] = useState(false);

    // 계산 결과
    const stats = useMemo(() => {
        // 글자 수 (공백 포함)
        const charWithSpace = text.length;

        // 글자 수 (공백 제외)
        const charWithoutSpace = text.replace(/\s/g, '').length;

        // 단어 수 (공백으로 구분)
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

        // 줄 수
        const lines = text === '' ? 0 : text.split('\n').length;

        // 바이트 계산 (UTF-8 기준: 한글 3바이트, 영문/숫자 1바이트)
        const bytesUtf8 = new Blob([text]).size;

        // 바이트 계산 (EUC-KR 기준: 한글 2바이트, 영문/숫자 1바이트)
        let bytesEucKr = 0;
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            // 한글 범위 체크 (가-힣, ㄱ-ㅎ, ㅏ-ㅣ)
            if ((charCode >= 0xAC00 && charCode <= 0xD7A3) ||
                (charCode >= 0x3131 && charCode <= 0x318E)) {
                bytesEucKr += 2;
            } else {
                bytesEucKr += 1;
            }
        }

        // SMS/LMS 계산 (EUC-KR 기준)
        let messageType = 'SMS';
        let messageCount = 0;
        if (bytesEucKr === 0) {
            messageCount = 0;
        } else if (bytesEucKr <= 90) {
            messageType = 'SMS';
            messageCount = 1;
        } else if (bytesEucKr <= 2000) {
            messageType = 'LMS';
            messageCount = Math.ceil(bytesEucKr / 2000);
        } else {
            messageType = 'MMS';
            messageCount = Math.ceil(bytesEucKr / 2000);
        }

        return {
            charWithSpace,
            charWithoutSpace,
            words,
            lines,
            bytesUtf8,
            bytesEucKr,
            messageType,
            messageCount,
        };
    }, [text]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setText('');
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    // 예시 텍스트
    const examples = [
        { label: '자기소개서 예시', text: '저는 끈기와 책임감을 갖춘 인재입니다. 대학 시절 동아리 회장으로 활동하며 팀원들과 함께 성공적인 프로젝트를 이끌었습니다.' },
        { label: 'SMS 90바이트', text: '안녕하세요. 회의 일정 안내드립니다. 내일 오후 2시 3층 회의실에서 진행됩니다.' },
        { label: '영문 예시', text: 'Hello, this is a sample text for character counting. It includes both English and numbers like 123.' },
    ];

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation />
            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* 페이지 헤더 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/10 mb-4">
                        <Type className="w-8 h-8 text-[var(--primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">글자 수 세기</h1>
                    <p className="text-[var(--muted-foreground)]">
                        글자 수, 바이트 수, SMS/LMS 건수를 계산합니다
                    </p>
                </div>

                {/* 입력 영역 */}
                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-bold text-[var(--foreground)]">텍스트 입력</label>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                disabled={!text}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--foreground)] rounded-lg transition-colors disabled:opacity-50"
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? '복사됨' : '복사'}
                            </button>
                            <button
                                onClick={handleClear}
                                disabled={!text}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--foreground)] rounded-lg transition-colors disabled:opacity-50"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                초기화
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="여기에 텍스트를 입력하세요..."
                        className="w-full h-48 p-4 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none resize-none bg-[var(--background)] text-[var(--foreground)]"
                    />

                    {/* 예시 버튼 */}
                    <div className="mt-4">
                        <p className="text-xs text-[var(--muted-foreground)] mb-2">예시를 클릭하면 자동 입력됩니다</p>
                        <div className="flex flex-wrap gap-2">
                            {examples.map((example, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setText(example.text)}
                                    className="text-xs px-3 py-1.5 bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--foreground)] rounded-full transition-colors"
                                >
                                    {example.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 결과 영역 */}
                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg border border-[var(--border)] mb-6">
                    <h3 className="font-bold text-[var(--foreground)] mb-4">계산 결과</h3>

                    {/* 글자 수 */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">공백 포함</p>
                            <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-300">
                                {stats.charWithSpace.toLocaleString()}
                                <span className="text-sm font-normal ml-1">자</span>
                            </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                            <p className="text-xs text-green-600 dark:text-green-400 mb-1">공백 제외</p>
                            <p className="text-2xl font-extrabold text-green-700 dark:text-green-300">
                                {stats.charWithoutSpace.toLocaleString()}
                                <span className="text-sm font-normal ml-1">자</span>
                            </p>
                        </div>
                    </div>

                    {/* 단어 수, 줄 수 */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-[var(--secondary)] p-4 rounded-xl">
                            <p className="text-xs text-[var(--muted-foreground)] mb-1">단어 수</p>
                            <p className="text-xl font-bold text-[var(--foreground)]">
                                {stats.words.toLocaleString()}
                                <span className="text-sm font-normal ml-1">개</span>
                            </p>
                        </div>
                        <div className="bg-[var(--secondary)] p-4 rounded-xl">
                            <p className="text-xs text-[var(--muted-foreground)] mb-1">줄 수</p>
                            <p className="text-xl font-bold text-[var(--foreground)]">
                                {stats.lines.toLocaleString()}
                                <span className="text-sm font-normal ml-1">줄</span>
                            </p>
                        </div>
                    </div>

                    {/* 바이트 수 */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800 mb-6">
                        <h4 className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-3">바이트 용량</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">UTF-8 (웹 표준)</p>
                                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                    {formatBytes(stats.bytesUtf8)}
                                </p>
                                <p className="text-xs text-purple-500 dark:text-purple-400">
                                    ({stats.bytesUtf8.toLocaleString()} bytes)
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">EUC-KR (SMS 기준)</p>
                                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                    {formatBytes(stats.bytesEucKr)}
                                </p>
                                <p className="text-xs text-purple-500 dark:text-purple-400">
                                    ({stats.bytesEucKr.toLocaleString()} bytes)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SMS/LMS 정보 */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
                        <h4 className="text-sm font-bold text-orange-700 dark:text-orange-300 mb-3">문자 발송 정보</h4>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">메시지 타입</p>
                                <p className="text-xl font-extrabold text-orange-700 dark:text-orange-300">
                                    {stats.messageType}
                                    {stats.messageCount > 0 && (
                                        <span className="text-sm font-normal ml-2">
                                            ({stats.messageCount}건)
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-orange-600 dark:text-orange-400">
                                    SMS: 90바이트 이하
                                </p>
                                <p className="text-xs text-orange-600 dark:text-orange-400">
                                    LMS: 2,000바이트 이하
                                </p>
                            </div>
                        </div>
                        {stats.bytesEucKr > 0 && stats.bytesEucKr <= 90 && (
                            <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-700">
                                <p className="text-xs text-orange-600 dark:text-orange-400">
                                    SMS 잔여: <span className="font-bold">{90 - stats.bytesEucKr}</span> 바이트 ({Math.floor((90 - stats.bytesEucKr) / 2)}자 한글 추가 가능)
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 도움말 */}
                <div className="bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden">
                    <div className="p-4 bg-[var(--secondary)] border-b border-[var(--border)]">
                        <h3 className="font-bold text-[var(--foreground)]">알아두면 좋은 정보</h3>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <h4 className="font-bold text-[var(--foreground)] text-sm mb-2">바이트 계산 기준</h4>
                            <ul className="text-sm text-[var(--muted-foreground)] space-y-1">
                                <li>• UTF-8: 한글 3바이트, 영문/숫자/공백 1바이트</li>
                                <li>• EUC-KR (SMS): 한글 2바이트, 영문/숫자/공백 1바이트</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-[var(--foreground)] text-sm mb-2">자소서/에세이 글자 수 제한</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { label: '대기업 자소서', limit: '500~1,000자' },
                                    { label: '공기업 자소서', limit: '400~600자' },
                                    { label: '대학 자소서', limit: '1,500자 내외' },
                                    { label: '영문 에세이', limit: '250~500 words' },
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-[var(--secondary)] p-2 rounded-lg">
                                        <p className="text-xs font-bold text-[var(--foreground)]">{item.label}</p>
                                        <p className="text-xs text-[var(--muted-foreground)]">{item.limit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
