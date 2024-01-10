"use server";
import { PrimaryLink } from "@/components/Link";
import { UserManager } from "@/modules/Admin";
import { updateGuestIsCollectingSouvenir } from "@/modules/Admin/GuestBookService";
import { AdminPanel } from "@/modules/Admin/components/AdminPanel";
import { Navbar } from "@/modules/Admin/components/Navbar";

type AdminProps = {};

export default async function AttendanceAdmin(_: AdminProps) {
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

  return (
    <main className="m-0 p-0">
      <Navbar />
      <h1 className="text-2xl text-center underline mb-5">
        Souvenir Collection
      </h1>
      <AdminPanel
        spreadsheetId={process.env.GOOGLE_DOCUMENT_ID as string}
        sendResult={updateGuestIsCollectingSouvenir}
      />
    </main>
  );
}
