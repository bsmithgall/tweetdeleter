import crypto from "crypto";
import axios from "axios";
import OAuth from "oauth-1.0a";

const TOKEN_ENDPOINT = "https://api.twitter.com/oauth2/token";

export interface ApiCredentials {
  readonly key: string;
  readonly secret: string;
  readonly token: string;
  readonly tokenSecret: string;
}

export interface TwitterToken {
  readonly token_type: string;
  readonly access_token: string;
}

export interface AppConfiguration {
  readonly token: TwitterToken;
  readonly username: string;
  readonly oldestTweet: number;
  readonly downloadLocation: string;
  readonly dryRun: boolean;
  readonly credentials: ApiCredentials;
}

export const getOauth = (key: string, secret: string): OAuth => {
  let oauth: OAuth | undefined;
  if (oauth !== undefined) {
    return oauth;
  }

  oauth = new OAuth({
    consumer: { key, secret },
    signature_method: "HMAC-SHA1",
    hash_function: (base_string, key) => {
      return crypto
        .createHmac("sha1", key)
        .update(base_string)
        .digest("base64");
    },
  });

  return oauth;
};

export const getOauthHeader = (
  creds: ApiCredentials,
  request: OAuth.RequestOptions
): { Authorization: string } => {
  const oauth = getOauth(creds.key, creds.secret);
  return oauth.toHeader(
    oauth.authorize(request, { key: creds.token, secret: creds.tokenSecret })
  );
};

function makeAuthentication(creds: ApiCredentials): string {
  return Buffer.from(`${creds.key}:${creds.secret}`).toString("base64");
}

export async function getToken(creds: ApiCredentials): Promise<TwitterToken> {
  return axios
    .post(TOKEN_ENDPOINT, undefined, {
      headers: { Authorization: `Basic ${makeAuthentication(creds)}` },
      params: { grant_type: "client_credentials" },
    })
    .then((resp) => {
      console.log("Got access token for user");
      return resp.data as TwitterToken;
    })
    .catch((error: any) => {
      console.log(error);
      throw new Error(error);
    });
}
