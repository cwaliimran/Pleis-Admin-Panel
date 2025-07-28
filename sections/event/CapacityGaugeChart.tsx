import { Card, CardHeader } from '@/components/ui/card';
import ProgressChart from './progressChart';


export default function CapacityGaugeChart() {
    return (
        <Card className="text-center dark:bg-[#171717] shadow-lg">
            <CardHeader>
                <h2 className="text-md font-semibold">Capacity vs. Attendance</h2>
                <p className="text-slate-500 text-sm text-center">Lorem ipsum dolor sit amet consectetur.</p>
            </CardHeader>
            <ProgressChart COLORS={['#3b82f6', '#e5e7eb']} data={
                [
                    { name: 'Confirmed', value: 41 },
                    { name: 'Remaining', value: 59 }
                ]
            } />

           
        </Card>
    );
}
