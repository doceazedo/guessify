import { Socket } from "socket.io";
import { init } from "@paralleldrive/cuid2";

type Player = {
  socket: Socket;
  nickname: string;
};

type Room = {
  members: Player[];
  ownerID: string;
  triviaID?: string;
};

export const rooms = new Map<string, Room>();
export const playerRooms = new Map<string, string>();

export const joinRoom = (player: Player, roomID?: string) => {
  roomID = roomID || createId();
  const room = createRoom(roomID, player);
  if (!room.members.find((member) => member.socket.id == player.socket.id)) {
    room.members.push(player);
    rooms.set(roomID, room);
  }
  playerRooms.set(player.socket.id, roomID);
  player.socket.join(roomID);
  return { data: room, id: roomID };
};

const createRoom = (id: string, player: Player) => {
  const existingRoom = rooms.get(id);
  if (existingRoom) return existingRoom;

  const roomData: Room = {
    members: [player],
    ownerID: player.socket.id,
  };
  rooms.set(id, roomData);
  return roomData;
};

const createId = init({ length: 5 });
