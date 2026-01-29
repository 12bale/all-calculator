"use client";

import { X } from 'lucide-react';
import { AnalysisReport } from '@/lib/report';

interface ReportModalProps {
  report: AnalysisReport | null;
  onClose: () => void;
}

export default function ReportModal({ report, onClose }: ReportModalProps) {
  if (!report) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--card-foreground)]">상세 분석 리포트</h2>
          <button
            onClick={onClose}
            className="text-[var(--muted-foreground)] hover:bg-[var(--secondary)] rounded-lg p-1.5 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 md:p-8">
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1 className="text-[var(--card-foreground)]">{report.title}</h1>
            <div
              className="text-[var(--card-foreground)]"
              dangerouslySetInnerHTML={{ __html: report.content }}
            />
          </article>
        </div>

        <div className="p-4 border-t border-[var(--border)] text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 font-semibold text-[var(--primary-foreground)] bg-[var(--primary)] rounded-lg hover:opacity-90 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
