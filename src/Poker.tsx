import React, { useEffect, useState } from 'react';


type Card = {
  value: string;
  color: string;
};

const generateDeck = (): Card[] => {
  const colors = ['♥️', '♦️', '♠️', '♣️'];
  const values = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A']; 
  const deck: Card[] = [];

  for (const color of colors) {
    for (const value of values) {
      deck.push({ value, color });
    }
  }
  return deck;
};

const shuffleDeck = (deck: Card[]): Card[] => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const Poker = () => {
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [computerHand, setComputerHand] = useState<Card[]>([]);
  const [winner, setWinner] = useState<[string, string] | null>(null);
  const [showPlayerCards, setshowPlayerCards] = useState<number>(0);

  const dealCards = () => {
    const deck = shuffleDeck(generateDeck());
    const newComputerHand = deck.slice(0, 4);
    const newPlayerHand = deck.slice(4, 8);
    setComputerHand(newComputerHand);
    setPlayerHand(newPlayerHand);
    setshowPlayerCards(0);
    setWinner(null);
  };

  useEffect(() => {
    if (showPlayerCards < playerHand.length) {
      const timer = setTimeout(() => {
        setshowPlayerCards(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else if (playerHand.length > 0 && computerHand.length > 0) {
      setWinner(annonceWinner(playerHand, computerHand));
    }
  }, [playerHand, computerHand, showPlayerCards]);

  const cardValue = (value: string): number => {
    const values = {'7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};
    return values[value as keyof typeof values];
  };

  const evaluateHand = (hand: Card[]): [string, number] => {
    const valueCounts: { [key: string]: number } = {};
    hand.forEach(card => {
      valueCounts[card.value] = (valueCounts[card.value] || 0) + 1;
    });
    const counts = Object.entries(valueCounts).sort((a, b) => b[1] - a[1] || cardValue(b[0]) - cardValue(a[0]));

    if (counts[0][1] === 4) return ['un Carré', cardValue(counts[0][0])];
    if (counts[0][1] === 3) return ['un Brelan', cardValue(counts[0][0])];
    if (counts[0][1] === 2 && counts[1][1] === 2) return ['une Double paire', cardValue(counts[0][0])];
    if (counts[0][1] === 2) return ['une Paire', cardValue(counts[0][0])];
    return ['', cardValue(counts[0][0])];
  };

  const annonceWinner = (playerHand: Card[], computerHand: Card[]): [string, string] => {
    const handCombinations = ['Meilleure carte', 'une Paire', 'une Double paire', 'un Brelan', 'un Carré'];
    const [playerRank, playerBestCard] = evaluateHand(playerHand);
    const [computerRank, computerBestCard] = evaluateHand(computerHand);

    if (handCombinations.indexOf(playerRank) > handCombinations.indexOf(computerRank)) {
      return [`GG ! Le Joueur gagne avec ${playerRank}`, 'player-win'];
    } else if (handCombinations.indexOf(playerRank) < handCombinations.indexOf(computerRank)) {
      return [`Aie... L'Ordinateur gagne avec ${computerRank}`, 'computer-win'];
    } else {
      if (playerBestCard > computerBestCard) {
        return [`GG ! Le Joueur gagne avec ${playerRank} (${playerHand.find(card => cardValue(card.value) === playerBestCard)?.value})`, 'player-win'];
      } else if (playerBestCard < computerBestCard) {
        return [`Aie... L'Ordinateur gagne avec ${computerRank} (${computerHand.find(card => cardValue(card.value) === computerBestCard)?.value})`, 'computer-win'];
      } else {
        return ['Égalité', 'tie'];
      }
    }
  };

  return (
    <div className="poker-game">
      <img src='./logo_poker.png' alt="Simple Poker Logo"></img>
      <button className="distribButton" onClick={dealCards}>Distribuer</button>
      <div className="area">
        <div className="computerHand">
          <h2>Main de l'ordinateur</h2>
          <div className="cards">
            {computerHand.map((card, index) => (
              <div key={index} className="card">
                <div className="value">{card.value} {card.color}</div>
              </div>
            ))}
          </div>
        </div>  
        <div className="winner">
          {winner && (
            <h2 className={winner[1]}>{winner[0]}</h2>
          )}
        </div>
        <div className="playerHand">
          <div className="cards">
            {playerHand.slice(0, showPlayerCards).map((card, index) => (
              <div key={index} className="card">
                <div className="value">{card.value} {card.color}</div>
              </div>
            ))}
          </div>
          <h2>Main du joueur</h2>
        </div>
      </div>
    </div>
  );
};

export default Poker;