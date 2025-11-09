import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Request, Response, NextFunction } from 'express';

export function validateBody<T>(cls: new () => T) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const instance = plainToInstance(cls, req.body);
		const errors = await validate(instance as object, { whitelist: true });
		if (errors.length > 0) {
			return res.status(400).json({ errors });
		}
		req.body = instance as unknown as Record<string, unknown>;
		return next();
	};
}

