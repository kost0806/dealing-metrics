import type { Metadata } from 'next';
import '../src/styles/global.css';

export const metadata: Metadata = {
  title: '딜량 측정 시스템',
  description: '게임 보스 딜량을 기록하고 통계를 확인하세요',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
