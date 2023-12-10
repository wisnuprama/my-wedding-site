import { PrimaryLink } from "@/components/Link";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <p className="text-2xl mb-4">Not Found</p>
      <PrimaryLink href="/">Return Home</PrimaryLink>
    </div>
  );
}
