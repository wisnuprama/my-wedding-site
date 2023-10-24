import { NON_STATIC_RUNTIME } from "@/config";
import { Scanner } from "./components/Scanner";
import { redirect } from "next/navigation";

export const runtime = NON_STATIC_RUNTIME;

const PASSWORD = process.env.ADMIN_PASSWORD;

type AdminProps = {
  searchParams?: {
    p?: string;
  };
};

export default function Admin({ searchParams }: AdminProps) {
  if (searchParams?.p !== PASSWORD) {
    redirect("/");
  }

  return (
    <main className="p-16">
      <div className="flex justify-center">
        <Scanner />
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";
