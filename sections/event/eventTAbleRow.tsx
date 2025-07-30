"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface PageProps {
  item: any;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
  active?: boolean;
  userType?: string;
}
const EventTableRow: FC<PageProps> = ({ item, handleDelete, userType }) => {
  const router = useRouter();

  const handleNavigateToDetails = () => {
    if (userType === "organizer") {
      router.push(`/organizer/events/${item.id}`);
    }
    if (userType === "super-admin") {
      router.push(`/super-admin/events/${item.id}`);
    }
  };

  const handleNavigateToEdit = (id: string) => {
    if (userType === "organizer") {
      router.push(`/organizer/events/edit-event/${id}`);
    }
    if (userType === "super-admin") {
      router.push(`/super-admin/events/edit-event/${id}`);
    }
  };

  return (
    <TableRow
      className=" transition-colors h-14 w-full cursor-pointer"
      onClick={handleNavigateToDetails}
    >
      <TableCell>
        <Avatar className="!rounded-xl  shadow-sm w-12 h-12 overflow-hidden">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="Store"
            className="object-cover w-full h-full cursor-pointer"
          />
        </Avatar>
      </TableCell>
      <TableCell className="text-left">
        {item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}
      </TableCell>
      <TableCell className="text-left">{item.organizaiton}</TableCell>
      <TableCell className="text-left">{item.venue}</TableCell>

      <TableCell>{item.fromDate ? item.fromDate : "N/A"}</TableCell>
      <TableCell className="text-left">
        {item.endDate ? item.endDate : "N/A"}
      </TableCell>
      <TableCell>{item.totalRevenue ? item.totalRevenue : "N/A"}</TableCell>
      <TableCell className="text-left">
        {item.totalViews ? item.totalViews : "N/A"}
      </TableCell>
      <TableCell className="text-left">
        {item.region ? item.region : "N/A"}
      </TableCell>
      <TableCell className="text-end">
        <div className="flex gap-2 ">
          {/* Publish / Hide Button */}
          {/* <Button
            className={`cursor-pointer px-0 w-24 py-2 font-medium rounded-md transition-colors duration-200 
    ${active ? "bg-red-600 text-white hover:bg-red-700" : ""}
  `}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePublish(event.id);
            }}
          >
            {active ? "UnPublish" : "Publish"}
          </Button>

          <Button
            variant={event.clone ? "secondary" : "outline"}
            className="cursor-pointer"
            size="sm"
          >
            Clone
          </Button> */}
          <button
            title="View Details"
            type="button"
            className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition cursor-pointer "
          >
            <Eye className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="Edit Event"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigateToEdit(item.id);
            }}
            className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <Pencil className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="Delete Event"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete?.(item.id);
            }}
            className="p-1.5 rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-300" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EventTableRow;
