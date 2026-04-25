import { useState, useCallback } from 'react'

/**
 * useFormValidation - Manages form validation state and errors
 * Provides validation logic and error display functionality
 * 
 * @template T - Type of form data
 * @param validationRules - Object with validation functions for each field
 * @returns Validation state and validation functions
 */
export function useFormValidation<T extends Record<string, any>>(
  validationRules: {
    [K in keyof T]?: (value: T[K], formData: T) => string | undefined
  }
) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  /**
   * Validate a single field
   */
  const validateField = useCallback((
    field: keyof T,
    value: any,
    formData: T
  ): string | undefined => {
    const rule = validationRules[field]
    if (!rule) return undefined
    return rule(value, formData)
  }, [validationRules])

  /**
   * Validate all fields in form data
   */
  const validateForm = useCallback((formData: T): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    for (const field in validationRules) {
      const error = validateField(field as keyof T, formData[field], formData)
      if (error) {
        newErrors[field as keyof T] = error
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }, [validateField, validationRules])

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  /**
   * Clear error for specific field
   */
  const clearFieldError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  return {
    errors,
    validateForm,
    validateField,
    clearErrors,
    clearFieldError,
    setErrors
  }
}