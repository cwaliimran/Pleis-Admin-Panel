'use client';
import React from 'react';
import MenuList from '../../../common/menuList';
import { menuGroups as originalMenuGroups } from './data';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Default = () => {
  const { user } = useSelector((state: RootState) => state.userSlice);
  console.log('user', user);
  const isLoyaltyDisabled = user?.basicInfo?.companyDetails?.status === 'suspended';
  console.log('isLoyaltyDisabled', isLoyaltyDisabled);

  // Inject disabled property into Loyalty group
  const menuGroups = originalMenuGroups.map((group) => {
    if (group.label === 'Loyalty') {
      return { ...group, disabled: isLoyaltyDisabled };
    }
    return group;
  });

  return (
    <>
      <MenuList menuGroups={menuGroups} />
    </>
  );
};

export default Default;
