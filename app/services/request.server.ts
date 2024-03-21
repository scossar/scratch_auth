import { json } from "@remix-run/node";

/**
 * A helper function to return the accurate HTTP status to the client.
 */

export const badRequest = <T>(data: T) => {
  return json<T>(data, { status: 400 });
};
