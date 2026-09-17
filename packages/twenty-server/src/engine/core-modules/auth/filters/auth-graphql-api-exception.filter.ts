import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
} from '@nestjs/common';
import { type GqlContextType } from '@nestjs/graphql';

import { isDefined } from 'twenty-shared/utils';

import { AuthException } from 'src/engine/core-modules/auth/auth.exception';
import { authGraphqlApiExceptionHandler } from 'src/engine/core-modules/auth/utils/auth-graphql-api-exception-handler.util';

@Catch(AuthException)
export class AuthGraphqlApiExceptionFilter implements ExceptionFilter {
  catch(exception: AuthException, host?: ArgumentsHost) {
    if (isDefined(host) && host.getType<GqlContextType>() !== 'graphql') {
      throw exception;
    }

    return authGraphqlApiExceptionHandler(exception);
  }
}
