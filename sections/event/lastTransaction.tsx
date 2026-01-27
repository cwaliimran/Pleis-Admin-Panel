import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
// import { Button } from '@/components/ui/button';
import Image from 'next/image';

const LastTransaction = ({ data }: { data: any }) => {
  return (
    <Card className="shadow-lg dark:bg-[#171717]">
      <CardHeader className="text-left">
        <CardTitle>Last Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {data?.latestEventOrders?.map((data: any) => (
          <div className="mb-4 flex flex-row items-center justify-between" key={data?._id}>
            <div className="flex items-center gap-1">
              {data?.user?.profileIcon && data?.user?.profileIcon !== noImageUrl && data?.user?.profileIcon !== noImageUrlDev ? (
                <Image
                  src={data?.user?.profileIcon || ''}
                  alt="Image"
                  className="h-7 w-7 rounded-full object-cover"
                  priority
                  height={25}
                  width={35}
                />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full border bg-gray-200 text-center text-sm font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                  {data?.user?.firstName?.[0]?.toUpperCase() || ''}
                </span>
              )}
              <h1 className="ml-1 capitalize">{data?.user?.firstName || ''}</h1>
            </div>
            <div>
              {data?.orderPricing?.currency}
              {data?.orderPricing?.total}
            </div>
          </div>
        ))}
        {/* <div className="flex items-center justify-center">
          <Button variant="outline" className="w-full cursor-pointer">
            See full transaction list
          </Button>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default LastTransaction;
