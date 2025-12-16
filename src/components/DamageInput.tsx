'use client';

import React, { useState } from 'react';
import { validateDamageInput } from '../utils/metricsCalculator';
import './DamageInput.css';

interface DamageInputProps {
  onSubmit: (damages: number[]) => void;
  initialValues?: number[];
}

const DamageInput: React.FC<DamageInputProps> = ({ onSubmit, initialValues = [] }) => {
  const [damages, setDamages] = useState<string[]>(
    initialValues.length === 9
      ? initialValues.map(String)
      : Array(9).fill('')
  );
  const [error, setError] = useState<string>('');

  const handleInputChange = (index: number, value: string) => {
    // Allow only numbers and empty string
    if (value !== '' && !/^\d+$/.test(value)) {
      return;
    }

    const newDamages = [...damages];
    newDamages[index] = value;
    setDamages(newDamages);
    setError('');
  };

  const handleSubmit = () => {
    const numericDamages = damages.map(d => (d === '' ? 0 : parseInt(d, 10)));
    const validation = validateDamageInput(numericDamages);

    if (!validation.valid) {
      setError(validation.error || '입력값을 확인해주세요.');
      return;
    }

    onSubmit(numericDamages);
    setDamages(Array(9).fill(''));
    setError('');
  };

  const handleClear = () => {
    setDamages(Array(9).fill(''));
    setError('');
  };

  const allFilled = damages.every(d => d !== '');

  return (
    <div className="glass-card damage-input-container">
      <h2 className="input-title">딜량 입력</h2>
      <p className="input-description">9회의 보스 딜량을 입력하세요</p>

      <div className="damage-grid">
        {damages.map((value, index) => (
          <div key={index} className="input-wrapper">
            <label className="input-label">{index + 1}회</label>
            <input
              type="text"
              inputMode="numeric"
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder="0"
              className="damage-input"
            />
          </div>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="button-group">
        <button onClick={handleClear} className="btn-secondary">
          초기화
        </button>
        <button
          onClick={handleSubmit}
          disabled={!allFilled}
          className="btn-primary"
        >
          제출
        </button>
      </div>
    </div>
  );
};

export default DamageInput;
