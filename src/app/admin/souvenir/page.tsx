import { PrimaryLink } from "@/components/Link";
import { UserManager } from "@/modules/Admin";
import { Scanner } from "@/modules/Admin/components/Scanner";

type AdminProps = {};

export default function SouvenirAdmin(_: AdminProps) {
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
      <div className="flex">
        <Scanner />
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";
