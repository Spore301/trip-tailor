import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
export function validateBody(cls) {
    return async (req, res, next) => {
        const instance = plainToInstance(cls, req.body);
        const errors = await validate(instance, { whitelist: true });
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        req.body = instance;
        return next();
    };
}
//# sourceMappingURL=validate.js.map