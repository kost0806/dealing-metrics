'use client';

import React, { useState, useEffect } from 'react';
import DamageInput from './DamageInput';
import MetricsCard from './MetricsCard';
import { calculateAllMetrics } from '../utils/metricsCalculator';
import { saveDamageEntry, getAllUserTotals } from '../utils/firebaseService';
import { DamageMetrics } from '../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [currentMetrics, setCurrentMetrics] = useState<DamageMetrics | null>(null);
  const [allUserTotals, setAllUserTotals] = useState<number[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [isNameSet, setIsNameSet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    loadAllUserTotals();
  }, []);

  const loadAllUserTotals = async () => {
    try {
      const totals = await getAllUserTotals();
      setAllUserTotals(totals);
    } catch (error) {
      console.error('Failed to load user totals:', error);
    }
  };

  const handleNameSubmit = () => {
    if (userName.trim()) {
      setIsNameSet(true);
    }
  };

  const handleDamageSubmit = async (damages: number[]) => {
    setLoading(true);
    setSuccessMessage('');

    try {
      // Calculate metrics with current user totals
      const metrics = calculateAllMetrics(damages, allUserTotals);
      setCurrentMetrics(metrics);

      // Save to Firebase with timeout
      const userId = `user_${Date.now()}`; // In production, use proper auth user ID

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('요청 시간이 초과되었습니다')), 10000);
      });

      // Race between Firebase operation and timeout
      await Promise.race([
        saveDamageEntry(userId, userName, damages),
        timeoutPromise
      ]);

      // Reload all user totals to update percentile for future submissions
      await Promise.race([
        loadAllUserTotals(),
        timeoutPromise
      ]);

      setSuccessMessage('딜량이 성공적으로 저장되었습니다!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save damage entry:', error);

      // More detailed error message
      let errorMessage = '딜량 저장에 실패했습니다.';
      if (error instanceof Error) {
        if (error.message.includes('시간이 초과')) {
          errorMessage = 'Firebase 연결 시간이 초과되었습니다. .env 파일을 확인하고 서버를 재시작해주세요.';
        } else if (error.message.includes('permission')) {
          errorMessage = 'Firebase 권한이 없습니다. Firestore 보안 규칙을 확인해주세요.';
        }
      }

      alert(errorMessage + '\n\n브라우저 콘솔(F12)에서 자세한 오류를 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  if (!isNameSet) {
    return (
      <div className="container">
        <div className="name-setup">
          <div className="glass-card name-card">
            <h1 className="welcome-title">딜량 측정 시스템</h1>
            <p className="welcome-description">
              게임 보스 딜량을 기록하고 통계를 확인하세요
            </p>
            <div className="name-input-group">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                placeholder="사용자 이름 입력"
                className="name-input"
                maxLength={20}
              />
              <button
                onClick={handleNameSubmit}
                disabled={!userName.trim()}
                className="btn-start"
              >
                시작하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">딜량 대시보드</h1>
        <div className="user-badge">{userName}</div>
      </header>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div className="bento-grid">
        <div className="bento-item bento-large">
          <DamageInput onSubmit={handleDamageSubmit} />
        </div>

        {currentMetrics && (
          <div className="bento-item bento-large">
            <MetricsCard metrics={currentMetrics} userName={userName} />
          </div>
        )}

        <div className="bento-item bento-wide">
          <div className="glass-card info-card">
            <h3 className="info-title">📌 사용 방법</h3>
            <ul className="info-list">
              <li>9회의 보스 딜량을 모두 입력하세요</li>
              <li>제출 버튼을 클릭하면 통계가 계산됩니다</li>
              <li>다른 사용자들과 비교하여 상위 몇 %인지 확인하세요</li>
              <li>데이터는 Firebase에 안전하게 저장됩니다</li>
            </ul>
          </div>
        </div>

        <div className="bento-item bento-tall">
          <div className="glass-card stats-card">
            <h3 className="stats-title">🎮 전체 통계</h3>
            <div className="stats-item">
              <span className="stats-label">등록된 기록</span>
              <span className="stats-value">{allUserTotals.length}개</span>
            </div>
            <div className="stats-item">
              <span className="stats-label">최고 딜량</span>
              <span className="stats-value">
                {allUserTotals.length > 0
                  ? Math.max(...allUserTotals).toLocaleString()
                  : '-'}
              </span>
            </div>
            <div className="stats-item">
              <span className="stats-label">평균 딜량</span>
              <span className="stats-value">
                {allUserTotals.length > 0
                  ? Math.round(
                      allUserTotals.reduce((a, b) => a + b, 0) / allUserTotals.length
                    ).toLocaleString()
                  : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
