import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme2 from "styles/theme2";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button, ButtonProps } from "@mui/material";

export default {
  title: "Theme2/Button",
  component: Button,
  decorators: [
    (Story) => {
      return (
        <ThemeProvider theme={theme2}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      );
    },
  ],
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
const primaryProps: ButtonProps = {
  color: "primary",
  variant: "contained",
  children: "test",
};
Primary.args = primaryProps;
