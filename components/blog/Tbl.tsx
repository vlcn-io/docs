export type Row = { id: string; content: string; classname?: string };
import React from "react";
import styles from "./GSetExample.module.css";

export default function Tbl({ rows }: { rows: Row[] }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>id</th>
          <th>content</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr className={row.classname}>
            <td>{row.id}</td>
            <td>{row.content}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
