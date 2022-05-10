import { useRecoilState } from "recoil";
import { nameState } from "atoms/name";

export default function InputComponent() {
  const [name, setName] = useRecoilState(nameState);

  let handleChangeInput = (e) => {
    setName(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Enter the string"
      onChange={handleChangeInput}
      value={name}
    />
  );
}
