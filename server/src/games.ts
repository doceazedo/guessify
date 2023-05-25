import { createId } from "@paralleldrive/cuid2";
import { getRoom, updateRoom } from "./rooms";
import { sleep } from "./utils";
import { Server } from "socket.io";
import { getTriviaQuestion } from "./trivias";
import { getPlayerRoomID } from "./rooms";

type Game = {
  id: string;
  round: number;
  state: "warmup" | "guessing" | "answer" | "end";
  guesses: {
    playerID: string;
    option: string;
    date: Date;
  }[];
};

const games = new Map<string, Game>();

const WARMUP_SECONDS = 6;
const GUESSING_SECONDS = 15;

export const startGame = async (io: Server, roomID: string) => {
  const room = getRoom(roomID);
  createGame(roomID);

  if (!room.triviaID)
    throw Error(
      `Could not start game on room "${roomID}": there is not trivia yet`
    );

  const startsAt = new Date();
  startsAt.setSeconds(startsAt.getSeconds() + WARMUP_SECONDS);

  io.to(roomID).emit("game:warmup", { startsAt });
  await sleep(WARMUP_SECONDS * 1000);

  const question = getTriviaQuestion(room.triviaID, 0);
  io.to(roomID).emit("game:guessing", {
    question: {
      type: question.type,
      preview: question.track.preview,
      options: question.options,
    },
  });
  await sleep(GUESSING_SECONDS * 1000);
  io.to(roomID).emit("game:answer", {
    track: question.track,
    scores: [], // TODO: pontuar
  });
};

const createGame = (roomID: string) => {
  const gameID = createId();
  games.set(gameID, {
    id: gameID,
    round: 0,
    state: "warmup",
    guesses: [],
  });

  updateRoom(roomID, { gameID });
};

export const getGame = (id: string) => {
  const game = games.get(id);
  if (!game) throw Error(`Could not find game "${id}"`);
  return game;
};

export const updateGame = (id: string, data: Partial<Game>) => {
  const game = games.get(id);
  if (!game) throw Error(`Could not update game: game "${id}" not found`);

  games.set(id, {
    ...game,
    ...data,
  });
};

export const guess = (io: Server, playerID: string, option: string) => {
  const roomID = getPlayerRoomID(playerID);
  const room = getRoom(roomID);
  if (!room.gameID) throw Error(`Room "${roomID}" is not in a game`);
  const game = getGame(room.gameID);

  const hasGuessed = !!game.guesses.find((x) => x.playerID === playerID);
  if (hasGuessed) throw Error(`Player "${playerID}" has already guessed`);

  const playerGuess = {
    playerID,
    option,
    date: new Date(),
  };
  game.guesses.push(playerGuess);

  updateGame(room.gameID, game);

  io.to(roomID).emit("player-guess", { guess: playerGuess });
};
