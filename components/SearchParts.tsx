import { Hit as AlgoliaHit } from "instantsearch.js";
import algoliasearch from "algoliasearch/lite";
import React from "react";
import {
  InstantSearch,
  Breadcrumb,
  Configure,
  ClearRefinements,
  CurrentRefinements,
  DynamicWidgets,
  HierarchicalMenu,
  Highlight,
  Hits,
  HitsPerPage,
  InfiniteHits,
  Menu,
  Pagination,
  RangeInput,
  RefinementList,
  PoweredBy,
  SearchBox,
  SortBy,
  ToggleRefinement,
} from "react-instantsearch-hooks-web";

import { indexName, minQueryLength, searchClient } from "../utils/algolia";

const Hit: React.FC<{
  hit: any;
}> = ({ hit }) => {
  return (
    <article>
      <h1>{hit.title}</h1>
    </article>
  );
};

export const SearchByAlgolia = () => {
  return (
    <>
      <InstantSearch indexName={indexName} searchClient={searchClient}>
        <SearchBox />
        <Hits hitComponent={Hit} />
      </InstantSearch>
    </>
  );
};
