import { Connection } from "typeorm";

import { gCall } from "../../../test-utils/gCall";
import { testConnection } from "../../../test-utils/testConnection";

let conn: Connection;
beforeAll(async () => {
  conn = await testConnection();
});
afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation {
  register(
    data: {
      firstName: "pratik"
      lastName: "dey"
      password: "1"
      email: "pratik7@pratik.com"
    }
  ) {
    id
    firstName
    lastName
    name
    email
  }
}
`;

describe("RegisterResolver", () => {
  it("create user", async () => {
    console.log(
      await gCall({
        source: registerMutation,
        variableValues: {
          data: {
            firstName: "bob",
            lastName: "booba",
            email: "bob@bob.com",
            password: "1234",
          },
        },
      })
    );
  });
});
