'use client';

import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { useDispatch } from 'react-redux';
import { showError } from '@/utils/toast';
import { logout } from '@/store/slice/userSlice';

const Account = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    user,
    // getDashboardRoute
  } = useAuth();

  const handleProfileClick = () => {
    if (user?.role === 'superAdmin') {
      router.push('/super-admin/admin-profile');
    } else if (user?.role === 'organizer') {
      router.push('/organizer/organizer-profile');
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logout());
      // popover.onClose();
      localStorage.clear();
      router.replace('/');
    } catch (error) {
      console.error(error);
      showError('Unable to logout!');
    }
  };

  // const handleDashboardClick = () => {
  //   router.push(getDashboardRoute());
  // };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={user.image || 'https://github.com/shadcn.png'}
            alt={user.name || 'User Avatar'}
            className="object-cover"
            width={100}
            height={100}
          />
          <AvatarFallback>
            {user?.basicInfo?.firstName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 dark:bg-[#272727]">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1 py-2">
            <p className="text-sm leading-none font-medium capitalize">
              {user?.basicInfo?.firstName}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.basicInfo?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleProfileClick}
          className="cursor-pointer"
        >
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Account;
