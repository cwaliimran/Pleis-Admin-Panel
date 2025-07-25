"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface PageProps {
  item: any;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}
const VenueTableRow: FC<PageProps> = ({ item, handleDelete, handleEdit }) => {
  const router = useRouter();

  return (
    <TableRow className=" transition-colors h-14 w-full">
      <TableCell>
        <div className="flex items-center gap-3">
          {/* <Avatar className="!rounded-xl  shadow-sm w-12 h-12 overflow-hidden">
                        <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="Store"
                            className="object-cover w-full h-full cursor-pointer"
                        />
                    </Avatar> */}
          {item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}
        </div>
      </TableCell>
      <TableCell className="text-left">{item.dateAdded}</TableCell>

      <TableCell className="text-left flex items-center gap-2">
        <Avatar className="">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="Store"
            className=""
          />
        </Avatar>
        {item.organization.name}
      </TableCell>
      {/* <TableCell>
                {item.location}
            </TableCell> */}
      <TableCell className="text-left">{item.region}</TableCell>
      <TableCell className="text-left">
        <span
          className={`px-3 capitalize ${
            item.status === "primary" ? "bg-green-100 text-green-900" : ""
          } rounded-full py-1`}
        >
          {item.status}
        </span>
      </TableCell>
      <TableCell className="text-left">{item.createdAt}</TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2 ">
          <button
            title="Select Primary"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item.id);
            }}
            className="p-1.5 rounded-md bg-blue-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="View Venue"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item.id);
            }}
            className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <Pencil className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="View Venue"
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

export default VenueTableRow;
