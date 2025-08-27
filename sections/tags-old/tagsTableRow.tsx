"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { FC } from "react";

interface CategoryItem {
  id: string;
  name: string;
  type: string;
  image: string;
  createdAt: string;
}

interface PageProps {
  item: CategoryItem;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

const TagsTableRow: FC<PageProps> = ({ item, handleDelete, handleEdit }) => {
  return (
    <TableRow className="transition-colors h-14 w-full">
      <TableCell>
        <span className="font-medium">
          {item.name.length > 30 ? item.name.slice(0, 30) + "..." : item.name}
        </span>
      </TableCell>

      <TableCell className="text-left">{item.type}</TableCell>
      <TableCell>{item.createdAt}</TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2 ">
          <button
            type="button"
            title="Edit Tag"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item.id);
            }}
            className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <Pencil className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            type="button"
            title="Delete Tag"
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

export default TagsTableRow;
