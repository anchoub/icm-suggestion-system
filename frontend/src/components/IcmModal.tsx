import React from 'react';
import { SimilarCase, ICMStatistics } from '../types';
import '../styles/IcmModal.css';

interface IcmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateIcm: () => void;
  onDuplicateIcm?: () => void;
  similarCases: SimilarCase[];
  highestSimilarity: number;
  recommendIcm: boolean;
  icmStatistics?: ICMStatistics;
}

const IcmModal: React.FC<IcmModalProps> = ({
  isOpen,
  onClose,
  onCreateIcm,
  onDuplicateIcm,
  similarCases,
  highestSimilarity,
  recommendIcm,
  icmStatistics,
}) => {
  if (!isOpen) return null;

  const topCases = similarCases.slice(0, 3);
  const scorePercent = (highestSimilarity * 100).toFixed(1);
  const threshold = 80;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="warning-icon">💡</div>
          <h2>ICM Alert</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* ICM Statistics Banner */}
          {icmStatistics && (
            <div className="icm-statistics-banner">
              <div className="statistics-header">
                <h3>📊➡️💡 Data-Driven Insights</h3>
              </div>
              <div className="statistics-content">
                <p className="statistics-text">
                  A review of cases from the past 6 months showed <strong className="highlight-number">{icmStatistics.cases_with_icm}</strong> similar scenario{icmStatistics.cases_with_icm !== 1 ? 's' : ''} where ICM{icmStatistics.cases_with_icm !== 1 ? 's were' : ' was'} opened. 
                  The resulting average delay of about <strong className="highlight-number">{icmStatistics.average_delay_days}</strong> days points to a valuable opportunity to strengthen early identification of ICM requirements going forward.
                </p>
                <p className="confidence-text">
                  <strong>Confidence Score:</strong> <span className="confidence-score">{icmStatistics.confidence_score}%</span>
                </p>
              </div>
            </div>
          )}

          <div className="alert-reasons">
            <h3>Reasons for ICM Recommendation:</h3>
            <ul>
              {recommendIcm && (
                <li className="reason-high-confidence">
                  <span className="reason-icon">🔴</span>
                  <div>
                    <strong>High Confidence Score:</strong> {scorePercent}% 
                    (Above {threshold}% threshold)
                  </div>
                </li>
              )}
              <li className="reason-similar-cases">
                <span className="reason-icon">📋</span>
                <div>
                  <strong>Similar Cases Found:</strong> {similarCases.length} cases with high similarity detected
                </div>
              </li>
              {similarCases.some(c => c.case.Severity === '1' || c.case.Severity === '2') && (
                <li className="reason-severity">
                  <span className="reason-icon">⚡</span>
                  <div>
                    <strong>High Severity Cases:</strong> Similar cases include Severity 1 or 2 incidents
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div className="top-matches">
            <h3>Top Similar Cases (Previous ICMs):</h3>
            {topCases.map((item, index) => (
              <div key={item.case.CaseID} className="match-item">
                <div className="match-header">
                  <span className="match-number">#{index + 1}</span>
                  <span className="match-score">
                    Confidence: {(item.similarity_score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="match-details">
                  <strong>{item.case.CaseTitle}</strong>
                  <div className="match-meta">
                    <span>ICM #{item.case.CaseID}</span>
                    <span>•</span>
                    <span>{item.case.Product}</span>
                    <span>•</span>
                    <span>Severity: {item.case.Severity || 'N/A'}</span>
                    <span>•</span>
                    <span className={`status-${item.case.CaseStatus?.toLowerCase()}`}>
                      {item.case.CaseStatus}
                    </span>
                  </div>
                  <div className="match-description">
                    {item.case.CaseDescription?.substring(0, 150)}...
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="recommendation-note">
            <strong>💡 Recommendation:</strong> Review the similar ICM cases above before proceeding.
            Based on {scorePercent}% confidence match with existing cases, you have the following options:
          </div>

          <div className="modal-question">
            <p><strong>What would you like to do?</strong></p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel & Review
          </button>
          {onDuplicateIcm && (
            <button className="btn-duplicate" onClick={onDuplicateIcm}>
              📋 Duplicate Existing ICM
            </button>
          )}
          <button className="btn-primary" onClick={onCreateIcm}>
            ✨ Create New ICM
          </button>
        </div>
      </div>
    </div>
  );
};

export default IcmModal;
