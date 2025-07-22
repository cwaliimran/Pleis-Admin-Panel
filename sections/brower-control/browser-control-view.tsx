"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BannerControl from "./components/banner-control/banner-control";
import MainSettings from "./components/main-setting/main-settings";

const BrowserControlPage = () => {
  return (
    <div className="flex w-full max-w-full flex-col gap-6">
      <Tabs defaultValue="account">
        <TabsList>
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
