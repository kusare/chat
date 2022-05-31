import { NextPage } from "next";
import { AsciiDocEditor } from "../components/codeMirror";
import { CustomDrawer } from "../components/WrapperUi";
import { Global, css } from "@emotion/react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import {
  cssTextState,
  cssTopbarState,
  cssChatMsgState,
} from "../recoil/cssMsgStates";

const Page: NextPage = () => {
  /**
██████╗ ███████╗ ██████╗ ██████╗ ██╗██╗     
██╔══██╗██╔════╝██╔════╝██╔═══██╗██║██║     
██████╔╝█████╗  ██║     ██║   ██║██║██║     
██╔══██╗██╔══╝  ██║     ██║   ██║██║██║     
██║  ██║███████╗╚██████╗╚██████╔╝██║███████╗
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝╚══════╝
                                            
 */

  // 全体の背景のCSS設定はcssTextStateから
  const setCssTextState = useSetRecoilState(cssTextState);
  const cssText = useRecoilValue(cssTextState);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCssTextState(event.target.value);
  };

  // 全体のtopbarのCSS設定
  const cssTopbar = useRecoilValue(cssTopbarState);
  const setCssTopbarState = useSetRecoilState(cssTopbarState);

  // 全体のChatのMessageのCSS設定
  const cssChatMsg = useRecoilValue(cssChatMsgState);
  const setChatMsgState = useSetRecoilState(cssChatMsgState);

  return (
    <>
      <Global
        styles={css`
          body {
            ${cssText}
          }
        `}
      />
      <CustomDrawer>
        <AsciiDocEditor defaultValue="AsciiDocEditor" />
      </CustomDrawer>
    </>
  );
};

export default Page;
