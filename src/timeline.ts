import { TwitterToken } from "./auth";
import axios, { AxiosRequestConfig } from "axios";

export const TWEETS_AT_ONCE = 200;

const TIMELINE_ENDPOINT =
  "https://api.twitter.com/1.1/statuses/user_timeline.json";

export interface Tweet {
  createdAt: Date;
  id: number;
  id_str: string;
  user: number;
  text: string;
}

interface JsonTweet {
  text: string;
  created_at: string;
  id: number;
  id_str: string;
  user: { id: number };
}

function makeRequestOptions(
  token: TwitterToken,
  username: string,
  maxId?: number
): AxiosRequestConfig {
  return {
    url: TIMELINE_ENDPOINT,
    method: "GET",
    params: {
      screen_name: username,
      count: TWEETS_AT_ONCE,
      include_rts: true,
      trim_user: true,
      // if we are passed a maxId, forward it into the
      // query string
      ...(maxId && { max_id: maxId }),
    },
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  };
}

export async function getTimeline(
  token: TwitterToken,
  username: string,
  maxId?: number
): Promise<Tweet[]> {
  const config = makeRequestOptions(token, username, maxId);

  return axios(config)
    .then((resp) => resp.data)
    .then((jsonTweets: JsonTweet[]) => {
      console.log(`fetched ${jsonTweets.length} tweets from maxId ${maxId}`);
      return jsonTweets.map((t) => ({
        createdAt: new Date(t.created_at),
        id: t.id,
        id_str: t.id_str,
        user: t.user.id,
        text: t.text,
      }));
    })
    .catch((error: any) => {
      console.error(error);
      throw new Error(error);
    });
}
