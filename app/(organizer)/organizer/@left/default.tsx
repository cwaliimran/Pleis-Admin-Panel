'use client';

import React from 'react';
import MenuList from '../../../common/menuList';
import { menuGroups as originalMenuGroups } from './data';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

const Default = () => {
  const { user } = useSelector((state: RootState) => state.userSlice);
  const isManager = user?.accountState?.userType === 'manager';

  const menuGroups = isManager ? originalMenuGroups.filter((group) => group.label !== 'Subscription') : originalMenuGroups;

  return (
    <>
      <MenuList menuGroups={menuGroups} />
    </>
  );
};

export default Default;
