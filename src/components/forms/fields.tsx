import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const CONTROL =
  "h-11 w-full rounded-xl border border-input bg-background/60 px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

export interface SelectOption {
  value: string;
  label: string;
}

interface FieldWrapperProps {
  id: string;
  label: string;
  required?: boolean | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
}

export function FieldWrapper({ id, label, required, error, hint, children }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="ml-0.5 text-coral">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-coral">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "number";
  placeholder?: string | undefined;
  required?: boolean;
  error?: string | undefined;
  hint?: string | undefined;
  autoComplete?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
}

export function TextField(props: TextFieldProps) {
  const { id, label, value, onChange, type = "text", placeholder, required, error, hint } = props;
  return (
    <FieldWrapper id={id} label={label} required={required} error={error} hint={hint}>
      <input
        id={id}
        className={cn(CONTROL, error && "border-coral/70")}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={props.autoComplete}
        min={props.min}
        max={props.max}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldWrapper>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string | undefined;
  required?: boolean;
  error?: string | undefined;
  hint?: string | undefined;
}

export function SelectField(props: SelectFieldProps) {
  const { id, label, value, onChange, options, placeholder, required, error, hint } = props;
  return (
    <FieldWrapper id={id} label={label} required={required} error={error} hint={hint}>
      <select
        id={id}
        className={cn(CONTROL, "appearance-none", error && "border-coral/70")}
        value={value}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string | undefined;
  rows?: number;
  required?: boolean;
  error?: string | undefined;
  hint?: string | undefined;
  maxLength?: number | undefined;
}

export function TextAreaField(props: TextAreaFieldProps) {
  const { id, label, value, onChange, placeholder, rows = 4, required, error, hint } = props;
  return (
    <FieldWrapper id={id} label={label} required={required} error={error} hint={hint}>
      <textarea
        id={id}
        className={cn(
          "w-full rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          error && "border-coral/70",
        )}
        value={value}
        rows={rows}
        placeholder={placeholder}
        maxLength={props.maxLength}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldWrapper>
  );
}
