import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { editCssTargetIdState, chatRadioBtnIdState } from "../recoil/States";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { IconButton, ListItem } from "@mui/material";
import { Global, css } from "@emotion/react";

/**
 ██████╗██╗  ██╗ █████╗ ████████╗
██╔════╝██║  ██║██╔══██╗╚══██╔══╝
██║     ███████║███████║   ██║   
██║     ██╔══██║██╔══██║   ██║   
╚██████╗██║  ██║██║  ██║   ██║   
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
                                 
 */

export const ChatLayoutChips = () => {
  const chatRadioBtnId = useRecoilValue(chatRadioBtnIdState);
  const setChatRadioBtnId = useSetRecoilState(chatRadioBtnIdState);

  const handleChatRadioBtnId = (id: any) => {
    setChatRadioBtnId(id);
  };

  return (
    <>
      <h5>Chat layout</h5>
      <Chip
        avatar={
          <Avatar src="https://lh3.googleusercontent.com/a-/AOh14GiTn84dF67hp4-VAHWFk2KdjcKnx1nE1SfXlQ2U=s96-c"></Avatar>
        }
        onClick={() => handleChatRadioBtnId("Normal")}
        label="Normal"
      />
      <Chip
        avatar={<Avatar></Avatar>}
        label="Recipe"
        onClick={() => handleChatRadioBtnId("Recipe")}
        css={css`
          background-color: red;
        `}
      />
    </>
  );
};

/**
████████╗██╗  ██╗███████╗███╗   ███╗███████╗
╚══██╔══╝██║  ██║██╔════╝████╗ ████║██╔════╝
   ██║   ███████║█████╗  ██╔████╔██║█████╗  
   ██║   ██╔══██║██╔══╝  ██║╚██╔╝██║██╔══╝  
   ██║   ██║  ██║███████╗██║ ╚═╝ ██║███████╗
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚══════╝
                                            
 */

export const EditCssTargetIdChips = () => {
  const editCssTargetId = useRecoilValue(editCssTargetIdState);
  const setEditCssTargetId = useSetRecoilState(editCssTargetIdState);

  const handleEditCssTargetId = (id: any) => {
    setEditCssTargetId(id);
  };

  const array = [
    {
      label: "cssBackground",
      avaterUrl:
        "https://lh3.googleusercontent.com/a-/AOh14GiTn84dF67hp4-VAHWFk2KdjcKnx1nE1SfXlQ2U=s96-c",
      css: "",
    },
    {
      label: "cssTopbar",
      avaterUrl: "",
      css: "background-color: red;",
    },
    {
      label: "cssTopbarDeco",
      avaterUrl: "",
      css: "",
    },
    {
      label: "cssChatMsg",
      avaterUrl: "",
      css: "",
    },
    {
      label: "cssChatMsgDeco",
      avaterUrl: "",
      css: "",
    },
    {
      label: "cssSubChatMsg",
      avaterUrl: "",
      css: "",
    },
    {
      label: "cssChatMsgTitleDeco",
      avaterUrl: "",
      css: "",
    },
  ];

  const ele = array.map((value, index) => {
    return (
      <Chip
        key={index}
        avatar={<Avatar src={value.avaterUrl}></Avatar>}
        onClick={() => handleEditCssTargetId(value.label)}
        label={value.label}
        css={css`
          ${value.css}
        `}
      />
    );
  });

  return (
    <>
      <h5>CSS</h5>
      {ele}
    </>
  );
};
