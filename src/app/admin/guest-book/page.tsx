"use server";
import { PrimaryLink } from "@/components/Link";
import { UserManager } from "@/modules/Admin";
import {
  getAllGuestData,
  setGuestIsAttending,
  updateGuestIsAttending,
} from "@/modules/Admin/GuestBookService";
import { AdminPanel } from "@/modules/Admin/components/AdminPanel";
import { Navbar } from "@/modules/Admin/components/Navbar";

type AdminProps = {};

export default async function GuestBookAdmin(_: AdminProps) {
  const userManager = UserManager.createUserManagerUsingEnvVariable();
  const user = userManager.getCurrentUser();
  const userToken = user?.token;

  if (!user || !userManager.isValidToken(userToken)) {
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
        <PrimaryLink href="/admin/guest-book">Return Home</PrimaryLink>
      </div>
    );
  }
  // @wisnuprama - temporary limit for testing purpose. TODO: Remove before the event.
  const TEMP_LIMIT = 10;
  const listData =
    user.role === "edit"
      ? guestListResponse.data.slice(0, TEMP_LIMIT)
      : guestListResponse.data;

  return (
    <main>
      <Navbar username={user.username} />
      <AdminPanel
        userRole={user.role}
        guestListData={listData}
        sendScannerResult={updateGuestIsAttending}
        setManualAttendance={setGuestIsAttending}
      />
    </main>
  );
}
