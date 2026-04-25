import { useState, useCallback } from 'react'

interface PaymentCard {
  id: string
  type: 'visa' | 'mc'
  lastFour: string
  expiryDate: string
}

/**
 * usePaymentCards - Manages payment card state
 * Handles adding and removing payment methods
 */
export function usePaymentCards() {
  const [cards, setCards] = useState<PaymentCard[]>([
    { id: '1', type: 'visa', lastFour: '4242', expiryDate: '08/27' },
    { id: '2', type: 'mc', lastFour: '8899', expiryDate: '03/28' }
  ])

  /**
   * Remove a payment card
   */
  const removeCard = useCallback((id: string) => {
    setCards(prev => prev.filter(card => card.id !== id))
  }, [])

  /**
   * Add a new payment card
   */
  const addCard = useCallback((card: Omit<PaymentCard, 'id'>) => {
    const newCard: PaymentCard = {
      ...card,
      id: String(Date.now())
    }
    setCards(prev => [...prev, newCard])
  }, [])

  return {
    cards,
    removeCard,
    addCard
  }
}