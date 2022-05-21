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
// import Hammer from "hammerjs";
import Hammer from "react-hammerjs";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";

const Page: NextPage = () => {
  /**
██╗  ██╗ █████╗ ███╗   ███╗███╗   ███╗███████╗██████╗ 
██║  ██║██╔══██╗████╗ ████║████╗ ████║██╔════╝██╔══██╗
███████║███████║██╔████╔██║██╔████╔██║█████╗  ██████╔╝
██╔══██║██╔══██║██║╚██╔╝██║██║╚██╔╝██║██╔══╝  ██╔══██╗
██║  ██║██║  ██║██║ ╚═╝ ██║██║ ╚═╝ ██║███████╗██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝
                                                      
 */

  /**
   * ProfilePicUrl
   */
  const FontDrum: React.FC = () => {
    const [select, setSelect] = useState(10);

    const handleTap = (e: any) => {
      console.log("tap", e);
      setSelect(20);
    };

    const handleSwipe = (e: any) => {
      console.log("swipe", e);
      setSelect(30);
    };

    return (
      <Hammer onTap={handleTap} onSwipe={handleSwipe}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              font-family?
            </InputLabel>
            <NativeSelect
              defaultValue={10}
              inputProps={{
                name: "age",
                id: "uncontrolled-native",
              }}
              value={select}
            >
              <option value={10}>Ten</option>
              <option value={20}>Twenty</option>
              <option value={30}>Thirty</option>
            </NativeSelect>
          </FormControl>
        </Box>
      </Hammer>
    );
  };

  /**
██████╗  ██████╗ ███╗   ███╗
██╔══██╗██╔═══██╗████╗ ████║
██║  ██║██║   ██║██╔████╔██║
██║  ██║██║   ██║██║╚██╔╝██║
██████╔╝╚██████╔╝██║ ╚═╝ ██║
╚═════╝  ╚═════╝ ╚═╝     ╚═╝
                            
 */

  // DOM Event not to be confused with React.MouseEvent
  const onScroll = (e: any) => {
    console.log(e.wheelDelta);
  };
  let start = { x: 0, y: 0 };
  function onTouchStart(e: any) {
    start.x = e.touches[0].pageX;
    start.y = e.touches[0].pageY;
  }
  const onTouch = (e: any) => {
    let offset = { x: 0, y: 0 };
    offset.x = start.x - e.touches[0].pageX;
    offset.y = start.y - e.touches[0].pageY;
    console.log(e);
    console.log(offset);
  };

  /**
   * css to background
   * https://thewebdev.info/2021/09/25/how-to-set-html-body-element-styles-from-within-a-react-component/
   *
   */
  useEffect(() => {
    document.body.style.backgroundColor = "pink";

    window.addEventListener("onscroll", onScroll);
    // window.addEventListener("touchstart", onTouchStart);
    // window.addEventListener("touchmove", onTouch);
    // return () => {
    //   document.body.style.backgroundColor = "white";
    // };
  }, []);

  /**
███████╗██╗  ██╗███████╗███████╗████████╗
██╔════╝██║  ██║██╔════╝██╔════╝╚══██╔══╝
███████╗███████║█████╗  █████╗     ██║   
╚════██║██╔══██║██╔══╝  ██╔══╝     ██║   
███████║██║  ██║███████╗███████╗   ██║   
╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝   
                                         
 */

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
    profilePicUrl: "/images/profile_placeholder.png",
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
      <FontDrum></FontDrum>
      <AsciiDocEditor defaultValue="aaS" />
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={mouseChange}
      >
        <ToggleButton value="global">Global</ToggleButton>
        <ToggleButton value="message">Message</ToggleButton>
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
            label="Message CSS"
            multiline
            placeholder="Placeholder"
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
