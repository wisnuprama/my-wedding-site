import { ServiceErrorCode } from "./errorcode";

export class ServiceError extends Error {
  constructor(
    public readonly error: ServiceErrorCode,
    public readonly errorMsg?: string,
  ) {
    super(errorMsg);
  }

  toObject() {
    return {
      error: this.error,
      errorMsg: this.errorMsg,
    };
  }
}

export { ServiceErrorCode };
