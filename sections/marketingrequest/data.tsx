type MarketRequest = {
  title: string;
  budget: number;
  organization: string;
  phone: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
};

export const marketRequestList: MarketRequest[] = [
  {
    title: "Social Media Blast",
    budget: 12000,
    organization: "AdSpark",
    phone: "555-101-2020",
    email: "contact@adspark.com",
    status: "pending",
  },
  {
    title: "Product Demo Campaign",
    budget: 18000,
    organization: "TechVibes",
    phone: "555-202-3030",
    email: "sales@techvibes.io",
    status: "approved",
  },
  {
    title: "Q3 Brand Push",
    budget: 25000,
    organization: "BrandHive",
    phone: "555-303-4040",
    email: "info@brandhive.com",
    status: "rejected",
  },
  {
    title: "Holiday Ads",
    budget: 30000,
    organization: "FestiveFlow",
    phone: "555-404-5050",
    email: "hello@festiveflow.com",
    status: "approved",
  },
  {
    title: "Local Market Activation",
    budget: 10000,
    organization: "GroundReach",
    phone: "555-505-6060",
    email: "reach@groundreach.net",
    status: "pending",
  },
  {
    title: "Influencer Partnership",
    budget: 20000,
    organization: "StarConnect",
    phone: "555-606-7070",
    email: "support@starconnect.tv",
    status: "approved",
  },
  {
    title: "Beta Launch Outreach",
    budget: 22000,
    organization: "BetaLaunchers",
    phone: "555-707-8080",
    email: "launch@betalaunchers.org",
    status: "pending",
  },
  {
    title: "Trade Show Booth",
    budget: 27000,
    organization: "ShowBiz Inc.",
    phone: "555-808-9090",
    email: "exhibit@showbiz.com",
    status: "rejected",
  },
  {
    title: "Email Funnel Strategy",
    budget: 9000,
    organization: "ClickGrow",
    phone: "555-909-0000",
    email: "team@clickgrow.io",
    status: "approved",
  },
  {
    title: "YouTube Ad Series",
    budget: 15000,
    organization: "VidStorm",
    phone: "555-000-1111",
    email: "media@vidstorm.com",
    status: "pending",
  },
];
