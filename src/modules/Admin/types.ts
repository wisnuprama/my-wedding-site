export type GuestData = {
  id: string;
  name: string;
  pax: number;
  vip: boolean;
  rsvpDone?: boolean;
  willAttend?: boolean;
  hasCollectedSouvenir?: boolean;
  isAttending?: boolean;
  reason?: string;
};
