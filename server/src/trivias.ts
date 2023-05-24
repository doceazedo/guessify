import { createId } from "@paralleldrive/cuid2";
import { spotifyApi } from "./spotify";
import { rooms } from "./rooms";

type Item = {
  id: string;
  name: string;
};

type Track = {
  track: Item;
  artist: Item;
  preview: string;
  cover: string;
};

type Question = {
  type: "title" | "artist";
  track: Track;
  options: Item[];
  answer: string;
};

const trivias = new Map<string, Question[]>();

export const setTrivia = async (roomID: string, playlistID: string) => {
  const questions = await getQuestionsFromPlaylist(playlistID);
  const triviaID = createId();
  trivias.set(triviaID, questions);

  const room = rooms.get(roomID);
  if (!room) throw Error(`Room "${roomID}" not found`);

  rooms.set(roomID, {
    ...room,
    triviaID,
  });
  console.log({
    trivia: questions,
    room: {
      ...room,
      triviaID,
    },
  });
};

const questionTypes = ["title", "artist"] as const;

const getQuestionsFromPlaylist = async (playlistID: string) => {
  const resp = await spotifyApi.getPlaylist(playlistID);
  const tracks = resp.body.tracks.items
    .map((item) => {
      if (!item.track || !item.track.preview_url) return null;
      return {
        track: {
          id: item.track.id,
          name: item.track.name,
        },
        artist: {
          id: item.track.artists[0].id,
          name: item.track.artists[0].name,
        },
        preview: item.track.preview_url,
        cover: item.track.album.images[0].url,
      };
    })
    .filter((item) => !!item) as Track[];
  const questions: Question[] = tracks.map((track) => {
    const type =
      questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const answer = type == "title" ? track.track : track.artist;

    const otherArtistTracks = tracks
      .filter((x) => x.artist.id != track.artist.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const otherAnswers =
      type == "title"
        ? otherArtistTracks.map((x) => x.track)
        : otherArtistTracks.map((x) => x.artist);

    return {
      type,
      track,
      options: [answer, ...otherAnswers].sort(() => Math.random() - 0.5),
      answer: answer.id,
    };
  });
  return questions;
};
