import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users2 } from "lucide-react";
import { FC } from "react";

interface PageProps {
  item: any;
  type?: string;
}
const RewardCard: FC<PageProps> = ({ item, type }) => {
  // Calculate progress percent for limited rewards
  let progressPercent = 0;
  if (type === 'limit') {
    const used = Number(item?.totalUsersUsed) || 0;
    const limit = Number(item?.claimLimit) || 0;
    progressPercent = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  }
  return (
    <div>
      <Card className="shadow-md gap-0 py-0 hover:shadow-lg transition-shadow duration-300 dark:bg-secondary">
        <CardHeader className="p-3">
          <div className="flex">
            <div>
              <img
                src={item?.rewardImage || "/images/rewardImage.png"}
                alt=""
                className="w-20 h-20 cursor-pointer"
              />
            </div>

            <div className="ml-4">
              <h1 className="text-[15px] font-bold mb-1">
                {item?.rewardTitle?.length > 30
                  ? item?.rewardTitle?.slice(0, 30) + "..."
                  : item?.rewardTitle}
              </h1>

              <p className="text-[14px] text-gray-500">
                {item?.rewardDescription?.length > 30
                  ? item?.rewardDescription?.slice(0, 30) + "..."
                  : item?.rewardDescription}
              </p>

              <div className="mt-2 flex items-center justify-between gap-2">
                <h1 className="text-[13px] font-bold text-gray-600 dark:text-gray-200">
                  {item?.pointsUsed} points
                </h1>

                <div className="flex items-center">
                  <Users2 className="text-gray-400 h-5 w-5" />
                  <h1 className="text-[14px] font-medium text-gray-500 ml-1">
                    Claimed Rewards{" "}
                    <span className="font-bold text-gray-700 dark:text-gray-200">
                      {item?.totalUsersUsed}
                    </span>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        {type == 'limit' && (
          <CardContent className="py-3 space-y-1 border-t border-gray-300">
            <div className="flex justify-between items-start gap-4">
              <h2 className="text-[12px] text-gray-500">REWARD AVAILABILITY</h2>
              <h2 className="text-[12px] text-gray-500">{item?.totalUsersUsed}/{item?.claimLimit}</h2>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="w-full h-2 bg-gray-200 rounded-full  overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default RewardCard;
