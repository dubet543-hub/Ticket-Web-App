const crypto = require("crypto");
const User = require("../models/User");

// Login tokens are "<userId>.<expiresAt>.<signature>", signed with JWT_SECRET so they can't be forged
const TOKEN_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

// Without JWT_SECRET a random one is used: still safe, but everyone is logged out on each restart
const secret = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");
if (!process.env.JWT_SECRET) console.warn("JWT_SECRET is not set: logins will not survive a server restart");

const sign = (payload) => crypto.createHmac("sha256", secret).update(payload).digest("base64url");

const issueToken = (user) => {
  const payload = `${user._id}.${Date.now() + TOKEN_LIFETIME_MS}`;
  return `${payload}.${sign(payload)}`;
};

const readToken = (token) => {
  const [userId, expiresAt, signature] = String(token).split(".");
  if (!userId || !expiresAt || !signature) return null;

  const expected = sign(`${userId}.${expiresAt}`);
  const valid =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  return valid && Number(expiresAt) > Date.now() ? userId : null;
};

const requireAuth = async (req, res, next) => {
  try {
    const token = (req.get("authorization") || "").replace(/^Bearer\s+/i, "");
    const userId = token && readToken(token);
    const user = userId && (await User.findById(userId).select("-password"));

    if (!user || user.status !== "Active") {
      return res.status(401).json({ message: "Please log in again" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Please log in again" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "Admin") {
    return res.status(403).json({ message: "Only an admin can do this" });
  }
  next();
};

module.exports = { issueToken, requireAuth, requireAdmin };
