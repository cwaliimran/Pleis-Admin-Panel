"use client";

import { useState, Fragment } from "react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import LoyaltyTableRow from "./loyaltyTableRow2";
import { useGetReservationTransactionsQuery } from "@/store/Reducer/reservations-api";
import { useCompanySelection } from "@/app/common/header/company-selection-storage";

const ticketTypeLabelMap: Record<string, string> = {
  vipEventPass: "VIP",
  generalAdmission: "General",
  premiumAccess: "Premium",
};

const headLabel = [
  { id: "user", label: "User", align: "left" },
  { id: "reservationType", label: "Reservation Type", align: "start" },
  { id: "timeslot", label: "Timeslot", align: "start" },
  { id: "tickets", label: "Linked Tickets", align: "start" },
  { id: "amount", label: "Total Amount", align: "start" },
  { id: "paymentStatus", label: "Payment Status", align: "start" },
  { id: "confirmation", label: "Confirmation", align: "start" },
  { id: "staff", label: "Staff", align: "start" },
];

const ReservationList = ( { userType }: { userType: string }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);

  const { organizerOrganizationIds } = useCompanySelection();

  const { data: transactionsRaw, isLoading } = useGetReservationTransactionsQuery(
    { page, limit,  organizations: userType === 'organizer' ? organizerOrganizationIds : undefined, },
    { refetchOnMountOrArgChange: true }
  );

  const transactions = transactionsRaw?.data || [];
  const totalPages = transactionsRaw?.meta?.totalPages || 1;
  const totalRecords = transactionsRaw?.meta?.totalRecords || 0;

  const getStaffMembersFromChanges = (changes: any[] = []) => {
    const sortedChanges = [...changes].sort(
      (left, right) =>
        new Date(right?.createdAt || 0).getTime() - new Date(left?.createdAt || 0).getTime()
    );
    const seenStaffIds = new Set<string>();

    return sortedChanges
      .map((change: any) => change.changedByUser)
      .filter((user: any) => user)
      .filter((user: any) => {
        const staffId = user._id || `${user.firstName || ""}-${user.lastName || ""}-${user.profileIcon || ""}`;

        if (seenStaffIds.has(staffId)) {
          return false;
        }

        seenStaffIds.add(staffId);
        return true;
      });
  };

  const handleStaffNames = (item: any) => {
    const changes = item.reservationChanges || item.reservation?.reservationChanges || [];
    const staffList = item.staffMembers || getStaffMembersFromChanges(changes);
    setStaffMembers(staffList);
    setModalOpen(true);
  };

  const handleTimeslot = (item: any) => {
    const dateTimeSlots = item.reservation?.timemingSlots?.dateTimeSlots || [];
    const timeslots: string[] = [];
    dateTimeSlots.forEach((dateSlot: any) => {
      dateSlot.timeSlots?.forEach((slot: any) => {
        const startTime = new Date(slot.startTime).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
        const endTime = new Date(slot.endTime).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
        timeslots.push(`${startTime} - ${endTime}`);
      });
    });
    return timeslots.length > 0 ? timeslots.join(", ") : "-";
  };

  const mappedData = transactions.map((item: any) => {
    const changes = item.reservation?.reservationChanges || [];
    const sortedStaffMembers = getStaffMembersFromChanges(changes);
    const recentStaffMember = sortedStaffMembers[0];
    const recentStaffName = recentStaffMember
      ? `${recentStaffMember.firstName || ""} ${recentStaffMember.lastName || ""}`.trim()
      : "-";
    const additionalStaffCount = Math.max(sortedStaffMembers.length - 1, 0);
    const rawTicketType = item.reservation?.ticketType;
    const ticketTypes = Array.isArray(rawTicketType)
      ? rawTicketType
      : rawTicketType
        ? [rawTicketType]
        : [];
    const mappedTickets = ticketTypes
      .map((ticket: string) => ticketTypeLabelMap[ticket] || ticket)
      .filter(Boolean);

    return {
      user: `${item.user?.firstName || ""} ${item.user?.lastName || ""}`.trim(),
      avatar: item.user?.profileIcon || "",
      reservationType: item.reservation?.reservationType || "-",
      timeslot: handleTimeslot(item),
      tickets: mappedTickets,
      amount: `€${item.amount || 0}`,
      paymentStatus: item.paymentStatus || "-",
      confirmation: item.reservation?.status || "-",
      primaryStaffName: recentStaffName,
      additionalStaffCount,
      staffMembers: sortedStaffMembers,
      reservationChanges: changes,
    };
  });

  return (
    <div>
      <div className="rounded-lg border md:m-4">
        <Table className="w-full">
          <TableHeadCustom headLabel={headLabel} />
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : mappedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-gray-400">
                  No transactions found.
                </td>
              </tr>
            ) : (
              mappedData.map((item: any, index: number) => (
                <LoyaltyTableRow 
                  key={index} 
                  item={item} 
                  onStaffClick={() => handleStaffNames(item)}
                />
              ))
            )}
          </tbody>
        </Table>
      </div>

      <Pagination className="mt-4 flex flex-wrap items-center justify-end gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground">Rows per page:</span>
          <Select
            defaultValue={String(limit)}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[70px] text-sm">
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

        <div className="text-muted-foreground">
          Page {page} of {totalPages} ({totalRecords} records)
        </div>

        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) setPage(page - 1);
              }}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .map((p, idx, arr) => (
              <Fragment key={p}>
                {idx > 0 && arr[idx - 1] !== p - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(p);
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              </Fragment>
            ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) setPage(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>Staff Members</DialogTitle>
          <div className="space-y-3">
            {staffMembers && staffMembers.length > 0 ? (
              staffMembers.map((staff, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
                  <img 
                    src={staff?.profileIcon || ""} 
                    alt={`${staff?.firstName} ${staff?.lastName}`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">{staff?.firstName} {staff?.lastName}</span>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-sm text-gray-500">No staff members found</div>
            )}
          </div>
          <Button onClick={() => setModalOpen(false)} className="w-full mt-4">Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservationList;
