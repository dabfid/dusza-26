const deckTabContainer = document.querySelector("#deck .card-container");

const worldCardsContainer = document.querySelector(
  "#world_cards .card-container"
);

const newCardButton = document.querySelector("#new-card-button");
const newCardNameInput = document.querySelector("#new-card-name");
const newCardHpInput = document.querySelector("#new-card-hp");
const newCardDmgInput = document.querySelector("#new-card-dmg");
const newCardTypeSelect = document.querySelector("#new-card-type");

const imageUrls = JSON.parse(
  document.querySelector("#url-data").dataset.imageUrls
);

let cardNames = [];

newCardButton.addEventListener("click", () => {
  const newCardName = newCardNameInput.value.trim();
  if (!newCardName) {
    alert("Kérlek adj meg egy kártyanevet.");
    return;
  }

  if (!newCardHpInput.value || !newCardDmgInput.value) {
    alert("Kérlek adj meg életerőt és sebzést a kártyához szám formályában.");
    return;
  }

  if (cardNames.includes(newCardName)) {
    alert("Már létezik ilyen nevű kártya.");
    return;
  }

  cardNames.push(newCardName);

  const backgroundImageIndex = Math.floor(
    Math.random() * imageUrls[newCardTypeSelect.value].length
  );

  createCardElement({
    cardName: newCardName,
    cardHp: newCardHpInput.value,
    cardDmg: newCardDmgInput.value,
    cardType: newCardTypeSelect.value,
    cardBackgroundImageIndex: backgroundImageIndex,
  });

  newCardNameInput.value = "";
  newCardHpInput.value = "";
  newCardDmgInput.value = "";
  newCardTypeSelect.value = "0";
});

const deleteButtons = document.querySelectorAll("#world_cards .card-delete");
deleteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".card");
    const cardName = card.dataset.cardName;
    deleteCardClick(card, cardName);
  });
});

export function createCardElement(cardData) {
  const newCard = document.createElement("div");
  newCard.dataset.cardName = cardData.cardName;
  newCard.dataset.cardHp = cardData.cardHp;
  newCard.dataset.cardDmg = cardData.cardDmg;
  newCard.dataset.cardType = cardData.cardType;
  newCard.dataset.cardBackgroundImageIndex = cardData.cardBackgroundImageIndex;
  newCard.className = "card";

  const background = document.createElement("img");
  background.className = "card-background";

  background.src =
    imageUrls[cardData.cardType][cardData.cardBackgroundImageIndex];
  newCard.appendChild(background);

  const deleteButton = document.createElement("a");
  deleteButton.className = "card-delete";
  deleteButton.textContent = "Törlés";
  deleteButton.addEventListener("click", () =>
    deleteCardClick(newCard, deckCard, cardData.cardName)
  );

  const deckCard = newCard.cloneNode(true);

  deckCard.addEventListener("click", () => {
    deckCard.classList.toggle("active-card");
  });

  newCard.appendChild(deleteButton);
  worldCardsContainer.appendChild(newCard);

  deckTabContainer.appendChild(deckCard);
}

function deleteCardClick(newCard, newCardName) {
  newCard.remove();
  const deckCard = document.querySelector(
    `#deck .card-container .card[data-card-name='${newCardName}']`
  );
  if (deckCard) {
    deckCard.remove();
  }
}

export function gatherCardData() {
  let worldCards = new Array();
  const worldCardElements = document.querySelectorAll("#world_cards .card");
  worldCardElements.forEach((card) => {
    worldCards.push({ ...card.dataset });
  });

  let DeckCards = new Array();
  const deckCardsElements = document.querySelectorAll("#deck .card");
  deckCardsElements.forEach((card) => {
    if (card.classList.contains("active-card")) {
      DeckCards.push({ ...card.dataset });
    }
  });

  return {
    worldCards: worldCards,
    deckCards: DeckCards,
  };
}
