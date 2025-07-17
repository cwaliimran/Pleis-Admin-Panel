import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import React from "react";

const Account = () => {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/super-admin/admin-profile");
  };

  return (
    <div>
      <Avatar onClick={handleProfileClick}>
        <AvatarImage
          src="https://github.com/shadcn.png"
          className="cursor-pointer"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Account;
