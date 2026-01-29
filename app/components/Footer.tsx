"use client";

import Link from "next/link";
import { Shield, Database, Github, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 데이터 출처 및 개인정보 보호 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 데이터 출처 */}
          <div className="flex items-start gap-3 p-4 bg-[var(--secondary)] rounded-xl">
            <Database className="w-5 h-5 text-[var(--primary)] mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm text-[var(--card-foreground)] mb-1">
                데이터 출처
              </h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                통계청 가계금융복지조사
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                고용노동부 고용형태별근로실태조사
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                기준연도: 2024-2025년
              </p>
            </div>
          </div>

          {/* 개인정보 보호 */}
          <div className="flex items-start gap-3 p-4 bg-[var(--secondary)] rounded-xl">
            <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm text-[var(--card-foreground)] mb-1">
                개인정보 보호
              </h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                입력된 데이터는 서버에 저장되지 않습니다.
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                모든 계산은 브라우저에서 처리되며, 어떠한 개인정보도 수집하지 않습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 주요 링크 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div>
            <h4 className="font-semibold text-sm text-[var(--card-foreground)] mb-3">서비스</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  전체 계산기
                </Link>
              </li>
              <li>
                <Link href="/tier-calculator" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  자산 티어 계산
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[var(--card-foreground)] mb-3">고객지원</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://forms.gle/BGuoqhngkSg1y7596" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  계산기 요청
                </a>
              </li>
              <li>
                <a href="mailto:zenox9312@gmail.com" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  이메일
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[var(--card-foreground)] mb-3">법적 고지</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[var(--card-foreground)] mb-3">외부 링크</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://kostat.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  통계청
                </a>
              </li>
              <li>
                <a
                  href="https://www.moel.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  고용노동부
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 면책 조항 */}
        <div className="text-center mb-6 p-4 bg-[var(--muted)] rounded-lg">
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            본 서비스는 통계 데이터를 기반으로 한 추정치를 제공하며, 재미와 참고 목적으로만 사용해주세요.
            <br className="hidden sm:block" />
            실제 재정 상담이나 투자 결정을 대체하지 않습니다. 정확한 재무 상담은 전문가와 상의하세요.
          </p>
        </div>

        {/* 저작권 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--muted-foreground)]">
            &copy; {currentYear} 전부 계산. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:zenox9312@gmail.com"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              aria-label="이메일 문의"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
