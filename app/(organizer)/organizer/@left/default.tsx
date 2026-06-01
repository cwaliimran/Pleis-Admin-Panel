'use client';

import React from 'react';
import MenuList from '../../../common/menuList';
import { menuGroups as originalMenuGroups } from './data';

const Default = () => {
  return (
    <>
      <MenuList menuGroups={originalMenuGroups} />
    </>
  );
};

export default Default;
