import type { LucideIcon } from 'lucide-react';
import {
  Building,
  Calendar,
  ChartColumnBig,
  Handshake,
  Highlighter,
  Home,
  List,
  Tags,
  User,
  UsersRound,
  VenetianMask,
} from 'lucide-react';
import { paths } from './paths';

type MenuItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  items?: MenuItem[];
};

type MenuGroup = {
  label: string;
  key: string;
  icon?: LucideIcon;
  items?: MenuItem[];
};

export const menuGroups: MenuGroup[] = [
  {
    label: 'Dashboard',
    key: paths.organizer.dashboard,
    icon: ChartColumnBig,
  },
  {
    label: 'Organizations',
    key: paths.organizer.organizations.default,
    icon: Building,
    items: [
      {
        title: 'Create Organization',
        url: paths.organizer.organizations.create,
        icon: Home,
      },
      {
        title: 'Organization List',
        url: paths.organizer.organizations.list,
        icon: Home,
      },
    ],
  },
  {
    label: 'Events',
    key: paths.organizer.events.default,
    icon: Calendar,
    items: [
      {
        title: 'Create Event',
        url: paths.organizer.events.create,
        icon: Tags,
      },
      {
        title: 'Events List',
        url: paths.organizer.events.list,
        icon: Tags,
      },
    ],
  },
  {
    label: 'Loyalty',
    key: paths.organizer.loyalty.default,
    icon: Handshake,
    items: [
      {
        title: 'Loyalty Dashboard',
        url: paths.organizer.loyalty.default,
        icon: Tags,
      },
      {
        title: 'Rewards',
        url: paths.organizer.rewards,
        icon: Tags,
      },
      {
        title: 'Challenges',
        url: paths.organizer.challenges,
        icon: Tags,
      },
      {
        title: 'Promotions',
        url: paths.organizer.events.list,
        icon: Tags,
      },
      {
        title: 'Members',
        url: paths.organizer.events.list,
        icon: Tags,
      },
      {
        title: 'Settings',
        url: paths.organizer.events.list,
        icon: Tags,
      },
      {
        title: 'Referrals',
        url: paths.organizer.events.list,
        icon: Tags,
      },
      {
        title: 'Transactions',
        url: paths.organizer.events.list,
        icon: Tags,
      },
    ],
  },
  {
    label: 'Venue',
    key: paths.organizer.venue.default,
    icon: VenetianMask,
  },
  {
    label: 'Highlights',
    key: paths.organizer.hightLight.default,
    icon: Highlighter,
  },
  {
    label: 'Menu Items',
    key: paths.organizer.menuItems,
    icon: List,
  },

  // {
  //   label: 'Loyalty',
  //   key: paths.organizer.loyalty.default,
  //   icon: Handshake,
  // },

  // {
  //   label: 'Rewards',
  //   key: paths.organizer.rewards,
  //   icon: Trophy,
  // },
  // {
  //   label: 'Challenges',
  //   key: paths.organizer.challenges,
  //   icon: Cog,
  // },
  {
    label: 'User',
    key: paths.organizer.users.default,
    icon: User,
    items: [
      {
        title: 'User List',
        url: paths.organizer.users.list,
        icon: UsersRound,
      },
      // {
      //     title: "Pending User List",
      //     url: paths.superAdmin.users.pendingList,
      //     icon: UsersRound,
      // }
    ],
  },
  // {
  //     label: "Marketing Requests",
  //     key: paths.organizer.marketing.detault,
  //     icon: Volume1
  // },

  // {
  //     label: "Transactions",
  //     key: paths.organizer.transactions.default,
  //     icon: ArrowRightLeft,
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
  //     label: "Notification",
  //     key: paths.organizer.notification.default,
  //     icon: Bell,
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
  //     label: "Subscription",
  //     key: paths.organizer.subscription,
  //     icon: Podcast,
  // },
  // {
  //     label: "Logout",
  //     key: "/user/signIn",
  //     icon: LogOut,
  // }
];
