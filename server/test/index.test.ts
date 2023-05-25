import { afterAll, assert, beforeAll, describe, expect, it } from "vitest";
import { io } from "socket.io-client";
import * as dotenv from "dotenv";

dotenv.config();

const port = parseInt(process.env.PORT || "3000");

describe("websocket server", () => {
  let client;

  beforeAll(
    () =>
      new Promise<void>((done) => {
        client = io(`ws://localhost:${port}`);
        client.on("connect", done);
      })
  );

  afterAll(() => {
    client.close();
  });

  it("should ping", () =>
    new Promise<void>((done) => {
      client.emit("ping", (resp) => {
        assert.isTrue(resp.ok);
        done();
      });
    }));

  it("should join room as Doce", () =>
    new Promise<void>((done) => {
      const nickname = "Doce";
      client.emit("join-room", { nickname }, (resp) => {
        expect(resp.roomID).toBeTruthy();
        done();
      });
    }));

  it("should set playlist to 9TEEN", () =>
    new Promise<void>((done) => {
      const playlistID = "2EYAln0twfPbpVQmOhYHVH";
      client.emit("set-playlist", { playlistID }, (resp) => {
        assert.isTrue(resp.ok);
        done();
      });
    }));
});
