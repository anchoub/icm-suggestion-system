import React, { useState } from 'react';
import { CaseData } from '../types';
import '../styles/CaseForm.css';

interface CaseFormProps {
  onSubmit: (caseData: CaseData) => void;
  onRecommend: (caseData: CaseData) => void;
  isLoading: boolean;
}

const CaseForm: React.FC<CaseFormProps> = ({ onSubmit, onRecommend, isLoading }) => {
  const [formData, setFormData] = useState<CaseData>({
    CaseTitle: '',
    CaseDescription: '',
    Product: '',
    Component: '',
    Severity: 'Medium',
    Priority: 'Medium',
    CustomerTier: '',
    SLAImpact: '',
    Environment: '',
    Region: '',
    Tenant: '',
    ErrorCodes: '',
    ErrorMessage: '',
    StackTrace: '',
    AttachmentsJson: '',
    LogLinksJson: '',
    TroubleshootingSteps: '',
    CaseStatus: 'Open',
    ResolutionNotes: '',
    AssignedTeam: '',
    AssignedTo: '',
    Account: '',
    Tags: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleRecommend = () => {
    onRecommend(formData);
  };

  return (
    <form className="case-form" onSubmit={handleSubmit}>
      <h2>Create New Case</h2>

      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="CaseTitle">Case Title *</label>
          <input
            type="text"
            id="CaseTitle"
            name="CaseTitle"
            value={formData.CaseTitle}
            onChange={handleChange}
            required
            placeholder="Brief summary of the issue"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="CaseDescription">Case Description *</label>
          <textarea
            id="CaseDescription"
            name="CaseDescription"
            value={formData.CaseDescription}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Detailed description of the case"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Product">Product *</label>
          <input
            type="text"
            id="Product"
            name="Product"
            value={formData.Product}
            onChange={handleChange}
            required
            placeholder="e.g., Azure VM, Office 365"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Component">Component</label>
          <input
            type="text"
            id="Component"
            name="Component"
            value={formData.Component}
            onChange={handleChange}
            placeholder="e.g., Auth, Storage"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Severity">Severity *</label>
          <select
            id="Severity"
            name="Severity"
            value={formData.Severity}
            onChange={handleChange}
            required
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="Priority">Priority *</label>
          <select
            id="Priority"
            name="Priority"
            value={formData.Priority}
            onChange={handleChange}
            required
          >
            <option value="P0">P0</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="CustomerTier">Customer Tier</label>
          <input
            type="text"
            id="CustomerTier"
            name="CustomerTier"
            value={formData.CustomerTier}
            onChange={handleChange}
            placeholder="e.g., Enterprise, Premium"
          />
        </div>

        <div className="form-group">
          <label htmlFor="SLAImpact">SLA Impact</label>
          <input
            type="text"
            id="SLAImpact"
            name="SLAImpact"
            value={formData.SLAImpact}
            onChange={handleChange}
            placeholder="e.g., High, Medium, Low"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Environment">Environment</label>
          <input
            type="text"
            id="Environment"
            name="Environment"
            value={formData.Environment}
            onChange={handleChange}
            placeholder="e.g., Production, Staging"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Region">Region</label>
          <input
            type="text"
            id="Region"
            name="Region"
            value={formData.Region}
            onChange={handleChange}
            placeholder="e.g., US-East, EU-West"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Tenant">Tenant</label>
          <input
            type="text"
            id="Tenant"
            name="Tenant"
            value={formData.Tenant}
            onChange={handleChange}
            placeholder="Tenant ID or name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Account">Account</label>
          <input
            type="text"
            id="Account"
            name="Account"
            value={formData.Account}
            onChange={handleChange}
            placeholder="Account ID or name"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="ErrorCodes">Error Codes</label>
          <input
            type="text"
            id="ErrorCodes"
            name="ErrorCodes"
            value={formData.ErrorCodes}
            onChange={handleChange}
            placeholder="e.g., ERR_500, AUTH_FAILED"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="ErrorMessage">Error Message</label>
          <textarea
            id="ErrorMessage"
            name="ErrorMessage"
            value={formData.ErrorMessage}
            onChange={handleChange}
            rows={2}
            placeholder="Full error message"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="StackTrace">Stack Trace</label>
          <textarea
            id="StackTrace"
            name="StackTrace"
            value={formData.StackTrace}
            onChange={handleChange}
            rows={4}
            placeholder="Paste stack trace here"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="TroubleshootingSteps">Troubleshooting Steps</label>
          <textarea
            id="TroubleshootingSteps"
            name="TroubleshootingSteps"
            value={formData.TroubleshootingSteps}
            onChange={handleChange}
            rows={3}
            placeholder="Steps already attempted"
          />
        </div>

        <div className="form-group">
          <label htmlFor="AssignedTeam">Assigned Team</label>
          <input
            type="text"
            id="AssignedTeam"
            name="AssignedTeam"
            value={formData.AssignedTeam}
            onChange={handleChange}
            placeholder="Team name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="AssignedTo">Assigned To</label>
          <input
            type="text"
            id="AssignedTo"
            name="AssignedTo"
            value={formData.AssignedTo}
            onChange={handleChange}
            placeholder="Person name or email"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="Tags">Tags</label>
          <input
            type="text"
            id="Tags"
            name="Tags"
            value={formData.Tags}
            onChange={handleChange}
            placeholder="comma, separated, tags"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="AttachmentsJson">Attachments (JSON)</label>
          <input
            type="text"
            id="AttachmentsJson"
            name="AttachmentsJson"
            value={formData.AttachmentsJson}
            onChange={handleChange}
            placeholder='e.g., ["file1.jpg", "log.txt"]'
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="LogLinksJson">Log Links (JSON)</label>
          <input
            type="text"
            id="LogLinksJson"
            name="LogLinksJson"
            value={formData.LogLinksJson}
            onChange={handleChange}
            placeholder='e.g., ["https://logs.example.com/123"]'
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={handleRecommend}
          disabled={isLoading || !formData.CaseTitle || !formData.CaseDescription}
          className="btn-recommend"
        >
          Get Similar Cases
        </button>
        <button type="submit" disabled={isLoading} className="btn-submit">
          {isLoading ? 'Submitting...' : 'Create Case'}
        </button>
      </div>
    </form>
  );
};

export default CaseForm;
