import type { Request, Response, NextFunction } from 'express';
export declare function validateBody<T>(cls: new () => T): (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=validate.d.ts.map