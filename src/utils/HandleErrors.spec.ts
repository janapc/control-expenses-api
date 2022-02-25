import { HandleErrors } from "./HandleErrors";

describe("HandleErrors utils", () => {
  it("Should return error structured", () => {
    const error = new HandleErrors(400, "The name field is required");

    expect(error.code).toEqual(400);
    expect(error.message).toEqual("The name field is required");
  });
});
