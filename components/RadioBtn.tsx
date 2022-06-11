import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { editCssTargetIdState, chatRadioBtnIdState } from "../recoil/States";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

/**
 ██████╗██╗  ██╗ █████╗ ████████╗
██╔════╝██║  ██║██╔══██╗╚══██╔══╝
██║     ███████║███████║   ██║   
██║     ██╔══██║██╔══██║   ██║   
╚██████╗██║  ██║██║  ██║   ██║   
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
                                 
 */

export function ChatRadioBtn() {
  // const [valueChatRadioBtn, setValueChatRadioBtn] = React.useState("Normal");

  const chatRadioBtnId = useRecoilValue(chatRadioBtnIdState);
  const setChatRadioBtnId = useSetRecoilState(chatRadioBtnIdState);
  const handleChatRadioBtnId = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignoree
    setChatRadioBtnId((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Chat Layout</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={chatRadioBtnId}
        onChange={handleChatRadioBtnId}
      >
        <FormControlLabel value="Normal" control={<Radio />} label="Normal" />
        <FormControlLabel value="Recipe" control={<Radio />} label="Recipe" />
      </RadioGroup>
    </FormControl>
  );
}

/**
████████╗██╗  ██╗███████╗███╗   ███╗███████╗
╚══██╔══╝██║  ██║██╔════╝████╗ ████║██╔════╝
   ██║   ███████║█████╗  ██╔████╔██║█████╗  
   ██║   ██╔══██║██╔══╝  ██║╚██╔╝██║██╔══╝  
   ██║   ██║  ██║███████╗██║ ╚═╝ ██║███████╗
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚══════╝
                                            
 */

export function EditCssTargetIdRadioBtn() {
  const editCssTargetId = useRecoilValue(editCssTargetIdState);
  const setEditCssTargetId = useSetRecoilState(editCssTargetIdState);
  const handleEditCssTargetId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignoree
    setEditCssTargetId((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Chat Layout</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={editCssTargetId}
        onChange={handleEditCssTargetId}
      >
        <FormControlLabel
          value="cssBackground"
          control={<Radio />}
          label="cssBackground"
        />
        <FormControlLabel
          value="cssTopbar"
          control={<Radio />}
          label="cssTopbar"
        />
        <FormControlLabel
          value="cssTopbarDeco"
          control={<Radio />}
          label="cssTopbarDeco"
        />
        <FormControlLabel
          value="cssChatMsg"
          control={<Radio />}
          label="cssChatMsg"
        />
        <FormControlLabel
          value="cssChatMsgDeco"
          control={<Radio />}
          label="cssChatMsgDeco"
        />
      </RadioGroup>
    </FormControl>
  );
}
