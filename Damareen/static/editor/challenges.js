const newChallengeButton = document.querySelector(".diff-button");
const deleteButtons = document.querySelectorAll(".delete-button");

const challengesTab = document.querySelector("#challenges");
const difficultySelector = document.querySelector("#diff-type");

const bossNameInput = document.querySelector("#boss-name-input");

const worldCardContainer = document.querySelector(
  "#world_cards .card-container"
);

let selectedCards = {};

const getFromDiff = {
  0: 1,
  1: 5,
  2: 6,
};

function applyBuff(boss, buff) {
  boss.classList.add("buff-card");
  boss.classList.add("card");
  boss.classList.remove("card-small");
  boss.dataset.cardName = bossNameInput.value;
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
  selectedCards = {};
  newChallengeButton.removeEventListener("click", this);

  const selectedDifficulty = difficultySelector.value;

  const cardSelector = worldCardContainer.cloneNode(true);
  const availableCards = cardSelector.querySelectorAll(".card");

  if (availableCards.length < getFromDiff[selectedDifficulty]) {
    alert("Nincs elég kártya a világban a kiválasztott nehézségi szinthez!");
    newChallengeButton.addEventListener("click", this);
    return;
  }

  if (selectedDifficulty != 0) {
    if (bossNameInput.value.trim() === "") {
      alert("Kérlek add meg a vezér nevét!");
      newChallengeButton.addEventListener("click", this);
      return;
    }
  }

  availableCards.forEach((card) => card.childNodes[0].remove());

  availableCards.forEach((card) => {
    card.addEventListener("click", () => {
      const cardName = card.dataset.cardName;
      if (card.classList.contains("active-card")) {
        card.classList.remove("active-card");

        delete selectedCards[cardName];
      } else {
        card.classList.add("active-card");

        selectedCards[cardName] = card;
      }
    });
  });

  challengesTab.prepend(cardSelector);

  const selectedAmountText = document.createElement("p");
  selectedAmountText.textContent = "0 / " + getFromDiff[selectedDifficulty];
  challengesTab.prepend(selectedAmountText);

  let buffDefButton, buffAttButton;
  if (selectedDifficulty != 0) {
    buffDefButton = document.createElement("a");
    buffAttButton = document.createElement("a");

    buffDefButton.className = "button buff-def-button active-buff";
    buffDefButton.textContent = "Def ^";
    buffAttButton.className = "button buff-att-button";
    buffAttButton.textContent = "Att ^";

    buffDefButton.addEventListener("click", () => {
      setActiveButton(buffDefButton, buffAttButton);
    });
    buffAttButton.addEventListener("click", () => {
      setActiveButton(buffAttButton, buffDefButton);
    });

    challengesTab.prepend(buffDefButton);
    challengesTab.prepend(buffAttButton);
  }

  await new Promise((resolve) => {
    availableCards.forEach((card) => {
      card.addEventListener("click", () => {
        const selectedAmount = Object.keys(selectedCards).length;
        selectedAmountText.textContent =
          selectedAmount + " / " + getFromDiff[selectedDifficulty];

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

  createKazameta(challengesTab, selectedDifficulty, buff, selectedCards);
  cardSelector.remove();
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

export function createKazameta(parent, difficulty, buff, cards) {
  let newCards = [];
  const wrap = document.createElement("div");
  wrap.className = "kazameta-wrap";
  wrap.dataset.difficulty = difficulty;

  const container = document.createElement("div");
  container.className = "kazameta-container";

  if (cards instanceof HTMLElement) {
    const newCard = cards.cloneNode(true);
    container.appendChild(newCard);
    newCard.className = "card-small";
  } else if (Array.isArray(cards) && typeof cards[0] === "string") {
    cards.forEach((id) => {
      const newCard = document
        .querySelector(`#world_cards .card[data-card-id="${id}"]`)
        .cloneNode(true);
      container.appendChild(newCard);
      newCard.className = "card-small";
      newCards.push(newCard);
    });
    if (difficulty !== "0") {
      const boss = newCards[newCards.length - 1];
      applyBuff(boss, buff);
    }
  } else {
    Array.from(Object.values(cards)).forEach((card) => {
      const newCard = card.cloneNode(true);
      container.appendChild(newCard);
      newCard.className = "card-small";
      newCards.push(newCard);
    });
    if (difficulty !== "0") {
      const boss = newCards[newCards.length - 1];
      applyBuff(boss, buff);
    }
  }

  const deleteButton = document.createElement("a");
  deleteButton.className = "button delete-button";
  deleteButton.textContent = "Törlés";
  deleteButton.addEventListener("click", () => {
    wrap.remove();
  });

  wrap.appendChild(container);
  wrap.appendChild(deleteButton);

  parent.appendChild(wrap);

  return wrap;
}

export function gatherChallengeData() {
  let challenges = [];
  const challengeWraps = document.querySelectorAll(".kazameta-wrap");
  challengeWraps.forEach((wrap) => {
    let cards = [];
    Array.from(wrap.querySelectorAll("div")).forEach((card) => {
      cards.push({ ...card.dataset });
    });
    challenges.push({ ...wrap.dataset, ...cards });
  });
  return challenges;
}
