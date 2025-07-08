
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
    CreditCard
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
        label: "Calendar",
        key: paths.organizer.calendar,
        icon: CalendarDays,
    },
    {
        label: "Invoices",
        key: paths.organizer.invoices,
        icon: LayoutDashboard,
    },
    {
        label: "Home",
        key: paths.organizer.home,
        icon: Home,
    },
    {
        label: "Organizers",
        key: paths.organizer.users,
        icon: UsersRound
    },
    {
        label: "Tags",
        key: paths.organizer.tags,
        icon: Tags
    },
    {
        label:"Loyalty",
        key: paths.organizer.loyalty,
        icon:CreditCard
    },
     {
        label: "Notification",
        key: paths.organizer.notification,
        icon: Bell
    },
    {
        label: "Boost",
        key: paths.organizer.boost,
        icon: Rocket
    },
    {
        label: "Settings",
        key: paths.organizer.settings,
        icon: Settings,
    }
]