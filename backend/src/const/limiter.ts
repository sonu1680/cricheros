import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 1 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
