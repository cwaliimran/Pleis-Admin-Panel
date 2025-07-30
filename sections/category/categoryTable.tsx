import TableHeadCustom from "@/components/table/table-head-custom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody } from "@/components/ui/table";
import { FC } from "react";
import { CategoryTableRow } from ".";
import { categoriesData } from "./data";

const headLabel = [
  { id: "icon", label: "Icon", align: "left" },
  { id: "name", label: "Category Name", align: "left" },
  { id: "createdAt", label: "Created At" },
  { id: "actions", label: "Action", align: "left" },
];

interface PageProps {
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

const CategoryTable: FC<PageProps> = ({ handleDelete, handleEdit }) => {
  return (
    <div>
      <div className="grid grid-cols-11">
        <Card className="mt-5 shadow-md col-span-12 lg:col-span-12 md:px-8 px-2 mb-5 dark:bg-secondary">
          <div className="flex md:justify-between md:items-center flex-col md:flex-row gap-4">
            <h3 className="text-xl font-semibold md:ml-0 ml-2">
              Category List
            </h3>
          </div>

          <div className="w-full ">
            <Input placeholder="Search Category" className="w-full h-10 " />
          </div>

          <div className="border rounded-lg">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={headLabel} />
              <TableBody>
                {categoriesData.map((item: any, index: number) => (
                  <CategoryTableRow
                    key={index}
                    item={item}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination className="flex flex-wrap items-center justify-end gap-4 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Rows per page:</span>
              <Select defaultValue="10">
                <SelectTrigger className="w-[70px] h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Page info */}
            <div className="text-muted-foreground">Page 1 of 1</div>

            {/* Pagination controls */}
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
        </Card>
      </div>
    </div>
  );
};

export default CategoryTable;
