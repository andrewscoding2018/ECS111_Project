import React, { ChangeEvent } from "react";

interface Props {
    name: string;
    value: number;
    displayName: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const NumInput = ({
    name,
    value,
    displayName,
    handleChange
}: Props) => {
    return (
        <label className="form-control ">
            <div className="label">
                <span className="text-slate-700 label-text">{displayName}</span>
            </div>
            <input
                type="text"
                name={name}
                value={value}
                onChange={handleChange}
                className="text-sm input input-bordered"
            />
        </label>
    );
};

export default NumInput;
