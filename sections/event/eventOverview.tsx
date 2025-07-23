import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Calendar, Dot, Ellipsis, MapPin, PartyPopper, Shirt, UserPlus, UsersRound } from 'lucide-react'
import React from 'react'
import { userTags } from '../users/data'
import { Button } from '@/components/ui/button'

const EventOverView = () => {


  const tickets = [
    { title: 'Early Bird Tickets', from: 'Mon 13, 25', sold: 1500, total: 2000 },
    { title: 'Early Bird Tickets', from: 'Mon 13, 25', sold: 1800, total: 2000 },
  ];

  const updates = [
    {
      title: 'Early Bird Tickets',
      description:
        'Lorem ipsum dolor sit amet consectetur. Posuere tellus sagittis morbi eu ac justo. Phasellus in in porta egestas eget massa.',
    },
    {
      title: 'Early Bird Tickets',
      description: 'Tellus congue tortor non morbi eros risus aenean.',
    },
  ];


  return (
    <div>
      <div className='grid grid-cols-12 gap-4'>
        <div className='lg:col-span-5 col-span-12'>
          {/* about organizer */}
          <Card className="shadow-lg dark:bg-secondary">
            <CardHeader>
              <h1 className="text-slate-500 font-semibold">ABOUT ORGANIZER</h1>
              <div className="mt-2">
                <div className="md:flex items-center gap-2 mt-1">
                  <img
                    src="/images/eventImage.png"
                    alt="Peti Kupe"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className='flex flex-col'>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">Peti Kupe</span>
                    <div className='flex'>
                      <MapPin className='w-4 h-4' />
                      <span>Trnjanska cesta 5, 10 00...</span>
                    </div>
                  </div>
                </div>
                <h1 className='text-slate-500 m-1'>Peti Kupe je destinacija u kojoj se isprepliću glazba, umjetnosti, edukativni sadržaji i gastronomija.</h1>
                <Badge
                  className=" bg-transparent w-full  text-black dark:bg-white  border border-gray-400 cursor-pointer rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800  transition-colors"
                >
                  Profile
                </Badge>
              </div>


            </CardHeader>
          </Card>
          {/* description */}
          <Card className="shadow-lg dark:bg-secondary mt-4">
            <CardHeader>
              <h1 className="text-slate-500 font-semibold">DESCRIPTION</h1>
              <p className=" mt-2">
                Svirati ploče bez pritiska, jednostavno iz ljubavi prema zvukovima te njegovati umjetnost slušanja muzike. Misija je to jedinstvenog kluba Kasheme u Zürichu. S ovim audiofilskim barom posebne koncepcije i uređenja upoznali smo se proljetos pri gostovanju njihove sjajne ekipe u Kupeu.
              </p>

            </CardHeader>
          </Card>
          {/* venue */}
          <Card className="mt-4 shadow-lg dark:bg-secondary">
            <CardHeader>
              <h1 className="text-slate-500 font-semibold ">VENUE TYPE</h1>
              <div className="flex items-center gap-2 mt-2">
                <PartyPopper />
                <p className=" mt-2 text-lg ">Nightclub</p>
              </div>
            </CardHeader>
          </Card>
          {/* categories */}
          <Card className="mt-4 shadow-lg dark:bg-secondary">
            <CardHeader>
              <h1 className="text-slate-500 font-semibold">CATEGORIES</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {userTags.map((item, index) => (
                  <Badge
                    key={index}
                    className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </Card>
          {/* tags */}
          <Card className="mt-4 shadow-lg dark:bg-secondary">
            <CardHeader>
              <h1 className="text-slate-500 font-semibold">TAGS</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {userTags.map((item, index) => (
                  <Badge
                    key={index}
                    className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </Card>
          <Card className="mt-4 shadow-lg dark:bg-secondary w-full">
            <CardHeader>
              {/* Top: Status + Ellipsis */}
              <div className="flex justify-between items-center">
                <Badge className="bg-gray-100 dark:bg-white text-black rounded-full px-4 py-1 text-sm font-medium">
                  Active
                </Badge>
                <Ellipsis className="cursor-pointer w-4 h-4" />
              </div>

              {/* Middle: Image + Info */}
              <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4">
                {/* Image */}
                <img
                  src="/images/bannerImage.png"
                  alt="Promotion"
                  className="w-full sm:w-20 md:h-20 h-30 rounded-[10px] object-cover"
                />

                {/* Text Info */}
                <div className="flex-1 flex flex-col">
                  {/* Row 1: Label + Days Left */}
                  <div className="flex justify-between items-center mb-1">
                    <h1 className="text-slate-500 font-semibold">PROMOTION</h1>
                    <h1 className="text-green-500 font-semibold whitespace-nowrap">
                      24 Days left
                    </h1>
                  </div>

                  {/* Row 2: Title */}
                  <h1 className="text-lg sm:text-xl font-medium">Promotion Name</h1>

                  {/* Row 3: Description */}
                  <p className="text-slate-500 mt-1 text-sm">
                    lorem ipsum dolor sit amet, consectetur ...
                  </p>
                </div>
              </div>
            </CardHeader>

            <hr />

            <CardContent>
              {/* Info Stats Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3">
                <div className="flex items-center">
                  <UsersRound className="w-5 h-5 text-slate-500" />
                  <p className="text-slate-500 ml-2 font-normal">
                    Max Points <span className="font-bold">632</span>
                  </p>
                </div>
                <div className="flex items-center">
                  <UsersRound className="w-5 h-5 text-slate-500" />
                  <p className="text-slate-500 ml-2 font-normal">
                    Max Points <span className="font-bold">632</span>
                  </p>
                </div>
              </div>

              {/* Reward Availability */}
              <div className="flex justify-between items-center mt-4 text-sm">
                <h1 className="text-slate-500 font-semibold">REWARD AVAILABILITY</h1>
                <h1 className="text-slate-500">488/2300</h1>
              </div>

              {/* Progress Bar */}
              <div className="mt-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-500 w-5/6"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-5 grid grid-cols-12 gap-4">
            <div
              className="md:col-span-6 col-span-12 shadow-lg bg-white dark:bg-black  w-full border-2 border-gray-300  rounded-full text-center
                             hover:bg-gray-100 "
            >
              <Badge className=" bg-transparent text-black dark:text-slate-500 px-4 py-1 text-md font-semibold">
                New Promonation
              </Badge>
            </div>
            <div className="md:col-span-6 col-span-12 shadow-lg bg-white dark:bg-black w-full border-2 border-gray-300  rounded-full text-center hover:bg-gray-100 ">
              <Badge className="bg-transparent text-black dark:text-slate-500  px-4 py-1 text-md font-semibold">
                New Notificaion
              </Badge>
            </div>
          </div>

        </div>
        <div className='lg:col-span-7 col-span-12'>
          {/* timeline  */}
          <Card className="shadow-lg dark:bg-[#171717]">
            <CardHeader className="w-full flex flex-col gap-2">
              <h1 className="text-slate-500 font-semibold">Timeline</h1>
              <hr />
              <div className='flex md:items-center gap-2 md:flex-row flex-col md:justify-between w-full'>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center  gap-2'>
                    <Calendar className='w-4 h-4' />
                    <p className='text-sm text-slate-500'>START DATE</p>
                  </div>
                  <p className='text-sm'>March 23, 25, 13:00</p>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    <p className='text-sm text-slate-500'>END DATE</p>
                  </div>
                  <p className='text-sm'>March 23, 25, 13:00</p>
                </div>
              </div>

            </CardHeader>
          </Card>
          {/* location */}
          <Card className="shadow-lg dark:bg-[#171717] mt-4">
            <CardHeader className="w-full flex flex-col gap-2">
              <h1 className="text-slate-500 font-semibold">LOCATION PIN</h1>
               <div className="flex items-center gap-2 mt-2">
                <PartyPopper className='w-4 h-4' />
                <span> Vibrant club</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className='w-4 h-4' />
                <span>Trnjanska cesta 5, 10 000 Zagreb, Cro...</span>
              </div>
              <img
                src="/images/mapImage.png"
                alt=""
                className="w-full h-full mt-2"
              />
            </CardHeader>
          </Card>

          {/* Tickets Section */}
          <Card className="space-y-4 mt-4 shadow-lg dark:bg-[#171717]">
            <CardContent>
              <h2 className="text-sm font-semibold text-muted-foreground">TICKETS</h2>

              {tickets.map((ticket, index) => (
                <div
                  key={index}
                >
                  <div
                    className="flex items-start justify-between  p-4 rounded-md "  >

                    <div className="flex-1 space-y-1">
                      <div className='flex items-center justify-between mr-2'>
                        <div>
                          <p className="text-base font-medium">{ticket.title}</p>
                          <p className="text-xs text-muted-foreground">From {ticket.from}</p>
                        </div>
                        <p>{ticket.sold}/ {ticket.total}</p>
                      </div>


                      <div className="mt-1">
                        <div className="relative h-2 w-full rounded-full bg-muted dark:bg-white overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(ticket.sold / ticket.total) * 100}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {ticket.sold}/{ticket.total}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Boost
                    </Button>
                  </div>
                  <hr />
                </div>
              ))}

              {/* Total Summary */}
              <div className="flex items-center justify-between md:px-4 pt-2  ">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Total</p>
                  <p className="text-lg font-bold">12,026 €</p>
                </div>
                <Button variant="outline" size="sm">
                  Manage Tickets
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Updates Section */}
          <Card className="space-y-4 mt-4 shadow-lg dark:bg-[#171717]">
            <CardContent>
              <h2 className="text-sm font-semibold text-muted-foreground">UPDATES</h2>

              {updates.map((update, index) => (
                <div key={index}>
                  <div className="flex justify-between p-4 rounded-md items-start">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Dot className="text-primary w-2 h-2 -ml-1 rounded-full bg-primary" />
                        <p className="text-sm font-medium">{update.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{update.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Boost
                    </Button>
                  </div>
                  <hr />
                </div>
              ))}

              {/* Optional Summary Section */}
              <div className="flex items-center justify-between px-1 pt-2">
                <p className="text-sm font-semibold text-muted-foreground">Last updated: 2 hours ago</p>
                <Button variant="outline" size="sm">
                  Manage Updates
                </Button>
              </div>
            </CardContent>
          </Card>






        </div>
      </div>
    </div>
  )
}

export default EventOverView