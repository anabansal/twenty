import { Injectable, type NestMiddleware } from '@nestjs/common';

import { type NextFunction, type Request, type Response } from 'express';
import { isDefined } from 'twenty-shared/utils';

import { assertWorkspaceIsNotSuspendedOrThrow } from 'src/engine/core-modules/auth/utils/assert-workspace-is-not-suspended-or-throw.util';
import { MiddlewareService } from 'src/engine/middlewares/middleware.service';

@Injectable()
export class GraphQLRefuseSuspendedWorkspaceMiddleware implements NestMiddleware {
  constructor(private readonly middlewareService: MiddlewareService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (!isDefined(req.workspace)) {
      next();

      return;
    }

    try {
      assertWorkspaceIsNotSuspendedOrThrow(req.workspace);
    } catch (error) {
      this.middlewareService.writeGraphqlResponseOnExceptionCaught(res, error);

      return;
    }

    next();
  }
}
