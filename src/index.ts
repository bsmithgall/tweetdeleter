require('dotenv').config();
import {ApiCredentials, AppConfiguration, getToken} from './auth';
import {getDeleteCandidates, doTheDeletes} from './wire';

const credentials: ApiCredentials = {
  key: <string>process.env.API_KEY,
  secret: <string>process.env.API_SECRET,
};
const username = <string>process.env.USERNAME;
const daysOld: number =
  parseInt(<string>process.env.OLDEST_TWEET_ALLOWED, 10) || 30;

let configuration: AppConfiguration;

getToken(credentials)
  .then(token => {
    configuration = {token: token, username: username, daysOld: daysOld};
    return getDeleteCandidates(configuration, username);
  })
  .then(tweets => doTheDeletes(configuration, tweets));
