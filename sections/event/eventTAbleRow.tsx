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
  userType?: string;
}

const EventTableRow: FC<PageProps> = ({ item, handleDelete, userType }) => {
  const router = useRouter();

  const handleNavigateToDetails = () => {
    if (userType === "organizer") {
      router.push(`/organizer/events/${item._id}`);
    }
    if (userType === "super-admin") {
      router.push(`/super-admin/events/${item._id}`);
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
      className="transition-colors h-14 w-full cursor-pointer"
      onClick={handleNavigateToDetails}
    >
      <TableCell>
        <Avatar className="!rounded-xl shadow-sm w-12 h-12 overflow-hidden">
          {/* Check if event has an image or use a placeholder */}
          {item?.basicInfo?.mediaInfo?.url && item.basicInfo.mediaInfo.name !== "noimage.png" ? (
            <AvatarImage
              src={item?.basicInfo?.mediaInfo?.url}
              alt={item?.basicInfo?.title}
              className="object-cover w-full h-full cursor-pointer"
            />
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">
              {item?.basicInfo?.title?.[0]?.toUpperCase() || ""}
            </span>
          )}
        </Avatar>
      </TableCell>

      <TableCell className="text-left">
        {item?.basicInfo?.title?.length > 20 ? item.basicInfo.title.slice(0, 20) + "..." : item.basicInfo.title}
      </TableCell>

      <TableCell className="text-left">{item?.basicInfo?.organization || "-"}</TableCell>
      <TableCell className="text-left">{item?.basicInfo?.venue || "-"}</TableCell>

      <TableCell>{item?.schedule?.startDateTime ? item.schedule.startDateTime : "-"}</TableCell>
      <TableCell className="text-left">
        {item?.schedule?.endDateTime ? item.schedule.endDateTime : "-"}
      </TableCell>

      <TableCell>{item?.meta?.revenue ? item.meta.revenue : "-"}</TableCell>
      <TableCell className="text-left">{item?.meta?.views ? item.meta.views : "-"}</TableCell>
      <TableCell className="text-left">{item?.meta?.region || "-"}</TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2">
          {/* View Details Button */}
          <button
            title="View Details"
            type="button"
            className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <Eye className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </button>

          {/* Edit Button */}
          <button
            title="Edit Event"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigateToEdit(item._id);
            }}
            className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <Pencil className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </button>

          {/* Delete Button */}
          <button
            title="Delete Event"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete?.(item._id);
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
