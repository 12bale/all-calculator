'use client';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Shield, Lock, Eye, Server, Cookie, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">
            개인정보처리방침
          </h1>
          <p className="text-[var(--muted-foreground)]">
            최종 수정일: 2025년 1월 29일
          </p>
        </div>

        <div className="space-y-8">
          {/* 개요 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">
                개요
              </h2>
            </div>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              재테크 계산(이하 &quot;서비스&quot;)은 이용자의 개인정보를 중요시하며,
              「개인정보 보호법」을 준수하고 있습니다. 본 개인정보처리방침은 서비스가
              이용자의 개인정보를 어떻게 수집, 이용, 보호하는지에 대해 설명합니다.
            </p>
          </section>

          {/* 수집하는 개인정보 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Eye className="w-5 h-5 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">
                수집하는 개인정보
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)]">
              <p className="leading-relaxed">
                <strong className="text-[var(--card-foreground)]">재테크 계산은 개인정보를 수집하지 않습니다.</strong>
              </p>
              <p className="leading-relaxed">
                본 서비스에서 제공하는 모든 계산기(연봉 계산기, 자산 티어 계산기, 나이 계산기 등)는
                사용자가 입력한 데이터를 서버로 전송하거나 저장하지 않습니다.
                모든 계산은 사용자의 브라우저(클라이언트 측)에서 처리되며,
                입력된 정보는 페이지를 떠나는 즉시 삭제됩니다.
              </p>
              <div className="bg-[var(--secondary)] p-4 rounded-lg">
                <p className="text-sm">
                  <strong className="text-[var(--card-foreground)]">참고:</strong> 일부 기능에서 사용자 편의를 위해
                  브라우저의 로컬 스토리지(Local Storage)를 사용할 수 있습니다.
                  이 데이터는 사용자의 기기에만 저장되며, 서버로 전송되지 않습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 서버 저장 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Server className="w-5 h-5 text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">
                데이터 저장 및 보안
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)]">
              <ul className="list-disc list-inside space-y-2">
                <li>사용자가 입력한 개인 데이터(연봉, 자산, 생년월일 등)는 서버에 저장되지 않습니다.</li>
                <li>회원가입이나 로그인 기능이 없으므로 계정 정보를 수집하지 않습니다.</li>
                <li>서비스 이용을 위해 어떠한 개인정보 입력도 요구하지 않습니다.</li>
              </ul>
            </div>
          </section>

          {/* 쿠키 및 분석 도구 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Cookie className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">
                쿠키 및 분석 도구
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)]">
              <p className="leading-relaxed">
                본 서비스는 다음과 같은 목적으로 쿠키 및 유사 기술을 사용할 수 있습니다:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong className="text-[var(--card-foreground)]">Google Analytics:</strong> 웹사이트 트래픽 분석 및 서비스 개선을 위해
                  익명화된 방문 통계를 수집합니다.
                </li>
                <li>
                  <strong className="text-[var(--card-foreground)]">Google AdSense:</strong> 광고 제공을 위해 쿠키를 사용할 수 있습니다.
                  사용자의 관심사에 기반한 광고가 표시될 수 있습니다.
                </li>
              </ul>
              <p className="leading-relaxed">
                사용자는 브라우저 설정을 통해 쿠키 사용을 거부할 수 있습니다.
                다만, 쿠키 거부 시 일부 서비스 이용에 제한이 있을 수 있습니다.
              </p>
            </div>
          </section>

          {/* 개인정보 보호 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Lock className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">
                이용자의 권리
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)]">
              <p className="leading-relaxed">
                본 서비스는 개인정보를 수집하지 않으므로, 별도의 개인정보 열람, 정정, 삭제 요청이 필요하지 않습니다.
              </p>
              <p className="leading-relaxed">
                브라우저의 로컬 스토리지에 저장된 데이터는 사용자가 직접 브라우저 설정에서 삭제할 수 있습니다.
              </p>
            </div>
          </section>

          {/* 문의 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Mail className="w-5 h-5 text-cyan-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">
                문의하기
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)]">
              <p className="leading-relaxed">
                개인정보처리방침에 대한 문의사항이 있으시면 아래 연락처로 문의해 주세요.
              </p>
              <div className="bg-[var(--secondary)] p-4 rounded-lg">
                <p><strong className="text-[var(--card-foreground)]">서비스명:</strong> 재테크 계산</p>
                <p><strong className="text-[var(--card-foreground)]">이메일:</strong> zenox9312@gmail.com</p>
              </div>
            </div>
          </section>

          {/* 변경 사항 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <h2 className="text-xl font-semibold text-[var(--card-foreground)] mb-4">
              개인정보처리방침 변경
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              본 개인정보처리방침은 법령 및 서비스 변경사항을 반영하기 위해 수정될 수 있습니다.
              변경 시 웹사이트를 통해 공지하며, 변경된 방침은 공지 후 즉시 효력이 발생합니다.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
