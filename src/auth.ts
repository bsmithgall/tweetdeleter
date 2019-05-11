import {post} from 'request-promise';

const TOKEN_ENDPOINT = 'https://api.twitter.com/oauth2/token';

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

function makeAuthentication(creds: ApiCredentials): string {
  return Buffer.from(`${creds.key}:${creds.secret}`).toString('base64');
}

export async function getToken(creds: ApiCredentials): Promise<TwitterToken> {
  return post({
    url: TOKEN_ENDPOINT,
    headers: {
      Authorization: `Basic ${makeAuthentication(creds)}`,
    },
    form: {
      grant_type: 'client_credentials',
    },
    json: true,
  })
    .then((token: object) => {
      console.log('Got access token for user');
      return token as TwitterToken;
    })
    .catch((error: any) => {
      console.log(error);
      throw new Error(error);
    });
}
