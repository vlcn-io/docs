import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { Feed } from "feed";
import { getPagesUnderRoute } from "nextra/context";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return;
  }

  const allPosts = getPagesUnderRoute("/blog");
  const site_url = "https://vlcn.io";

  const feedOptions = {
    title: "vlcn.io blog",
    description: "vlcn.io blog",
    id: site_url,
    link: site_url,
    image: `${site_url}/logo.png`,
    favicon: `${site_url}/favicon.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}, One Law LLC`,
    generator: "Feed for Node.js",
    feedLinks: {
      rss2: `${site_url}/rss.xml`,
    },
  };

  const feed = new Feed(feedOptions);
  allPosts.forEach((post) => {
    const casted = post as any;
    feed.addItem({
      title: post.meta?.title,
      id: post.route,
      link: `${site_url}${post.route}`,
      description: casted.frontMatter?.description,
      date: new Date(casted.frontMatter?.date),
    });
  });

  res.status(200).send(feed.rss2());
  fs.writeFileSync("./public/blog/rss.xml", feed.rss2());
}
