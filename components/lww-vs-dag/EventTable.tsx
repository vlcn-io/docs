import React from "react";
import { CtxAsync as Ctx, useQuery } from "@vlcn.io/react";

export default function EventTable({
  ctx,
  nodeName,
}: {
  ctx: Ctx;
  nodeName: string;
}) {
  const allEvents = useQuery(
    ctx,
    `SELECT id, item_id as itemId, type, value FROM event ORDER BY id ASC`,
    []
  );
  return (
    <>
      <h2>Events - {nodeName}</h2>
      <table className="stateTable">
        <thead>
          <tr>
            <th>id</th>
            <th>item_id</th>
            <th>type</th>
            <th>value</th>
          </tr>
        </thead>
        <tbody>
          {allEvents.data.map((event: any) => {
            return (
              <tr key={event.id.toString()}>
                <td className="id-readout">
                  ...{event.id.toString().slice(-4)}
                </td>
                <td>...{(event.itemId || "").toString().slice(-4)}</td>
                <td>{event.type}</td>
                <td>{event.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
