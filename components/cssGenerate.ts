import cssGen from "css-generator";

const options = {
  indentation: "  ", // 2 spaces
};
const css = cssGen.create(options);

css.addRule(".color-white", {
  color: "white",
});

css.openBlock("media", "screen and (min-width: 30em)");

css.addRule(["body", "html"], {
  color: "gray",
});

css.closeBlock();

css.openBlock("supports", "(display: grid)");

css.addRule(".grid", {
  display: "grid",
});

css.openBlock("media", "screen and (max-width: 30em)");

css.addRule(".grid-sm", {
  display: "grid",
});

const generatedCSS = css.getOutput();

export default generatedCSS;
