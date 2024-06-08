"use server";
import { PrimaryLink } from "@/components/Link";
import { UserManager } from "@/modules/Admin";
import {
  getAllGuestData,
  updateGuestIsAttending,
} from "@/modules/Admin/GuestBookService";
import { AdminPanel } from "@/modules/Admin/components/AdminPanel";
import { Navbar } from "@/modules/Admin/components/Navbar";

type AdminProps = {};

export default async function GuestBookAdmin(_: AdminProps) {
  const userManager = UserManager.createUserManagerUsingEnvVariable();
  const userToken = userManager.getCurrentUser()?.token;

  if (!userManager.isValidToken(userToken)) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <p className="text-2xl mb-4">Not Found</p>
        <PrimaryLink href="/">Return Home</PrimaryLink>
      </div>
    );
  }

  const guestListResponse = await getAllGuestData();

  if (guestListResponse.status === "error") {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <p className="text-2xl mb-4">
          {guestListResponse.message}, report to dev on duty
        </p>
        <PrimaryLink href="/">Return Home</PrimaryLink>
      </div>
    );
  }

  return (
    <main className="m-0 p-0 h-screen">
      <Navbar />
      <AdminPanel
        guestListData={guestListResponse.data}
        sendResult={updateGuestIsAttending}
      />
    </main>
  );
}
