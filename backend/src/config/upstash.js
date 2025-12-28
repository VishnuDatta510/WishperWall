import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import dotenv from "dotenv";

dotenv.config();

let ratelimit = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "60 s"),
  });
  console.log("Rate limiting enabled with Upstash Redis");
} else {
  console.warn("⚠️  Rate limiting disabled - Upstash Redis credentials not configured");
}

export default ratelimit;
