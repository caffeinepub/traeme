import { useState } from 'react';
import { Principal } from '@dfinity/principal';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface PrincipalInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

export default function PrincipalInput({
  value,
  onChange,
  label = 'Principal ID',
  placeholder = 'Enter principal ID',
  error,
}: PrincipalInputProps) {
  const [validationError, setValidationError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (newValue.trim()) {
      try {
        Principal.fromText(newValue.trim());
        setValidationError('');
      } catch {
        setValidationError('Invalid principal ID format');
      }
    } else {
      setValidationError('');
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="principal">{label}</Label>
      <Input
        id="principal"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={validationError || error ? 'border-destructive' : ''}
      />
      {(validationError || error) && (
        <p className="text-sm text-destructive">{validationError || error}</p>
      )}
    </div>
  );
}
