# Tweet Deleter

This is an application to delete your tweets. It is the same as
[tweetdelete.net](https://www.tweetdelete.net/), except you can read the source
code.

# How does it work

Twitter lets you get your timeline in a batch of 200 tweets at a time, up to
3200 tweets. Here's what this does:

1. While we have fewer than 3200 tweets, fetch new tweets from the timeline.
2. If they have a `created_at` older than some number of days, add them to a
   list of candidates from deletion.
3. When we have exhausted the timeline, go through and delete them all.

# I want to delete my tweets

First, get a developer account on [twitter.com](https://developer.twitter.com).
Then, make a new application. Make a file named `.env` in this directory (`touch
.env` should do it). Open it up with your favorite text editor and make it look
like this:

```bash
API_KEY="yourApiKeyHere"
API_SECRET="yourApiSecretHere"
USERNAME="yourTwitterUsername"
OLDEST_TWEET_ALLOWED="numberInDays" # defaults to 30 days
```

Then:

```
npm install
npm run build
```

Goodbye tweets.

