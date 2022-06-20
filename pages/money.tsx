import type { NextPage } from "next";
import Head from "next/head";
import React, { useState, useEffect, useRef } from "react";
import { Global, css } from "@emotion/react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { cssBackgroundState } from "../recoil/States";
import { CustomDrawer } from "../components/GlobalParts";
import { chatRadioBtnIdState } from "../recoil/States";

const Page: NextPage = () => {
  const cssText = useRecoilValue(cssBackgroundState);
  return (
    <div>
      <Global
        styles={css`
          body {
            ${cssText}
          }
        `}
      />
      <Head>
        <title>Hamu House</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CustomDrawer>
        <p>money</p>
      </CustomDrawer>
    </div>
  );
};

export default Page;
