import { KeyboardEvent } from "react";

type TextInputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
};

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  onKeyDown = () => {},
}) => {
  return (
    <div className="flex flex-col gap-1 flex-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onKeyDown={e => onKeyDown(e)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm ${className}`}
      />
    </div>
  );
};