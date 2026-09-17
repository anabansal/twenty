import {
  AuthException,
  AuthExceptionCode,
} from 'src/engine/core-modules/auth/auth.exception';
import { type FlatWorkspace } from 'src/engine/core-modules/workspace/types/flat-workspace.type';
import { isWorkspaceSuspended } from 'src/engine/core-modules/workspace/utils/is-workspace-suspended.util';

export const assertWorkspaceIsNotSuspendedOrThrow = (
  workspace:
    | Pick<FlatWorkspace, 'activationStatus' | 'deletedAt'>
    | null
    | undefined,
): void => {
  if (!isWorkspaceSuspended(workspace)) {
    return;
  }

  throw new AuthException(
    'Workspace is suspended',
    AuthExceptionCode.WORKSPACE_SUSPENDED,
  );
};
