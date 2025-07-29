"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import CustomBadge from "@/components/ui/custom-badge";
import { Pencil, Play, Trash2 } from "lucide-react";
import { FC } from "react";

interface PageProps {
  item: {
    id: string;
    title: string;
    organization: string;
    status: string;
    video: string;
    event: string;
    createdAt: string;
  };
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

const HighlightTableRow: FC<PageProps> = ({
  item,
  handleDelete,
  handleEdit,
}) => {
  return (
    <TableRow className="transition-colors h-14 w-full">
      <TableCell>
        <span className="font-medium">
          {item.title.length > 30
            ? item.title.slice(0, 30) + "..."
            : item.title}
        </span>
      </TableCell>
      <TableCell className="text-left">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt={item.organization}
              className="object-cover"
            />
          </Avatar>
          {item.organization}
        </div>
      </TableCell>
      <TableCell>{item.event}</TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Play className="h-4 w-4 text-primary cursor-pointer    " />
          </DialogTrigger>
          <DialogContent className="max-w-2xl p-2 overflow-hidden">
            <video
              controls
              autoPlay
              className="w-full h-full"
              // src={item.video}
              src={
                "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"
              }
            />
          </DialogContent>
        </Dialog>
      </TableCell>
      <TableCell>{item.createdAt}</TableCell>

      {/* Status */}
      <TableCell className="text-left">
        <CustomBadge
          variant={
            item.status === "active"
              ? "success"
              : item.status === "scheduled"
              ? "info"
              : "error"
          }
        >
          {item.status}
        </CustomBadge>
      </TableCell>

      {/* Action menu */}
      <TableCell className="text-end">
        <div className="flex gap-2 ">
          <button
            type="button"
            title="Edit Highlight"
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
            title="Delete Highlight"
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

export default HighlightTableRow;
