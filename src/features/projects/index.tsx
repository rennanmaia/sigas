import { useState } from "react";

export function Projects() {
  const [value, setValue] = useState("");
  return (
    <>
      <input
        type="text"
        placeholder="teste...."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <div>{value}</div>
    </>
  );
}
