export class RSVPFormDTO {
  readonly actualPax: number | undefined;
  readonly willAttend: boolean | undefined;
  readonly accessibility?: string | undefined;

  constructor(actualPax: number, willAttend: boolean, accessibility: string) {
    this.actualPax = actualPax;
    this.willAttend = willAttend;
    this.accessibility = accessibility;
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

    return {
      actualPax: this.actualPax,
      willAttend: this.willAttend,
      accessibility: this.accessibility,
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
