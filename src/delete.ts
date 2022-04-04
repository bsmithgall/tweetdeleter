import { ApiCredentials, getOauthHeader } from "./auth";
import { Tweet } from "./timeline";
import axios, { AxiosRequestConfig } from "axios";

function deleteEndpoint(id_str: string) {
  return `https://api.twitter.com/1.1/statuses/destroy/${id_str}.json`;
}

function makeRequestOptions(
  credentials: ApiCredentials,
  tweet: Tweet
): AxiosRequestConfig {
  const url = deleteEndpoint(tweet.id_str);
  return {
    url,
    method: "POST",
    headers: getOauthHeader(credentials, { url, method: "POST" }),
  };
}

export async function deleteTweet(
  credentials: ApiCredentials,
  tweet: Tweet
): Promise<boolean> {
  const config = makeRequestOptions(credentials, tweet);
  return axios(config)
    .then((_) => true)
    .catch((error: unknown) => {
      console.error("issue deleting tweet", tweet);
      console.error(error);
      throw new Error();
    });
}
