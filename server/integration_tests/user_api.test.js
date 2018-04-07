process.env.NODE_ENV = "integration";

const testDB = require("../test_helper/in_memory_mongodb_setup");
const fixtureLoader = require("../test_helper/fixtures");
const fixtures = require("../test_helper/fixtures").fixtures;
const request = require("supertest");
const app = require("../app");

beforeAll(testDB.setup);
beforeAll(fixtureLoader.load);

afterAll(testDB.teardown);

let jwtToken;

async function loginAsTom() {
  let email = fixtures.users.tom.email;
  let password = fixtures.users.tom.password;
  let response = await request(app)
    .post("/api/users/login")
    .send({ user: { email, password } });
  jwtToken = response.body.token;
}

describe("Accessing User API without login", () => {
  test("Get information on the current user", async () => {
    let response = await request(app).get("/api/user");
    expect(response.statusCode).toBe(401);
  });
  test("Update user profile", async () => {
    const newPicture = "new-picture";

    const updatedUser = {
      picture: newPicture
    };
    let response = await request(app)
      .put("/api/user")
      .send({ user: updatedUser });
    expect(response.statusCode).toBe(401);
  });
});

describe("Accessing User API after login", () => {
  beforeAll(loginAsTom);

  test("Get information on the current user", async () => {
    let response = await request(app)
      .get("/api/user")
      .set("Authorization", "Bearer " + jwtToken);
    let userJson = response.body.user;
    expect(response.statusCode).toBe(200);
    expect(userJson).toBeDefined();
    expect(userJson.email).toEqual(fixtures.users.tom.email);
  });

  test("Update user profile", async () => {
    const newPicture = "new-picture";

    const updatedUser = {
      picture: newPicture
    };
    let response = await request(app)
      .put("/api/user")
      .send({ user: updatedUser })
      .set("Authorization", "Bearer " + jwtToken);

    let userJson = response.body.user;
    expect(response.statusCode).toBe(200);
    expect(userJson).toBeDefined();
    expect(userJson.picture).toEqual(newPicture);
  });

  test("Update user profile with no user information", async () => {
    let response = await request(app)
      .put("/api/user")
      .send({})
      .set("Authorization", "Bearer " + jwtToken);
    expect(response.statusCode).toBe(422);
  });
});
