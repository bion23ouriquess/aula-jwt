import type { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../utils/jwt.ts";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userEmail?: string | null;
      userName?: string | null;
    }
  }
}

export function auth(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith("Bearer "))
    return res.status(401).json({ error: "missing token" });

  try {
    const token = hdr.slice("Bearer ".length);
    const payload = verifyAccess(token) as any;

    if (!payload || !payload.userId)
      return res.status(401).json({ error: "invalid token" });

    req.userId = Number(payload.userId);
    req.userEmail = payload.email ?? null;
    req.userName = payload.name ?? null;

    next();
  } catch {
    return res.status(401).json({ error: "invalid or expired token" });
  }
}
