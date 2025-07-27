import { BlackjackEngine } from '../gameEngine'
import type { Card, Hand } from '../../types/game'

// Helper function to create a card
const createCard = (rank: Card['rank'], suit: Card['suit'] = 'hearts'): Card => {
  let value = 0
  if (rank === 'A') value = 11
  else if (['J', 'Q', 'K'].includes(rank)) value = 10
  else value = parseInt(rank)
  
  return { suit, rank, value }
}

// Helper function to create a hand
const createTestHand = (cards: Card[]): Hand => {
  return BlackjackEngine.createHand(cards)
}

describe('BlackjackEngine', () => {
  describe('Hand Value Calculation', () => {
    test('should calculate basic hand values correctly', () => {
      const hand1 = createTestHand([createCard('7'), createCard('8')])
      expect(hand1.value).toBe(15)
      expect(hand1.isSoft).toBe(false)
    })

    test('should handle aces correctly', () => {
      const hand1 = createTestHand([createCard('A'), createCard('5')])
      expect(hand1.value).toBe(16)
      expect(hand1.isSoft).toBe(true)
    })

    test('should adjust aces when busting', () => {
      const hand1 = createTestHand([createCard('A'), createCard('A'), createCard('9')])
      expect(hand1.value).toBe(21)
      expect(hand1.isSoft).toBe(true)
    })

    test('should detect busted hands', () => {
      const hand1 = createTestHand([createCard('K'), createCard('Q'), createCard('5')])
      expect(hand1.value).toBe(25)
      expect(hand1.isBusted).toBe(true)
    })
  })

  describe('Blackjack Detection', () => {
    test('should detect blackjack with Ace and 10', () => {
      const hand1 = createTestHand([createCard('A'), createCard('10')])
      expect(hand1.isBlackjack).toBe(true)
      expect(hand1.value).toBe(21)
    })

    test('should detect blackjack with Ace and face card', () => {
      const hand1 = createTestHand([createCard('A'), createCard('K')])
      expect(hand1.isBlackjack).toBe(true)
    })

    test('should NOT detect blackjack with 3+ cards totaling 21', () => {
      const hand1 = createTestHand([createCard('7'), createCard('7'), createCard('7')])
      expect(hand1.value).toBe(21)
      expect(hand1.isBlackjack).toBe(false)
    })

    test('should NOT detect blackjack with 2 cards not totaling 21', () => {
      const hand1 = createTestHand([createCard('A'), createCard('9')])
      expect(hand1.value).toBe(20)
      expect(hand1.isBlackjack).toBe(false)
    })
  })

  describe('Winner Determination - Core Rules', () => {
    test('Rule 1: Player busts, dealer wins regardless', () => {
      const playerHand = createTestHand([createCard('K'), createCard('Q'), createCard('5')]) // 25 - busted
      const dealerHand = createTestHand([createCard('7'), createCard('8')]) // 15
      
      expect(playerHand.isBusted).toBe(true)
      expect(BlackjackEngine.determineWinner(playerHand, dealerHand)).toBe('dealer')
    })

    test('Rule 2: Dealer busts, player wins', () => {
      const playerHand = createTestHand([createCard('10'), createCard('9')]) // 19
      const dealerHand = createTestHand([createCard('K'), createCard('Q'), createCard('5')]) // 25 - busted
      
      expect(dealerHand.isBusted).toBe(true)
      expect(BlackjackEngine.determineWinner(playerHand, dealerHand)).toBe('player')
    })

    test('Rule 3: Player blackjack vs dealer non-blackjack', () => {
      const playerHand = createTestHand([createCard('A'), createCard('K')]) // Blackjack
      const dealerHand = createTestHand([createCard('10'), createCard('7')]) // 17
      
      expect(playerHand.isBlackjack).toBe(true)
      expect(dealerHand.isBlackjack).toBe(false)
      expect(BlackjackEngine.determineWinner(playerHand, dealerHand)).toBe('player')
    })

    test('Rule 4: Dealer blackjack vs player non-blackjack', () => {
      const playerHand = createTestHand([createCard('10'), createCard('6')]) // 16
      const dealerHand = createTestHand([createCard('A'), createCard('Q')]) // Blackjack
      
      expect(playerHand.isBlackjack).toBe(false)
      expect(dealerHand.isBlackjack).toBe(true)
      expect(BlackjackEngine.determineWinner(playerHand, dealerHand)).toBe('dealer')
    })

    test('Rule 5: Both have blackjack = push', () => {
      const playerHand = createTestHand([createCard('A'), createCard('K')]) // Blackjack
      const dealerHand = createTestHand([createCard('A'), createCard('Q')]) // Blackjack
      
      expect(playerHand.isBlackjack).toBe(true)
      expect(dealerHand.isBlackjack).toBe(true)
      expect(BlackjackEngine.determineWinner(playerHand, dealerHand)).toBe('push')
    })

    test('Rule 6: Higher value wins', () => {
      const playerHand = createTestHand([createCard('10'), createCard('9')]) // 19
      const dealerHand = createTestHand([createCard('10'), createCard('7')]) // 17
      
      expect(BlackjackEngine.determineWinner(playerHand, dealerHand)).toBe('player')
    })

    test('Rule 7: Same value = push', () => {
      const playerHand = createTestHand([createCard('10'), createCard('8')]) // 18
      const dealerHand = createTestHand([createCard('9'), createCard('9')]) // 18
      
      expect(BlackjackEngine.determineWinner(playerHand, dealerHand)).toBe('push')
    })
  })

  describe('Payout Calculation', () => {
    test('Player wins with blackjack - pays 3:2', () => {
      const playerHand = createTestHand([createCard('A'), createCard('K')]) // Blackjack
      const dealerHand = createTestHand([createCard('10'), createCard('7')]) // 17
      const bet = 100
      
      const payout = BlackjackEngine.calculatePayout(bet, playerHand, dealerHand)
      expect(payout).toBe(250) // bet (100) + winnings (150)
    })

    test('Player wins regular hand - pays 1:1', () => {
      const playerHand = createTestHand([createCard('10'), createCard('9')]) // 19
      const dealerHand = createTestHand([createCard('10'), createCard('7')]) // 17
      const bet = 100
      
      const payout = BlackjackEngine.calculatePayout(bet, playerHand, dealerHand)
      expect(payout).toBe(200) // bet (100) + winnings (100)
    })

    test('Player loses - gets nothing', () => {
      const playerHand = createTestHand([createCard('10'), createCard('6')]) // 16
      const dealerHand = createTestHand([createCard('10'), createCard('9')]) // 19
      const bet = 100
      
      const payout = BlackjackEngine.calculatePayout(bet, playerHand, dealerHand)
      expect(payout).toBe(0) // loses bet
    })

    test('Push - gets bet back', () => {
      const playerHand = createTestHand([createCard('10'), createCard('8')]) // 18
      const dealerHand = createTestHand([createCard('9'), createCard('9')]) // 18
      const bet = 100
      
      const payout = BlackjackEngine.calculatePayout(bet, playerHand, dealerHand)
      expect(payout).toBe(100) // gets bet back
    })
  })

  describe('Dealer Rules', () => {
    test('Dealer hits on 16', () => {
      const hand = createTestHand([createCard('10'), createCard('6')]) // 16
      expect(BlackjackEngine.shouldDealerHit(hand)).toBe(true)
    })

    test('Dealer stands on hard 17', () => {
      const hand = createTestHand([createCard('10'), createCard('7')]) // 17
      expect(BlackjackEngine.shouldDealerHit(hand)).toBe(false)
    })

    test('Dealer hits on soft 17', () => {
      const hand = createTestHand([createCard('A'), createCard('6')]) // Soft 17
      expect(hand.isSoft).toBe(true)
      expect(hand.value).toBe(17)
      expect(BlackjackEngine.shouldDealerHit(hand)).toBe(true)
    })

    test('Dealer stands on 18+', () => {
      const hand = createTestHand([createCard('10'), createCard('8')]) // 18
      expect(BlackjackEngine.shouldDealerHit(hand)).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    test('Player blackjack vs dealer 21 (not blackjack)', () => {
      const playerHand = createTestHand([createCard('A'), createCard('K')]) // Blackjack
      const dealerHand = createTestHand([createCard('7'), createCard('7'), createCard('7')]) // 21 but not blackjack
      
      expect(playerHand.isBlackjack).toBe(true)
      expect(dealerHand.isBlackjack).toBe(false)
      expect(dealerHand.value).toBe(21)
      expect(BlackjackEngine.determineWinner(playerHand, dealerHand)).toBe('player')
    })

    test('Multiple aces handled correctly', () => {
      const hand = createTestHand([createCard('A'), createCard('A'), createCard('A'), createCard('8')])
      expect(hand.value).toBe(21) // A + A + A + 8 = 1 + 1 + 1 + 8 = 11
      expect(hand.isSoft).toBe(true)
    })

    test('Soft hand becomes hard', () => {
      const cards = [createCard('A'), createCard('5'), createCard('7')]
      const hand = createTestHand(cards)
      expect(hand.value).toBe(13) // A(1) + 5 + 7
      expect(hand.isSoft).toBe(false)
    })
  })
})
