import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Rocket } from 'lucide-react';
import { activePromontions } from './data';

const ActivePromontion = () => {
  return (
    <Card className="shadow-lg dark:bg-[#171717]">
      <CardHeader>
        <h1 className="text-xl font-bold">Active Promontions & Boosts</h1>
      </CardHeader>
      <hr />
      <CardContent>
        {activePromontions.slice(0, 1).map((item: any) => (
          <div key={item.title} className="mb-6 flex items-center gap-2">
            <Rocket />
            <div className="ml-2">
              <h1 className="text-lg font-semibold">-</h1>
              <p className="text-gray-500">-</p>
            </div>
            {/* <Badge className='border-gray-300 rounded-2xl ml-auto bg-transparent px-3 py-1 text-lg text-gray-700 dark:text-gray-400'>Boost</Badge> */}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActivePromontion;
