export class RSVPFormDTO {
  constructor(
    public readonly actualPax: number,
    public readonly willAttend: boolean,
    public readonly accessibility?: string | undefined,
    public readonly wishMessage?: string | undefined,
  ) {
    this.actualPax = actualPax;
    this.willAttend = willAttend;
    this.accessibility = accessibility;
    this.wishMessage = wishMessage;
  }

  // TODO: estabilish validation framework
  public validate() {
    if (!this.actualPax || this.actualPax < 0) {
      throw new Error("Actual pax cannot be negative");
    }

    const acceptableAccessibilities = ["wheelchair", "old", "other"];

    if (
      this.accessibility &&
      !acceptableAccessibilities.includes(this.accessibility)
    ) {
      throw new Error("Not an acceptable accessibility");
    }

    if (typeof this.willAttend !== "boolean") {
      throw new Error("Will attend must be a boolean");
    }

    if (typeof this.wishMessage !== "string") {
      throw new Error("Wishes must be a string");
    }

    return {
      actualPax: this.actualPax,
      willAttend: this.willAttend,
      accessibility: this.accessibility,
      wishMessage: this.wishMessage,
    };
  }

  toObject() {
    return {
      actualPax: this.actualPax,
      willAttend: this.willAttend,
      accessibility: this.accessibility,
    };
  }
}
