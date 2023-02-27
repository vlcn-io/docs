---
layout: docs
title: Syncing Data
---

<style type="text/css">
@import url("../assets/interactive/runnable-code.css");
@import url("../assets/interactive/json-viewer.css");
</style>

<script type="module" src="../assets/docs/guides/common.js"></script>

The base primitives around which everything is built are tables and `crrs` ([conflict free replicated relations](./concept-crr)).

- Tables are just regular `sqlite` tables.
- `crrs` are `sqlite` tables which can be merged with other tables on other devices

You can have local-only data (regular tables) as well as synced data (crrs) in the same database. Anything that is not a `crr` will not be synced.

For the rest of this guide we'll assume that you're making a collaborative presentation editor like Google Slides, Keynote or Powerpoint. This application will have completely local data (like selection state) and shared data (like decks, slides and slide contents).

# Write the Schema

We can start by defining the base data model as normal `sqlite` tables.

<div class="runnable-code">
  <div>
self.schema = [
  `CREATE TABLE IF NOT EXISTS "deck" (
    "id" primary key,
    "name"
  );`,
  `CREATE TABLE IF NOT EXISTS "slide" (
    "id" primary key,
    "deck_id",
    "order"
  );`,
  `CREATE TABLE IF NOT EXISTS "component" (
    "id" primary key,
    "slide_id",
    "type",
    "content",
    "x",
    "y",
    "w",
    "h",
    "rotation"
  );`,
  `CREATE TABLE IF NOT EXISTS "selected_slide" (
    "deck_id", "slide_id", primary key ("deck_id", "slide_id")
  );`,
  `CREATE TABLE IF NOT EXISTS "selected_component" (
    "slide_id", "component_id", primary key ("slide_id", "component_id")
  );`
];
  </div>
</div>

And then decide which of those should be synced and thus `crrs`. We'll want to replicate the `deck`, `slide` and `component` tables given those states should be shared across all devices and users. We won't replicate the tables which represent local-only state like `selected_slide` and `selected_component`.

<div class="runnable-code">
  <div>
schema.push(`SELECT crsql_as_crr('deck');`);
schema.push(`SELECT crsql_as_crr('slide');`);
schema.push(`SELECT crsql_as_crr('component');`);
  </div>
</div>

# Apply the Schema to the DB

Now that we have a data model sketched out we can apply it to a database. Let's import the `crsqlite-wasm` module and open a database in memory. Too learn how to persist data to disk, see [[docs/guide-persistence]].

<div class="runnable-code">
  <div>
self.sqlitePromise = import("https://esm.sh/@vlcn.io/crsqlite-wasm@0.5.7").then((crsqliteWasm) => 
  crsqliteWasm.default({
    locateWasm: (f) => "https://esm.sh/@vlcn.io/crsqlite-wasm@0.5.7/dist/sqlite3.wasm",
    locateProxy: (f) => "https://esm.sh/@vlcn.io/crsqlite-wasm@0.5.7/dist/sqlite3-opfs-async-proxy.js",
  })
);
// We assign to the `self` object for the sake of the demo. It just allows each cell on the
// page to access data created by another cell.
return sqlitePromise.then((sqlite) => self.db1 = sqlite.open(":memory:"));
  </div>
</div>

Then apply the schema we defined earlier to the database.

<div class="runnable-code">
  <div>
db1.execMany(schema);
  </div>
</div>

Great! Let's run a few commands to make sure that worked.

<div class="runnable-code">
  <div>
return db1.execA(`SELECT name FROM sqlite_master WHERE type = 'table'`).join("\n");
  </div>
</div>

As you can see, all the tables were created as expected. There are a few internal tables as well which are used by vlcn/crsqlite to track merge state. You can read more about those at [[docs/bits-internal-tables]].

> You can modify the code above and press `shift + enter` to see the results of other queries.

# Writing Data

Now that we have a database with a data model we can start writing data to it. Let's start by creating a deck along with a few slides and components.

<div class="runnable-code">
  <div>
const deckid = nanoid();
self.deckid = deckid; // save for use by other cells later on
const slideid1 = nanoid();
const slideid2 = nanoid();
db1.execMany([
  `INSERT INTO "deck" ("id", "name") VALUES ('${deckid}', 'First Presentation');`,
  `INSERT INTO "slide" ("id", "deck_id", "order") VALUES ('${slideid1}', '${deckid}', 0);`,
  `INSERT INTO "slide" ("id", deck_id, "order") VALUES ('${slideid2}', '${deckid}', 1);`,
  `INSERT INTO component ("id", "slide_id", "type", "content", x, y, w, h, "rotation") VALUES ('${nanoid()}', '${slideid1}', 'text', 'Some Title', 0, 0, 600, 100, 0);`,
  `INSERT INTO component ("id", "slide_id", "type", "content", x, y, w, h, "rotation") VALUES ('${nanoid()}', '${slideid1}', 'text', 'Some subtext', 500, 150, 400, 100, 0);`,
]);
  </div>
</div>

And to check on things --

<div class="runnable-code">
  <div>
const decks = db1.execO(`SELECT * FROM deck`);
const slides = db1.execO(`SELECT * FROM slide`);
const components = db1.execO(`SELECT * FROM component`);

return {
  decks,
  slides,
  components,
};
  </div>
</div>

But what if we need to collaborate between multiple devices? We need to be able to replicate the data between devices. Let's see how that works.

# Syncing, Merging, Replicating

The main primitive for this is [[docs/crsql_changes]] which allows you to:

- pull changes since a given time
- apply changes from another db

While you can select _all_ changes in the database, you can also narrow down to specific logical clock ranges, tables, primary keys and more.

Let us see what some of the changes in our DB looks like.

<div class="runnable-code">
  <div>
// beautify for the output to the document
return db1.execA(
    `SELECT
      "table",
      "pk",
      "cid",
      "val",
      "col_version",
      "db_version",
      quote("site_id")
    FROM "crsql_changes"`);
  </div>
</div>

A bunch of stuff. The details don't really matter for now, just know that:

1. The output of a select from `crsql_changes` can be directly fed back into an insert into `crsql_changes`
2. That a list of changes compresses well -- so don't worry about the repeated values

> To understand everything in a chageset, see [[docs/bits-crsql-changes-internals]].

Let's see what happens when we apply a changeset to a new database.

## Syncing to a new DB

Spin up a new DB that has no data in it.

<div class="runnable-code">
  <div>
return sqlitePromise.then((sqlite) => self.db2 = sqlite.open(":memory:"));
  </div>
</div>

One constraint is that databases must have the same set of CRRs in order to sync between them. So let's apply the schema to the new database.

> Note that there are exceptions to this rule. See [[docs/bits-syncing-exceptions]] for more details.

<div class="runnable-code">
  <div>
db2.execMany(schema);
  </div>
</div>

Confirm that db2 is in fact empty wrt presentations.

<div class="runnable-code">
  <div>
return db2.execO(`SELECT * FROM deck, slide, component`);
  </div>
</div>

And finally apply all changes from the first database to the second.

<div class="runnable-code">
  <div>
// example of selecting changes after a db_version and only made locally
const changes = db1.execA(`SELECT * FROM crsql_changes WHERE db_version > 0 AND site_id IS NULL`);
db2.transaction(() => {
  for (const change of changes) {
    db2.exec(
      `INSERT INTO crsql_changes VALUES (?, ?, ?, ?, ?, ?, ?)`,
      change,
    );
  }
});
  </div>
</div>

Now checking the contents of db2 post sync --

<div class="runnable-code">
  <div>
const decks = db2.execO(`SELECT * FROM deck`);
const slides = db2.execO(`SELECT * FROM slide`);
const components = db2.execO(`SELECT * FROM component`);

return {
  decks,
  slides,
  components,
};
  </div>
</div>

We can also perform concurrent edits on each DB and then merge them together. In order to ensure we only sync what has changed between the last time we synced, we'll need to track `db_version` for our peers.

`crsqlite` maintains a [crsql_tracked_peers](./crsql_tracked_peers) table that tracks the `db_version` of each peer. Let's see what that looks like for each database.

<div class="runnable-code">
  <div>
const db1TrackedPeers = db1.execO(`SELECT quote(site_id) as site, version FROM crsql_tracked_peers WHERE event = 0`);
const db2TrackedPeers = db2.execO(`SELECT quote(site_id) as site, version FROM crsql_tracked_peers WHERE event = 0`);

return {
  db1TrackedPeers,
  db2TrackedPeers
};
  </div>
</div>

You can see that `tracked_peers` only has entries in `db2`. This is because `tracked_peers` gets updated on write, not read, and we've only synced from the direction of `db1` to `db2`.

Updating `tracked_peers` on read is a responsibility of network layers that need to stream changes. See [[docs/crsql_tracked_peers]].

## Using Tracked Peers

The `crsql_tracked_peers` table is essentially acting as a mechanism to store cursors that represent the last point in time that we synced with another peer or site. We use these values to pull changes from other sites.

For example, if `db2` wants all changes from `db1` that it has not yet seen, `db2` can ask `db1` for changes where the `db_version` is greater than the value it has stored for `db1`.


example --
<div class="runnable-code">
  <div>
// What is the site id of db1?
const db1SiteId = db1.execA(`SELECT crsql_siteid()`)[0][0];
// What was the latest value db2 saw from db1?
const lastSeenDb1Version = db2.execO(
  `SELECT clock FROM crsql_tracked_peers WHERE event = 0 AND site_id = ?`,
  [db1SiteId],
)[0].clock;

self.db1SiteId = db1SiteId;
self.lastSeenDb1Version = lastSeenDb1Version;
return {
  db1SiteId,
  lastSeenDb1Version
}
  </div>
</div>

Now we can ask db1 for all changes since that version.

<div class="runnable-code">
  <div>
return db1.execA(`SELECT * FROM crsql_changes WHERE db_version > ? AND site_id IS NULL`, [lastSeenDb1Version]);
  </div>
</div>

As you can see, no changes were returned. This is because we've already synced all changes from db1 to db2. If we perform a write on db1, however, we'll see that the changes are returned.

<div class="runnable-code">
  <div>
db1.exec(`UPDATE deck SET name = 'new title' WHERE id = ?`, [deckid]);
return db1.execA(`SELECT * FROM crsql_changes WHERE db_version > ? AND site_id IS NULL`, [lastSeenDb1Version]);
  </div>
</div>

# Wrap Up

You've seen how you can compose:

- [`crsql_as_crr`](./crsql_as_crr)
- [`crsql_siteid`](./crsql_siteid)
- [`crsql_changes`](./crsql_changes)
- [`crsql_tracked_peers`](./crsql_tracked_peers)

to build a sync layer for your application.

The basic ideas:

1. Convert tables to conflict free replicated relations with `crsql_as_crr`
2. Discover the unique id of each database with `crsql_siteid`
3. Pull and apply changes to/from databases with `crsql_changes`
4. Keep track of what you've synced with `crsql_tracked_peers`

# Next Steps

This guide showed you how to do whole database replication. In future guides we'll:

1. Show you how you can track and replicate only a certain set of rows
2. Sync across a network
3. Handle migrations
4. Build a complete app
5. Go over other CRDT types that you can use
6. Discuss using event sourcing to power many different CDRT "views" atop the same data
