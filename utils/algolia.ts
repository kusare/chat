import { MultipleQueriesQuery } from "@algolia/client-search";
import algoliasearch from "algoliasearch";
import dotenv from "dotenv";
// dotenv.config();

// try {
//   dotenv.config();

//   if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID) {
//     throw new Error("NEXT_PUBLIC_ALGOLIA_APP_ID is not defined");
//   }

//   if (!process.env.ALGOLIA_SEARCH_ADMIN_KEY) {
//     throw new Error("ALGOLIA_SEARCH_ADMIN_KEY is not defined");
//   }
// } catch (error) {
//   console.error(error);
// }

// console.log("It works!");

const appId = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_APP_ID || "";
const algoliaSearchApiKey =
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || "";

export const indexName =
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX_NAME || "";
export const minQueryLength = 3;

export const searchClient = algoliasearch(appId, algoliaSearchApiKey);

// export const searchIndex = searchClient.initIndex("test");

// export const searchClient = {
//   search(requests: MultipleQueriesQuery[]) {
//     // コンポーネント表示時に検索を実行しないように
//     // 検索文字がminQueryLength未満の場合は実行しないように
//     // https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-requests/react/
//     if (
//       requests.every(({ params }: MultipleQueriesQuery) => {
//         return !params?.query || params.query.length < minQueryLength;
//       })
//     ) {
//       return Promise.resolve({
//         results: requests.map(() => ({
//           hits: [],
//           nbHits: 0,
//           nbPages: 0,
//           page: 0,
//           processingTimeMS: 0,
//         })),
//       });
//     }

//     return algoliaClient.search(requests);
//   },
// };
