import { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { PostItem } from "../types";
import {
  getFaviconSrcFromOrigin,
  getMemberPath,
  getMemberById,
} from "../utils/helper";
import { Stack } from "@mui/material";
// @ts-ignore
import DomParser from "dom-parser";

dayjs.extend(relativeTime);

// const PostLink: React.FC<{ item: PostItem }> = (props) => {
//   const { authorId, title, isoDate, link, dateMiliSeconds } = props.item;
//   const member = getMemberById(authorId);
//   if (!member) return null;

//   const { hostname, origin } = new URL(link);

//   return (
//     <article className="post-link">
//       <Link href={getMemberPath(member.id)} passHref>
//         <a className="post-link__author">
//           <img
//             src={member.avatarSrc}
//             className="post-link__author-img"
//             width={35}
//             height={35}
//             alt={member.name}
//           />
//           <div className="post-link__author-name">
//             <div className="post-link__author-name">{member.name}</div>
//             <time dateTime={isoDate} className="post-link__date">
//               {dayjs(isoDate).fromNow()}
//             </time>
//           </div>
//         </a>
//       </Link>
//       <a href={link} className="post-link__main-link">
//         <h2 className="post-link__title">{title}</h2>
//         {hostname && (
//           <div className="post-link__site">
//             <img
//               src={getFaviconSrcFromOrigin(origin)}
//               width={14}
//               height={14}
//               className="post-link__site-favicon"
//               alt={hostname}
//             />
//             {hostname}
//           </div>
//         )}
//       </a>
//       {dateMiliSeconds && dateMiliSeconds > Date.now() - 86400000 * 3 && (
//         <div className="post-link__new-label">NEW</div>
//       )}
//     </article>
//   );
// };

// export const PostList: React.FC<{ items: PostItem[] }> = (props) => {
//   const [displayItemsCount, setDisplayItemsCount] = useState<number>(32);
//   const totalItemsCount = props.items?.length || 0;
//   const canLoadMore = totalItemsCount - displayItemsCount > 0;

//   if (!totalItemsCount) {
//     return <div className="post-list-empty">No posts yet</div>;
//   }

//   return (
//     <>
//       <div className="post-list">
//         {props.items.slice(0, displayItemsCount).map((item, i) => (
//           <PostLink key={`post-item-${i}`} item={item} />
//         ))}
//       </div>
//       {canLoadMore && (
//         <div className="post-list-load">
//           <button
//             onClick={() => setDisplayItemsCount(displayItemsCount + 32)}
//             className="post-list-load__button"
//           >
//             LOAD MORE
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

const CustomPostLink: React.FC<{ item: PostItem }> = (props) => {
  const { authorId, title, isoDate, link, dateMiliSeconds, encoded } =
    props.item;
  const member = getMemberById(authorId);
  if (!member) return null;

  const { hostname, origin } = new URL(link);

  const rawParser = new DomParser();
  const doms = rawParser.parseFromString(encoded);
  const test = doms
    .getElementsByTagName("img")[0]
    ?.attributes.filter((dom: { name: string }) => dom.name === "src");
  let imgUrl = "";
  if (test) imgUrl = test[0].value;

  const parser = new DomParser();

  return (
    <article className="post-link">
      <a href={link} className="post-link__main-link">
        <img src={imgUrl} />
        <Stack spacing={1} direction="row">
          <h3 className="post-link__title">{title}</h3>
        </Stack>
      </a>
      <Stack spacing={1} direction="row">
        {hostname && (
          <>
            <img
              src={getFaviconSrcFromOrigin(origin)}
              width={14}
              height={14}
              className="post-link__site-favicon"
              alt={hostname}
            />
            {hostname}
          </>
        )}
        <div>{member.name}</div>
        <time dateTime={isoDate}>{dayjs(isoDate).fromNow()}</time>
      </Stack>
    </article>
  );
};

export const CustomPostList: React.FC<{ items: PostItem[] }> = (props) => {
  const [displayItemsCount, setDisplayItemsCount] = useState<number>(32);
  const totalItemsCount = props.items?.length || 0;
  const canLoadMore = totalItemsCount - displayItemsCount > 0;

  if (!totalItemsCount) {
    return <div className="post-list-empty">No posts yet</div>;
  }

  return (
    <>
      <div className="post-list">
        {props.items.slice(0, displayItemsCount).map((item, i) => (
          <CustomPostLink key={`post-item-${i}`} item={item} />
        ))}
      </div>
      {canLoadMore && (
        <div className="post-list-load">
          <button
            onClick={() => setDisplayItemsCount(displayItemsCount + 32)}
            className="post-list-load__button"
          >
            LOAD MORE
          </button>
        </div>
      )}
    </>
  );
};
