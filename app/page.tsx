import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Link href={"/organizer/dashboard"}>
      <Button className="bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer">
        Go to Organizer Dashboard
      </Button>
      </Link>
    </div>
  );
}
