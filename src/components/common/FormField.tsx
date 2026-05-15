import { FC, ChangeEvent } from 'react'
import './FormField.css'

interface SelectOption {
  value: string
  label: string
}

interface FormFieldProps {
  label: string
  type?: 'text' | 'number' | 'date' | 'email' | 'tel' | 'select' | 'textarea' | 'password'
  value: string | number
  onChange: (value: string) => void
  options?: SelectOption[]
  placeholder?: string
  required?: boolean
  min?: string | number
  max?: string | number
  step?: string | number
  disabled?: boolean
  className?: string
  error?: string
}

const FormField: FC<FormFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  min,
  max,
  step,
  disabled = false,
  className = '',
  error
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const renderInput = () => {
    if (type === 'select') {
      return (
        <select
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          className="form-input"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    if (type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="form-input form-textarea"
          rows={4}
        />
      )
    }

    return (
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="form-input"
      />
    )
  }

  return (
    <div className={`form-field ${className}`}>
      <label className="form-label">
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      {renderInput()}
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}

export default FormField