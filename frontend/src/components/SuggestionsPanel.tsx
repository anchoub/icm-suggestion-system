import React from 'react';
import { SimilarCase } from '../types';
import '../styles/SuggestionsPanel.css';

interface SuggestionsPanelProps {
  suggestions: SimilarCase[];
  isVisible: boolean;
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ suggestions, isVisible }) => {
  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  const getScoreColor = (score: number): string => {
    if (score >= 0.9) return '#10b981'; // green
    if (score >= 0.8) return '#f59e0b'; // amber
    if (score >= 0.75) return '#ef4444'; // red
    return '#6b7280'; // gray
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 0.9) return 'Very High';
    if (score >= 0.8) return 'High';
    if (score >= 0.75) return 'Medium';
    return 'Low';
  };

  return (
    <div className="suggestions-panel">
      <h2>Similar Cases Found</h2>
      <p className="suggestions-subtitle">
        Found {suggestions.length} similar case{suggestions.length !== 1 ? 's' : ''} in the database
      </p>

      <div className="suggestions-list">
        {suggestions.map((item, index) => {
          const { case: caseData, similarity_score } = item;
          const scorePercent = (similarity_score * 100).toFixed(1);

          return (
            <div key={caseData.CaseID} className="suggestion-card">
              <div className="suggestion-header">
                <div className="suggestion-rank">#{index + 1}</div>
                <div className="suggestion-title">
                  <h3>{caseData.CaseTitle}</h3>
                  <span className="case-id">Case #{caseData.CaseID}</span>
                </div>
              </div>

              <div className="similarity-bar">
                <div className="similarity-label">
                  <span>Similarity: {getScoreLabel(similarity_score)}</span>
                  <span className="similarity-percent">{scorePercent}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${scorePercent}%`,
                      backgroundColor: getScoreColor(similarity_score),
                    }}
                  />
                </div>
              </div>

              <div className="case-details">
                <div className="detail-row">
                  <span className="detail-label">Product:</span>
                  <span>{caseData.Product}</span>
                </div>
                {caseData.Component && (
                  <div className="detail-row">
                    <span className="detail-label">Component:</span>
                    <span>{caseData.Component}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Severity:</span>
                  <span className={`badge severity-${caseData.Severity.toLowerCase()}`}>
                    {caseData.Severity}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`badge status-${caseData.CaseStatus?.toLowerCase()}`}>
                    {caseData.CaseStatus}
                  </span>
                </div>
                <div className="detail-row full-width">
                  <span className="detail-label">Description:</span>
                  <p className="description-text">{caseData.CaseDescription}</p>
                </div>
                {caseData.ResolutionNotes && (
                  <div className="detail-row full-width resolution">
                    <span className="detail-label">Resolution:</span>
                    <p className="resolution-text">{caseData.ResolutionNotes}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestionsPanel;
