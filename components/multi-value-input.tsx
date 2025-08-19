import React, { useState, KeyboardEvent } from "react";

interface MultiValueInputProps {
  value?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
}

const MultiValueInput: React.FC<MultiValueInputProps> = ({
  value = [],
  onChange,
  placeholder = "Type and press space...",
}) => {
  const [values, setValues] = useState<string[]>(value);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " && inputValue.trim() !== "") {
      e.preventDefault();
      const newValues = [...values, inputValue.trim()];
      setValues(newValues);
      setInputValue("");
      onChange?.(newValues);
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      values.length > 0
    ) {
      const newValues = values.slice(0, -1);
      setValues(newValues);
      onChange?.(newValues);
    }
  };

  const removeValue = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    setValues(newValues);
    onChange?.(newValues);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 border border-input rounded-md focus-within:ring-ring/50 focus-within:ring-[3px]  px-3 py-2 text-base shadow-xs transition-[color,box-shadow] focus-within:border-stone-500 md:text-sm">
      {values.map((val, index) => (
        <span
          key={index}
          className="flex items-center gap-1 bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-100 px-3 rounded-sm text-sm md:text-xs"
        >
          {val}
          <button
            type="button"
            onClick={() => removeValue(index)}
            className="text-stone-500 dark:text-stone-100 hover:text-red-500 h-full text-sm transition"
          >
            &times;
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 placeholder:text-muted-foreground outline-none bg-transparent min-w-[80px]"
        placeholder={placeholder}
      />
    </div>
  );
};

export default MultiValueInput;
