// Bill types for the application

export interface Bill {
  id: number;
  congressNumber: number;
  billType: string;
  billNumber: number;
  title: string;
  shortTitle: string | null;
  introducedDate: Date | null;
  latestActionDate: Date | null;
  latestActionText: string | null;
  sponsorName: string | null;
  sponsorParty: string | null;
  sponsorState: string | null;
  status: string | null;
  subjects: string[];
  congressUrl: string | null;
  fullTextUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillWithSummary extends Bill {
  summary: SummaryCard | null;
}

export interface SummaryCard {
  oneLiner: string;
  shortSummary: string;
}

export interface Summary {
  _id?: string;
  billId: number;
  congressBillId: string;
  generatedAt: Date;
  modelUsed: string;
  promptVersion: string;
  summary: {
    oneLiner: string;
    shortSummary: string;
    detailedSummary: string;
    keyPoints: string[];
    impact: {
      whoAffected: string[];
      potentialEffects: string[];
    };
    politicalContext: {
      bipartisanSupport: boolean;
      relatedBills: string[];
      controversialAspects: string[];
    };
  };
  metadata: {
    processingTimeMs: number;
    tokenCount: number;
    cost: number;
  };
}

export interface CongressApiBill {
  congress: number;
  type: string;
  number: number;
  title: string;
  originChamber: string;
  originChamberCode: string;
  latestAction: {
    actionDate: string;
    text: string;
  };
  updateDate: string;
  url: string;
}

export interface CongressApiBillDetail {
  congress: number;
  type: string;
  number: number;
  title: string;
  constitutionalAuthorityStatementText?: string;
  introducedDate: string;
  sponsors?: Array<{
    bioguideId: string;
    fullName: string;
    firstName: string;
    lastName: string;
    party: string;
    state: string;
    isByRequest: string;
  }>;
  latestAction: {
    actionDate: string;
    text: string;
  };
  policyArea?: {
    name: string;
  };
  subjects?: {
    url: string;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  hasMore: boolean;
  total?: number;
}

export interface BillsResponse {
  bills: BillWithSummary[];
  pagination: PaginationInfo;
}

export interface GeneratedSummary {
  oneLiner: string;
  shortSummary: string;
  detailedSummary: string;
  keyPoints: string[];
  whoAffected: string[];
  potentialEffects: string[];
  bipartisanSupport: boolean;
}
