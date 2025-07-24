"use client";

import Header from "@/app/common/header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userData } from "@/sections/create-organization/create-org-data";
import { eventCardData } from "@/sections/event/data";
import { tabsData } from "@/sections/event/data";
import UserCard from "@/sections/users/userCard";
import { useRouter } from "next/navigation";
import React from "react";
import { TransactionHistory } from "@/sections/invoices";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventAnalytics from "@/sections/event/eventAnalytics";
import EventInfo from "@/sections/event/eventOverview";
import EventNotification from "@/sections/event/eventNotification";
import EventReservation from "@/sections/event/eventReservation";
import EventTicket from "@/sections/event/eventTicket";
import EventOverView from "@/sections/event/eventOverview";
import {
  Calendar,
  Copy,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { useBoolean } from "@/hooks/useBoolean";
import ConfirmDialog from "@/components/comfirm-dialog/confirm-dialog";
import CapacityGaugeChart from "@/sections/event/CapacityGaugeChart";
import LastTransaction from "@/sections/event/lastTransaction";
import { Button } from "@/components/ui/button";
import FilterDropdown from "@/components/filter-dropdown/FilterDropdown";

const Page = () => {
  const [active, setActive] = React.useState("overview");
  const [tabActive, setTabActive] = React.useState("all");
  const router = useRouter();
  const deleteModal = useBoolean();
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  const event = {
    id: "1",
    name: "Summer Music Festival 2025",
    published: true,
    fromDate: "2025-03-23T13:00:00Z",
    endDate: "2025-03-25T13:00:00Z",
  };

  const onDelete = () => {
    deleteModal.onFalse();
    // Handle delete logic here
  };

  const handleTogglePublish = async (id: string) => {
    // Call API to toggle published state
    //   await togglePublishStatus(id);
    //   toast.success("Event status updated.");
    //   refetch(); // Or update local state
  };

  const handleCloneEvent = async (id: string) => {
    // Call API to clone event
    //   const clonedEvent = await cloneEvent(id);
    //   toast.success("Event cloned successfully.");
    //   router.push(`/events/${clonedEvent.id}`); // or refresh list
  };

  return (
    <div>
      <div className="space-y-6 pb-12">
        <Header
          links={[
            { name: "Dashboard", href: "/super-admin" },
            { name: "Events", href: "/super-admin/events" },
            { name: "Event Detail", href: "" },
          ]}
        />
        <div className="mt-10 h-full">
          <div className="grid grid-cols-12 md:gap-7">
            <div className="lg:col-span-9 col-span-12">
              <Card className=" dark:bg-[#171717] shadow-md pb-0">
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3 ">
                    <div className="w-full sm:w-1/3">
                      <img
                        src="/images/eventImage.png"
                        alt="Event"
                        className="rounded-md w-full h-auto object-contain object-top "
                      />
                    </div>

                    {/* Right Content */}
                    <div className="w-full sm:w-2/3 flex flex-col gap-3">
                      {/* Status and Date */}
                      <div className="flex items-center justify-between gap-3 text-sm text-gray-500">
                        <div className="flex items-center md:flex-row flex-col gap-2">
                          <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium">
                            Upcoming
                          </span>
                          <span>Sat, 26 Feb</span>
                        </div>
                        <div className="flex items-center">
                          <Pencil
                            className="md:w-5 md:h-5 w-4 h-4  text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                            onClick={() =>
                              router.push("/super-admin/events/create-event")
                            }
                          />
                          <Trash2
                            className="md:w-5 md:h-5 w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors md:ml-4 ml-1"
                            onClick={deleteModal.onTrue}
                          />
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Summer Music Festival 2025
                      </h2>

                      {/* Description */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Svirati ploče bez pritiska, jednostavno iz ljubavi prema
                        zvukovima te njegovati umjetnost slušanja muzike. Misija
                        je to jedinstvenog kluba Kasheme u Zürichu. S ovim
                        audiofilskim barom posebne koncepcije i uređenja
                        upoznali smo se proljetos pri gostovanju njihove sjajne
                        ekipe u Kupeu.
                      </p>

                      {/* Organizer */}
                      <div className="mt-2">
                        <h4 className="text-xs font-bold text-gray-500">
                          ORGANIZER
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <img
                            src="/images/eventImage.png"
                            alt="Peti Kupe"
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            Peti Kupe
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 w-full mt-4 md:mb-0 mb-2 md:px-0 px-2">
                    {/* Publish / Hide Button */}
                    {/* <div className="w-full sm:w-auto">
                      <Button
                        variant="default"
                        onClick={() => handleTogglePublish(event.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-3xl w-full sm:w-auto cursor-pointer"
                      >
                        {event.published ? (
                          <>
                            <EyeOff className="w-4 h-4" /> Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" /> Publish
                          </>
                        )}
                      </Button>
                    </div> */}

                    {/* Clone Button */}
                    <div className="w-full sm:w-auto">
                      <Button
                        variant="default"
                        onClick={() => handleCloneEvent(event.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-3xl w-full sm:w-auto cursor-pointer"
                      >
                        <Copy className="w-4 h-4" /> Clone
                      </Button>
                    </div>

                    {/* Publish Button */}
                    <div className="w-full sm:w-auto">
                      <Button
                        variant="default"
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-3xl w-full sm:w-auto cursor-pointer"
                      >
                        Publish
                      </Button>
                    </div>

                    {/* Boost Button */}
                    <div className="w-full sm:w-auto">
                      <button className="bg-primary text-white px-4 py-2 rounded-3xl hover:bg-primary transition w-full sm:w-auto cursor-pointer">
                        Boost
                      </button>
                    </div>
                  </div>

                  <div className="w-full md:px-0 px-2">
                    {/* Small screen dropdown */}
                    <div className="block sm:hidden mb-4">
                      <Select value={active} onValueChange={setActive}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select tab" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-secondary">
                          {tabsData.map((tab: any) => (
                            <SelectItem key={tab.value} value={tab.value}>
                              {tab.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Tabs for larger screens */}
                    <Tabs
                      value={active}
                      onValueChange={setActive}
                      className="hidden sm:block w-full"
                    >
                      <TabsList className="inline-flex items-center gap-2 bg-transparent p-1">
                        <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
                          {tabsData.map((tab: any) => (
                            <TabsTrigger
                              key={tab.value}
                              value={tab.value}
                              className={`relative px-4 py-2 font-semibold text-sm rounded-full transition-all
                                                                    !shadow-none dark:!bg-transparent cursor-pointer border-none
                                                                  ${active ===
                                  tab.value
                                  ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-[4px] after:bg-[#71717A] after:rounded-full'
                                  : "text-muted-foreground"
                                }`}
                            >
                              {tab.label}
                            </TabsTrigger>
                          ))}
                        </div>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              <div className=" mt-4 rounded-lg">
                {active === "overview" && <EventOverView />}

                {active === "analytics" && <EventAnalytics />}

                {active === "tickets" && <EventTicket />}

                {active === "reservations" && <EventReservation />}

                {active === "notifications" && <EventNotification />}
              </div>
            </div>

            {/* Sidebar or Additional Panel */}
            <div className="lg:col-span-3 col-span-12 md:space-y-2 space-y-3 md:mt-0 mt-3">
              {eventCardData.map((user: any) => (
                <UserCard item={user} key={user._id} />
              ))}
              <CapacityGaugeChart />
              <LastTransaction />

              <Card className="col-span-12 shadow-lg  dark:bg-[#171717]">
                <CardContent>
                  <div className="w-full md:flex  justify-between items-start flex-wrap gap-y-6 md:px-0 px-2">
                    {/* START DATE */}
                    <div className="flex flex-col gap-1 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-white" />
                        <p className="text-xs text-gray-600 dark:text-white font-semibold">
                          START DATE
                        </p>
                      </div>
                      <p className="text-sm text-black dark:text-white font-medium">
                        March 23, 25, 13:00
                      </p>
                    </div>

                    {/* END DATE */}
                    <div className="flex flex-col gap-1 min-w-[140px] md:mt-0 mt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-white" />
                        <p className="text-xs text-gray-600 dark:text-white font-semibold">
                          END DATE
                        </p>
                      </div>
                      <p className="text-sm text-black dark:text-white font-medium">
                        March 23, 25, 13:00
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {active === "analytics" && (
            <div className="grid grid-cols-12 mt-5">
              <Card className="col-span-12 shadow-lg  dark:bg-[#171717]">
                {/* <CardHeader>
                  <div className="flex md:justify-between md:items-center flex-col md:flex-row gap-4">
                    <h3 className="text-xl font-semibold">
                      Transaction History
                    </h3>
                    <div>
                      <Tabs
                        value={tabActive}
                        onValueChange={setTabActive}
                        defaultValue="all"
                        className="w-full "
                      >
                        <TabsList className="flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border  rounded-full p-1">
                          <TabsTrigger
                            value="all"
                            className={cn(
                              "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer "
                            )}
                          >
                            All
                          </TabsTrigger>
                          <TabsTrigger
                            value="transactions"
                            className={cn(
                              "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                            )}
                          >
                            Transactions
                          </TabsTrigger>
                          <TabsTrigger
                            value="refunds"
                            className={cn(
                              "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                            )}
                          >
                            Refunds
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <div className="flex flex-col md:items-center items-end">
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="w-auto">
                            <SelectLabel>Transaction</SelectLabel>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="thisWeek">This Week</SelectItem>
                            <SelectItem value="thisMonth">
                              This Month
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader> */}
                <CardHeader>
                  <div className='flex md:justify-between md:items-center flex-col md:flex-row gap-4'>
                    <h3 className='text-xl font-semibold'>Transaction History</h3>
                    <div>

                      <div className="w-full">
                        {/* Show select on small screens */}
                        <div className="block sm:hidden">
                          <Select value={active} onValueChange={setActive}>
                            <SelectTrigger className="w-full bg-[#EBEBEB] dark:bg-black dark:text-white">
                              <SelectValue placeholder="Select tab" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-secondary">
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="transactions">Transactions</SelectItem>
                              <SelectItem value="refunds">Refunds</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Show tabs on medium and larger screens */}
                        <div className="hidden sm:block">
                          <Tabs value={active} onValueChange={setActive} defaultValue="all" className="w-full">
                            <TabsList className="flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border rounded-full p-1">
                              <TabsTrigger
                                value="all"
                                className={cn(
                                  "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                                )}
                              >
                                All
                              </TabsTrigger>
                              <TabsTrigger
                                value="transactions"
                                className={cn(
                                  "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                                )}
                              >
                                Transactions
                              </TabsTrigger>
                              <TabsTrigger
                                value="refunds"
                                className={cn(
                                  "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                                )}
                              >
                                Refunds
                              </TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </div>
                      </div>

                    </div>
                    <div className='flex flex-col md:items-center items-end'>
                      <FilterDropdown
                        selectedOptions={selectedOptions}
                        onSelectOption={setSelectedOptions}
                        options={[
                          { id: "user", label: "User" },
                          { id: 'contact', label: 'Contact' },
                          { id: "invoice", label: "Invoice" },
                          { id: 'organizer', label: 'Organizer ' },
                          { id: 'date', label: 'Date' },
                          { id: 'total', label: 'Total' },
                          { id: "transactionType", label: "Transaction Type" },
                          { id: 'status', label: 'Status' },
                        ]}
                      />
                    </div>
                  </div>
                </CardHeader>
                <TransactionHistory />
              </Card>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Event"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default Page;
