"use client";

import ImageWithFallback from "@/components/common/img-with-fallback";
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
  }

  return (
    <TableRow
      className="transition-colors h-14 w-full cursor-pointer"
      onClick={handleNavigateToDetails}
    >
      {/* Event Image */}

      <TableCell>
        <Avatar className="!rounded-xl shadow-sm w-12 h-12 overflow-hidden">
          {item?.basicInfo?.mediaInfo?.url && item.basicInfo.mediaInfo.name !== "noimage.png" ? (
            <ImageWithFallback
              url={item?.basicInfo?.mediaInfo?.url}
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

      {/* Event Title */}
      <TableCell className="text-left">
        {item?.basicInfo?.title?.length > 20 ? item.basicInfo.title.slice(0, 20) + "..." : item.basicInfo.title}
      </TableCell>

      {/* Organization Name & Logo */}
      <TableCell className="text-left">
        <div className="flex items-center justify-center gap-2">
          {item?.basicInfo?.organization?.basicInfo?.mediaInfo?.logo?.url && (
            <Avatar className="w-6 h-6 !rounded">
              <ImageWithFallback url={item?.basicInfo?.organization?.basicInfo?.mediaInfo?.logo?.url}
                alt={item?.basicInfo?.organization?.basicInfo?.name}  className="object-cover w-full h-full" />
              {/* <AvatarImage
                src={item?.basicInfo?.organization?.basicInfo?.mediaInfo?.logo?.url}
                alt={item?.basicInfo?.organization?.basicInfo?.mediaInfo?.logo?.name}
                className="object-cover w-full h-full"
              /> */}
            </Avatar>
          )}
          <span>{item?.basicInfo?.organization?.basicInfo?.name || "-"}</span>
        </div>

      </TableCell>

      {/* Venue Title */}
      <TableCell className="text-left">{item?.basicInfo?.venue?.title || "-"}</TableCell>

      {/* Start Date */}
      <TableCell>
        {item?.schedule?.startDateTime
          ? new Date(item.schedule.startDateTime).toLocaleString()
          : "-"}
      </TableCell>
      {/* End Date */}
      <TableCell className="text-left">
        {item?.schedule?.endDateTime
          ? new Date(item.schedule.endDateTime).toLocaleString()
          : "-"}
      </TableCell>

      {/* Revenue */}
      <TableCell>{item?.meta?.revenue ? item.meta.revenue : "-"}</TableCell>
      {/* Views */}
      <TableCell className="text-left">{item?.meta?.views ? item.meta.views : "-"}</TableCell>
      {/* Region */}
      <TableCell className="text-left">{item?.meta?.region || "-"}</TableCell>

      {/* Category */}
      {/* <TableCell className="text-left flex items-center gap-2">
      {item?.basicInfo?.category?.imageInfo?.url &&
      item?.basicInfo?.category?.imageInfo?.name !== "noimage.png" ? (
        <Avatar className="w-6 h-6 !rounded">
        <AvatarImage
          src={item?.basicInfo?.category?.imageInfo?.url}
          alt={item?.basicInfo?.category?.imageInfo?.name}
          className="object-cover w-full h-full"
        />
        </Avatar>
      ) : null}
      <span>{item?.basicInfo?.category?.title || "-"}</span>
      </TableCell> */}


      {/* Actions */}
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
