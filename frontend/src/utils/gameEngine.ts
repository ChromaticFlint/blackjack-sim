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

  static splitHand(hand: Hand): { hand1: Hand; hand2: Hand } {
    if (!this.canSplit(hand)) {
      throw new Error('Cannot split this hand');
    }

    const hand1 = this.createHand([hand.cards[0]]);
    const hand2 = this.createHand([hand.cards[1]]);

    return { hand1, hand2 };
  }

  static dealCardToSplitHand(deck: Card[], splitHands: Hand[], handIndex: number): {
    newDeck: Card[];
    newSplitHands: Hand[];
  } {
    if (deck.length === 0) {
      throw new Error('Deck is empty');
    }

    if (handIndex < 0 || handIndex >= splitHands.length) {
      throw new Error('Invalid hand index');
    }

    const newDeck = [...deck];
    const card = newDeck.pop()!;
    const newSplitHands = [...splitHands];

    const newCards = [...splitHands[handIndex].cards, card];
    newSplitHands[handIndex] = this.createHand(newCards);

    return { newDeck, newSplitHands };
  }

  static shouldDealerHit(hand: Hand): boolean {
    if (hand.value < 17) return true;
    if (hand.value === 17 && hand.isSoft) return true; // Dealer hits soft 17
    return false;
  }

  static determineWinner(playerHand: Hand, dealerHand: Hand): 'player' | 'dealer' | 'push' {
    console.log('=== WIN CONDITION ANALYSIS ===');
    console.log('Player:', {
      value: playerHand.value,
      cards: playerHand.cards.length,
      isBusted: playerHand.isBusted,
      isBlackjack: playerHand.isBlackjack,
      cardValues: playerHand.cards.map(c => c.rank)
    });
    console.log('Dealer:', {
      value: dealerHand.value,
      cards: dealerHand.cards.length,
      isBusted: dealerHand.isBusted,
      isBlackjack: dealerHand.isBlackjack,
      cardValues: dealerHand.cards.map(c => c.rank)
    });

    // Rule 1: If player busts, dealer wins (regardless of dealer's hand)
    if (playerHand.isBusted) {
      console.log('Result: DEALER WINS (player busted)');
      return 'dealer';
    }

    // Rule 2: If dealer busts and player doesn't, player wins
    if (dealerHand.isBusted) {
      console.log('Result: PLAYER WINS (dealer busted)');
      return 'player';
    }

    // Rule 3: Blackjack vs non-blackjack
    if (playerHand.isBlackjack && !dealerHand.isBlackjack) {
      console.log('Result: PLAYER WINS (player blackjack vs dealer non-blackjack)');
      return 'player';
    }
    if (dealerHand.isBlackjack && !playerHand.isBlackjack) {
      console.log('Result: DEALER WINS (dealer blackjack vs player non-blackjack)');
      return 'dealer';
    }

    // Rule 4: Both have blackjack = push
    if (playerHand.isBlackjack && dealerHand.isBlackjack) {
      console.log('Result: PUSH (both have blackjack)');
      return 'push';
    }

    // Rule 5: Compare point totals (neither busted, neither has blackjack advantage)
    if (playerHand.value > dealerHand.value) {
      console.log(`Result: PLAYER WINS (${playerHand.value} vs ${dealerHand.value})`);
      return 'player';
    }
    if (dealerHand.value > playerHand.value) {
      console.log(`Result: DEALER WINS (${dealerHand.value} vs ${playerHand.value})`);
      return 'dealer';
    }

    // Rule 6: Same point total = push
    console.log(`Result: PUSH (both have ${playerHand.value})`);
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
    const playerValue = playerHand.value;

    // Calculate accurate bust probability on hit
    const bustProbability = this.calculateBustProbability(playerHand, deck);

    // Calculate dealer final hand probabilities
    const dealerProbs = this.calculateDealerProbabilities(dealerUpCard, deck);

    // Calculate hit win probability
    const hitWinProbability = this.calculateHitWinProbability(playerHand, dealerProbs, deck);

    // Calculate stand win probability
    const standWinProbability = this.calculateStandWinProbability(playerValue, dealerProbs);

    // Calculate double down win probability (if applicable)
    const doubleDownWinProbability = this.canDoubleDown(playerHand) ?
      this.calculateDoubleDownWinProbability(playerHand, dealerProbs, deck) : undefined;

    // Calculate split win probability (if applicable)
    const splitWinProbability = this.canSplit(playerHand) ?
      this.calculateSplitWinProbability(playerHand, dealerUpCard, deck) : undefined;

    return {
      hitWinProbability: Math.round(hitWinProbability * 1000) / 10, // Round to 0.1%
      standWinProbability: Math.round(standWinProbability * 1000) / 10,
      bustProbability: Math.round(bustProbability * 1000) / 10,
      dealerBustProbability: Math.round(dealerProbs.bustProbability * 1000) / 10,
      canSplit: this.canSplit(playerHand),
      canDoubleDown: this.canDoubleDown(playerHand),
      splitWinProbability: splitWinProbability ? Math.round(splitWinProbability * 1000) / 10 : undefined,
      doubleDownWinProbability: doubleDownWinProbability ? Math.round(doubleDownWinProbability * 1000) / 10 : undefined
    };
  }

  static calculateBustProbability(playerHand: Hand, deck: Card[]): number {
    if (playerHand.value >= 21) return playerHand.value > 21 ? 1 : 0;

    let bustCards = 0;
    for (const card of deck) {
      const cardValue = card.rank === 'A' ? 1 : card.value; // Use 1 for Ace to be conservative
      if (playerHand.value + cardValue > 21) {
        bustCards++;
      }
    }

    return deck.length > 0 ? bustCards / deck.length : 0;
  }

  static calculateDealerProbabilities(dealerUpCard: Card, _deck: Card[]): {
    finalValues: { [value: number]: number },
    bustProbability: number
  } {
    // Accurate dealer bust probabilities based on up card (from blackjack mathematics)
    const dealerBustProbs: { [key: string]: number } = {
      'A': 0.1157, '2': 0.3539, '3': 0.3745, '4': 0.4040, '5': 0.4283, '6': 0.4238,
      '7': 0.2616, '8': 0.2385, '9': 0.2327, '10': 0.2131, 'J': 0.2131, 'Q': 0.2131, 'K': 0.2131
    };

    // Dealer final hand probabilities (17-21)
    const dealerFinalProbs: { [key: string]: { [value: number]: number } } = {
      'A': { 17: 0.1317, 18: 0.1317, 19: 0.1317, 20: 0.1317, 21: 0.3075 },
      '2': { 17: 0.1393, 18: 0.1314, 19: 0.1303, 20: 0.1258, 21: 0.1193 },
      '3': { 17: 0.1301, 18: 0.1327, 19: 0.1303, 20: 0.1258, 21: 0.1066 },
      '4': { 17: 0.1208, 18: 0.1340, 19: 0.1303, 20: 0.1258, 21: 0.0851 },
      '5': { 17: 0.1208, 18: 0.1227, 19: 0.1303, 20: 0.1258, 21: 0.0721 },
      '6': { 17: 0.1654, 18: 0.1063, 19: 0.1063, 20: 0.1063, 21: 0.0919 },
      '7': { 17: 0.3692, 18: 0.1385, 19: 0.0769, 20: 0.0769, 21: 0.0769 },
      '8': { 17: 0.1292, 18: 0.3615, 19: 0.1292, 20: 0.0615, 21: 0.0615 },
      '9': { 17: 0.1173, 18: 0.1173, 19: 0.3596, 20: 0.1173, 21: 0.0558 },
      '10': { 17: 0.0385, 18: 0.0385, 19: 0.0385, 20: 0.7692, 21: 0.0385 },
      'J': { 17: 0.0385, 18: 0.0385, 19: 0.0385, 20: 0.7692, 21: 0.0385 },
      'Q': { 17: 0.0385, 18: 0.0385, 19: 0.0385, 20: 0.7692, 21: 0.0385 },
      'K': { 17: 0.0385, 18: 0.0385, 19: 0.0385, 20: 0.7692, 21: 0.0385 }
    };

    const bustProbability = dealerBustProbs[dealerUpCard.rank] || 0.21;
    const finalValues = dealerFinalProbs[dealerUpCard.rank] ||
      { 17: 0.2, 18: 0.2, 19: 0.2, 20: 0.2, 21: 0.2 };

    return { finalValues, bustProbability };
  }

  static calculateHitWinProbability(playerHand: Hand, dealerProbs: any, deck: Card[]): number {
    if (playerHand.value >= 21) return 0;

    let totalWinProb = 0;
    let totalCards = 0;

    for (const card of deck) {
      const cardValue = card.rank === 'A' ?
        (playerHand.value + 11 <= 21 ? 11 : 1) : card.value;
      const newValue = playerHand.value + cardValue;

      if (newValue > 21) {
        // Bust - 0% win probability
        totalCards++;
        continue;
      }

      // Calculate win probability for this new hand value
      let winProb = dealerProbs.bustProbability; // Win if dealer busts

      // Add probability of beating dealer's final hands
      for (const [dealerFinal, prob] of Object.entries(dealerProbs.finalValues)) {
        const dealerValue = parseInt(dealerFinal);
        if (newValue > dealerValue) {
          winProb += prob as number;
        } else if (newValue === dealerValue) {
          // Push - no win/loss
        }
      }

      totalWinProb += winProb;
      totalCards++;
    }

    return totalCards > 0 ? totalWinProb / totalCards : 0;
  }

  static calculateStandWinProbability(playerValue: number, dealerProbs: any): number {
    if (playerValue > 21) return 0;
    if (playerValue < 17) return dealerProbs.bustProbability; // Only win if dealer busts

    let winProb = dealerProbs.bustProbability; // Win if dealer busts

    // Add probability of beating dealer's final hands
    for (const [dealerFinal, prob] of Object.entries(dealerProbs.finalValues)) {
      const dealerValue = parseInt(dealerFinal);
      if (playerValue > dealerValue) {
        winProb += prob as number;
      }
    }

    return winProb;
  }

  static calculateDoubleDownWinProbability(playerHand: Hand, dealerProbs: any, deck: Card[]): number {
    // Double down takes exactly one card, then stands
    if (playerHand.value >= 21) return 0;

    let totalWinProb = 0;
    let totalCards = 0;

    for (const card of deck) {
      const cardValue = card.rank === 'A' ?
        (playerHand.value + 11 <= 21 ? 11 : 1) : card.value;
      const newValue = playerHand.value + cardValue;

      if (newValue > 21) {
        // Bust - 0% win probability
        totalCards++;
        continue;
      }

      // Calculate stand win probability for this final value
      const winProb = this.calculateStandWinProbability(newValue, dealerProbs);
      totalWinProb += winProb;
      totalCards++;
    }

    return totalCards > 0 ? totalWinProb / totalCards : 0;
  }

  static calculateSplitWinProbability(playerHand: Hand, dealerUpCard: Card, deck: Card[]): number {
    if (!this.canSplit(playerHand)) return 0;

    // Simplified split calculation - average win probability for each split hand
    const cardRank = playerHand.cards[0].rank;

    // Calculate average win probability after hitting once on each split hand
    let totalWinProb = 0;
    let validOutcomes = 0;

    for (const card of deck) {
      if (card.rank === cardRank) continue; // Can't draw the same card we split

      const newCards = [playerHand.cards[0], card];
      const newHand = this.createHand(newCards);

      if (newHand.value <= 21) {
        const dealerProbs = this.calculateDealerProbabilities(dealerUpCard, deck);
        const handWinProb = this.calculateStandWinProbability(newHand.value, dealerProbs);
        totalWinProb += handWinProb;
      }
      validOutcomes++;
    }

    // Return average win probability for both split hands
    return validOutcomes > 0 ? totalWinProb / validOutcomes : 0;
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
