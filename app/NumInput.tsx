import React, { ChangeEvent } from "react";

interface Props {
  name: string;
  placeholder: string;
  displayName: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const NumInput = ({ name, placeholder, displayName, handleChange }: Props) => {
  return (
    <label className="form-control">
      <div className="label">
        <span className="label-text font-bold">{displayName}</span>
      </div>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        className="text-sm input outline-base-400 outline-1"
      />
    </label>
  );
};

export default NumInput;
