import rateLimit from "express-rate-limit";

// Limit each IP to 10 requests per minute
export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 1 minute.",
  },
  standardHeaders: true, // send rate limit info in headers
});
