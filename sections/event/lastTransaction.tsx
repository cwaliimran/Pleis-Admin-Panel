import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { lastTransactionData } from './data'
import { Button } from '@/components/ui/button'

const LastTransaction = () => {
    return (
        <Card className='shadow-lg dark:bg-[#171717] '>
            <CardHeader className='text-left'>
                <CardTitle>Last Transactions</CardTitle>
                <p className="text-sm text-muted-foreground">These made 265 transactions this month</p>
            </CardHeader>
            <hr />
            <CardContent>
                {lastTransactionData.map((item) => (
                    <div className='flex flex-row justify-between items-center mb-4 ' key={item.name}>
                        <div className='flex gap-1 items-center'>
                            <img src="/images/avatar.png" alt="" />
                            <h1>{item.name}</h1>
                        </div>
                        <div>{item.transaction}</div>
                    </div>))}
                <div className='flex items-center justify-center'>
                    <Button variant="outline" className='cursor-pointer w-full'>See full transaction list</Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default LastTransaction