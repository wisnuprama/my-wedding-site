import { NextResponse } from "next/server";

function withLooseAuthorization() {
  return async (
    req: Request,
    next: () => unknown,
  ): Promise<NextResponse | unknown> => {
    const url = new URL(req.url);

    // The API is not that important we just want an easy access to the resource
    if (url.searchParams.get("p") === process.env.API_KEY) {
      return next();
    }

    return NextResponse.json({ message: "Auth required" }, { status: 401 });
  };
}

const middlewares: Array<
  (req: Request, next: () => unknown) => Promise<NextResponse | unknown>
> = [withLooseAuthorization()];

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
