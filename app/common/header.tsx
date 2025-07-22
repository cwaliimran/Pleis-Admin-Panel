// "use client";
// import React, { FC, useState } from "react";
// import Link from "next/link";
// import { Input } from "@/components/ui/input";
// import Profile from "./profile";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ModeToggle } from "@/components/atoms/mode-toggle";
// import { useSidebar } from "@/components/ui/sidebar";

// interface HeaderProps {
//   links?: {
//     name: string;
//     href?: string;
//   }[];
// }

// const Header: FC<HeaderProps> = ({ links }) => {
//   const { open } = useSidebar();
//   const [selectedOrganization, setSelectedOrganization] = useState<string>("");

//   return (
//     <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4  md:my-8 mt-8 mb-4">
//       <div className={` ${open ? "" : "md:ml-10"} ml-3`}>
//         <Breadcrumb>
//           <BreadcrumbList>
//             {links?.map((link, index) => (
//               <div key={index} className="flex items-center">
//                 <BreadcrumbItem>
//                   <BreadcrumbLink asChild>
//                     {link.href && <Link href={link.href}> {link.name} </Link>}
//                   </BreadcrumbLink>
//                   {!link.href && <BreadcrumbPage>{link.name}</BreadcrumbPage>}
//                 </BreadcrumbItem>
//                 {link.href && <BreadcrumbSeparator />}
//               </div>
//             ))}
//           </BreadcrumbList>
//         </Breadcrumb>
//       </div>

//       {/* Search and Profile */}
//       <div className="flex items-center gap-2 md:gap-4 lg:gap-6 xl:gap-4 2xl:gap-4 md:mt-0 mt-7">
//         <Input
//           placeholder="Search..."
//           className="w-full md:w-[300px] lg:w-[300px] bg-white xl:w-[300px] h-10 rounded-full pl-5"
//         />

//         {/* Organization Selector */}
//         <Select
//           value={selectedOrganization}
//           onValueChange={setSelectedOrganization}
//         >
//           <SelectTrigger className="w-[180px] md:w-[200px] h-10 bg-white">
//             <SelectValue placeholder="Select Organization" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="org1">Organization 1</SelectItem>
//             <SelectItem value="org2">Organization 2</SelectItem>
//             <SelectItem value="org3">Organization 3</SelectItem>
//           </SelectContent>
//         </Select>

//         <ModeToggle />
//         <Profile />
//       </div>
//     </div>
//   );
// };

// export default Header;


"use client";
import React, { FC, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import Profile from "./profile";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "@/components/atoms/mode-toggle";
import { useSidebar } from "@/components/ui/sidebar";

interface HeaderProps {
  links?: {
    name: string;
    href?: string;
  }[];
}

const Header: FC<HeaderProps> = ({ links }) => {
  const { open } = useSidebar();
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 px-3 sm:px-5 md:my-8 ">
      {/* Breadcrumbs */}
      <div className={`${open ? "" : "md:ml-10"} w-full overflow-x-auto`}>
        <Breadcrumb>
          <BreadcrumbList className="flex flex-wrap gap-x-1">
            {links?.map((link, index) => (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    {link.href ? <Link href={link.href}>{link.name}</Link> : null}
                  </BreadcrumbLink>
                  {!link.href && <BreadcrumbPage>{link.name}</BreadcrumbPage>}
                </BreadcrumbItem>
                {link.href && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right-side Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <Input
          placeholder="Search..."
          className="w-full sm:w-[200px] md:w-[240px] lg:w-[280px] h-10 rounded-full pl-5 bg-white"
        />

        <Select
          value={selectedOrganization}
          onValueChange={setSelectedOrganization}
        >
          <SelectTrigger className="w-full sm:w-[180px] h-10 bg-white">
            <SelectValue placeholder="Select Organization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="org1">Organization 1</SelectItem>
            <SelectItem value="org2">Organization 2</SelectItem>
            <SelectItem value="org3">Organization 3</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-3 items-center">
          <ModeToggle />
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Header;
