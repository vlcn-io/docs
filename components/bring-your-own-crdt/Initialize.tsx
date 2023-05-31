import React, { useEffect, useState } from "react";
import { CtxAsync as Ctx } from "@vlcn.io/react";
// @ts-ignore
import wasmUrl from "@vlcn.io/crsqlite-wasm/crsqlite.wasm";
import sqliteWasm, { DB } from "@vlcn.io/crsqlite-wasm";
import tblrx from "@vlcn.io/rx-tbl";

declare global {
  interface Window {
    __bringowncrdt: Promise<{ ctxts: Ctx[] }>;
  }
}

export default function Initialize({
  Comp,
}: {
  Comp: React.FC<{ ctxts: Ctx[] }>;
}) {
  const [ctxts, setCtxts] = useState<{
    ctxts: Ctx[];
  } | null>(null);
  useEffect(() => {
    if (window.__bringowncrdt) {
      window.__bringowncrdt.then((newCtxts) => {
        if (ctxts != null) {
          return;
        }
        setCtxts(newCtxts);
      });
    } else {
      window.__bringowncrdt = init();
      window.__bringowncrdt.then((newCtxts) => {
        if (ctxts != null) {
          return;
        }
        setCtxts(newCtxts);
      });
    }
  }, []);

  if (ctxts == null) {
    return <div>Loading...</div>;
  } else {
    return <Comp {...ctxts} />;
  }
}

async function init() {
  const sqlite = await sqliteWasm((_) => wasmUrl);

  const createDagCtx = async (db: DB) => {
    await createSchema(db);
    const rx = tblrx(db);
    return {
      db,
      rx,
    };
  };

  const ctxts = await Promise.all<Ctx>(
    [
      await sqlite.open(":memory:"),
      await sqlite.open(":memory:"),
      await sqlite.open(":memory:"),
    ].map(createDagCtx)
  );

  return { ctxts };
}

async function createSchema(db: DB) {
  await db.tx(async (tx) => {
    await tx.exec(`CREATE TABLE event (
      id INTEGER PRIMARY KEY,
      mutation_name TEXT,
      args ANY
    ) STRICT;`);
    await tx.exec(`CREATE TABLE event_dag (
      parent_id ANY, -- the event that came before this one
      event_id INTEGER, -- the id of the event
      PRIMARY KEY (parent_id, event_id)
    ) STRICT;`);

    await tx.exec(`CREATE INDEX event_dag_event ON event_dag (event_id);`);
    await tx.exec("SELECT crsql_as_crr('event');");
    await tx.exec("SELECT crsql_as_crr('event_dag');");

    await tx.exec(
      `CREATE TABLE todo (id INTEGER PRIMARY KEY, content TEXT, completed INTEGER);`
    );
  });
}
