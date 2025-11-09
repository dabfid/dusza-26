const cards = document.querySelectorAll(".card-data");
const cardsContainer = document.querySelector("#card-container");

let selectedCards = [];

const imageUrlsData = document.querySelector("#url-data");
const imageUrls = JSON.parse(imageUrlsData.dataset.imageUrls);

const charactersInput = document.querySelector("#characters_input");

const difficultyData =
  document.querySelector("#difficulty-data").dataset.challengeDifficulty;

const getFromDiff = {
  0: 1,
  1: 5,
  2: 6,
};

const selectedCountText = document.querySelector("#selected_count");
selectedCountText.textContent = `Kiválasztva: ${selectedCards.length}/${getFromDiff[difficultyData]}`;

const submitButton = document.querySelector("#submit-cards");

const challengeId = document.querySelector("#selected-challenge-data").dataset
  .challengeId;

cards.forEach((card) => {
  createCardElement({
    cardName: card.dataset.name,
    cardHp: card.dataset.hp,
    cardDmg: card.dataset.dmg,
    cardType: card.dataset.type,
    cardBackgroundImageIndex: card.dataset.img,
  });
});

function createCardElement(cardData) {
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

  newCard.addEventListener("click", () => {
    const cardName = newCard.dataset.cardName;
    if (newCard.classList.contains("active-card")) {
      newCard.classList.remove("active-card");

      selectedCards = selectedCards.filter(
        (c) => c.dataset.cardName !== cardName
      );
    } else {
      newCard.classList.add("active-card");

      selectedCards.push(newCard);
    }
    selectedCountText.textContent = `Kiválasztva: ${selectedCards.length}/${getFromDiff[difficultyData]}`;
    updateButtonSendState();
  });

  cardsContainer.appendChild(newCard);
}

function updateButtonSendState() {
  if (selectedCards.length === getFromDiff[difficultyData]) {
    submitButton.classList.remove("disabled-button");
  } else {
    submitButton.classList.add("disabled-button");
  }
}

submitButton.addEventListener("click", (e) => {
  e.preventDefault();

  if (selectedCards.length !== getFromDiff[difficultyData]) {
    return;
  }

  charactersInput.value = JSON.stringify({
    cards: selectedCards.map((card) => ({
      cardName: card.dataset.cardName,
      cardHp: card.dataset.cardHp,
      cardDmg: card.dataset.cardDmg,
      cardType: card.dataset.cardType,
      cardBackgroundImageIndex: card.dataset.cardBackgroundImageIndex,
    })),
    challengeId: challengeId,
  });

  document.querySelector("#choose-form").submit();
});
