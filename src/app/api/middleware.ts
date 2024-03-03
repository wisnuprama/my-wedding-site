import { NextResponse } from "next/server";

function withAuthorization() {
  return async (
    req: Request,
    next: () => unknown,
  ): Promise<NextResponse | unknown> => {
    if (req.headers.get("Authorization") === process.env.API_KEY) {
      return next();
    }

    return NextResponse.json({ message: "Auth required" }, { status: 401 });
  };
}

const middlewares: Array<
  (req: Request, next: () => unknown) => Promise<NextResponse | unknown>
> = [withAuthorization()];

const MiddlewareNextResponse = Symbol("MiddlewareNextResponse");

export function middleware(
  handler: (request: Request) => Promise<NextResponse>,
) {
  function next() {
    return MiddlewareNextResponse;
  }

  return async (req: Request) => {
    for (const middleware of middlewares) {
      const result = await middleware(req, next);

      if (result instanceof NextResponse) {
        return result;
      }
    }

    return handler(req);
  };
}
