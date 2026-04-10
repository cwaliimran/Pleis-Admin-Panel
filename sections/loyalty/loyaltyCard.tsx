import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber } from "@/utils/format-compact-number";
import React, { FC } from "react";

interface PageProps {
  item: any;
}
const LoyaltyCard: FC<PageProps> = ({ item }) => {
  return (
    <div>
      <Card className="gap-0 dark:bg-secondary">
        <CardHeader>
          <CardTitle className="text-sm mb-2">{item.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <h1 className="text-3xl font-extrabold">{formatCompactNumber(Number(item.points ?? 0))}</h1>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyCard;
