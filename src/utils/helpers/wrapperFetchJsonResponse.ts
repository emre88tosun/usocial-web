import HTTP_CODES_ENUM from '@constants/http';
import { FetchJsonResponse } from '@customTypes/fetch';

async function wrapperFetchJsonResponse<T>(
  response: Response
): Promise<FetchJsonResponse<T>> {
  const status = response.status as FetchJsonResponse<T>['status'];
  return {
    status,
    data: [
      HTTP_CODES_ENUM.NO_CONTENT,
      HTTP_CODES_ENUM.SERVICE_UNAVAILABLE,
    ].includes(status)
      ? undefined
      : await response.json(),
  };
}

export default wrapperFetchJsonResponse;
