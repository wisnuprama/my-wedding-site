import { Language } from "./Language";

export const NAVBAR_HEIGHT = 24;

export function Navbar() {
  return (
    <div
      className="flex justify-end py-1 px-2"
      style={{ maxHeight: NAVBAR_HEIGHT }}
    >
      <Language />
    </div>
  );
}
