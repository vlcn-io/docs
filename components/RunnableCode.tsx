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

export default function RunnableCode({ code }: { code: string }) {}

const USE_REG = /^use\s+([A-z]{1}[A-z|0-9]*)$/gm;
const PROVIDE_REG = /^provide\s+([A-z]{1}[A-z|0-9]*)$/gm;

function getResouce(id: string) {
  if (!resources.has(id)) {
    resources.set(id, new Resource(id));
  }
  return resources.get(id);
}

class CodeNode {
  uses = new Map<string, number>();
  provides = new Set<string>();
  body: string | null = null;

  constructor(id: string, private code: string) {}

  eval() {
    const [uses, body, provides] = this.parse(this.code);
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
    for (const u of this.uses.keys()) {
      const resource = resources.get(u);
      this.uses.set(u, resource?.version || 0);
    }

    const fn = `async (${[...this.uses].join(", ")}) => {
      let ___ret = await (async () => {
        ${body}
      })();

      return [___ret, ${[...this.provides].join(", ")}];
    }`;

    const result = eval(fn);
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
      const resource = resources.get(u);
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

    if (seenAllVersions) {
      return;
    }

    this.run(this.body!);
  };

  private parse(code: string): [Set<string>, string, Set<string>] {
    const uses = new Set<string>();
    for (const m of code.matchAll(USE_REG)) {
      uses.add(m[1]);
    }

    const provides = new Set<string>();
    for (const m of code.matchAll(PROVIDE_REG)) {
      provides.add(m[1]);
    }

    const body = code.replaceAll(USE_REG, "").replaceAll(PROVIDE_REG, "");

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
  private resolution: any;
  private rejection: any;
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
    if (this.isReady) {
      consumer(this.id, this.resolution, this.rejection, this.version);
    }
    this.consumers.add(consumer);
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
