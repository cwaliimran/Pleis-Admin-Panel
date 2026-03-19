import TableHeadCustom from '@/components/table/table-head-custom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { TrendingUp } from 'lucide-react';
import React, { FC } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface TopOrganizer {
  organizerName: string;
  organizerLogo: string;
  revenue: number;
  engagement: number;
}

interface TopPerformingOrganizersProps {
  data: TopOrganizer[];
}

// ---------------------------------------------------------------------------
// Table head config — ROI removed since API doesn't provide it
// ---------------------------------------------------------------------------
const headLabel = [
  { id: 'organizerName', label: 'Organizer Name' },
  { id: 'revenue', label: 'Revenue ($)' },
  { id: 'engagement', label: 'Engagement (%)' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format revenue to a readable short form: 3.6B, 1.2M, 355K, etc. */
const formatRevenue = (value: number): string => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

/** Get initials from organizer name for avatar fallback */
const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

// ---------------------------------------------------------------------------
// Row Component
// ---------------------------------------------------------------------------
const OrganizerRow: FC<{ item: TopOrganizer }> = ({ item }) => (
  <TableRow className="h-14">
    <TableCell>
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.organizerLogo} alt={item.organizerName} className="cursor-pointer object-cover" />
          <AvatarFallback className="text-xs">{getInitials(item.organizerName)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{item.organizerName}</span>
      </div>
    </TableCell>
    <TableCell className="text-center">${formatRevenue(item.revenue)}</TableCell>
    <TableCell className="text-center">
      <div className="flex items-center justify-center gap-2">
        {item.engagement}%
        <TrendingUp className="h-4 w-4 text-[#79D48B]" />
      </div>
    </TableCell>
  </TableRow>
);

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const TopPerformingOrganizers: FC<TopPerformingOrganizersProps> = ({ data }) => {
  if (!data.length) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-muted-foreground text-sm">No organizer data available</p>
      </div>
    );
  }

  return (
    <div className="m-4 rounded-lg border p-4">
      <Table className="w-full">
        <TableHeadCustom headLabel={headLabel} />
        <TableBody>
          {data.map((item, index) => (
            <OrganizerRow key={`${item.organizerName}-${index}`} item={item} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TopPerformingOrganizers;
