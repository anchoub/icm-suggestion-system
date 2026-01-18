import React, { useState } from 'react';
import { CaseData } from '../types';
import '../styles/EscalateForm.css';

interface EscalateFormProps {
  onClose: () => void;
  caseData?: CaseData | null;
}

const EscalateForm: React.FC<EscalateFormProps> = ({ onClose, caseData }) => {
  const [formData, setFormData] = useState({
    supportTopic: caseData?.Product || 'Virtual Machine Scale Sets / Cannot update my scale set / Instances in a failed state',
    template: 'AzureRT SEV3 to EEE',
    severity: caseData?.Severity || '3',
    title: caseData?.CaseTitle || '',
    description: caseData?.CaseDescription || '',
    impactedService: '',
    subscription: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('ICM Created Successfully!');
    onClose();
  };

  return (
    <div className="escalate-form-overlay">
      <div className="escalate-form-container">
        <div className="escalate-form-header">
          <h2>Escalate case</h2>
          <p className="escalate-subtitle">Escalate case and view details of associated incidents</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="escalate-form-nav">
          <div className="nav-item active">Create incident</div>
          <div className="nav-item">Pick Template</div>
          <div className="nav-item">Add Details</div>
          <div className="nav-item">View associated incidents</div>
        </div>

        <form onSubmit={handleSubmit} className="escalate-form-content">
          <div className="form-section">
            <h3>Pick Template</h3>
            <p className="section-note">Showing recommended templates based on the selected support topic</p>

            <div className="form-group">
              <label>Support Topic</label>
              <select 
                value={formData.supportTopic}
                onChange={(e) => setFormData({ ...formData, supportTopic: e.target.value })}
              >
                <option>Virtual Machine Scale Sets / Cannot update my scale set / Instances in a failed state</option>
                <option>Storage Account / Performance Issue / High Latency</option>
                <option>Network / Connectivity Issue / Cannot connect to VM</option>
              </select>
            </div>

            <div className="form-group">
              <label>Choose template</label>
              <div className="template-options">
                <div className="template-option selected">
                  <input 
                    type="radio" 
                    name="template" 
                    value="AzureRT SEV3 to EEE"
                    checked={formData.template === 'AzureRT SEV3 to EEE'}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  />
                  <div className="template-details">
                    <strong>AzureRT SEV3 to EEE (ID: K2hs2X)</strong>
                    <p>Compute Resource Provider CRP, Disk Resource Provider Disk RP, Platform Image Repository PIR, VirtualMachineImages Resource Provider Image Builder RP, Cloud Services Extended Support CS ES RP, Red Dog Front End RDFE - aka 'Classic'.</p>
                  </div>
                </div>

                <div className="template-option">
                  <input 
                    type="radio" 
                    name="template" 
                    value="VCPE for Sev2"
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  />
                  <div className="template-details">
                    <strong>VCPE for Sev2 (ID: p2Xh19)</strong>
                    <p>VM/VMSS CRUD (Create, Read, Update or Delete) Operations Sev2 ICM to Virtual Machines CAPE Experts. Do not use unless customer and support engineer are available to work it until the customer agrees to lower the severity.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ai-insight-banner">
              <span className="insight-icon">🤖</span>
              <div className="insight-content">
                <strong>AI Recommendation:</strong> Similar case (Case #2601050029998765) with 87% confidence score was escalated using this template and resolved successfully.
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-next">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EscalateForm;
