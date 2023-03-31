/**
 * RunnableCode has imports and exports.
 *
 * Imports are what we need from other blocks.
 * Exports are what we provide to blocks.
 *
 * Blocks with no imports can be run immediately.
 * Blocks with imports must way till those imports are ready.
 *
 * We can create a cache of promises for each import.
 *
 * When someone exports, they can resolve that promise.
 * When someone imports, they await on that promise.
 *
 * But it should likely be a generator and in a loop so we can re-run blocks and trigger
 * a cascading update across all blocks.
 */

// TODO: rm from this map any resources no longer provided by anyone
const resources = new Map<string, Resource>();

const USE_REG = /^use\s+([A-z]{1}[A-z|0-9]*);$/gm;
const PROVIDE_REG = /^provide\s+([A-z]{1}[A-z|0-9]*);$/gm;

function getResouce(id: string) {
  if (!resources.has(id)) {
    resources.set(id, new Resource(id));
  }
  return resources.get(id);
}

export class CodeNode {
  uses = new Map<string, number>();
  provides = new Set<string>();
  body: string | null = null;
  pendingPromise: Promise<any> | null = null;
  on: ((r: any, e?: any) => void) | null = null;

  constructor() {}

  eval(code: string) {
    const [uses, body, provides] = this.parse(code);
    this.body = body;
    const noLongerUses = [...this.uses.keys()].filter((u) => !uses.has(u));

    for (const u of noLongerUses) {
      resources.get(u)?.off(this.onResourceReady);
    }

    this.uses = new Map();
    for (const u of uses) {
      this.uses.set(u, 0);
    }
    this.provides = provides;

    for (const p of this.provides) {
      getResouce(p)?.invalidate();
    }

    if (this.uses.size == 0) {
      this.run(body);
    }

    for (const u of this.uses.keys()) {
      getResouce(u)?.on(this.onResourceReady);
    }
  }

  private run(body: string) {
    let rejected = false;
    let inputs = [];
    for (const u of this.uses.keys()) {
      const resource = getResouce(u);
      this.uses.set(u, resource?.version || 0);
      rejected = rejected || resource?.rejection !== undefined;
      if (rejected) {
        console.error(resource?.rejection);
        return;
      }
      inputs.push(resource?.resolution);
    }

    const code = `async (${[...this.uses.keys()].join(", ")}) => {
      let ___ret = await (async () => {
        ${body}
      })();

      return [___ret, ${[...this.provides].join(", ")}];
    }`;

    let fn;
    try {
      fn = eval(code);
    } catch (e) {
      console.log(code);
      throw e;
    }

    const result = fn(...inputs);

    let i = 1;
    for (const p of this.provides) {
      const resource = getResouce(p);
      const index = i;
      resource?.setPromise(
        result.then((r: any) => {
          return r[index];
        })
      );
      ++i;
    }

    this.pendingPromise = result;
    result.then(
      (r: any) => {
        if (this.pendingPromise != result) {
          return;
        }

        if (isPromise(r[0])) {
          r[0].then((r: any) => {
            this.runComplete(r);
          });
        } else {
          this.runComplete(r[0]);
        }
      },
      (e: any) => {
        this.runComplete(undefined, e);
      }
    );
  }

  private runComplete(result: any, e?: any) {
    this.on?.(result, e);
  }

  private onResourceReady = (
    id: string,
    resolution: any,
    rejection: any,
    version: number
  ) => {
    // if all resources are ready, run
    // but do not run once for each resoucrce binding
    let allReady = true;
    let seenAllVersions = true;

    for (const [u, v] of this.uses) {
      const resource = getResouce(u);
      if (!resource?.isReady) {
        allReady = false;
        break;
      }
      if (v < resource.version) {
        seenAllVersions = false;
      }
    }

    if (!allReady) {
      return;
    }

    if (!seenAllVersions) {
      this.run(this.body!);
    }
  };

  private parse(code: string): [Set<string>, string, Set<string>] {
    const uses = new Set<string>();
    for (const m of code.matchAll(USE_REG)) {
      uses.add(m[1]);
    }

    const provides = new Set<string>();
    for (const m of code.matchAll(PROVIDE_REG)) {
      provides.add(m[1]);
      code = code.replace(m[0], `self.${m[1]} = ${m[1]};`);
    }

    const body = code.replaceAll(USE_REG, "");

    return [uses, body, provides];
  }
}

type Consumer = (
  id: string,
  resolution: any,
  rejection: any,
  version: number
) => void;

class Resource {
  private promise: Promise<any>;
  public resolution: any;
  public rejection: any;
  private ready = false;
  private consumers: Set<Consumer> = new Set();
  private v = 1;

  constructor(public readonly id: string) {
    this.promise = Promise.resolve();
  }

  invalidate() {
    this.promise = Promise.resolve();
    this.resolution = undefined;
    this.rejection = undefined;
    this.ready = false;
  }

  setPromise(promise: Promise<any>) {
    this.promise = promise;
    this.resolution = undefined;
    this.rejection = undefined;
    this.ready = false;

    promise.then(
      (value) => {
        if (promise == this.promise) {
          ++this.v;
          this.resolution = value;
          this.ready = true;
          this.notifyConsumers();
        }
      },
      (error) => {
        if (promise == this.promise) {
          ++this.v;
          this.rejection = error;
          this.ready = true;
          this.notifyConsumers();
        }
      }
    );
  }

  on(consumer: Consumer) {
    this.consumers.add(consumer);
    if (this.isReady) {
      consumer(this.id, this.resolution, this.rejection, this.version);
    }
    return () => this.off(consumer);
  }

  off(consumer: Consumer) {
    this.consumers.delete(consumer);
  }

  private notifyConsumers() {
    for (const c of this.consumers) {
      c(this.id, this.resolution, this.rejection, this.version);
    }
  }

  get isReady() {
    return this.ready;
  }

  get version() {
    return this.v;
  }
}

function isPromise(obj: any) {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
}
