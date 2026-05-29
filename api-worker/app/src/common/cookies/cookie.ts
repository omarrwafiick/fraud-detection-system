import * as express from 'express';

export class CookieService{
    public static get(key: string, req: express.Request) : string | null{
        if (req && req.cookies) {
            return req.cookies[key] || null;
        }
        return null;
    }

    public static set(key: string, value: string, res: express.Response, options: express.CookieOptions){
        if (res) {
            res.cookie(key, value, options);
        }
        throw new Error("Response is not passed to add a new cookie");
    }

    public static remove(key: string, res: express.Response){
        if (res) {
            res.clearCookie(key);
        }
        throw new Error("Response is not passed to remove the cookie");
    }
}