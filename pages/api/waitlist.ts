// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "better-sqlite3";

let db: any;
if (!process.env.FLY_APP_NAME) {
  db = sqlite3("./dev.db");
} else {
  console.log("using prod db");
  db = sqlite3("/mnt/vlcn_sqlite/prod2.db");
}

db.exec("CREATE TABLE IF NOT EXISTS waitlist (name, company, email)");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    if (
      process.env.WAITLIST_PW &&
      process.env.WAITLIST_PW.length > 10 &&
      req.query.pw === process.env.WAITLIST_PW
    ) {
      res.status(200).json(db.prepare("SELECT * FROM waitlist").all());
      return;
    } else {
      res.status(200).send(html);
    }
    return;
  }

  const { name, company, email } = req.body;

  const stmt = db.prepare(
    "INSERT INTO waitlist (name, company, email) VALUES (?, ?, ?)"
  );
  stmt.run(name, company, email);

  res.status(200).send(html);
}

const html = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>vlcn.io - Moving Software Forward</title>
  <link rel="stylesheet" href="/waitlist.css">
</head>

<body>
  <br />
  <br />
  <center>
    <h1>Thanks! We'll get back to you soon!</h1>
    <h2><a href="/" style="color: white">vlcn.io</a></h2>
  </center>
</body>

</html>
`;
