import React, { ChangeEvent } from "react";

interface Props {
  index: number;
  name: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  value: string;
  displayName: string;
}

const MultiSelect = ({
  index,
  name,
  selectedValue,
  setSelectedValue,
  value,
  displayName,
}: Props) => {
  return (
    <label
      key={index}
      className="form-control flex p-0 outline outline-1	bg-base-300 hover:brightness-90 outline-base-100 rounded-md"
    >
      <div className="flex p-3 rounded">
        <input
          type="radio"
          name={name}
          value={value}
          checked={selectedValue === value}
          onChange={() => {
            setSelectedValue(value);
            console.log(selectedValue);
          }}
          className="radio mr-4 align-middle "
        />
        <p className="text-sm align-middle">{displayName}</p>
      </div>
    </label>
  );
};

export default MultiSelect;
