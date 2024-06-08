import Link from "next/link";

export const NAVBAR_HEIGHT = 24;

export function Navbar() {
  return (
    <div
      className="flex justify-around py-1 px-2"
      style={{ maxHeight: NAVBAR_HEIGHT }}
    >
      <Link href="/admin/guest-book">Guest Book</Link>
      <Link href="/admin?logout=1">Logout</Link>
    </div>
  );
}
