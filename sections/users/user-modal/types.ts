// types.ts
export type RoleKey = 'admin' | 'organizer' | 'manager' | 'staff' | 'guest' | 'user';

export type Option = {
  value: string;
  label: string;
};

export type PhoneNumber = {
  code: string;
  number: string;
};

export type Location = {
  coordinates: [number, number];
  fullAddress: string;
  country: string;
  city: string;
  state: string;
  postalCode: string;
};

export type CompanyDetails = {
  name: string;
  oib: string;
  bankAccountNumber: string;
  representativeName: string;
  location: Location;
  suppliers: string[];
};

export type UserPayload =
  | { userType: 'admin' } & BaseUser
  | { userType: 'organizer'; organizationName: string; companyDetails: CompanyDetails } & BaseUser
  | { userType: 'manager'; organizations: string[] } & BaseUser
  | { userType: 'staff'; organizations: string[]; modules: string[] } & BaseUser
  | { userType: 'guest' } & BaseUser
  | { userType: 'user'; username: string; dob: string; gender: string; organizations: string[] } & BaseUser;

type BaseUser = {
  profileIcon: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: PhoneNumber;
  password?: string;
};