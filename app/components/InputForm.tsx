"use client";

import { useState, useEffect } from "react";
import { Calculator, TrendingUp, Wallet, User, HelpCircle } from "lucide-react";
import { parseAmount } from "@/lib/calculator";

interface InputFormProps {
  onSubmit: (data: { age: number; netWorth: number; salary: number }) => void;
  isLoading?: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [age, setAge] = useState<string>("");
  const [netWorth, setNetWorth] = useState<string>("");
  const [salary, setSalary] = useState<string>("");
  const [errors, setErrors] = useState<{ age?: string; netWorth?: string; salary?: string }>({});

  // 파싱된 값 미리보기
  const [netWorthPreview, setNetWorthPreview] = useState<string>("");
  const [salaryPreview, setSalaryPreview] = useState<string>("");

  // 순자산 입력 처리 (다양한 형식 지원)
  useEffect(() => {
    if (netWorth.trim()) {
      const parsed = parseAmount(netWorth);
      if (parsed.value !== 0 || netWorth.includes("0")) {
        setNetWorthPreview(parsed.formatted);
      } else {
        setNetWorthPreview("");
      }
    } else {
      setNetWorthPreview("");
    }
  }, [netWorth]);

  // 연봉 입력 처리
  useEffect(() => {
    if (salary.trim()) {
      const parsed = parseAmount(salary);
      if (parsed.value !== 0 || salary.includes("0")) {
        setSalaryPreview(parsed.formatted);
      } else {
        setSalaryPreview("");
      }
    } else {
      setSalaryPreview("");
    }
  }, [salary]);

  const validate = (): boolean => {
    const newErrors: { age?: string; netWorth?: string; salary?: string } = {};

    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum)) {
      newErrors.age = "나이를 입력해주세요";
    } else if (ageNum < 20 || ageNum > 100) {
      newErrors.age = "20세 이상 100세 이하만 가능합니다";
    }

    const netWorthParsed = parseAmount(netWorth);
    if (!netWorth.trim()) {
      newErrors.netWorth = "순자산을 입력해주세요";
    } else if (netWorthParsed.value < -100000) {
      newErrors.netWorth = "-100억 이상 입력해주세요";
    }

    const salaryParsed = parseAmount(salary);
    if (!salary.trim()) {
      newErrors.salary = "연봉을 입력해주세요";
    } else if (salaryParsed.value < 0) {
      newErrors.salary = "0 이상 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const netWorthParsed = parseAmount(netWorth);
      const salaryParsed = parseAmount(salary);

      onSubmit({
        age: parseInt(age, 10),
        netWorth: netWorthParsed.value,
        salary: salaryParsed.value,
      });
    }
  };

  const quickFillExamples = [
    { label: "사회초년생", age: 25, netWorth: "2000", salary: "3500" },
    { label: "30대 직장인", age: 35, netWorth: "1.5억", salary: "6000" },
    { label: "40대 중산층", age: 45, netWorth: "5억", salary: "8000" },
    { label: "50대 자산가", age: 55, netWorth: "10억", salary: "1억" },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Age Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <User className="w-4 h-4 text-[var(--primary)]" />
            나이
          </label>
          <div className="relative">
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="만 나이 입력"
              className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-xl
                focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent
                text-[var(--card-foreground)] placeholder:text-[var(--muted-foreground)]
                transition-all duration-200"
              min="20"
              max="100"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
              세
            </span>
          </div>
          {errors.age && (
            <p className="text-sm text-red-500">{errors.age}</p>
          )}
        </div>

        {/* Net Worth Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <Wallet className="w-4 h-4 text-[var(--primary)]" />
            순자산 (부동산 + 금융자산 - 부채)
          </label>
          <div className="relative">
            <input
              type="text"
              value={netWorth}
              onChange={(e) => setNetWorth(e.target.value)}
              placeholder="예: 1억 5000만, 1.5억, 15000"
              className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-xl
                focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent
                text-[var(--card-foreground)] placeholder:text-[var(--muted-foreground)]
                transition-all duration-200"
            />
          </div>
          {netWorthPreview && (
            <p className="text-sm text-[var(--primary)] font-medium">
              = {netWorthPreview}
            </p>
          )}
          <div className="flex items-start gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[var(--muted-foreground)] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[var(--muted-foreground)]">
              &apos;1억&apos;, &apos;1.5억&apos;, &apos;1억 5000만원&apos;, &apos;15000&apos;(만원) 등 자유롭게 입력
            </p>
          </div>
          {errors.netWorth && (
            <p className="text-sm text-red-500">{errors.netWorth}</p>
          )}
        </div>

        {/* Salary Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
            연봉 (세전)
          </label>
          <div className="relative">
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="예: 6000만원, 1억, 6000"
              className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-xl
                focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent
                text-[var(--card-foreground)] placeholder:text-[var(--muted-foreground)]
                transition-all duration-200"
            />
          </div>
          {salaryPreview && (
            <p className="text-sm text-[var(--accent)] font-medium">
              = {salaryPreview}
            </p>
          )}
          {errors.salary && (
            <p className="text-sm text-red-500">{errors.salary}</p>
          )}
        </div>

        {/* Quick Fill Buttons */}
        <div className="space-y-2">
          <p className="text-xs text-[var(--muted-foreground)]">빠른 입력 예시:</p>
          <div className="flex flex-wrap gap-2">
            {quickFillExamples.map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => {
                  setAge(example.age.toString());
                  setNetWorth(example.netWorth);
                  setSalary(example.salary);
                }}
                className="px-3 py-1.5 text-xs bg-[var(--secondary)] text-[var(--secondary-foreground)]
                  rounded-lg hover:bg-[var(--muted)] transition-colors duration-200"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 bg-[var(--primary)] text-[var(--primary-foreground)]
            font-semibold rounded-xl hover:opacity-90 transition-all duration-200
            flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
            shadow-lg hover:shadow-xl"
        >
          <Calculator className="w-5 h-5" />
          {isLoading ? "분석 중..." : "내 티어 확인하기"}
        </button>
      </form>
    </div>
  );
}
