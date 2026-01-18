export interface CaseData {
  CaseTitle: string;
  CaseDescription: string;
  Product: string;
  Component?: string;
  Severity: string;
  Priority: string;
  CustomerTier?: string;
  SLAImpact?: string;
  Environment?: string;
  Region?: string;
  Tenant?: string;
  ErrorCodes?: string;
  ErrorMessage?: string;
  StackTrace?: string;
  AttachmentsJson?: string;
  LogLinksJson?: string;
  TroubleshootingSteps?: string;
  CaseStatus?: string;
  ResolutionNotes?: string;
  AssignedTeam?: string;
  AssignedTo?: string;
  Account?: string;
  Tags?: string;
}

export interface Case extends CaseData {
  CaseID: number;
  CreatedDate: string;
  ModifiedDate?: string;
}

export interface SimilarCase {
  case: Case;
  similarity_score: number;
}

export interface RecommendationResponse {
  similar_cases: SimilarCase[];
  alert_threshold_reached: boolean;
  recommend_icm: boolean;
  highest_similarity: number;
}

export interface RecommendationRequest {
  case_title: string;
  case_description: string;
  product?: string;
  error_message?: string;
  stack_trace?: string;
  top_k?: number;
}
