import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Globe, MapIcon, MapPin, Phone, PhoneCall } from 'lucide-react'
import React from 'react'

const BusinessInfo = () => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <h1 className='font-bold text-xl'>Business Info</h1>
                </CardHeader>
                <CardContent className='gap-4 flex flex-col items-start'>
                    <div className='flex gap-2'>
                        <MapPin />
                        <h1 className='text-slate-500'>  1234 Business Street, City, Country</h1>
                    </div>
                    <div className='flex gap-2'>
                        <Phone className='text-slate-500'/>
                        <h1 className='text-slate-500'>+123 456 7890</h1>
                    </div>
                    <div className='flex gap-2'>
                        <Globe className='text-slate-500'/>
                        <h1 className='text-slate-500'>www.businesswebsite.com</h1>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default BusinessInfo