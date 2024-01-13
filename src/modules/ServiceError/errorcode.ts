/**
 * Service error code starts with 9
 */
export enum ServiceErrorCode {
  OK = 0,
  FAILED_TO_DETERMINE_RSVP_STATUS = 91,
  RSVP_NOT_FOUND = 92,
  FAILED_TO_UPDATE_GUEST_ATTENDANCE = 94,
  FAILED_TO_CREATE_WISH = 95,
}
