import { Server } from "socket.io";
import * as dotenv from "dotenv";
import { getPlayerRoomID, joinRoom } from "./rooms";
import { setTrivia } from "./trivias";
import { guess, startGame } from "./games";

type JoinRoomPayload = {
  nickname: string;
  roomID: string;
};

type SetPlaylistPayload = {
  playlistID: string;
};

type GuessPayload = {
  optionID: string;
};

dotenv.config();

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
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
        score: 0,
      },
      payload.roomID
    );
    console.log(
      `✅ ${socket.id} joined room "${room.id}" as "${payload.nickname}"`
    );

    const members = room.data.members.map((x) => ({
      id: x.socket.id,
      nickname: x.nickname,
      score: x.score,
    }));

    callback({ roomID: room.id, members, ownerID: room.data.ownerID });
  });

  socket.on("set-playlist", async (payload: SetPlaylistPayload, callback) => {
    const roomID = getPlayerRoomID(socket.id);
    await setTrivia(roomID, payload.playlistID);
    callback({ ok: true });
  });

  socket.on("start", (callback) => {
    const roomID = getPlayerRoomID(socket.id);
    startGame(io, roomID);
    callback({ ok: true });
  });

  socket.on("guess", (payload: GuessPayload, callback) => {
    guess(io, socket.id, payload.optionID);
  });
});

const port = parseInt(process.env.PORT || "3000");
io.listen(port);
console.log(`Server running on ws://localhost:${port}`);
