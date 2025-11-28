// components/lists/ActivePromotionsList.tsx
import TableHeadCustom from '@/components/table/table-head-custom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { promotionsData, promotionsHeadLabel } from './data';
import PromotionListTableRow from './PromotionListTableRow';

const ActivePromotionsList = () => {
  return (
    <div>
      <div className="rounded-lg border md:m-4">
        <Table className="w-full">
          <TableHeadCustom headLabel={promotionsHeadLabel} />
          <tbody>
            {promotionsData.map((item: any, index: number) => (
              <PromotionListTableRow key={index} item={item} />
            ))}
          </tbody>
        </Table>
      </div>
      
      {/* Pagination component logic */}
      <Pagination className="mt-4 flex flex-wrap items-center justify-end gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground">Rows per page:</span>
          <Select defaultValue="10">
            <SelectTrigger className="h-8 w-[70px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
  );
};

export default ActivePromotionsList;