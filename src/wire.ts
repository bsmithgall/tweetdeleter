import {AppConfiguration} from './auth';
import {deleteTweet} from './delete';
import {getTimeline, Tweet} from './timeline';

const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
const MAX_TWEETS_ALLOWED = 3200;

function shouldDeleteTweet(tweet: Tweet, daysAgo: number): boolean {
  const millisSinceTweet: number =
    new Date().valueOf() - tweet.createdAt.valueOf();
  return millisSinceTweet > daysAgo * MILLIS_PER_DAY;
}

export async function getDeleteCandidates(
  config: AppConfiguration,
  username: string,
): Promise<Array<Tweet>> {
  let deleteCandidates: Array<Tweet> = [];
  let maxId = undefined;
  let tweetsScanned = 0;

  while (tweetsScanned < MAX_TWEETS_ALLOWED) {
    const timelinePart: Array<Tweet> = await getTimeline(
      config.token,
      username,
      maxId,
    );

    timelinePart
      .filter(t => shouldDeleteTweet(t, config.daysOld))
      .forEach(t => deleteCandidates.push(t));

    maxId = Math.min(...timelinePart.map(t => t.id));

    tweetsScanned += 200;
  }

  return deleteCandidates;
}

export async function doTheDeletes(
  config: AppConfiguration,
  candidates: Array<Tweet>,
) {
  const printEvery = 500;
  let current = 0;
  candidates.forEach(c =>
    deleteTweet(config.token, c).then(_ => {
      current += 1;
      if (current % printEvery === 0) {
        console.log(`Deleted ${current} successfully`);
      }
    }),
  );
}
