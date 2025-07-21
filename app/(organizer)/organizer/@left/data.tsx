
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
    Calendar,
    Building,
    VenetianMask,
    Highlighter,
    Volume1,
    Podcast,
    ArrowRightLeft,
    User
} from "lucide-react"
import { paths } from "./paths"

type MenuItem = {
    title: string
    url?: string
    icon: any
    items?: MenuItem[]
}

type MenuGroup = {
    label: string
    key: string,
    icon: any,
    items?: MenuItem[]
}

export const menuGroups: MenuGroup[] = [
    {
        label: "Dashboard",
        key: paths.organizer.dashboard,
        icon: ChartColumnBig,
    },
    {
        label: "Organizations",
        key: paths.organizer.organizations.default,
        icon: Building,
        items: [
            {
                title: "Create Organization",
                url: paths.organizer.organizations.create,
                icon: Home,
            },
            {
                title: "Organization List",
                url: paths.organizer.organizations.list,
                icon: Home,
            }
        ]
    },
    {
        label: "Events",
        key: paths.organizer.events.default,
        icon: Calendar,
        items: [
            {
                title: "Create Event",
                url: paths.organizer.events.create,
                icon: Tags,
            },
            {
                title: "Events List",
                url: paths.organizer.events.list, // Example ID
                icon: Tags,
            }
        ]
    },
    {
        label: "Venue",
        key: paths.organizer.venue.default,
        icon: VenetianMask,
    },
    {
        label: "Highlights",
        key: paths.organizer.hightLight.default,
        icon: Highlighter,

    },
    {
        label: "User",
        key: paths.organizer.users.default,
        icon: User,
        items: [
            {
                title: "User List",
                url: paths.organizer.users.list,
                icon: UsersRound,
            },
            // {
            //     title: "Pending User List",
            //     url: paths.superAdmin.users.pendingList,
            //     icon: UsersRound,
            // }
        ]
    },
    {
        label: "Marketing Requests",
        key: paths.organizer.marketing.detault,
        icon: Volume1
    },

    {
        label: "Transactions",
        key: paths.organizer.transactions.default,
        icon: ArrowRightLeft,
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
    },
    {
        label: "Notification",
        key: paths.organizer.notification.default,
        icon: Bell,
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
    },

    {
        label: "Subscription",
        key: paths.organizer.subscription,
        icon: Podcast,
    },
]