// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "better-sqlite3";

let db;
if (!process.env.PRODUCTION) {
  db = sqlite3("./dev.db");
} else {
  db = sqlite3("/mnt/vlcn_sqlite/prod.db");
}

db.exec("CREATE TABLE IF NOT EXISTS waitlist (name, company, email)");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    if (
      process.env.PW &&
      process.env.PW.length > 10 &&
      req.query.pw === process.env.PW
    ) {
      res.status(200).json(db.prepare("SELECT * FROM waitlist").all());
      return;
    }
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { name, company, email } = req.body;

  const stmt = db.prepare(
    "INSERT INTO waitlist (name, company, email) VALUES (?, ?, ?)"
  );
  stmt.run(name, company, email);

  res.redirect("/thanks.html");
}
