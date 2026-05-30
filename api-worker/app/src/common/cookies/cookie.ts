import { Response, Request, CookieOptions } from 'express';

export class CookieService {
  public static get(key: string, req: Request): string | null {
    if (!req || !req.cookies) {
      return null;
    }
    return req.cookies[key] || null;
  }

  public static set(key: string, value: string, res: Response, options: CookieOptions): void {
    if (!res) {
      throw new Error('Response object is required to assign a secure session cookie.');
    }

    res.cookie(key, value, options);
  }

  public static remove(key: string, res: Response): void {
    if (!res) {
      throw new Error('Response object is required to evict a session cookie.');
    }

    res.clearCookie(key);
  }
}