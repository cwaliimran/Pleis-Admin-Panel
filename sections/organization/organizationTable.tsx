"use client";
import TableHeadCustom from "@/components/table/table-head-custom";
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
  SelectItem, SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Table, TableBody } from "@/components/ui/table";
import { FC, useState } from "react";
import { Card } from "@/components/ui/card";
import { organizationListData } from "./data";
import OrganizationTableRow from "./organizationTableRow";
import { TableFilters } from "@/components/table-filters";

const headLabel = [
  { id: "log", label: "Logo", align: "left" },
  { id: "name", label: "Name", align: "left" },
  { id: "createdDate", label: "Created Date", align: "left" },
  { id: "subscriptionType", label: "Sub Type", align: "left" },
  { id: "subscriptionValidity", label: "Sub End Date", align: "left" },
  { id: "commission", label: "Commission (%)", align: "left" },
  { id: "totalViews", label: "T. Views", align: "left" },
  { id: "totalRevenue", label: "Total Revenue", align: "left" },
  { id: "status", label: "Status" },
  { id: "actions", label: "Action" },
  // { id: "region", label: "Region", align: "left" },
];

interface PageProps {
  handleDelete?: (id: string) => void;
  userType?: "organizer" | "super-admin";
}
const OrganizationTable: FC<PageProps> = ({ handleDelete, userType }) => {
  const [subType, setSubType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleResetFilters = () => {
    setDate(undefined);
    setSubType("");
    setStatus("");
    setSearchTerm("");
  };

  return (
    <div>
      <div className="grid grid-cols-12 ">
        <Card className="mt-5 shadow-md col-span-12 lg:col-span-12  md:px-8 px-2  mb-5  dark:bg-secondary">
          <div className="flex md:justify-between md:items-center flex-col md:flex-row gap-4">
            <h3 className="text-xl font-semibold md:ml-0 ml-2">
              Organization List
            </h3>
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
                id: "sub-type",
                label: "Sub Type",
                placeholder: "Select Sub Type",
                value: subType,
                onChange: setSubType,
                options: [
                  { value: "basic", label: "Basic" },
                  { value: "enterprise", label: "Enterprise" },
                  { value: "premium", label: "Premium" },
                ],
              },
              {
                id: "status",
                label: "Status",
                placeholder: "Select Status",
                value: status,
                onChange: setStatus,
                options: [
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "pending", label: "Pending" },
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

          <div className="border rounded-lg ">
            <Table className="w-full rounded-md border  ">
              <TableHeadCustom headLabel={headLabel} />
              <TableBody>
                {organizationListData.map((item, index) => (
                  <OrganizationTableRow
                    key={index}
                    item={item}
                    handleDelete={handleDelete}
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

export default OrganizationTable;
