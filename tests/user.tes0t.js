const { getFirstName, isValidPassword } = require("../src/utils/user");

test("Should extract first name", () => {
  const firstName = getFirstName("Halil Azy");

  // if (firstName !== "Halil") {
  //   throw new Error("Expected the string Halil");
  // }
  expect(firstName).toBe("Halil");
});

test("Should reject passwords shorter than 8 chars", () => {
  expect(isValidPassword("halo123")).toBe(false);
});

test("Should reject passwords contain the word password", () => {
  expect(isValidPassword("halopassword00")).toBe(false);
});
