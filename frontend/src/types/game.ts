export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
  value: number;
}

export interface Hand {
  cards: Card[];
  value: number;
  isSoft: boolean; // Has an ace counted as 11
  isBusted: boolean;
  isBlackjack: boolean;
}

export interface Player {
  id: string;
  name: string;
  hand: Hand;
  bet: number;
  chips: number;
  isDealer?: boolean;
  hasStood?: boolean;
  hasDoubledDown?: boolean;
  splitHands?: Hand[];
  currentHandIndex?: number;
}

export interface GameState {
  players: Player[];
  dealer: Player;
  deck: Card[];
  currentPlayerIndex: number;
  gamePhase: 'betting' | 'dealing' | 'playing' | 'dealer-turn' | 'game-over';
  minBet: number;
  maxBet: number;
}

export interface GameAction {
  type: 'hit' | 'stand' | 'double-down' | 'split' | 'bet' | 'deal' | 'new-game';
  playerId?: string;
  amount?: number;
}

export interface BlackjackOdds {
  hitWinProbability: number;
  standWinProbability: number;
  bustProbability: number;
  dealerBustProbability: number;
  canSplit: boolean;
  canDoubleDown: boolean;
  splitWinProbability?: number;
  doubleDownWinProbability?: number;
}

export interface GameStats {
  basicStrategyChart: { [key: string]: string };
  houseEdge: number;
  playerAdvantage: { [key: string]: number };
  cardCountingEffects: { [key: string]: number };
}
