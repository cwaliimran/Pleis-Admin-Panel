import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRightFromLine,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  Eye,
  Facebook,
  Globe,
  Heart,
  Instagram,
  Languages,
  MapPin,
  Share2,
  Twitter,
  UserRound,
  Users,
} from "lucide-react";
import React from "react";
import { eventTags, orgTags, userTags, venueTypes } from "../users/data";
import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const UserOverView: React.FC<{ userType: string | null; user: any }> = ({
  userType,
  user,
}) => {
  const permissionList = [
    "Ticketing",
    "Loyalty",
    "InApp ordering",
    "Reservation management",
  ];

  const accessList = [
    "Ticket validation",
    "Reservation info",
    "Ticket analytics",
    "NFC/QR scanning of tickets and loyalty cards",
    "Viewing active loyalty transactions (point redemption)",
    "Manually entering transaction codes (if NFC unavailable)",
    "Checking orders and confirming delivery",
    "Viewing table booking status",
  ];

  const interactions = [
    {
      label: "Viewed Content",
      value: 124,
      icon: <Eye className="h-6 w-6 text-blue-500" />,
    },
    {
      label: "Liked Content",
      value: 78,
      icon: <Heart className="h-6 w-6 text-pink-500" />,
    },
    {
      label: "Shared Content",
      value: 32,
      icon: <Share2 className="h-6 w-6 text-green-500" />,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="lg:col-span-5 col-span-12">
          {userType === "staff" && (
            <>
              <Card className="w-full mt-4 shadow-lg dark:bg-secondary">
                <CardHeader>
                  <CardTitle className="text-slate-500 dark:text-slate-500 text-xl font-semibold">
                    Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {permissionList.map((perm, idx) => (
                    <Badge key={idx} variant="default">
                      {perm}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {(userType === "admin" || userType === "organizer") && (
            <>
              <Card className="shadow-lg dark:bg-secondary bg-white rounded-2xl mt-6">
                <CardHeader>
                  <CardTitle className="text-slate-500 dark:text-slate-500 text-xl font-semibold">
                    Business Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {/* Name & Description */}
                  <div className="">
                    <span className="font-semibold text-gray-500 w-28">
                      Name:
                    </span>
                    <span className="text-gray-800 dark:text-white">
                      {user.businessDetails.name}
                    </span>
                  </div>
                  <div className=" ">
                    <span className="font-semibold text-gray-500 w-28">
                      Description:
                    </span>
                    <span className="text-gray-800 dark:text-white">
                      {user.businessDetails.description}
                    </span>
                  </div>
                  {/* Website */}
                  <div className="flex items-center gap-2">
                    <Globe />
                    <a
                      href={user.businessDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all font-medium"
                    >
                      {user.businessDetails.website}
                    </a>
                  </div>
                  {/* Social Links */}
                  <div>
                    <div className="flex justify-end gap-4 mt-2">
                      <a
                        href={user.businessDetails.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus:outline-none"
                      >
                        <Badge className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-200 transition cursor-pointer shadow">
                          <Facebook className="w-5 h-5" />
                        </Badge>
                      </a>
                      <a
                        href={user.businessDetails.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus:outline-none"
                      >
                        <Badge className="bg-pink-100 text-pink-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-pink-200 transition cursor-pointer shadow">
                          <Instagram className="w-5 h-5" />
                        </Badge>
                      </a>
                      <a
                        href={user.businessDetails.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus:outline-none"
                      >
                        <Badge className="bg-sky-200 text-sky-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-sky-300 transition cursor-pointer shadow">
                          <Twitter className="w-5 h-5" />
                        </Badge>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg dark:bg-secondary bg-white rounded-2xl mt-4">
                <CardHeader>
                  <CardTitle className="text-slate-500 text-lg font-semibold">
                    Bank Details
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-sm text-slate-500 dark:text-gray-400 space-y-1">
                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <p className="font-bold text-slate-500">OIB:</p>
                    <p className=" text-gray-800 dark:text-white">
                      {user.bankDetails?.oib || "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <p className="font-bold text-slate-500">IBAN:</p>
                    <p className=" text-gray-800 dark:text-white">
                      {user.bankDetails?.iban || "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <p className="font-bold text-gray-500">
                      Bank Account Name:
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {user.bankDetails?.bankAccountName || "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <p className="font-bold text-gray-500">
                      Representative Full Name:
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {user.bankDetails?.representativeFullName || "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <p className="font-bold text-gray-500">Address:</p>
                    <p className=" text-gray-800 dark:text-white">
                      {user.bankDetails?.address || "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <p className="font-bold text-gray-500">Postal Code:</p>
                    <p className=" text-gray-800 dark:text-white">
                      {user.bankDetails?.postalCode || "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <p className="font-bold text-gray-500">City:</p>
                    <p className=" text-gray-800 dark:text-white">
                      {user.bankDetails?.city || "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <p className="font-bold text-gray-500">Country:</p>
                    <p className=" text-gray-800 dark:text-white">
                      {user.bankDetails?.country || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full max-w-4xl bg-white dark:bg-secondary mt-6 mb-6 shadow-sm hover:shadow-md transition rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-muted-foreground text-lg font-semibold">
                    Event Details
                  </CardTitle>
                </CardHeader>
                <CardContent className=" ">
                  {/* Left: Event Info */}
                  <div className="space-y-2 flex flex-col justify-center">
                    <h2 className="text-2xl font-extrabold text-primary mb-1">
                      Tech Summit 2025
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-5 h-5" />
                      <span className="font-medium">Expo Center, Lahore</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-5 h-5" />
                      <span className="font-medium">By: InnovateX</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="w-5 h-5" />
                      <span className="font-medium">
                        Aug 1, 2025 – Aug 3, 2025
                      </span>
                    </div>
                  </div>
                  {/* Right: Stats + CTA */}
                  <div className="flex flex-col  items-start mt-3 gap-4 text-sm">
                    <div className="space-y-2 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        <span>
                          <span className="font-medium">Budget:</span>{" "}
                          <strong className="text-foreground">$5000</strong>
                        </span>
                      </div>
                      <div className="flex items- gap-2">
                        <UserRound className="w-5 h-5" />
                        <span>
                          <span className="font-medium">Attendees:</span>{" "}
                          <strong className="text-foreground">1500</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        <span>
                          <span className="font-medium">Region:</span>{" "}
                          <strong className="text-foreground">
                            North America
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {userType === "user" && (
            <Card className="mt-4 shadow-lg dark:bg-secondary">
              <CardHeader>
                <h1 className="text-slate-500 font-semibold">CATEGORIES</h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {userTags.map((item, index) => (
                    <Badge
                      key={index}
                      className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-2 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          )}

          {/* tags */}
          {userType === "user" && (
            <Card className="mt-4 shadow-lg dark:bg-secondary">
              <CardHeader>
                <h1 className="text-slate-500 font-semibold">TAGS</h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {userTags.map((item, index) => (
                    <Badge
                      key={index}
                      className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-2 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          )}

          {/* venue tag */}
          {userType === "user" && (
            <Card className="mt-4 shadow-lg dark:bg-secondary">
              <CardHeader>
                <h1 className="text-slate-500 font-semibold">VENUE TYPE</h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {venueTypes.map((item, index) => (
                    <Badge
                      key={index}
                      className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-2 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          )}

          <Card className="shadow-lg dark:bg-secondary gap-y-0 mt-4">
            <CardHeader className="">
              <h3 className="mb-2 text-lg font-semibold text-slate-500 ">
                Wallet Information
              </h3>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-xl flex items-center gap-2">
                <strong className="text-slate-500 ">Balance:</strong>{" "}
                <span className="text-3xl font-bold">$95.00</span>
              </p>
              <p>
                <strong className="text-slate-500 ">
                  Recent Transactions:
                </strong>{" "}
                See more go to transaction tab
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 col-span-12">
          <Card className="mt-4 shadow-lg rounded-2xl bg-white dark:bg-[#1a1a1a]">
            <CardHeader>
              <h1 className="text-xl font-semibold text-slate-500 dark:text-slate-500">
                User Interactions
              </h1>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {interactions.map((item, index) => (
                  <m.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="p-5 sm:p-6 border border-muted dark:bg-muted/50 shadow-md rounded-xl transition-all duration-300 hover:shadow-lg cursor-pointer">
                      <div className="flex flex-col items-center gap-4">
                        <div className="bg-muted rounded-full p-2">
                          {item.icon}
                        </div>
                        <div className="text-center">
                          <h2 className="text-sm text-nowrap text-muted-foreground">
                            {item.label}
                          </h2>
                          <p className="text-2xl font-extrabold text-primary">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </m.div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* timeline  */}

          <Card className="mt-4 shadow-lg dark:bg-secondary">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-500 ">
                Loyalty Program Participation
              </h3>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong className="text-slate-500 ">Clubs:</strong> Premium
                Club, EventPlus
              </p>
              <p>
                <strong className="text-slate-500 ">Tier & Points:</strong> Gold
                (1,200 pts), Silver (600 pts)
              </p>
              <p>
                <strong className="text-slate-500 ">Global Points:</strong>{" "}
                1,800 pts
              </p>
              <p>
                <strong className="text-slate-500 ">Redeemed:</strong> $40 worth
                in last 30 days
              </p>
            </CardContent>
          </Card>

          {userType === "user" && (
            <Card className="mt-4 shadow-lg dark:bg-secondary">
              <CardHeader>
                <h1 className="text-slate-500 font-semibold">
                  FOLLOWED ORGANIZATION
                </h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {orgTags.map((item, index) => (
                    <Badge
                      key={index}
                      className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-2 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          )}

          {userType === "user" && (
            <Card className="mt-4 shadow-lg dark:bg-secondary">
              <CardHeader>
                <h1 className="text-slate-500 font-semibold">
                  FOLLOWED EVENTS
                </h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {eventTags.map((item, index) => (
                    <Badge
                      key={index}
                      className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-2 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOverView;
