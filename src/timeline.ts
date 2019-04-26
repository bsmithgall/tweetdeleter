import {TwitterToken} from './auth';
import {get} from 'request-promise';

const TIMELINE_ENDPOINT =
  'https://api.twitter.com/1.1/statuses/user_timeline.json';

export interface Tweet {
  createdAt: Date;
  id: number;
  user: number;
  text: string;
}

interface JsonTweet {
  text: string;
  created_at: string;
  id: number;
  user: {id: number};
}

function makeRequestOptions(
  token: TwitterToken,
  username: string,
  maxId?: number,
) {
  return {
    url: TIMELINE_ENDPOINT,
    qs: {
      screen_name: username,
      count: 200,
      include_rts: true,
      trim_user: true,
      // if we are passed a maxId, forward it into the
      // query string
      ...(maxId && {max_id: maxId}),
    },
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
    json: true,
  };
}

export async function getTimeline(
  token: TwitterToken,
  username: string,
  maxId?: number,
): Promise<Array<Tweet>> {
  const options = makeRequestOptions(token, username, maxId);

  return get(options)
    .then((jsonTweets: Array<JsonTweet>) => {
      console.log(`fetched ${jsonTweets.length} tweets from maxId ${maxId}`);
      return jsonTweets.map(t => ({
        createdAt: new Date(t.created_at),
        id: t.id,
        user: t.user.id,
        text: t.text,
      }));
    })
    .catch((error: any) => {
      console.error(error);
      throw new Error(error);
    });
}
