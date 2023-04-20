import React from "react";
import { CtxAsync as Ctx, useQuery } from "@vlcn.io/react";

export default function LwwStateTable({ ctx }: { ctx: Ctx }) {
  // select * from todo then grab clock values for the row(s)
  const allTodos = useQuery(
    ctx,
    `SELECT todo.id, todo."text", todo.completed,
      json_group_object(__crsql_col_name, json_array(__crsql_col_version, __crsql_db_version)) as clocks FROM todo 
      JOIN todo__crsql_clock as v ON v.id = todo.id
      GROUP BY todo.id ORDER BY todo.id DESC`,
    [],
    (allRows: any[]) => {
      return allRows.map((r) => {
        return {
          ...r,
          clocks: JSON.parse(r.clocks),
        };
      });
    }
  ).data;

  return (
    <table className="stateTable">
      <thead>
        <tr>
          <th>id</th>
          <th>content</th>
          <th>content_clock</th>
          <th>done</th>
          <th>done_clock</th>
        </tr>
      </thead>
      <tbody>
        {allTodos.map((todo) => {
          return (
            <tr key={todo.id}>
              <td className="id-readout">...{todo.id.toString().slice(-4)}</td>
              <td>{todo.text}</td>
              <td>{(todo.clocks.text || [])[0]}</td>
              <td>{todo.completed ? "true" : "false"}</td>
              <td>{(todo.clocks.completed || [])[0]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
