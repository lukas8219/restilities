import { NextFunction, Request, Response } from "express";

function createErrorHandlerFn(
  context: any,
  fn: (req: Request, res: Response) => any
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      return await fn.bind(context)(req, res);
    } catch (err) {
      return next(err);
    }
  };
}

export function Controller<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    constructor(...any: any[]) {
      super(...any);
      Object.getOwnPropertyNames(constructor.prototype).forEach(
        (property: any) => {
          if (property === "constructor") return;
          Object.defineProperty(this, property, {
            get() {
              return createErrorHandlerFn(
                this,
                constructor.prototype[property]
              );
            },
          });
        }
      );
    }
  };
}
