import { describe, expect, test, beforeAll } from "@jest/globals";
import request from "supertest";

const API_URL = "http://localhost:8000";
let authToken = "";
let pgdb: any;
let mongo: any;

async function setupDatabase() {
  try {
    // postgres
    pgdb.begin();
    //

    // mongo
    mongo.startSession();
  } catch (error) {
    throw error;
  }
}
async function cleanupDatabase() {
  try {
    db.rollback();

    mongo.rollBack();
  } catch (error) {
    throw error;
  }
}
beforeAll(async () => {
  await setupDatabase();
  // Get auth token for protected routes
  const response = await request(API_URL)
    .post("/v1/signin")
    .send({ username: "testuser", password: "testpass" });
  authToken = response.body.token;
});

describe("Auth Endpoints", () => {
  test("POST /v1/signin returns 200", async () => {
    const response = await request(API_URL)
      .post("/v1/signin")
      .send({ username: "testuser", password: "testpass" });
    expect(response.status).toBe(200);
  });
});

describe("User Endpoints", () => {
  test("GET /v1/me returns 200", async () => {
    const response = await request(API_URL)
      .get("/v1/me")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  test("GET /v1/user returns 200", async () => {
    const response = await request(API_URL)
      .get("/v1/user")
      .query({ query: "test" });
    expect(response.status).toBe(200);
  });
});

describe("Friends Endpoints", () => {
  test("GET /v1/me/friends returns 200", async () => {
    const response = await request(API_URL)
      .get("/v1/me/friends")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  test("GET /v1/me/friend/requests/received returns 200", async () => {
    const response = await request(API_URL)
      .get("/v1/me/friend/requests/received")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  test("POST /v1/me/friend/request returns 200", async () => {
    const response = await request(API_URL)
      .post("/v1/me/friend/request")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId: "testUserId" });
    expect(response.status).toBe(200);
  });

  test("POST /v1/me/friend/add returns 200", async () => {
    const response = await request(API_URL)
      .post("/v1/me/friend/add")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ requestId: "testRequestId" });
    expect(response.status).toBe(200);
  });
});

describe("Rooms Endpoints", () => {
  test("GET /v1/me/groups returns 200", async () => {
    const response = await request(API_URL)
      .get("/v1/me/groups")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  test("POST /v1/room/oneone returns 200", async () => {
    const response = await request(API_URL)
      .post("/v1/room/oneone")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId: "testUserId" });
    expect(response.status).toBe(200);
  });

  test("GET /v1/room/groups returns 200", async () => {
    const response = await request(API_URL)
      .get("/v1/room/groups")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  test("GET /v1/room/groups/{id} returns 200", async () => {
    const response = await request(API_URL)
      .get("/v1/room/groups/testGroupId")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  test("POST /v1/room/group/join returns 200", async () => {
    const response = await request(API_URL)
      .post("/v1/room/group/join")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ groupId: "testGroupId" });
    expect(response.status).toBe(200);
  });

  test("POST /v1/room/group/create returns 200", async () => {
    const response = await request(API_URL)
      .post("/v1/room/group/create")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "Test Group" });
    expect(response.status).toBe(200);
  });

  test("POST /v1/room/msg returns 200", async () => {
    const response = await request(API_URL)
      .post("/v1/room/msg")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ roomId: "testRoomId" });
    expect(response.status).toBe(200);
  });
});

describe("Themes Endpoints", () => {
  test("POST /v1/theme returns 200", async () => {
    const response = await request(API_URL)
      .post("/v1/theme")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "Test Theme" });
    expect(response.status).toBe(200);
  });

  test("DELETE /v1/themes/{id} returns 200", async () => {
    const response = await request(API_URL)
      .delete("/v1/themes/testThemeId")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  test("GET /v1/me/themes returns 200", async () => {
    const response = await request(API_URL)
      .get("/v1/me/themes")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  test("POST /v1/themes/{id}/apply returns 200", async () => {
    const response = await request(API_URL)
      .post("/v1/themes/testThemeId/apply")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });
});

describe("Marketplace Endpoints", () => {
  test("POST /v1/themes/{id}/publish returns 200", async () => {
    const response = await request(API_URL)
      .post("/v1/themes/testThemeId/publish")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  test("GET /v1/market returns 200", async () => {
    const response = await request(API_URL)
      .get("/v1/market")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  test("POST /v1/themes/{id}/download returns 200", async () => {
    const response = await request(API_URL)
      .post("/v1/themes/testThemeId/download")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });
});
