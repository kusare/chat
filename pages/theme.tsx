import { NextPage } from "next";
import React, { useState, useEffect, useRef } from "react";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Stack, Button } from "@mui/material";
import { Msg } from "../components/firebase-index";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const Page: NextPage = () => {
  const [sheet, setSheet] = useState(`color: black; background-color: red`);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSheet(event.target.value);
  };
  const lorem =
    "Lorem ipsum dolor sit amet, consectetur 威力に聴いたのは無論今日へよほどででべき。";
  const sampleMsg = {
    id: "",
    timestamp: Timestamp.fromDate(new Date()),
    name: "",
    text: lorem,
    profilePicUrl: "",
    imageUrl: "",
  };
  const [alignment, setAlignment] = React.useState("web");
  const mouseChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <>
      <h1>Theme</h1>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={mouseChange}
      >
        <ToggleButton value="web">Web</ToggleButton>
        <ToggleButton value="android">Android</ToggleButton>
        <ToggleButton value="ios">iOS</ToggleButton>
      </ToggleButtonGroup>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <Stack spacing={2} direction="row">
          <div
            css={css(`
          ${sheet}
        `)}
          >
            <Msg msg={sampleMsg} />
          </div>
          <TextField
            label="Sample"
            multiline
            placeholder="Placeholder"
            maxRows={4}
            value={lorem}
            rows={4}
            css={css(`
          ${sheet}
        `)}
          />
          <TextField
            label="CSS"
            multiline
            placeholder="Placeholder"
            maxRows={4}
            value={sheet}
            rows={4}
            onChange={handleChange}
          />
        </Stack>
        <Stack spacing={2} direction="row">
          <TextField
            label="Sample"
            multiline
            placeholder="Placeholder"
            maxRows={4}
            value={lorem}
            rows={4}
            css={css(`
          ${sheet}
        `)}
          />
          <TextField
            label="CSS"
            multiline
            placeholder="Placeholder"
            maxRows={4}
            value={sheet}
            rows={4}
            onChange={handleChange}
          />
        </Stack>
      </Box>
    </>
  );
};

export default Page;
