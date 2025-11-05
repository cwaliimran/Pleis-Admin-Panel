'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BannerControl from './components/banner-control/banner-control';
import MainSettings from './components/main-setting/main-settings';

const BrowserControlPage = () => {
  return (
    <div className="my-3 flex w-full max-w-full flex-col gap-6 pb-12 sm:mt-0">
      <Tabs defaultValue="account">
        <TabsList className="mb-4 gap-1">
          <TabsTrigger value="account" className="cursor-pointer">
            Main Settings
          </TabsTrigger>
          <TabsTrigger value="Banner Control" className="cursor-pointer">
            Banner Control
          </TabsTrigger>
        </TabsList>


        <TabsContent value="account">
          <MainSettings />
        </TabsContent>

        <TabsContent value="Banner Control">
          <BannerControl />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrowserControlPage;
