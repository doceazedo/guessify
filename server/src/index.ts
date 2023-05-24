import { Server } from "socket.io";
import * as dotenv from "dotenv";
import { joinRoom, playerRooms } from "./rooms";
import { setTrivia } from "./trivias";

type JoinRoomPayload = {
  nickname: string;
  roomID: string;
};

type SetPlaylistPayload = {
  playlistID: string;
};

dotenv.config();

const io = new Server({
  /* options */
});

io.on("connection", (socket) => {
  socket.on("ping", (callback) => {
    console.log(`🏓 ${socket.id} just pinged`);
    callback({ ok: true });
  });

  socket.on("join-room", (payload: JoinRoomPayload, callback) => {
    const room = joinRoom(
      {
        nickname: payload.nickname,
        socket,
      },
      payload.roomID
    );
    console.log(
      `✅ ${socket.id} joined room "${room.id}" as "${payload.nickname}"`
    );
    callback({ ok: true });
  });

  socket.on("set-playlist", async (payload: SetPlaylistPayload, callback) => {
    const roomID = playerRooms.get(socket.id);
    if (!roomID) throw Error(`Player ${socket.id} is not in a room`);

    await setTrivia(roomID, payload.playlistID);
    callback({ ok: true });
  });
});

const port = parseInt(process.env.PORT || "3000");
io.listen(port);
console.log(`Server running on ws://localhost:${port}`);
