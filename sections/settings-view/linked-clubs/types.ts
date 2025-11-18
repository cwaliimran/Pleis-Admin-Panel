export type Props = {
  selectedCompanyId: string | undefined;
};

export interface CompanyResult {
  _id: string;
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
