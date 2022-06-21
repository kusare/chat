import { Member } from "./types";

export const members: Member[] = [
  {
    id: "catnose",
    name: "CatNose",
    bio: "デザインが好きなプログラマー。開発者向けの情報共有プラットフォームzenn.devを開発しています。",
    avatarSrc: "",
    sources: [
      "https://zenn.dev/catnose99/feed",
      "https://catnose.medium.com/feed",
      "https://note.com/catnose/rss",
      "https://qiita.com/catnose99/feed.atom",
    ],
    includeUrlRegex: "medium.com|zenn.dev",
    twitterUsername: "catnose99",
    githubUsername: "catnose99",
    websiteUrl: "https://catnose99.com",
  },
  {
    id: "livedoor_blog",
    name: "livedoor blog",
    avatarSrc: "",
    sources: [
      "https://mamekichimameko.blog.jp/index.rdf",
      "https://tsuisoku.com/index.rdf",
      "http://jin115.com/index.rdf",
      "http://world-fusigi.net/index.rdf",
      "http://blog.livedoor.jp/dqnplus/index.rdf",
      "http://blog.esuteru.com/index.rdf",
      "http://blog.livedoor.jp/rbkyn844/index.rdf",
      "http://blog.livedoor.jp/nanjstu/index.rdf",
      "https://hamusoku.com/index.rdf",
      "http://news4vip.livedoor.biz/index.rdf",
    ],
  },
];
