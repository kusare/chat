import { NextPage } from "next";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Stack, Button } from "@mui/material";
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
import Hammer from "react-hammerjs";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import { PixiComponent, Stage, Text } from "@inlet/react-pixi";
import { Graphics, TextStyle, filters } from "pixi.js";
import * as THREE from "three";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useState, useEffect, useContext, useRef } from "react";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import PastelFilter from "../components/PastelFilter";
import { useSelector, useDispatch } from "react-redux";
import { decrease, increase, selectCount } from "../redux/counterSlice";

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
██████╗ ██╗██╗  ██╗██╗
██╔══██╗██║╚██╗██╔╝██║
██████╔╝██║ ╚███╔╝ ██║
██╔═══╝ ██║ ██╔██╗ ██║
██║     ██║██╔╝ ██╗██║
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝
                      
 */

  interface RectangleProps {
    x: number;
    y: number;
    width: number;
    height: number;
    color: number;
  }

  const Rectangle = PixiComponent<RectangleProps, Graphics>("Rectangle", {
    create: () => new Graphics(),
    applyProps: (ins, _, props) => {
      ins.x = props.x;
      ins.beginFill(props.color);
      ins.drawRect(props.x, props.y, props.width, props.height);
      ins.endFill();
    },
  });

  interface TapiocaProps {
    x: number;
    y: number;
    size: number;
    count: number;
    gap: number;
  }

  const Tapioca = PixiComponent<TapiocaProps, Graphics>("Tapioca", {
    create: () => new Graphics(),
    applyProps: (ins, _, props) => {
      const { x, y, size, count, gap } = props;
      ins.beginFill(0xaa8833);
      ins.x = x;
      Array(count)
        .fill(0)
        .forEach((v, i) => {
          ins.drawCircle(x + (size * 2 + gap) * i, y, size);
        });
      ins.endFill();
      ins.filters = [new PastelFilter()];
    },
  });

  const width = 500;
  const height = 300;

  const stageOptions = {
    antialias: true,
    autoDensity: true,
    backgroundAlpha: 0,
  };

  const Pixi = () => (
    <Stage width={width} height={height} options={stageOptions}>
      <Tapioca x={50} y={50} size={10} count={10} gap={5}></Tapioca>
      <Rectangle x={1} y={1} width={100} height={100} color={0xff0000} />
      <Text
        text="Hello World"
        anchor={0}
        x={1}
        y={1}
        style={
          new TextStyle({
            align: "center",
            fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
            fontSize: 50,
            fontWeight: "400",
            fill: ["#ffffff", "#00ff99"], // gradient
            stroke: "#01d27e",
            strokeThickness: 5,
            letterSpacing: 20,
            dropShadow: true,
            dropShadowColor: "#ccced2",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
          })
        }
      />
    </Stage>
  );

  /**
████████╗██╗  ██╗██████╗ ███████╗███████╗
╚══██╔══╝██║  ██║██╔══██╗██╔════╝██╔════╝
   ██║   ███████║██████╔╝█████╗  █████╗  
   ██║   ██╔══██║██╔══██╗██╔══╝  ██╔══╝  
   ██║   ██║  ██║██║  ██║███████╗███████╗
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝
                                         
 */

  const threeCss = css`
    width: 100vw;
    height: 100vh;
    background-color: #272727;
  `;

  const TBox = (props: JSX.IntrinsicElements["mesh"]) => {
    const ref = useRef<THREE.Mesh>(null!);
    const [hovered, hover] = useState(false);
    const [clicked, click] = useState(false);
    useFrame((state, delta) => (ref.current.rotation.x += 0.01));
    return (
      <mesh
        {...props}
        ref={ref}
        scale={clicked ? 1.5 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
      </mesh>
    );
  };

  /**
   *
   */
  function Box1(props: any) {
    const mesh = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);
    useFrame(
      (state) => (mesh.current.position.y = Math.sin(state.clock.elapsedTime))
    );
    return (
      <mesh
        {...props}
        ref={mesh}
        onClick={(e) => props.setActive(!props.active)}
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
      >
        <boxBufferGeometry />
        <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
      </mesh>
    );
  }

  function Box2(props: any) {
    const mesh = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);
    useFrame(
      (state) => (mesh.current.position.y = Math.sin(state.clock.elapsedTime))
    );
    return (
      <group {...props}>
        <mesh
          {...props}
          ref={mesh}
          onClick={(e) => props.setActive(!props.active)}
          onPointerOver={(e) => setHover(true)}
          onPointerOut={(e) => setHover(false)}
        >
          <boxBufferGeometry />
          <meshStandardMaterial color={hovered ? "green" : "blue"} />
        </mesh>
      </group>
    );
  }

  function Switcher() {
    const [active, setActive] = useState(false);
    return (
      <>
        {active && (
          <Box1 active={active} setActive={setActive} position={[-0.5, 0, 0]} />
        )}
        {!active && (
          <Box2 active={active} setActive={setActive} position={[0.25, 0, 0]} />
        )}
      </>
    );
  }

  const Three = () => {
    return (
      <div css={threeCss}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight
            intensity={0.6}
            position={[30, 30, 50]}
            angle={0.2}
            penumbra={1}
            castShadow
          />
          <TBox position={[-1.2, 0, 0]} />
          <TBox position={[1.2, 0, 0]} />
          <Switcher />
        </Canvas>
      </div>
    );
  };

  /**
 ██████╗ █████╗ ███╗   ██╗███╗   ██╗ ██████╗ ███╗   ██╗
██╔════╝██╔══██╗████╗  ██║████╗  ██║██╔═══██╗████╗  ██║
██║     ███████║██╔██╗ ██║██╔██╗ ██║██║   ██║██╔██╗ ██║
██║     ██╔══██║██║╚██╗██║██║╚██╗██║██║   ██║██║╚██╗██║
╚██████╗██║  ██║██║ ╚████║██║ ╚████║╚██████╔╝██║ ╚████║
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═══╝
 */

  /**
   *
   */
  function Plane(props: any) {
    const altRef = useRef();
    const [ref] = usePlane(() => ({
      rotation: [-Math.PI / 2, 0, 0],
      ...props,
    }));
    return (
      // @ts-ignore
      <mesh ref={ref}>
        <planeGeometry args={[100, 100]} />
      </mesh>
    );
  }

  function Cube(props: any) {
    const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], ...props }));
    return (
      // @ts-ignore
      <mesh ref={ref}>
        <boxGeometry />
      </mesh>
    );
  }

  const Cannon = () => {
    return (
      <>
        <Canvas>
          <Physics>
            <Plane />
            <Cube />
          </Physics>
        </Canvas>
      </>
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

  /**
██████╗ ███████╗████████╗██╗   ██╗██████╗ ███╗   ██╗
██╔══██╗██╔════╝╚══██╔══╝██║   ██║██╔══██╗████╗  ██║
██████╔╝█████╗     ██║   ██║   ██║██████╔╝██╔██╗ ██║
██╔══██╗██╔══╝     ██║   ██║   ██║██╔══██╗██║╚██╗██║
██║  ██║███████╗   ██║   ╚██████╔╝██║  ██║██║ ╚████║
╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
                                                    
 */

  // @ts-ignoree
  const count = useSelector(selectCount);
  const dispatch = useDispatch();

  return (
    <>
      <h1>Test</h1>
      <h2>Redux-Persist-Count: {count}</h2>
      <button onClick={() => dispatch(increase(1))}>Up</button>
      <button onClick={() => dispatch(decrease(1))}>Down</button>
      <Cannon></Cannon>
      <Three></Three>
      <Pixi></Pixi>
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
          ></div>

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
