import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import dotenv from "dotenv";

dotenv.config();

// create a ratelimiter that allows 100 requests per minute
let ratelimit = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, "60 s"),
  });
  console.log("Rate limiting enabled with Upstash Redis");
} else {
  console.warn("⚠️  Rate limiting disabled - Upstash Redis credentials not configured");
}

export default ratelimit;
