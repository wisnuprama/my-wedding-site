import { useContext, useMemo } from "react";
import { RSVPContext } from ".";

export function useRSVPMessage() {
  const rsvp = useContext(RSVPContext);

  const name = rsvp.isValidRSVP ? rsvp.data.name : "";
  const message = rsvp.isValidRSVP ? rsvp.data.message : "";

  return useMemo(() => {
    if (!message) {
      return null;
    }
    return message.replaceAll("$nm", name);
  }, [name, message]);
}
