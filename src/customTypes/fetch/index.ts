import HTTP_CODES_ENUM from '@constants/http';

type FetchParams = Parameters<typeof fetch>;

export type FetchInputType = FetchParams[0];
export type FetchInitType = FetchParams[1];

export type FetchJsonResponse<T> =
  | { status: HTTP_CODES_ENUM.OK | HTTP_CODES_ENUM.CREATED; data: T }
  | { status: HTTP_CODES_ENUM.NO_CONTENT; data: undefined }
  | {
      status: HTTP_CODES_ENUM.UNAUTHORIZED | HTTP_CODES_ENUM.BAD_REQUEST;
      data: { message: string };
    }
  | {
      status:
        | HTTP_CODES_ENUM.INTERNAL_SERVER_ERROR
        | HTTP_CODES_ENUM.SERVICE_UNAVAILABLE;
      data?: { message?: string };
    }
  | {
      status: HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY;
      data: {
        message: HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY;
        errors: Record<string, Array<string>>;
      };
    }
  | {
      status: HTTP_CODES_ENUM.NOT_FOUND;
      data: {
        status: HTTP_CODES_ENUM.NOT_FOUND;
        error: string;
      };
    };
