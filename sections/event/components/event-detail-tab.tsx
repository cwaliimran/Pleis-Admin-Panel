import { Card, CardHeader } from '@/components/ui/card';

const EventDetailCard = ({ data }: { data: any }) => {
  return (
    <Card className="dark:bg-secondary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">{data.title.length > 20 ? data.title.slice(0, 20) + '...' : data.title}</h3>
          </div>
          <div>
            <div className="flex h-[30px] w-[80px] items-center justify-center rounded-full bg-[#79D48B] text-sm font-semibold text-white">
              <p>{data.status}</p>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center text-4xl font-bold">
          0{data.total && <sub className="ml-1 text-base font-medium">/ {data.total}k</sub>}
        </div>
      </CardHeader>
    </Card>
  );
};

export default EventDetailCard;
