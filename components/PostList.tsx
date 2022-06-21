import { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";

import { PostItem } from "../types";
import {
  getFaviconSrcFromOrigin,
  getMemberPath,
  getMemberById,
} from "../utils/helper";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
} from "@mui/material";
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
      <Card sx={{ display: "flex" }}>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={imgUrl}
          alt="Live from space album cover"
        />
        <a href={link}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              {/* <img
          width="auto"
          height="200"
          src={imgUrl}
          // srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
          alt={member.name}
          loading="lazy"
        /> */}

              <h4>{title}</h4>
            </CardContent>
            <Stack spacing={1} direction="row">
              <img
                src={getFaviconSrcFromOrigin(origin)}
                width={14}
                height={14}
                alt={hostname}
              />
              {hostname} {member.name}
              <time dateTime={isoDate}>{dayjs(isoDate).fromNow()}</time>
            </Stack>
          </Box>
        </a>
      </Card>
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
