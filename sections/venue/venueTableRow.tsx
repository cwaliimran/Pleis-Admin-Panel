"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import CustomBadge from "@/components/ui/custom-badge";
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
        {/* <span
          className={`px-3 capitalize ${
            item.status === "primary" ? "bg-green-100 text-green-900" : ""
          } rounded-full py-1`}
        >
          {item.status}
        </span> */}
        <CustomBadge variant={item.status === "primary" ? "success" : "error"}>
          {item.status}
        </CustomBadge>
      </TableCell>
      <TableCell className="text-left">{item.createdAt}</TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2 ">
          <button
            title="Select Primary"
            type="button"
            className="p-1.5 rounded-md bg-blue-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M8.056.396a1.636 1.636 0 0 0-2.133 0a55 55 0 0 0-.562.488a55 55 0 0 0-.73-.142a1.636 1.636 0 0 0-1.848 1.067q-.125.356-.243.708q-.36.12-.721.248A1.636 1.636 0 0 0 .752 4.613q.07.37.144.735q-.25.284-.5.575a1.636 1.636 0 0 0 0 2.133q.25.293.504.578q-.076.374-.148.753c-.15.796.303 1.58 1.067 1.848q.361.128.721.248q.119.352.243.708a1.636 1.636 0 0 0 1.848 1.068q.376-.071.748-.147q.279.248.565.492c.613.528 1.52.528 2.133 0q.285-.243.562-.488q.363.073.73.143c.795.15 1.58-.304 1.848-1.068q.125-.356.243-.708q.36-.12.721-.248a1.636 1.636 0 0 0 1.066-1.848a56 56 0 0 0-.143-.735q.25-.284.5-.575a1.636 1.636 0 0 0 0-2.133a56 56 0 0 0-.504-.579q.076-.374.147-.752a1.636 1.636 0 0 0-1.066-1.848a56 56 0 0 0-.721-.248q-.119-.353-.243-.708A1.636 1.636 0 0 0 9.369.742q-.375.07-.748.146a56 56 0 0 0-.565-.492m-1.319.947a.386.386 0 0 1 .504 0q.398.343.783.686c.148.132.35.186.544.146q.51-.107 1.033-.205a.386.386 0 0 1 .436.252q.174.496.335.985c.062.188.21.336.398.398q.496.163.997.34c.18.063.288.248.252.436q-.099.524-.206 1.037a.63.63 0 0 0 .146.545q.35.39.697.796a.386.386 0 0 1 0 .504q-.345.402-.693.792a.63.63 0 0 0-.146.544q.105.504.202 1.02a.386.386 0 0 1-.252.437q-.5.176-.997.339a.63.63 0 0 0-.398.398q-.162.49-.335.985a.386.386 0 0 1-.436.252a54 54 0 0 1-1.016-.201a.63.63 0 0 0-.544.146q-.382.342-.778.682a.386.386 0 0 1-.504 0a54 54 0 0 1-.783-.686a.63.63 0 0 0-.544-.146q-.51.107-1.033.205a.386.386 0 0 1-.436-.252q-.174-.495-.335-.985a.63.63 0 0 0-.398-.398q-.496-.163-.997-.34a.386.386 0 0 1-.252-.436q.098-.525.206-1.038a.63.63 0 0 0-.146-.544q-.35-.39-.697-.796a.386.386 0 0 1 0-.504q.345-.402.693-.792a.63.63 0 0 0 .146-.544q-.105-.504-.202-1.02a.386.386 0 0 1 .252-.437q.501-.175.996-.339a.63.63 0 0 0 .399-.398q.16-.489.335-.985a.386.386 0 0 1 .436-.252q.512.096 1.016.201a.63.63 0 0 0 .543-.146q.383-.342.78-.682m2.767 4.212a.75.75 0 0 0-1.008-1.11c-.674.611-1.19 1.17-1.628 1.852a9 9 0 0 0-.694 1.336l-.636-.655a.75.75 0 0 0-1.076 1.044l1.454 1.5a.75.75 0 0 0 1.247-.275c.333-.957.624-1.603.968-2.14c.342-.534.756-.992 1.373-1.551"
                clipRule="evenodd"
              />
            </svg>
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
