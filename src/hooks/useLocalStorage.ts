import { useState, useEffect } from 'react'

/**
 * useLocalStorage - Syncs state with localStorage
 * Automatically saves and loads data from browser storage
 * 
 * @template T - Type of stored value
 * @param key - LocalStorage key
 * @param initialValue - Default value if key doesn't exist
 * @returns Stateful value and setter function
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return initialValue
    }
  })

  // Update localStorage when state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}