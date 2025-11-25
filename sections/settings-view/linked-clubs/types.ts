export type Props = {
  selectedCompanyId: string | null;
};

export interface CompanyResult {
  _id: string;
  collaborationStatus?: string;
  profileIcon: string;
  firstName: string;
  lastName: string;
  companyDetails: {
    name: string;
    loyaltySettings: {
      title: string;
      model: string;
      pointValuePercentage: number;
    };
  };
}
