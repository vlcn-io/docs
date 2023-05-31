import React from "react";
import { CtxAsync as Ctx, useQuery } from "@vlcn.io/react";
import styles from "./style.module.css";

export default function EventTable({
  ctx,
  nodeName,
}: {
  ctx: Ctx;
  nodeName: string;
}) {
  const allEvents = useQuery(
    ctx,
    `SELECT id, mutation_name as mutationName, args FROM event ORDER BY id ASC`,
    []
  );
  return (
    <>
      <h2>Mutations - {nodeName}</h2>
      <table className={styles.stateTable}>
        <thead>
          <tr>
            <th>mutation id</th>
            <th>name</th>
            <th>args</th>
          </tr>
        </thead>
        <tbody>
          {allEvents.data.map((event: any) => {
            return (
              <tr key={event.id.toString()}>
                <td className={styles["id-readout"]}>{event.id}</td>
                <td>{event.mutationName}</td>
                <td>{event.args}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
