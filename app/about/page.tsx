'use client';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Calculator, Target, Shield, Zap, Users, Heart, TrendingUp, Wallet, BarChart3, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const features = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: '다양한 계산기',
      description: '연봉, 자산, 세금, 나이 등 일상에서 필요한 모든 계산기를 한 곳에서 제공합니다.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: '빠르고 정확한 계산',
      description: '복잡한 공식도 즉시 계산하여 정확한 결과를 제공합니다.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '개인정보 보호',
      description: '입력한 데이터는 서버에 저장되지 않습니다. 모든 계산은 브라우저에서 처리됩니다.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: '무료 서비스',
      description: '회원가입 없이 누구나 무료로 모든 계산기를 이용할 수 있습니다.',
    },
  ];

  const calculators = [
    { icon: <TrendingUp className="w-5 h-5" />, name: '자산 티어 계산기', href: '/tier-calculator', description: '내 자산은 상위 몇 %?' },
    { icon: <Wallet className="w-5 h-5" />, name: '연봉 실수령액 계산기', href: '/salary-calculator', description: '세금 공제 후 실제 월급' },
    { icon: <BarChart3 className="w-5 h-5" />, name: '자산 성장 시뮬레이터', href: '/stack-calculator', description: '복리로 자산 성장 예측' },
    { icon: <Calendar className="w-5 h-5" />, name: '나이 계산기', href: '/age-calculator', description: '만나이, 띠, 별자리' },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 히어로 섹션 */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--primary)] rounded-2xl mb-6">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            재테크 계산
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            복잡한 계산은 저희에게 맡기세요.<br />
            연봉, 자산, 세금, 나이까지 일상의 모든 계산을 한 곳에서 해결합니다.
          </p>
        </section>

        {/* 미션 섹션 */}
        <section className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)] mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--card-foreground)]">
              우리의 미션
            </h2>
          </div>
          <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
            재테크 계산은 &quot;누구나 쉽게 금융 정보에 접근할 수 있어야 한다&quot;는 믿음으로 시작되었습니다.
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
            연봉 협상을 앞두고 실수령액이 궁금할 때, 내 자산이 또래 대비 어느 정도인지 알고 싶을 때,
            투자하면 얼마나 자산이 늘어날지 시뮬레이션하고 싶을 때 - 이런 순간에 복잡한 계산 없이
            빠르게 답을 얻을 수 있도록 도와드립니다.
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            통계청, 고용노동부 등 공신력 있는 기관의 데이터를 활용하여 신뢰할 수 있는 결과를 제공하고,
            회원가입이나 개인정보 수집 없이 누구나 무료로 이용할 수 있습니다.
          </p>
        </section>

        {/* 특징 섹션 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">
            왜 재테크 계산인가요?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]"
              >
                <div className="p-2 bg-[var(--primary)]/10 rounded-lg w-fit mb-4">
                  <div className="text-[var(--primary)]">{feature.icon}</div>
                </div>
                <h3 className="font-semibold text-[var(--card-foreground)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 인기 계산기 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">
            인기 계산기
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calculators.map((calc, index) => (
              <Link
                key={index}
                href={calc.href}
                className="flex items-center gap-4 bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] hover:border-[var(--primary)] transition-colors group"
              >
                <div className="p-3 bg-[var(--secondary)] rounded-xl group-hover:bg-[var(--primary)]/10 transition-colors">
                  <div className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {calc.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--card-foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {calc.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 데이터 출처 */}
        <section className="bg-[var(--secondary)] rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
            데이터 출처
          </h2>
          <p className="text-[var(--muted-foreground)] mb-4">
            재테크 계산은 신뢰할 수 있는 공공 데이터를 기반으로 서비스를 제공합니다:
          </p>
          <ul className="space-y-2 text-[var(--muted-foreground)]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></span>
              통계청 가계금융복지조사 (자산, 부채 데이터)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></span>
              고용노동부 고용형태별근로실태조사 (연봉 데이터)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></span>
              국세청 세율표 (세금 계산)
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-[var(--primary)]/10 to-blue-500/10 rounded-2xl p-8 border border-[var(--primary)]/20">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[var(--primary)] rounded-full mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            계산기 요청
          </h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            필요한 계산기가 없으신가요? 새로운 계산기를 요청해 주세요!
          </p>
          <a
            href="https://forms.gle/BGuoqhngkSg1y7596"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            계산기 요청하기
          </a>
        </section>
      </div>

      <Footer />
    </main>
  );
}
