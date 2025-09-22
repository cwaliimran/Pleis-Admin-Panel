'use client';

import TableHeadCustom from '@/components/table/table-head-custom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';

type ReferralItem = {
  friendName: string;
  status: 'joined' | 'pending';
  dateReferred: string;
  pointsAwarded: number;
};

const referralData: ReferralItem[] = [
  {
    friendName: 'Alice Johnson',
    status: 'joined',
    dateReferred: '2024-01-12',
    pointsAwarded: 20,
  },
  {
    friendName: 'Mark Smith',
    status: 'pending',
    dateReferred: '2024-02-01',
    pointsAwarded: 0,
  },
  {
    friendName: 'Sophia Lee',
    status: 'joined',
    dateReferred: '2024-02-05',
    pointsAwarded: 20,
  },
  {
    friendName: 'James Brown',
    status: 'joined',
    dateReferred: '2024-02-10',
    pointsAwarded: 20,
  },
];

const headLabel = [
  { id: 'friendName', label: 'Friend Name', align: 'left' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'dateReferred', label: 'Date Referred', align: 'center' },
  { id: 'pointsAwarded', label: 'Points Awarded', align: 'center' },
];

const ReferralsDetailPageTable = () => {
  return (
    <Card className="dark:bg-secondary shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Referral List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <Table className="w-full">
            <TableHeadCustom headLabel={headLabel} />
            <tbody>
              {referralData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b text-sm last:border-0 dark:border-gray-700"
                >
                  <td className="px-4 py-3 text-left">{item?.friendName}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium capitalize ${
                        item?.status === 'joined'
                          ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200'
                      }`}
                    >
                      {item?.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item?.dateReferred}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item?.pointsAwarded}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <Pagination className="flex flex-wrap items-center justify-end gap-4 text-sm">
            <div className="text-muted-foreground">Page 1 of 1</div>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralsDetailPageTable;
