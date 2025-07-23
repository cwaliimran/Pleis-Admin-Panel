"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const user = useSelector((state: RootState) => state.userSlice.user);
  const router = useRouter();

  const handleGoToDashboard = () => {
    if (user?.role === "superAdmin") {
      router.push("/super-admin");
    } else if (user?.role === "organizer") {
      router.push("/organizer/dashboard");
    } else {
      router.push("/user/signIn");
    }
  };

  return (
    <>
      <section className="bg-white min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              404
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              Something's missing.
            </p>
            <p className="mb-4 text-md font-light text-gray-600 dark:text-gray-400">
              You don't have permission to access this area.
            </p>
            <Button
              onClick={handleGoToDashboard}
              variant="default"
              className="cursor-pointer"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
