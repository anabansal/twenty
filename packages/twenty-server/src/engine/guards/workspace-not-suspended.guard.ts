import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

import { isDefined } from 'twenty-shared/utils';

import { assertWorkspaceIsNotSuspendedOrThrow } from 'src/engine/core-modules/auth/utils/assert-workspace-is-not-suspended-or-throw.util';
import { isWorkspaceSuspended } from 'src/engine/core-modules/workspace/utils/is-workspace-suspended.util';
import { ALLOW_SUSPENDED_WORKSPACE_KEY } from 'src/engine/guards/constants/allow-suspended-workspace-key.constant';
import { getRequest } from 'src/utils/extract-request';

@Injectable()
export class WorkspaceNotSuspendedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = getRequest(context);

    if (!isWorkspaceSuspended(request?.workspace)) {
      return true;
    }

    if (context.getType<GqlContextType>() !== 'graphql') {
      assertWorkspaceIsNotSuspendedOrThrow(request?.workspace);

      return true;
    }

    if (this.isQueryOperation(context)) {
      return true;
    }

    const isSuspendedWorkspaceAllowed =
      this.reflector.getAllAndOverride<boolean>(ALLOW_SUSPENDED_WORKSPACE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    if (isSuspendedWorkspaceAllowed === true) {
      return true;
    }

    assertWorkspaceIsNotSuspendedOrThrow(request?.workspace);

    return true;
  }

  private isQueryOperation(context: ExecutionContext): boolean {
    const operation = GqlExecutionContext.create(context).getInfo<
      { operation?: { operation?: string } } | undefined
    >()?.operation?.operation;

    return isDefined(operation) && operation === 'query';
  }
}
