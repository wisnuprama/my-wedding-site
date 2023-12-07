import invariant from "invariant";

export class RSVPFormDTO {
  constructor(
    public readonly actualPax: any | null | undefined,
    public readonly willAttend: any | null | undefined,
    public readonly accessibility?: string | null | undefined,
    public readonly wishMessage?: string | null | undefined,
  ) {
    this.actualPax = actualPax;
    this.willAttend = willAttend;
    this.accessibility = accessibility;
    this.wishMessage = wishMessage;
  }

  private object: {
    actualPax: number;
    willAttend: boolean;
    accessibility: string | null | undefined;
    wishMessage: string | null | undefined;
  } | null = null;

  // TODO: estabilish validation framework
  public validate() {
    const actualPax = parseInt(this.actualPax, 10);

    if (isNaN(actualPax) || this.actualPax < 0) {
      throw new Error("Actual pax cannot be negative");
    }

    const acceptableAccessibilities = ["Chair for Elderly"];

    if (
      this.accessibility &&
      !acceptableAccessibilities.includes(this.accessibility)
    ) {
      throw new Error("Does not recognize the given accessibility");
    }

    const willAttend = this.willAttend === "true";

    this.object = {
      actualPax,
      willAttend,
      accessibility: this.accessibility,
      wishMessage: this.wishMessage,
    };
  }

  toObject() {
    invariant(this.object, "Call `validate` before calling `toObject`");
    return this.object;
  }
}
