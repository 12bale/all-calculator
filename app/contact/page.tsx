'use client';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Mail, MessageSquare, Clock, ExternalLink } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            문의하기
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            서비스 이용 중 궁금한 점이나 건의사항이 있으시면 언제든 연락해 주세요.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* 이메일 문의 */}
          <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">
                이메일 문의
              </h2>
            </div>
            <p className="text-[var(--muted-foreground)] mb-4">
              서비스 이용 관련 문의, 버그 제보, 제휴 문의 등 모든 문의를 이메일로 받고 있습니다.
            </p>
            <a
              href="mailto:zenox9312@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              zenox9312@gmail.com
            </a>
            <div className="flex items-center gap-2 mt-4 text-sm text-[var(--muted-foreground)]">
              <Clock className="w-4 h-4" />
              <span>영업일 기준 1-2일 내 답변</span>
            </div>
          </div>

          {/* 계산기 요청 */}
          <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <MessageSquare className="w-6 h-6 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">
                계산기 요청
              </h2>
            </div>
            <p className="text-[var(--muted-foreground)] mb-4">
              필요한 계산기가 없으신가요? 새로운 계산기를 요청해 주시면 검토 후 추가하겠습니다.
            </p>
            <a
              href="https://forms.gle/BGuoqhngkSg1y7596"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              계산기 요청하기
            </a>
          </div>
        </div>

        {/* 자주 묻는 질문 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="font-semibold text-[var(--card-foreground)] mb-2">
                Q. 계산 결과가 실제와 다른 것 같아요.
              </h3>
              <p className="text-[var(--muted-foreground)]">
                A. 본 서비스의 계산 결과는 일반적인 상황을 가정한 추정치입니다.
                실제 세금, 급여 등은 개인의 상황(부양가족 수, 비과세 항목, 특별 공제 등)에 따라 달라질 수 있습니다.
                정확한 금액은 관련 기관이나 전문가에게 확인하시기 바랍니다.
              </p>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="font-semibold text-[var(--card-foreground)] mb-2">
                Q. 입력한 정보가 저장되나요?
              </h3>
              <p className="text-[var(--muted-foreground)]">
                A. 아니요, 입력하신 모든 정보는 서버에 저장되지 않습니다.
                모든 계산은 사용자의 브라우저에서 처리되며, 페이지를 떠나면 입력 정보는 삭제됩니다.
              </p>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="font-semibold text-[var(--card-foreground)] mb-2">
                Q. 자산 티어 계산기의 데이터는 어디서 왔나요?
              </h3>
              <p className="text-[var(--muted-foreground)]">
                A. 통계청의 가계금융복지조사 및 고용노동부의 고용형태별근로실태조사 데이터를 기반으로 합니다.
                데이터는 주기적으로 업데이트됩니다.
              </p>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="font-semibold text-[var(--card-foreground)] mb-2">
                Q. 서비스 이용료가 있나요?
              </h3>
              <p className="text-[var(--muted-foreground)]">
                A. 재테크 계산의 모든 계산기는 무료로 이용하실 수 있습니다.
                회원가입도 필요 없습니다.
              </p>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="font-semibold text-[var(--card-foreground)] mb-2">
                Q. 모바일에서도 이용할 수 있나요?
              </h3>
              <p className="text-[var(--muted-foreground)]">
                A. 네, 재테크 계산은 모바일 환경에 최적화되어 있어 스마트폰, 태블릿에서도 편리하게 이용하실 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 운영 정보 */}
        <section className="bg-[var(--secondary)] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
            운영 정보
          </h2>
          <div className="space-y-2 text-[var(--muted-foreground)]">
            <p><strong className="text-[var(--foreground)]">서비스명:</strong> 재테크 계산</p>
            <p><strong className="text-[var(--foreground)]">이메일:</strong> zenox9312@gmail.com</p>
            <p><strong className="text-[var(--foreground)]">웹사이트:</strong> www.allcalculator.co.kr</p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
