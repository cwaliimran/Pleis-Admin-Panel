import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Globe,
  Mail,
  MapIcon,
  MapPin,
  Phone,
  PhoneCall,
  VenetianMask,
} from "lucide-react";
import React from "react";

const BusinessInfo = () => {
  return (
    <div>
      <Card className="dark:bg-[#171717]">
        <CardHeader>
          <h1 className="font-bold text-xl">Business Info</h1>
        </CardHeader>
        <CardContent className="gap-4 flex flex-col items-start">
          <div className="flex gap-2">
            <Mail className="text-slate-500" width={20} />
            <h1 className="text-slate-500">dummy@gmail.com</h1>
          </div>
          <div className="flex gap-2">
            <Phone className="text-slate-500" width={20} />
            <h1 className="text-slate-500">+123 456 7890</h1>
          </div>
          <div className="flex gap-2">
            <VenetianMask className="text-slate-500" width={20} />
            <h1 className="text-slate-500">Venue Name</h1>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessInfo;
