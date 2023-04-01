import React from "react";
import styles from "./GentleCrdts.module.css";

export default function TieTbl({
  row,
}: {
  row: {
    id: string;
    content: string;
    time: string;
  };
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>id</th>
          <th>content</th>
          <th>time</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{row.id}</td>
          <td>{row.content}</td>
          <td>{row.time}</td>
        </tr>
      </tbody>
    </table>
  );
}
