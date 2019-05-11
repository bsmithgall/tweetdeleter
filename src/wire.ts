import {AppConfiguration} from './auth';
import fs from 'fs';
import {Parser} from 'json2csv';
import {deleteTweet} from './delete';
import {TWEETS_AT_ONCE, getTimeline, Tweet} from './timeline';

const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
const MAX_TWEETS_ALLOWED = 3200;

function shouldDeleteTweet(tweet: Tweet, daysAgo: number): boolean {
  const millisSinceTweet: number =
    new Date().valueOf() - tweet.createdAt.valueOf();
  return millisSinceTweet > daysAgo * MILLIS_PER_DAY;
}

export async function getDeleteCandidates(
  config: AppConfiguration,
): Promise<Array<Tweet>> {
  let deleteCandidates: Array<Tweet> = [];
  let maxId = undefined;
  let tweetsScanned = 0;

  while (tweetsScanned < MAX_TWEETS_ALLOWED) {
    const timelinePart: Array<Tweet> = await getTimeline(
      config.token,
      config.username,
      maxId,
    );

    timelinePart
      .filter(t => shouldDeleteTweet(t, config.oldestTweet))
      .forEach(t => deleteCandidates.push(t));

    maxId = Math.min(...timelinePart.map(t => t.id));

    tweetsScanned += TWEETS_AT_ONCE;
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
    deleteTweet(config.token, config.credentials, c).then(_ => {
      current += 1;
      if (current % printEvery === 0) {
        console.log(`Deleted ${current} successfully`);
      }
    }),
  );
}

export async function doTheDownload(
  config: AppConfiguration,
  tweets: Array<Tweet>,
) {
  fs.access(config.downloadLocation, fileDoesNotExistErr => {
    const writeStream = fs.createWriteStream(config.downloadLocation, {
      encoding: 'utf8',
    });

    const csv = new Parser({
      header: fileDoesNotExistErr !== null,
    }).parse(tweets);

    writeStream.write(csv);
  });
}
