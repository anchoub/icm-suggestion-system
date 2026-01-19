import { useState } from 'react';
import CaseForm from './components/CaseForm';
import SuggestionsPanel from './components/SuggestionsPanel';
import FlagNotification from './components/FlagNotification';
import IcmModal from './components/IcmModal';
import EscalateForm from './components/EscalateForm';
import { CaseData, SimilarCase, RecommendationResponse } from './types';
import { createCase, getRecommendations } from './api';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SimilarCase[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recommendationData, setRecommendationData] = useState<RecommendationResponse | null>(
    null
  );
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [pendingCaseData, setPendingCaseData] = useState<CaseData | null>(null);
  const [showEscalateForm, setShowEscalateForm] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleGetRecommendations = async (caseData: CaseData) => {
    setIsLoading(true);
    try {
      const response = await getRecommendations({
        case_title: caseData.CaseTitle,
        case_description: caseData.CaseDescription,
        product: caseData.Product,
        error_message: caseData.ErrorMessage,
        stack_trace: caseData.StackTrace,
        top_k: 5,
      });

      setRecommendationData(response);
      setSuggestions(response.similar_cases);
      setShowSuggestions(true);

      // Show modal if ICM recommendation threshold is met
      if (response.recommend_icm) {
        setPendingCaseData(caseData);
        setShowModal(true);
      }

      showToast(
        `Found ${response.similar_cases.length} similar case${
          response.similar_cases.length !== 1 ? 's' : ''
        }`,
        'success'
      );
    } catch (error) {
      console.error('Error getting recommendations:', error);
      showToast('Failed to get recommendations. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCase = async (caseData: CaseData) => {
    // If we have recommendations and should show modal, show it instead
    if (recommendationData?.recommend_icm && !showModal) {
      setPendingCaseData(caseData);
      setShowModal(true);
      return;
    }

    await submitCaseToBackend(caseData);
  };

  const submitCaseToBackend = async (caseData: CaseData) => {
    setIsLoading(true);
    try {
      const createdCase = await createCase(caseData);
      showToast(`Case #${createdCase.CaseID} created successfully!`, 'success');

      // Reset states
      setSuggestions([]);
      setShowSuggestions(false);
      setRecommendationData(null);
      setPendingCaseData(null);
    } catch (error) {
      console.error('Error creating case:', error);
      showToast('Failed to create case. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateIcmAnyway = () => {
    setShowModal(false);
    setShowEscalateForm(true);
  };

  const handleDuplicateIcm = () => {
    setShowModal(false);
    // Pre-fill the form with data from the most similar case
    if (suggestions.length > 0) {
      const topCase = suggestions[0].case;
      showToast(`Duplicating ICM #${topCase.CaseID} - ${topCase.CaseTitle}`, 'success');
      setShowEscalateForm(true);
    }
  };

  const handleFlagClick = () => {
    // If no recommendation data exists, create mock data for demo
    if (!recommendationData) {
      const mockSuggestions: SimilarCase[] = [
        {
          case: {
            CaseID: 1234,
            CaseTitle: 'Azure SQL Database Connection Timeout Issues',
            CaseDescription: 'Multiple users experiencing connection timeouts when accessing Azure SQL Database. Issue started after recent deployment. Error occurs consistently during peak hours.',
            Product: 'Azure SQL Database',
            Priority: 'High',
            Severity: '2',
            CaseStatus: 'Active',
            CreatedDate: '2024-01-15T10:30:00Z',
            ErrorMessage: 'Connection timeout'
          },
          similarity_score: 0.87
        },
        {
          case: {
            CaseID: 1156,
            CaseTitle: 'Database Performance Degradation in Production',
            CaseDescription: 'Significant slowdown in database queries affecting application performance. CPU usage at 95%. Query execution time increased by 300%.',
            Product: 'Azure SQL Database',
            Priority: 'High',
            Severity: '2',
            CaseStatus: 'Resolved',
            CreatedDate: '2024-01-10T08:15:00Z',
            ErrorMessage: 'Query timeout'
          },
          similarity_score: 0.82
        },
        {
          case: {
            CaseID: 987,
            CaseTitle: 'Azure SQL High CPU Usage Alert',
            CaseDescription: 'Database experiencing sustained high CPU utilization. Multiple blocking queries detected. Application response time degraded.',
            Product: 'Azure SQL Database',
            Priority: 'Medium',
            Severity: '3',
            CaseStatus: 'Resolved',
            CreatedDate: '2024-01-05T14:20:00Z',
            ErrorMessage: 'High CPU'
          },
          similarity_score: 0.79
        }
      ];

      setSuggestions(mockSuggestions);
      setRecommendationData({
        similar_cases: mockSuggestions,
        highest_similarity: 0.87,
        alert_threshold_reached: true,
        recommend_icm: true,
        icm_statistics: {
          total_similar_cases_reviewed: 3,
          cases_with_icm: 3,
          average_delay_days: 5.3,
          confidence_score: 87.0,
          review_period_months: 6
        }
      });
    }
    setShowModal(true);
  };

  return (
    <div
      className="app-container"
      style={{ 
        backgroundImage: showEscalateForm 
          ? 'url(/escalate-form-bg.png)' 
          : `url(/azure-case-bg.png?v=${Date.now()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {!showEscalateForm ? (
        <>
          {/* Left Sidebar */}
          <div className="left-sidebar">
            <FlagNotification 
              onClick={handleFlagClick}
              alertCount={3}
              highestScore={0.87}
            />
          </div>

          {/* Hidden overlay for case form - only show when needed */}
          {showSuggestions && (
            <div className="content-overlay">
              <div className="content-wrapper">
                <CaseForm
                  onSubmit={handleSubmitCase}
                  onRecommend={handleGetRecommendations}
                  isLoading={isLoading}
                />
                <SuggestionsPanel suggestions={suggestions} isVisible={showSuggestions} />
              </div>
            </div>
          )}

          <IcmModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onCreateIcm={handleCreateIcmAnyway}
            onDuplicateIcm={handleDuplicateIcm}
            similarCases={suggestions}
            highestSimilarity={recommendationData?.highest_similarity || 0}
            recommendIcm={recommendationData?.recommend_icm || false}
            icmStatistics={recommendationData?.icm_statistics}
          />

          {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
        </>
      ) : (
        <EscalateForm 
          onClose={() => setShowEscalateForm(false)}
          caseData={pendingCaseData}
        />
      )}
    </div>
  );
}

export default App;
