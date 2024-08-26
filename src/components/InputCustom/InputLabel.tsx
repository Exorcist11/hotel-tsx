import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IInputLB {
  title: string;
  type: "email" | "password" | "text" | "tel" | "date" | "number";
  name?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputLabel({
  name,
  type = "text",
  title,
  placeholder,
  error,
  required,
  value,
  onChange,
}: IInputLB) {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={name}>
        {title} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className={`focus-visible:ring-transparent ${
          error && "border-red-500"
        }`}
      />
      {error && (
        <Label htmlFor={name} className="text-red-500">
          {error}
        </Label>
      )}
    </div>
  );
}
