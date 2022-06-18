import * as Soundfont from "soundfont-player";

export function SoundTest() {
  return (
    <div>
      <button
        onClick={() => {
          Soundfont.instrument(new AudioContext(), "clavinet").then(function (
            clavinet
          ) {
            clavinet.play("C4");
          });
        }}
      >
        Sound Test
      </button>
    </div>
  );
}
