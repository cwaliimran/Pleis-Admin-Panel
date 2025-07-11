


export const paths = {
    superAdmin: {
        default: "/super-admin",
        menu: "/super-admin/menu",
        invoices: "/super-admin/invoices",
        category: {
            default: "/super-admin/category",
            create: "/super-admin/category/create-category",
            list: "/super-admin/category/category-list",
        },
        tags: '/super-admin/tag',
        organizations: {
            default: "/super-admin/organization",
            create: "/super-admin/organization/create-organization",
            list: "/super-admin/organization/organization-list",
        },
        users: {
            default: "/super-admin/user",
            create: "/super-admin/user/create-user",
            list: "/super-admin/user/user-list",
            pendingList: "/super-admin/user/pending-user-list",
        },
        evnets: {
            default: "/super-admin/events",
            create: "/super-admin/events/create-event",
            list: "/super-admin/events/event-list",
        },
        update: {
            default: "/super-admin/update",
            create: "/super-admin/update/create-update",
            list: "/super-admin/update/update-list",

        },
        venue: {
            default: "/super-admin/venue",
            create: "/super-admin/venue/create-venue",
            list: "/super-admin/venue/venue-list",

        },
        vanueType: {
            default: "/super-admin/venue-type",
            create: "/super-admin/venue-type/create",
            list: "/super-admin/venue-type/venue-type-list",

        },
        region: {
            default: "/super-admin/region",
            create: "/super-admin/region/create-region",
            list: "/super-admin/region/region-list",

        },
        marketing: '/super-admin/marketing-list',
        transactions: {
            default: "/super-admin/transactions",
            premium: "/super-admin/transactions/premium-tranaction",
            list: "/super-admin/transactions/transaction-list",
            refund: "/super-admin/transactions/refund-transaction",
        
    },
    addSupport: '/super-admin/add-support',

}
}