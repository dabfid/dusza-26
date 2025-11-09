import { createKazameta } from "./challenges.js";
import { createCardElement } from "./cards.js";

const world = document.querySelector("#world");

const nameTextbox = document.querySelector("#world-name");

function loadCardData(cardData) {
  const { worldCards, deckCards } = cardData;

  for (const card of worldCards) {
    createCardElement(card);
  }

  for (const card of deckCards) {
    const deckCard = document.querySelector(
      `#deck .card-container .card[data-card-name='${card.cardName}']`
    );
    if (deckCard) {
      deckCard.classList.add("active-card");
    }
  }
}
// TODO save kazamatak, load kazamatak as images instead of div
function loadChallengeData(challengeData) {
  for (const challenge of challengeData) {
    createKazameta(challenge.difficulty, challenge.buff, challenge.cards);
  }
}

if (world) {
  const worldName = world.dataset.worldName;
  const levelData = world.dataset.levelData.replace(/'/g, '"');

  nameTextbox.value = worldName;
  const parsedLevelData = JSON.parse(levelData);

  loadCardData(parsedLevelData.cardData);
  loadChallengeData(parsedLevelData.challengeData);
}
