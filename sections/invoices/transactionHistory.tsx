"use client"

import { useCompanySelection } from '@/app/common/header/company-selection-storage'
import TableHeadCustom from '@/components/table/table-head-custom'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState'
import { useGetOrderTransactionsAnalyticsQuery } from '@/store/Reducer/loyalty-transactions-api'
import React, { useEffect, useMemo, useState } from 'react'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

const headLabel = [
    { id: 'title', label: 'Title', align: 'left' },
    { id: 'value', label: 'Value', align: 'left' },
    { id: 'growth', label: 'Growth', align: 'left' },
    { id: 'subFilters', label: 'Sub Filters', align: 'left' },
    { id: 'selectedSubFilter', label: 'Selected Filter', align: 'left' },
]

const normalizeSubFilters = (subFilters: any) => {
    if (Array.isArray(subFilters)) {
        return subFilters.map((sub: any, idx: number) => ({
            key: sub?.key || `${idx}`,
            label: sub?.label || sub?.name || sub?.value || 'N/A',
        }))
    }

    if (subFilters && typeof subFilters === 'object') {
        return Object.entries(subFilters).map(([key, value]) => ({
            key,
            label: String(value ?? key),
        }))
    }

    return []
}

const mapStatToRow = (item: any) => ({
    key: item?.key || item?._id || item?.title || 'unknown',
    title: item?.title || 'N/A',
    value: item?.value ?? 0,
    growth: item?.growth ?? 0,
    subFilters: normalizeSubFilters(item?.subFilters),
    selectedSubFilter: item?.selectedSubFilter || 'all',
})

const TransactionHistory = () => {
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    const { companyId, organizationId } = useCompanySelectionState()
    const { organizerOrganizationIds } = useCompanySelection()

    const selectedOrganizations = useMemo(() => {
        if (organizationId && organizationId !== 'all') return organizationId

        const filteredOrganizerIds = (organizerOrganizationIds || []).filter((id: string) => id && id !== 'all')
        if (filteredOrganizerIds.length > 0) return filteredOrganizerIds.join(',')

        return undefined
    }, [organizationId, organizerOrganizationIds])

    const hasValidSelection = Boolean(companyId || selectedOrganizations)
    const isAllOrganizationsMode = hasValidSelection && !selectedOrganizations

    useEffect(() => {
        setPage(1)
    }, [companyId, selectedOrganizations])

    const {
        data: statsResponse,
        isLoading,
        isFetching,
        error,
    } = useGetOrderTransactionsAnalyticsQuery(
        {
            companyOrganizer: companyId || undefined,
            organizations: selectedOrganizations,
            page: page - 1,
            limit,
        },
        {
            skip: !hasValidSelection,
        }
    )

    const stats = statsResponse?.data || []
    const totalPages = Math.max(1, Number(statsResponse?.meta?.totalPages) || 1)
    const tableRows = useMemo(() => stats.map((item: any) => mapStatToRow(item)), [stats])

    const errorMessage = (error as any)?.data?.message || (error as any)?.error || 'Failed to fetch transaction stats'

    return (
        <div>
            <div className='border rounded-lg m-4 '>
                <Table className="w-full">
                    <TableHeadCustom headLabel={headLabel} />
                    <TableBody>
                        {!hasValidSelection && (
                            <TableRow>
                                <TableCell colSpan={headLabel.length} className='text-center py-6'>
                                    Select a company or organization to load transaction analytics.
                                </TableCell>
                            </TableRow>
                        )}

                        {hasValidSelection && (isLoading || isFetching) && (
                            <TableRow>
                                <TableCell colSpan={headLabel.length} className='text-center py-6'>Loading...</TableCell>
                            </TableRow>
                        )}

                        {hasValidSelection && !isLoading && !isFetching && error && (
                            <TableRow>
                                <TableCell colSpan={headLabel.length} className='text-center py-6 text-red-600'>Error: {errorMessage}</TableCell>
                            </TableRow>
                        )}

                        {hasValidSelection && !isLoading && !isFetching && !error && tableRows.map((item: any, index: number) => (
                            <TableRow key={`${item.key}-${index}`}>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.value}</TableCell>
                                <TableCell>{item.growth}%</TableCell>
                                <TableCell>
                                    <div className='flex flex-wrap gap-2'>
                                        {item.subFilters.length > 0
                                            ? item.subFilters.map((sub: any) => (
                                                <span key={sub.key} className='text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700'>
                                                    {sub.label}
                                                </span>
                                            ))
                                            : 'N/A'}
                                    </div>
                                </TableCell>
                                <TableCell>{item.selectedSubFilter}</TableCell>
                            </TableRow>
                        ))}

                        {hasValidSelection && !isLoading && !isFetching && !error && tableRows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={headLabel.length} className='text-center py-6'>No analytics stats found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {isAllOrganizationsMode && (
                    <p className='text-xs text-gray-500 px-4 pb-2'>Showing analytics for all organizations (no organizations filter in payload).</p>
                )}
                <div >
                </div>
                <Pagination className='w-full flex justify-end mt-2'>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (page > 1) setPage((prev) => prev - 1)
                                }}
                                className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>{page}</PaginationLink>
                        </PaginationItem>
                        {totalPages > page + 1 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (page < totalPages) setPage((prev) => prev + 1)
                                }}
                                className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}

export default TransactionHistory