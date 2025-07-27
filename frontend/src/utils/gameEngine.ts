import type { Card, Hand, BlackjackOdds } from '../types/game';

export class BlackjackEngine {
  static createDeck(): Card[] {
    const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Card['rank'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck: Card[] = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        let value = 0;
        if (rank === 'A') value = 11;
        else if (['J', 'Q', 'K'].includes(rank)) value = 10;
        else value = parseInt(rank);

        deck.push({ suit, rank, value });
      }
    }

    return this.shuffleDeck(deck);
  }

  static shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static calculateHandValue(cards: Card[]): { value: number; isSoft: boolean } {
    let value = 0;
    let aces = 0;

    for (const card of cards) {
      if (card.rank === 'A') {
        aces++;
        value += 11;
      } else {
        value += card.value;
      }
    }

    // Adjust for aces - reduce aces from 11 to 1 until under 21 or no more aces to reduce
    let acesAsEleven = aces;
    while (value > 21 && acesAsEleven > 0) {
      value -= 10;
      acesAsEleven--;
    }

    const isSoft = acesAsEleven > 0 && value <= 21;
    return { value, isSoft };
  }

  static createHand(cards: Card[] = []): Hand {
    const { value, isSoft } = this.calculateHandValue(cards);
    return {
      cards,
      value,
      isSoft,
      isBusted: value > 21,
      isBlackjack: cards.length === 2 && value === 21
    };
  }

  static dealCard(deck: Card[], hand: Hand): { newDeck: Card[]; newHand: Hand } {
    if (deck.length === 0) {
      throw new Error('Deck is empty');
    }

    const newDeck = [...deck];
    const card = newDeck.pop()!;
    const newCards = [...hand.cards, card];
    const newHand = this.createHand(newCards);

    return { newDeck, newHand };
  }

  static canSplit(hand: Hand): boolean {
    return hand.cards.length === 2 && hand.cards[0].rank === hand.cards[1].rank;
  }

  static canDoubleDown(hand: Hand): boolean {
    return hand.cards.length === 2 && !hand.isBusted;
  }

  static shouldDealerHit(hand: Hand): boolean {
    if (hand.value < 17) return true;
    if (hand.value === 17 && hand.isSoft) return true; // Dealer hits soft 17
    return false;
  }

  static determineWinner(playerHand: Hand, dealerHand: Hand): 'player' | 'dealer' | 'push' {
    // Rule 1: If player busts, dealer wins (regardless of dealer's hand)
    if (playerHand.isBusted) return 'dealer';

    // Rule 2: If dealer busts and player doesn't, player wins
    if (dealerHand.isBusted) return 'player';

    // Rule 3: Blackjack vs non-blackjack
    if (playerHand.isBlackjack && !dealerHand.isBlackjack) return 'player';
    if (dealerHand.isBlackjack && !playerHand.isBlackjack) return 'dealer';

    // Rule 4: Both have blackjack = push
    if (playerHand.isBlackjack && dealerHand.isBlackjack) return 'push';

    // Rule 5: Compare point totals (neither busted, neither has blackjack advantage)
    if (playerHand.value > dealerHand.value) return 'player';
    if (dealerHand.value > playerHand.value) return 'dealer';

    // Rule 6: Same point total = push
    return 'push';
  }

  static calculatePayout(bet: number, playerHand: Hand, dealerHand: Hand): number {
    const result = this.determineWinner(playerHand, dealerHand);

    if (result === 'player') {
      // Player wins: return bet + winnings
      return playerHand.isBlackjack ? bet + (bet * 1.5) : bet + bet; // Blackjack pays 3:2, regular win pays 1:1
    }
    if (result === 'dealer') {
      // Player loses: lose the bet
      return 0;
    }
    // Push: return the bet
    return bet;
  }

  static calculateOdds(playerHand: Hand, dealerUpCard: Card, deck: Card[]): BlackjackOdds {
    // Simplified odds calculation - in a real implementation, this would be more complex
    const playerValue = playerHand.value;
    const dealerValue = dealerUpCard.value === 11 ? 11 : dealerUpCard.value;
    
    // Basic probability calculations
    let hitWinProbability = 0;
    let standWinProbability = 0;
    let bustProbability = 0;
    
    // Calculate bust probability on hit
    const cardsTobust = deck.filter(card => {
      const newValue = playerValue + (card.rank === 'A' ? 1 : card.value);
      return newValue > 21;
    }).length;
    
    bustProbability = cardsTobust / deck.length;
    
    // Simplified win probabilities based on basic strategy
    if (playerValue <= 11) {
      hitWinProbability = 0.8;
      standWinProbability = 0.2;
    } else if (playerValue <= 16) {
      if (dealerValue >= 7) {
        hitWinProbability = 0.4;
        standWinProbability = 0.2;
      } else {
        hitWinProbability = 0.3;
        standWinProbability = 0.6;
      }
    } else {
      hitWinProbability = 0.1;
      standWinProbability = 0.7;
    }
    
    // Dealer bust probability based on up card
    const dealerBustProbabilities: { [key: number]: number } = {
      2: 0.35, 3: 0.37, 4: 0.40, 5: 0.42, 6: 0.42,
      7: 0.26, 8: 0.24, 9: 0.23, 10: 0.21, 11: 0.17
    };
    
    const dealerBustProbability = dealerBustProbabilities[dealerValue] || 0.21;
    
    return {
      hitWinProbability: Math.max(0, Math.min(1, hitWinProbability)),
      standWinProbability: Math.max(0, Math.min(1, standWinProbability)),
      bustProbability: Math.max(0, Math.min(1, bustProbability)),
      dealerBustProbability,
      canSplit: this.canSplit(playerHand),
      canDoubleDown: this.canDoubleDown(playerHand),
      splitWinProbability: this.canSplit(playerHand) ? 0.5 : undefined,
      doubleDownWinProbability: this.canDoubleDown(playerHand) ? hitWinProbability * 0.9 : undefined
    };
  }

  static getBasicStrategyAction(playerHand: Hand, dealerUpCard: Card): string {
    const playerValue = playerHand.value;
    const dealerValue = dealerUpCard.value === 11 ? 11 : dealerUpCard.value;
    const isSoft = playerHand.isSoft;
    const canSplit = this.canSplit(playerHand);

    // Simplified basic strategy
    if (canSplit) {
      const pairValue = playerHand.cards[0].value;
      if (pairValue === 11 || pairValue === 8) return 'Split';
      if (pairValue === 10) return 'Stand';
      if (pairValue === 5 || pairValue === 4) return 'Hit';
      // More complex pair logic would go here
    }

    if (isSoft) {
      if (playerValue >= 19) return 'Stand';
      if (playerValue === 18 && dealerValue <= 6) return 'Double/Stand';
      if (playerValue === 18) return 'Stand';
      if (playerValue <= 17 && dealerValue <= 6) return 'Double/Hit';
      return 'Hit';
    }

    // Hard totals
    if (playerValue >= 17) return 'Stand';
    if (playerValue >= 13 && dealerValue <= 6) return 'Stand';
    if (playerValue === 12 && dealerValue >= 4 && dealerValue <= 6) return 'Stand';
    if (playerValue === 11) return 'Double/Hit';
    if (playerValue === 10 && dealerValue <= 9) return 'Double/Hit';
    if (playerValue === 9 && dealerValue >= 3 && dealerValue <= 6) return 'Double/Hit';
    
    return 'Hit';
  }
}
