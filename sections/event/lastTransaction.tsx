import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
              <Image src={data?.user?.profileIcon} alt={data?.user?.firstName} width={25} height={25} className="rounded-full" />
              <h1>{data?.user?.firstName}</h1>
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
