'use client';

import Link from 'next/link';

export default function Header() {
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link
                        href="/"
                        className="font-bold text-xl text-gray-900 cursor-pointer flex items-center gap-2"
                    >
                        <span>🔢</span>
                        <span>재테크 계산</span>
                    </Link>

                    <Link
                        href="/"
                        className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition cursor-pointer"
                    >
                        홈으로
                    </Link>
                </div>
            </div>
        </nav>
    );
}
