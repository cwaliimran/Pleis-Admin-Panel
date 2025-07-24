import TableHeadCustom from "@/components/table/table-head-custom";
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
import React, { FC, useState } from "react";
import EventTableRow from "./eventTAbleRow";
import { Card } from "@/components/ui/card";
import { eventData } from "./data";
import FilterDropdown from "@/components/filter-dropdown/FilterDropdown";

const headLabel = [
  { id: "image", label: "Image", align: "left" },
  { id: "name", label: "Name", align: "left" },
  { id: "Organization", label: "Organization", align: "left" },
  { id: "venue", label: "Venue", align: "left" },
  { id: "startDate", label: "Start Date", align: "left" },
  { id: "endDate", label: "End Date", align: "left" },
  { id: "totalRevenue", label: "Revenue", align: "left" },
  { id: "totalViews", label: "Views", align: "left" },
  { id: "region", label: "Region", align: "left" },
  { id: "actions", label: "Action", align: "center" },
];
interface PageProps {
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
  userType?: string;
}
const EventTable: FC<PageProps> = ({ handleDelete, handleEdit, userType }) => {
  const [filterField, setFilterField] = useState<string[]>([]);

  return (
    <div>
      <div className="grid grid-cols-12 ">
        <Card className="mt-5 shadow-md col-span-12 lg:col-span-12  md:px-8 px-2  mb-5  dark:bg-secondary">
          <div className="flex md:justify-between md:items-center flex-col md:flex-row gap-4">
            <h3 className="text-xl font-semibold md:ml-0 ml-2">Event List</h3>
            <div>
              <div className="flex flex-col md:items-center items-end">
                <FilterDropdown
                  options={[
                    { id: "name", label: "Name" },
                    { id: "Organization", label: "Organization" },
                    { id: "venue", label: "Venue" },
                    { id: "startDate", label: "Start Date" },
                    { id: "endDate", label: "End Date" },
                    { id: "totalRevenue", label: "Revenue" },
                    { id: "totalViews", label: "Views" },
                    { id: "region", label: "Region" },
                  ]}
                  selectedOptions={filterField}
                  onSelectOption={setFilterField}
                />
              </div>
            </div>
          </div>
          <div className="w-full ">
            <Input
              placeholder="Search Event"
              // value={globalFilter}
              // onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full  h-10 "
            />
          </div>
          <div className="border rounded-lg  ">
            <Table className="w-full rounded-md border  ">
              <TableHeadCustom headLabel={headLabel} />
              <TableBody>
                {eventData.map((item, index) => (
                  <EventTableRow
                    key={index}
                    active={index === 0}
                    item={item}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    userType={userType}
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

export default EventTable;
