import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Box, Stack, Button, TextField } from "@mui/material";
import {
  signIn,
  signOutUser,
  ProfilePic,
  UserName,
  setMsg,
  Msg,
  useMsgs,
  setImgMsg,
} from "../components/firebase-index";
import Header from "../components/Header";
import Grid from "@mui/material/Grid";
import { Input } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import generatedCSS from "../components/cssGenerate";

const sections = [
  { title: "Chat", url: "" },
  { title: "test", url: "test" },
  { title: "🎨Theme", url: "theme" },
  { title: "🔧Setting", url: "setting" },
];

const Home: NextPage = () => {
  const [text, setText] = useState("コメント");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Hamu House</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title="Hamu House" sections={sections}></Header>

      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Box>
          <Stack spacing={2} direction="row">
            <TextField
              label="CSS"
              multiline
              placeholder="Placeholder"
              value={text}
              rows={4}
              onChange={handleChange}
            />
            <Button onClick={() => setMsg(text)}>Set Msg</Button>
          </Stack>
        </Box>
        <Input type="file" onChange={setImgMsg} />
        {useMsgs().map((msg, index) => (
          <Msg key={msg?.id + index.toString()} msg={msg}></Msg>
        ))}
      </Grid>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
