import {ApiCredentials, TwitterToken} from './auth';
import {Tweet} from './timeline';
import {post} from 'request-promise';

function deleteEndpoint(id_str: string) {
  return `https://api.twitter.com/1.1/statuses/destroy/${id_str}.json`;
}

function makeRequestOptions(
  token: TwitterToken,
  credentials: ApiCredentials,
  tweet: Tweet,
) {
  return {
    url: deleteEndpoint(tweet.id_str),
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
    oauth: {
      consumer_key: credentials.key,
      consumer_secret: credentials.secret,
      token: credentials.token,
      token_secret: credentials.tokenSecret,
    },
    json: true,
  };
}

export async function deleteTweet(
  token: TwitterToken,
  credentials: ApiCredentials,
  tweet: Tweet,
): Promise<boolean> {
  const options = makeRequestOptions(token, credentials, tweet);

  return post(options)
    .then(_ => true)
    .catch((error: any) => {
      console.error("issue deleting tweet", tweet)
      console.error(error);
      throw new Error(error);
    });
}
