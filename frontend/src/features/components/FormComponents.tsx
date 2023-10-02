import React from 'react';
import { TextField, InputAdornment, IconButton, MenuItem } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface InputFieldProps {
  name: string;
  required?: boolean;
  [x:string]: any;
}

interface PasswordFieldProps {
  name: string;
  required?: boolean;
  [x:string]: any;
}

interface OptionPickerProps<Type> {
  name: string;
  value: Type;
  setValue: (value: number) => void;
  options: Type[];
  [x:string]: any;
}

export function InputField({ name, required = true, ...props } : InputFieldProps) {
  return (
    <TextField
      margin="normal"
      fullWidth
      required={required}
      name={name}
      label={name}
      {...props}
    />
  );
}

export function PasswordField({
  name, required = true, disabled, ...props
}: PasswordFieldProps) {
  const [showPasswordText, setShowPasswordText] = React.useState(false);
  return (
    <TextField
      margin="normal"
      variant="outlined"
      fullWidth
      name={name}
      label={name}
      type={showPasswordText ? 'text' : 'password'}
      required={required}
      disabled={disabled}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              tabIndex={-1}
              aria-label="toggle password visibility"
              onClick={() => setShowPasswordText(!showPasswordText)}
              edge="end"
              disabled={disabled}
            >
              {showPasswordText ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}

export function OptionPicker<Type>({ name, value, setValue, options }: OptionPickerProps<Type>) {
  return (
    <InputField
      name={name}
      value={value}
      select
      onChange={setValue}
      SelectProps={{
        MenuProps: {
          style: {
            maxHeight: 300,
          },
        }
      }}
    >
      {options.map((opt: Type, i: number) => {
        const option: any = opt;
        return (
          option
            ? <MenuItem key={i} value={option}>{option}</MenuItem>
            : <MenuItem key={i} value={''}>&nbsp;</MenuItem>
        );
      })}
    </InputField>
  );
}
