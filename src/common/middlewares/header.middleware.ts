import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void) {
        // Attach headers to the context 
        req['context'] = {
            ...req['context'], // Preserve existing context properties
            headers: req.headers, // Attach headers to the context
        };
 
        next();
    }
}