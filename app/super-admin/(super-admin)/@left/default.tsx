'use client';
import React from 'react';
import MenuList from '../../../common/menuList';

import { menuGroups, sidePanels } from './data';
const Default = () => {
  return (
    <>
      <MenuList menuGroups={menuGroups} panels={sidePanels} />
    </>
  );
};

export default Default;
