#!/usr/bin/env node

import { ApiCredentials, AppConfiguration, getToken } from "./auth";
import { getDeleteCandidates, doTheDownload, doTheDeletes } from "./wire";

import program from "commander";

let configuration: AppConfiguration;

const command = program
  .command("tweetdelete")
  .option("-k, --key <key>", "Twitter API Key")
  .option("-s, --secret <secret>", "Twitter API Secret")
  .option("-t, --token <token>", "Twitter access token")
  .option("-x, --token-secret <tokenSecret>", "Twitter access token secret")
  .option("-u, --username <username>", "User whose tweets you want to delete")
  .option(
    "-o, --oldest-tweet <oldestTweet>",
    "Delete everything before",
    parseInt
  )
  .option(
    "-d, --download-location [filePath]",
    "Download a copy of the tweets before deleting them.",
    "./tweets.csv"
  )
  .option("--dry-run", "Do a dry run (don't actually delete the tweets)");

function main(program: program.Command) {
  program.parse(process.argv);

  if (!program.key || !program.secret) {
    console.error("No API Credentials provided!\n");
    program.help();
  }

  const credentials: ApiCredentials = {
    key: program.key,
    secret: program.secret,
    token: program.token,
    tokenSecret: program.tokenSecret,
  };

  getToken(credentials)
    .then((token) => {
      configuration = {
        token: token,
        credentials: credentials,
        username: program.username,
        oldestTweet: program.oldestTweet,
        downloadLocation: program.downloadLocation,
        dryRun: program.dryRun as boolean,
      };
      return getDeleteCandidates(configuration);
    })
    .then(async (tweets) => {
      console.log(tweets);
      if (configuration.downloadLocation) {
        doTheDownload(configuration, tweets);
      }

      return tweets;
    })
    .then((tweets) => {
      if (!configuration.dryRun) {
        doTheDeletes(configuration, tweets);
      }
    });
}

main(command);
