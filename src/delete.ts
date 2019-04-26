import {TwitterToken} from './auth';
import {Tweet} from './timeline';
import {post} from 'request-promise';

function deleteEndpoint(id: number) {
  return `https://api.twitter.com/1.1/statuses/destroy/${id}.json`;
}

function makeRequestOptions(token: TwitterToken, tweet: Tweet) {
  return {
    url: deleteEndpoint(tweet.id),
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
    json: true,
  };
}

export async function deleteTweet(
  token: TwitterToken,
  tweet: Tweet,
): Promise<boolean> {
  const options = makeRequestOptions(token, tweet);

  return post(options)
    .then(_ => true)
    .catch((error: any) => {
      console.error(error);
      throw new Error(error);
    });
}
