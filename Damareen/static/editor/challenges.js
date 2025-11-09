import { showAlert } from './alert.js';

const newCard = document.createElement("div");

const newChallengeButton = document.querySelector(".diff-button");
const deleteButtons = document.querySelectorAll(".delete-button");

const challengesTab = document.querySelector("#challenges");
const difficultySelector = document.querySelector("#diff-type");

const bossNameInput = document.querySelector("#boss-name-input");

const worldCardContainer = document.querySelector(
  "#world_cards .card-container"
);

const imageUrls = JSON.parse(
  document.querySelector("#url-data").dataset.imageUrls
);

let selectedCards = [];
let bossName = "";

const getFromDiff = {
  0: 1,
  1: 5,
  2: 6,
};

function applyBuff(boss, buff) {
  boss.classList.add("buff-card");
  boss.classList.add("card");
  boss.classList.remove("card-small");
  boss.dataset.cardName = bossName;
  if (buff === 1) {
    boss.dataset.cardHp = parseInt(boss.dataset.cardHp) * 2;
  } else if (buff === 2) {
    boss.dataset.cardDmg = parseInt(boss.dataset.cardDmg) * 2;
  }
}

function setActiveButton(thisBtn, otherBtn) {
  thisBtn.classList.add("active-buff");
  otherBtn.classList.remove("active-buff");
}

newChallengeButton.addEventListener("click", async () => {
  selectedCards = [];
  newChallengeButton.removeEventListener("click", this);

  const selectedDifficulty = difficultySelector.value;

  const cardSelector = worldCardContainer.cloneNode(true);
  const availableCards = cardSelector.querySelectorAll(".card");

  if (availableCards.length < getFromDiff[selectedDifficulty]) {
    showAlert("Nincs elég kártya a világban a kiválasztott nehézségi szinthez!");
    newChallengeButton.addEventListener("click", this);
    return;
  }

  if (selectedDifficulty != 0) {
    if (bossNameInput.value.trim() === "") {
      showAlert("Kérlek add meg a vezér nevét!");
      newChallengeButton.addEventListener("click", this);
      return;
    }
  }

  bossName = bossNameInput.value;

  availableCards.forEach((card) =>
    card.querySelectorAll("a").forEach((btn) => btn.remove())
  );

  availableCards.forEach((card) => {
    card.addEventListener("click", () => {
      const cardName = card.dataset.cardName;
      if (card.classList.contains("active-card")) {
        card.classList.remove("active-card");

        selectedCards = selectedCards.filter(
          (c) => c.dataset.cardName !== cardName
        );
      } else {
        card.classList.add("active-card");

        selectedCards.push(card);
      }
    });
  });

  const kazamataContainer = document.createElement("div");
  kazamataContainer.className = "kazamata-container";

  const separator = document.createElement("hr");
  kazamataContainer.append(separator);

  const selectedAmountText = document.createElement("p");
  selectedAmountText.textContent = `${bossNameInput.value} – 0 / ${getFromDiff[selectedDifficulty]} kiválasztva`;
  kazamataContainer.append(selectedAmountText);

  kazamataContainer.append(cardSelector);

  let buffDefButton, buffAttButton;
  if (selectedDifficulty != 0) {
    const buffSelector = document.createElement("div");
    buffSelector.className = "buff-selector";
    buffSelector.innerHTML = "<span>Válassz duplázást a vezérnek: </span>";

    buffDefButton = document.createElement("a");
    buffAttButton = document.createElement("a");

    buffDefButton.className = "button buff-def-button active-buff";
    buffDefButton.textContent = "Életerő";
    buffAttButton.className = "button buff-att-button";
    buffAttButton.textContent = "Sebzés";

    buffDefButton.addEventListener("click", () => {
      setActiveButton(buffDefButton, buffAttButton);
    });
    buffAttButton.addEventListener("click", () => {
      setActiveButton(buffAttButton, buffDefButton);
    });

    buffSelector.appendChild(buffDefButton);
    buffSelector.appendChild(buffAttButton);
    kazamataContainer.append(buffSelector);
  }

  challengesTab.append(kazamataContainer);

  await new Promise((resolve) => {
    availableCards.forEach((card) => {
      card.addEventListener("click", () => {
        const selectedAmount = Object.keys(selectedCards).length;
        selectedAmountText.textContent = `${bossNameInput.value} – ${selectedAmount} / ${getFromDiff[selectedDifficulty]} kiválasztva`;

        if (selectedAmount === getFromDiff[selectedDifficulty]) {
          resolve();
        }
      });
    });
  });

  let buff = 0;

  if (selectedDifficulty != 0) {
    if (buffDefButton.classList.contains("active-buff")) {
      buff = 1;
    } else {
      buff = 2;
    }
  }

  createKazameta(selectedDifficulty, buff, selectedCards);
  kazamataContainer.remove();
  selectedAmountText.remove();
  if (selectedDifficulty != 0) {
    buffDefButton.remove();
    buffAttButton.remove();
  }

  newChallengeButton.addEventListener("click", this);
});

deleteButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentElement.remove();
  });
});

export function createKazameta(difficulty, buff, cards) {
  let newCards = [];
  const wrap = document.createElement("div");
  wrap.className = "kazameta-wrap";
  wrap.dataset.difficulty = difficulty;
  wrap.dataset.buff = buff;

  const container = document.createElement("div");
  container.className = "kazameta-container";

  if (cards instanceof HTMLElement) {
    const newCard = cards.cloneNode(true);
    container.appendChild(newCard);
    newCard.className = "card-small";
  } else {
    Array.from(Object.values(cards)).forEach((card) => {
      let newCard;
      if (card instanceof HTMLElement) {
        newCard = card.cloneNode(true);
        container.appendChild(newCard);
        newCard.className = "card-small";
      } else {
        newCard = createCardElement(card, container);
      }
      newCards.push(newCard);
    });
    if (difficulty !== "0") {
      const boss = newCards[newCards.length - 1];
      applyBuff(boss, buff);
    }
  }

  const deleteButton = document.createElement("button");
  deleteButton.className = "button delete-button";
  deleteButton.textContent = "Kazamata törlése";
  deleteButton.addEventListener("click", () => {
    wrap.remove();
  });

  wrap.appendChild(container);
  wrap.appendChild(deleteButton);

  challengesTab.appendChild(wrap);

  return wrap;
}

function createCardElement(cardData, cardsContainer) {
  const newCard = document.createElement("div");
  newCard.dataset.cardName = cardData.cardName;
  newCard.dataset.cardHp = cardData.cardHp;
  newCard.dataset.cardDmg = cardData.cardDmg;
  newCard.dataset.cardType = cardData.cardType;
  newCard.dataset.cardBackgroundImageIndex = cardData.cardBackgroundImageIndex;
  newCard.className = "card-small";

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

export function gatherChallengeData() {
  let challenges = [];
  const challengeWraps = document.querySelectorAll(".kazameta-wrap");
  challengeWraps.forEach((wrap) => {
    let cards = [];
    Array.from(
      wrap
        .querySelector(".kazameta-container")
        .querySelectorAll("div.card, div.card-small")
    ).forEach((card) => {
      console.log(card.dataset);
      cards.push({ ...card.dataset });
    });
    challenges.push({
      difficulty: wrap.dataset.difficulty,
      buff: wrap.dataset.buff,
      cards: cards,
    });
  });

  const difficulties = challenges.map(c => c.difficulty);
  const hasDiff0 = difficulties.filter(d => d === '0').length >= 1;
  const hasDiff1 = difficulties.filter(d => d === '1').length >= 1;
  const hasDiff2 = difficulties.filter(d => d === '2').length >= 1;
  
  if (!hasDiff0 || !hasDiff1 || !hasDiff2) {
    showAlert('Legalább egy könnyű, egy közepes és egy nehéz kazamatát szükséges létrehozni!');
    throw new Error('Legalább egy könnyű, egy közepes és egy nehéz kazamatát szükséges létrehozni!');
  }

  return challenges;
}
