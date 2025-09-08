'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/store/slice/userSlice';
import type { RootState } from '@/store/store';
import { showError } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import placeHolderImage from '../../assets/profile/user.png';

const Account = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userSlice);

  const handleProfileClick = () => {
    if (user?.role === 'admin') {
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
      console.log(error);
      showError('Unable to logout!');
    }
  };

  if (!user) {
    return null;
  }

  const profileImage =
    user?.basicInfo?.profileIcon ===
    'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noImage.png'
      ? placeHolderImage.src
      : user?.basicInfo?.profileIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={profileImage}
            alt={user?.basicInfo?.firstName || 'Unknown'}
            className="object-cover"
            width={100}
            height={100}
          />
          <AvatarFallback>
            {user?.basicInfo?.firstName?.charAt(0).toUpperCase() || '-'}
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
