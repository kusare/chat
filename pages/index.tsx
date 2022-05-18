import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Stack, Button } from "@mui/material";
import {
  signIn,
  signOutUser,
  ProfilePic,
  UserName,
  setMsg,
  Msgs,
  setImgMsg,
} from "../components/firebase-index";
import Header from "../components/Header";
import Grid from "@mui/material/Grid";
import { Input } from "@mui/material";

const sections = [
  { title: "Technology", url: "#" },
  { title: "Design", url: "#" },
  { title: "Culture", url: "#" },
  { title: "Business", url: "#" },
];

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Chat</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title="Chat" sections={sections}></Header>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Stack spacing={2} direction="row">
          <Button onClick={() => setMsg("testgaw;eil4ktj;qi")}>Set Msg</Button>
          <Input type="file" onChange={setImgMsg} />
        </Stack>
        <Msgs></Msgs>
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