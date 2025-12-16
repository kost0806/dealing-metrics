'use client';

import React from 'react';
import { DamageMetrics } from '../types';
import './MetricsCard.css';

interface MetricsCardProps {
  metrics: DamageMetrics;
  userName?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ metrics, userName }) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR', {
      maximumFractionDigits: 0,
    });
  };

  const formatDecimal = (num: number) => {
    return num.toLocaleString('ko-KR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'percentile-high';
    if (percentile >= 70) return 'percentile-mid';
    return 'percentile-low';
  };

  return (
    <div className="glass-card metrics-card">
      <div className="metrics-header">
        <h2 className="metrics-title">통계 정보</h2>
        {userName && <span className="user-name">{userName}</span>}
      </div>

      <div className="metrics-grid">
        <div className="metric-item">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <span className="metric-label">총 딜량</span>
            <span className="metric-value">{formatNumber(metrics.total)}</span>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <span className="metric-label">회당 평균</span>
            <span className="metric-value">{formatNumber(metrics.average)}</span>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <span className="metric-label">중앙값</span>
            <span className="metric-value">{formatNumber(metrics.median)}</span>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-icon">📉</div>
          <div className="metric-content">
            <span className="metric-label">표준편차</span>
            <span className="metric-value">{formatDecimal(metrics.standardDeviation)}</span>
          </div>
        </div>
      </div>

      <div className={`percentile-card ${getPercentileColor(metrics.percentile)}`}>
        <div className="percentile-label">상위</div>
        <div className="percentile-value">{100 - metrics.percentile}%</div>
      </div>
    </div>
  );
};

export default MetricsCard;
