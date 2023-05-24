import SpotifyWebApi from "spotify-web-api-node";
import * as dotenv from "dotenv";

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
if (!clientId || !clientSecret || !refreshToken)
  throw Error("Missing Spotify credentials");

export const spotifyApi = new SpotifyWebApi();

spotifyApi.setCredentials({
  clientId,
  clientSecret,
  refreshToken,
});

const refreshAccessToken = async () => {
  const tokens = await spotifyApi.refreshAccessToken();
  spotifyApi.setAccessToken(tokens.body.access_token);
  console.log("Spotify token refreshed!");
};
setInterval(refreshAccessToken, 5400000); // every 1h30min
refreshAccessToken();
