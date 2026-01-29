'use client';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { FileText, AlertTriangle, Scale, Ban, RefreshCw, Gavel } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">
            이용약관
          </h1>
          <p className="text-[var(--muted-foreground)]">
            최종 수정일: 2025년 1월 29일
          </p>
        </div>

        <div className="space-y-8">
          {/* 약관 동의 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">
                제1조 (목적)
              </h2>
            </div>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              본 약관은 재테크 계산(이하 &quot;서비스&quot;)이 제공하는 모든 서비스의 이용조건 및
              절차, 이용자와 서비스의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* 서비스 정의 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Scale className="w-5 h-5 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">
                제2조 (서비스의 정의)
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)]">
              <p className="leading-relaxed">
                &quot;서비스&quot;란 재테크 계산이 제공하는 웹 기반 계산기 서비스를 의미하며,
                다음을 포함합니다:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>연봉 실수령액 계산기</li>
                <li>자산 티어 계산기</li>
                <li>자산 성장 시뮬레이터</li>
                <li>나이 계산기</li>
                <li>전역일 계산기</li>
                <li>결혼기념일 계산기</li>
                <li>프리랜서 세금 계산기</li>
                <li>퍼센트 계산기</li>
                <li>기타 서비스가 제공하는 모든 계산기</li>
              </ul>
            </div>
          </section>

          {/* 서비스 이용 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <RefreshCw className="w-5 h-5 text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">
                제3조 (서비스 이용)
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)]">
              <ol className="list-decimal list-inside space-y-2">
                <li>서비스는 별도의 회원가입 없이 누구나 무료로 이용할 수 있습니다.</li>
                <li>서비스는 연중무휴 24시간 제공을 원칙으로 합니다.</li>
                <li>다만, 시스템 점검이나 기술적 문제 발생 시 서비스 이용이 일시적으로 제한될 수 있습니다.</li>
                <li>서비스는 사전 공지 후 서비스 내용을 변경하거나 종료할 수 있습니다.</li>
              </ol>
            </div>
          </section>

          {/* 면책조항 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">
                제4조 (면책조항)
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)]">
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong className="text-[var(--card-foreground)]">정보의 정확성:</strong>{' '}
                  본 서비스에서 제공하는 계산 결과는 참고용으로만 사용해야 하며,
                  실제 세금, 급여, 자산 등은 개인 상황에 따라 다를 수 있습니다.
                </li>
                <li>
                  <strong className="text-[var(--card-foreground)]">투자 조언 아님:</strong>{' '}
                  본 서비스는 재정 상담, 투자 조언, 세무 조언을 제공하지 않습니다.
                  중요한 재정적 결정은 반드시 전문가와 상담하시기 바랍니다.
                </li>
                <li>
                  <strong className="text-[var(--card-foreground)]">데이터 출처:</strong>{' '}
                  통계 데이터는 통계청, 고용노동부 등 공공기관의 자료를 기반으로 하나,
                  최신 정보와 차이가 있을 수 있습니다.
                </li>
                <li>
                  <strong className="text-[var(--card-foreground)]">손해배상:</strong>{' '}
                  서비스 이용으로 인해 발생한 직접적, 간접적, 우발적, 특수적 손해에 대해
                  서비스는 책임을 지지 않습니다.
                </li>
              </ol>
              <div className="bg-[var(--secondary)] p-4 rounded-lg mt-4">
                <p className="text-sm font-medium text-[var(--card-foreground)]">
                  ⚠️ 중요 안내
                </p>
                <p className="text-sm mt-1">
                  본 서비스의 계산 결과는 추정치이며, 실제 금액과 차이가 있을 수 있습니다.
                  정확한 정보는 관련 기관이나 전문가에게 확인하시기 바랍니다.
                </p>
              </div>
            </div>
          </section>

          {/* 금지 행위 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Ban className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">
                제5조 (금지 행위)
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)]">
              <p className="leading-relaxed">
                이용자는 다음 행위를 해서는 안 됩니다:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>서비스의 정상적인 운영을 방해하는 행위</li>
                <li>서비스를 이용하여 불법적인 목적을 달성하려는 행위</li>
                <li>서비스의 콘텐츠를 무단으로 복제, 배포, 수정하는 행위</li>
                <li>자동화된 수단을 이용한 대량 접속 또는 데이터 수집 행위</li>
                <li>기타 관련 법령에 위배되는 행위</li>
              </ul>
            </div>
          </section>

          {/* 지적재산권 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Gavel className="w-5 h-5 text-indigo-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">
                제6조 (지적재산권)
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)]">
              <ol className="list-decimal list-inside space-y-2">
                <li>서비스가 제공하는 콘텐츠에 대한 저작권 및 지적재산권은 서비스에 귀속됩니다.</li>
                <li>이용자는 서비스를 이용함으로써 얻은 정보를 서비스의 사전 승낙 없이 상업적으로 이용할 수 없습니다.</li>
              </ol>
            </div>
          </section>

          {/* 약관 변경 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <h2 className="text-xl font-semibold text-[var(--card-foreground)] mb-4">
              제7조 (약관의 변경)
            </h2>
            <div className="space-y-4 text-[var(--muted-foreground)]">
              <ol className="list-decimal list-inside space-y-2">
                <li>서비스는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.</li>
                <li>약관이 변경되는 경우, 변경 내용을 서비스 내에 공지합니다.</li>
                <li>변경된 약관은 공지 후 즉시 효력이 발생합니다.</li>
              </ol>
            </div>
          </section>

          {/* 준거법 및 관할 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <h2 className="text-xl font-semibold text-[var(--card-foreground)] mb-4">
              제8조 (준거법 및 관할)
            </h2>
            <div className="space-y-4 text-[var(--muted-foreground)]">
              <ol className="list-decimal list-inside space-y-2">
                <li>본 약관은 대한민국 법률에 따라 규율되고 해석됩니다.</li>
                <li>서비스와 이용자 간의 분쟁은 민사소송법상의 관할법원에서 해결합니다.</li>
              </ol>
            </div>
          </section>

          {/* 부칙 */}
          <section className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <h2 className="text-xl font-semibold text-[var(--card-foreground)] mb-4">
              부칙
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              본 약관은 2025년 1월 29일부터 시행됩니다.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
