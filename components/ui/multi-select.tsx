// File: components/ui/multi-select.tsx
import Select from "react-select"

interface MultiSelectProps {
  options: { value: string; label: string }[]
  value: { value: string; label: string }[]
  onChange: (value: any) => void
  placeholder?: string
}

export const MultiSelect = ({ options, value, onChange, placeholder }: MultiSelectProps) => {
  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Select..."}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  )
}
