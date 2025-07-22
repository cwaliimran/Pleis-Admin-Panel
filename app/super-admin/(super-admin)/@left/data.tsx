import {
  Home,
  Settings,
  ChartColumnBig,
  CalendarDays,
  UsersRound,
  Tags,
  Bell,
  Rocket,
  LayoutDashboard,
  CreditCard,
  List,
  Hash,
  Building,
  User,
  Calendar,
  ChevronsUp,
  VenetianMask,
  ChartArea,
  Volume1,
  ArrowRightLeft,
  HeartPlus,
  Highlighter,
  Podcast,
} from "lucide-react";
import { paths } from "./paths";

type MenuItem = {
  title: string;
  url?: string;
  icon: any;
  items?: MenuItem[];
};

type MenuGroup = {
  label: string;
  key: string;
  icon: any;
  items?: MenuItem[];
};

export const menuGroups: MenuGroup[] = [
  {
    label: "Dashboard",
    key: paths.superAdmin.default,
    icon: ChartColumnBig,
  },
  {
    label: "Organizations",
    key: paths.superAdmin.organizations.default,
    icon: Building,
    items: [
      {
        title: "Create Organization",
        url: paths.superAdmin.organizations.create,
        icon: Home,
      },
      {
        title: "Organization List",
        url: paths.superAdmin.organizations.list,
        icon: Home,
      },
    ],
  },
  {
    label: "Events",
    key: paths.superAdmin.events.default,
    icon: Calendar,
    items: [
      {
        title: "Create Event",
        url: paths.superAdmin.events.create,
        icon: Tags,
      },
      {
        title: "Events List",
        url: paths.superAdmin.events.list, // Example ID
        icon: Tags,
      },
    ],
  },
  {
    label: "Venue",
    key: paths.superAdmin.venue.default,
    icon: VenetianMask,
  },

  {
    label: "Highlights",
    key: paths.superAdmin.hightLight.default,
    icon: Highlighter,
  },
  {
    label: "Categories",
    key: paths.superAdmin.category.default,
    icon: List,
  },
  {
    label: "Venue Type",
    key: paths.superAdmin.vanueType.default,
    icon: VenetianMask,
  },
  {
    label: "Browser Control",
    key: paths.superAdmin.browserControl.default,
    icon: Settings,
  },
  {
    label: "Tags",
    key: paths.superAdmin.tags.default,
    icon: Hash,
  },

  {
    label: "User",
    key: paths.superAdmin.users.default,
    icon: User,
    items: [
      {
        title: "User List",
        url: paths.superAdmin.users.list,
        icon: UsersRound,
      },
      {
        title: "Pending User List",
        url: paths.superAdmin.users.pendingList,
        icon: UsersRound,
      },
    ],
  },
  // {
  //   label: "Marketing Requests",
  //   key: paths.superAdmin.marketing.detault,
  //   icon: Volume1,
  // },
  // {
  //   label: "Transactions",
  //   key: paths.superAdmin.transactions.default,
  //   icon: ArrowRightLeft,
  // items: [
  //     {
  //         title: "Premium Transaction",
  //         url: paths.superAdmin.transactions.premium,
  //         icon: Settings,
  //     },
  //     {
  //         title: "Transaction List",
  //         url: paths.superAdmin.transactions.list, // Example ID
  //         icon: Settings,
  //     }, {
  //         title: "Refund List",
  //         url: paths.superAdmin.transactions.refund, // Example ID
  //         icon: Settings,
  //     }
  // ]
  // },
  // {
  //   label: "Notification",
  //   key: paths.superAdmin.notification.default,
  //   icon: Bell,
  // items: [
  //     {
  //         title: "Overview",
  //         url: paths.superAdmin.notification.overview,
  //         icon: Bell,
  //     },
  //     {
  //         title: "Notification List",
  //         url: paths.superAdmin.notification.list, // Example ID
  //         icon: Bell,
  //     },
  //     {
  //         title: "Create Notification",
  //         url: paths.superAdmin.notification.createUpdate, // Example ID
  //         icon: Bell,
  //     },
  //     {
  //         title: "Create Giveaway",
  //         url: paths.superAdmin.notification.createGiveaway, // Example ID
  //         icon: Bell,
  //     },
  //     {
  //         title: "Create Notification",
  //         url: paths.superAdmin.notification.createNotification, // Example ID
  //         icon: Bell,
  //     }
  // ]
  // },

  // {
  //   label: "Subscription",
  //   key: paths.superAdmin.subscription,
  //   icon: Podcast,
  // },
  // {
  //   label: "Add Support",
  //   key: paths.superAdmin.addSupport,
  //   icon: HeartPlus,
  // },
];
