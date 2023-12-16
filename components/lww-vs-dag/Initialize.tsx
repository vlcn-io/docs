import React, { useEffect, useState } from "react";
import { CtxAsync as Ctx } from "@vlcn.io/react";
// @ts-ignore
import wasmUrl from "@vlcn.io/crsqlite-wasm/crsqlite.wasm";
import sqliteWasm, { DB } from "@vlcn.io/crsqlite-wasm";
import tblrx from "@vlcn.io/rx-tbl";

declare global {
  interface Window {
    __lwwvsdagctxs: Promise<{ lwwCtxts: Ctx[]; dagCtxts: Ctx[] }>;
  }
}

export default function Initialize({
  Comp,
}: {
  Comp: React.FC<{ lwwCtxts: Ctx[]; dagCtxts: Ctx[] }>;
}) {
  const [ctxts, setCtxts] = useState<{
    lwwCtxts: Ctx[];
    dagCtxts: Ctx[];
  } | null>(null);
  useEffect(() => {
    if (window.__lwwvsdagctxs) {
      window.__lwwvsdagctxs.then((newCtxts) => {
        if (ctxts != null) {
          return;
        }
        setCtxts(newCtxts);
      });
    } else {
      window.__lwwvsdagctxs = init();
      window.__lwwvsdagctxs.then((newCtxts) => {
        if (ctxts != null) {
          return;
        }
        setCtxts(newCtxts);
      });
    }
  }, [ctxts]);

  if (ctxts == null) {
    return <div>Loading...</div>;
  } else {
    return <Comp {...ctxts} />;
  }
}

async function init() {
  const sqlite = await sqliteWasm((_) => wasmUrl);

  const createCtx = async (db: DB) => {
    await createSchema(db);
    const rx = await tblrx(db);
    return {
      db,
      rx,
    };
  };
  const createDagCtx = async (db: DB) => {
    await createDagSchema(db);
    const rx = await tblrx(db);
    return {
      db,
      rx,
    };
  };

  const lwwCtxts = await Promise.all<Ctx>(
    [
      await sqlite.open(":memory:"),
      await sqlite.open(":memory:"),
      await sqlite.open(":memory:"),
    ].map(createCtx)
  );
  const dagCtxts = await Promise.all<Ctx>(
    [
      await sqlite.open(":memory:"),
      await sqlite.open(":memory:"),
      await sqlite.open(":memory:"),
    ].map(createDagCtx)
  );

  return { lwwCtxts, dagCtxts };
}

async function createSchema(db: DB) {
  await db.exec(
    'CREATE TABLE todo (id INTEGER PRIMARY KEY NOT NULL, "text" TEXT, completed INTEGER);'
  );
  await db.exec("SELECT crsql_as_crr('todo');");
}

async function createDagSchema(db: DB) {
  await db.tx(async (tx) => {
    await tx.exec(
      'CREATE TABLE todo (id INTEGER PRIMARY KEY NOT NULL, "text" TEXT, completed INTEGER);'
    );
    await tx.exec(
      "CREATE TABLE event (id INTEGER PRIMARY KEY NOT NULL, item_id INTEGER, [type] TEXT, value ANY);"
    );
    await tx.exec("CREATE INDEX event_item ON event (item_id);");
    await tx.exec(`CREATE TABLE event_dag (
      parent_id ANY NOT NULL, -- the event that came before this one
      event_id INTEGER NOT NULL, -- the id of the event
      foo ANY,
      PRIMARY KEY (parent_id, event_id)
    ) STRICT;`);
    await tx.exec(`CREATE INDEX event_dag_event ON event_dag (event_id);`);
    await tx.exec("SELECT crsql_as_crr('event');");
    await tx.exec("SELECT crsql_as_crr('event_dag');");
  });
}
