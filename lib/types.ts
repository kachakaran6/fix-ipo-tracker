export interface IPOApplication {
  id: string;
  applicantName: string;
  applicationNumber: string;
  pan: string;
  ipoName: string;
  ipoPrice: number;
  otherPrice?: number;
  timestamp: string;
}

export interface IPOName {
  id: string;
  name: string;
  createdAt: string;
}

export interface GroupedApplications {
  [ipoName: string]: IPOApplication[];
}
