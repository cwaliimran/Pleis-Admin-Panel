import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { FC } from 'react'

interface PageProps {
    item: any; 
}
const LoyaltyCard: FC<PageProps> = ({ item }) => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className=''>{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <h1 className='text-2xl font-bold'>{item.points}</h1>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoyaltyCard