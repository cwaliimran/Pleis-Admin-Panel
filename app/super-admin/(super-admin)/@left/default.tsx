'use client';
import React from 'react';
import MenuList from '../../../common/menuList';

import { menuGroups } from './data';
const Default = () => {
  return (
    <>
      <MenuList menuGroups={menuGroups} />
    </>
  );
};

export default Default;
