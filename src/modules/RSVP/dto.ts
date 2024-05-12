import invariant from "invariant";

export class RSVPFormDTO {
  constructor(
    public readonly actualPax: any | null | undefined,
    public readonly willAttend: any | null | undefined,
    public readonly wishMessage?: string | null | undefined,
  ) {
    this.actualPax = actualPax;
    this.willAttend = willAttend;
    this.wishMessage = wishMessage;
  }

  private object: {
    actualPax: number;
    willAttend: boolean;
    wishMessage: string | null | undefined;
  } | null = null;

  // TODO: estabilish validation framework
  public validate() {
    let actualPax = parseInt(this.actualPax, 10);

    if (isNaN(actualPax) || this.actualPax < 0) {
      throw new Error("Actual pax cannot be negative");
    }

    if (this.wishMessage && this.wishMessage.length > 500) {
      throw new Error("Wish message cannot be longer than 500 characters");
    }

    const willAttend = this.willAttend === "true";

    // if user not attending, set actualPax to 0 so it won't be counted
    // in the total pax.
    if (!willAttend) {
      actualPax = 0;
    }

    this.object = {
      actualPax,
      willAttend,
      wishMessage: this.wishMessage,
    };
  }

  toObject() {
    invariant(this.object, "Call `validate` before calling `toObject`");
    return this.object;
  }
}
