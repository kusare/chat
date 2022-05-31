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
import { AsciiDocEditor } from "../components/codeMirror";
import { CustomDrawer } from "../components/WrapperUi";

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
      <CustomDrawer>
        <AsciiDocEditor defaultValue="AsciiDocEditor" />
      </CustomDrawer>
    </>
  );
};

export default Page;
