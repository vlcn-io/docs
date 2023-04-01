import React from "react";
import styles from "./GentleCrdts.module.css";

export default function PushTbl({
  rows,
}: {
  rows: {
    id: string;
    content: string;
    row_time: number;
    local_row_time: number;
  }[];
}) {
  return (
    <table className={styles.table}>
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
            <tr key={row.id}>
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
