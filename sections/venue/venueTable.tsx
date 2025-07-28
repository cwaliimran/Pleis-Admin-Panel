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
import { Card } from "@/components/ui/card";
import { venueData } from "./data";
import VenueTableRow from "./venueTableRow";
import FilterDropdown from "@/components/filter-dropdown/FilterDropdown";
import { TableFilters } from "@/components/table-filters";
const headLabel = [
  { id: "name", label: "Name", align: "left" },
  { id: "dateAdded", label: "Date Added", align: "left" },
  { id: "organizaiton", label: "Organization", align: "left" },
  { id: "location", label: "Location", align: "left" },
  { id: "status", label: "Status" },
  { id: "createdAt", label: "Created At" },
  { id: "actions", label: "Action", align: "center" },
];

interface PageProps {
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}
const VenueTable: FC<PageProps> = ({ handleDelete, handleEdit }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleResetFilters = () => {
    setDate(undefined);
    setLocation("");
    setSearchTerm("");
  };

  return (
    <div>
      <div className="grid grid-cols-12 ">
        <Card className="mt-5 shadow-md col-span-12 lg:col-span-12  md:px-8 px-2  mb-5  dark:bg-secondary">
          <div className="flex md:justify-between md:items-center flex-col md:flex-row gap-4">
            <h3 className="text-xl font-semibold md:ml-0 ml-2">Venue List</h3>
          </div>

          <TableFilters
            dateFilter={{
              id: "organization-date",
              placeholder: "Select date",
              value: date,
              onChange: setDate,
            }}
            selectFilters={[
              {
                id: "location",
                label: "Location",
                placeholder: "Select Location",
                value: location,
                onChange: setLocation,
                options: [
                  { value: "punjab", label: "Punjab" },
                  { value: "sindh", label: "Sindh" },
                  { value: "kashmir", label: "Kashmir" },
                ],
              },
            ]}
            searchFilter={{
              placeholder: "Search Organization",
              value: searchTerm,
              onChange: setSearchTerm,
            }}
            resetFilter={{
              onReset: handleResetFilters,
              showResetButton: true,
            }}
            filtersAlignment="right"
          />

          <div className="border rounded-lg  ">
            <Table className="w-full rounded-md border  ">
              <TableHeadCustom headLabel={headLabel} />
              <TableBody>
                {venueData.map((item: any, index: number) => (
                  <VenueTableRow
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

export default VenueTable;
