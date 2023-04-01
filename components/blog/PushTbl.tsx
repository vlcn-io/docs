import React from "react";

export default function PushTbl({
  rows,
}: {
  rows: {
    id: string;
    content: string;
    row_time: string;
    local_row_time: string;
  }[];
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>content</th>
          <th>row_time</th>
          <th>local_row_time</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          return (
            <tr>
              <td>{row.id}</td>
              <td>{row.content}</td>
              <td>{row.row_time}</td>
              <td>{row.local_row_time}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
