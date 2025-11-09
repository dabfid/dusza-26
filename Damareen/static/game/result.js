const imageUrlsData = document.querySelector("#url-data");
const imageUrls = JSON.parse(imageUrlsData.dataset.imageUrls);

const results = document.querySelectorAll(".result");

const resultsContainer = document.querySelector(".result-container");

const battleData = document.querySelector("#battle-data");
const worldId = battleData.dataset.worldId;
const difficulty = battleData.dataset.difficulty;
const didEnemyWin = battleData.dataset.didPPlayerWin;

const winButton = document.querySelector("#win-button");
const loseButton = document.querySelector("#lose-button");

results.forEach((result) => {
  const playerCard = result.querySelector(".player-card").dataset.card;
  const enemyCard = result.querySelector(".enemy-card").dataset.card;
  const outcome = result.querySelector(".result-view").dataset.result;

  const playerCardData = JSON.parse(playerCard);
  const enemyCardData = JSON.parse(enemyCard);

  const newResultEntry = document.createElement("div");
  newResultEntry.className = "result-entry";

  const playerCardElement = createCardElement(playerCardData, newResultEntry);

  const enemyCardElement = createCardElement(enemyCardData, newResultEntry);

  const resultElement = document.createElement("div");
  resultElement.className = "result-view";
  if (outcome === "True") {
    resultElement.textContent = "Vereség";
  } else {
    resultElement.textContent = "Győzelem";
  }
  newResultEntry.appendChild(resultElement);

  resultsContainer.appendChild(newResultEntry);
});

function createCardElement(cardData, cardsContainer) {
  const newCard = document.createElement("div");
  newCard.dataset.cardName = cardData.cardName;
  newCard.dataset.cardHp = cardData.cardHp;
  newCard.dataset.cardDmg = cardData.cardDmg;
  newCard.dataset.cardType = cardData.cardType;
  newCard.dataset.cardBackgroundImageIndex = cardData.cardBackgroundImageIndex;
  newCard.className = "card";

  const topRow = document.createElement("div");
  topRow.className = "card-top-row";

  const nameElement = document.createElement("span");
  nameElement.className = "card-name";
  nameElement.textContent = cardData.cardName;
  topRow.appendChild(nameElement);

  newCard.appendChild(topRow);

  const background = document.createElement("img");
  background.src =
    imageUrls[cardData.cardType][cardData.cardBackgroundImageIndex];
  background.className = "card-picture";
  newCard.appendChild(background);

  const info = document.createElement("div");
  info.className = "card-info";

  const hpElement = document.createElement("span");
  hpElement.className = "card-hp";
  hpElement.textContent = `${cardData.cardHp}`;
  info.appendChild(hpElement);

  const dmgElement = document.createElement("span");
  dmgElement.className = "card-dmg";
  dmgElement.textContent = `${cardData.cardDmg}`;
  info.appendChild(dmgElement);

  newCard.appendChild(info);

  cardsContainer.appendChild(newCard);
  return newCard;
}

if (winButton) {
  winButton.addEventListener("click", () => {
    window.location.href = `/game/upgrade/${worldId}/${difficulty}`;
  });
}

if (loseButton) {
  loseButton.addEventListener("click", () => {
    window.location.href = `/game/difficulty/${worldId}`;
  });
}

// Rejtés/megjelenítés betöltéskor és 2s után
document.addEventListener("DOMContentLoaded", () => {
  const resultsShown = document.querySelector("#resultsShown");
  const resultAnimation = document.querySelector("#resultAnimation");

  // Kezdetben a resultsShown legyen rejtve
  if (resultsShown) resultsShown.style.display = "none";

  // 2 másodperc után: animáció elrejt, eredmények megjelennek
  setTimeout(() => {
    if (resultAnimation) resultAnimation.style.display = "none";
    if (resultsShown) resultsShown.style.display = "";
  }, 1500);
});
