import React, { ChangeEvent } from "react";

interface Props {
  index: number;
  name: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  value: string;
  displayName: string;
}

const FormSection = ({
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
      className="form-control flex flex-row justify-center items-center gap-3"
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selectedValue === value}
        onChange={() => {
          setSelectedValue(value);
          console.log(selectedValue);
        }}
        className="radio"
      />
      <p className="text-lg">{displayName}</p>
    </label>
  );
};

export default FormSection;
