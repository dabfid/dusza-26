const diffButton = document.querySelector(".diff-button");
const deleteButtons = document.querySelectorAll(".delete-button");

const challengesTab = document.querySelector("#challenges");
const difficultySelector = document.querySelector("#diff-type");

const deckCardContainer = document.querySelector("#deck .card-container");

let selectedCards = {};

const getFromDiff = {
  0: 1,
  1: 5,
  2: 6,
};

function setActiveButton(activeBtn, inactiveBtn) {
  activeBtn.classList.add("active-buff");
  inactiveBtn.classList.remove("active-buff");
}

diffButton.addEventListener("click", async () => {
  selectedCards = {};
  diffButton.removeEventListener("click", this);

  const selectedDifficulty = difficultySelector.value;

  const cardSelector = deckCardContainer.cloneNode(true);
  const availableCards = cardSelector.querySelectorAll(".card");

  if (availableCards.length < getFromDiff[selectedDifficulty]) {
    alert("Nincs elég kártya a pakliban a kiválasztott nehézségi szinthez!");
    diffButton.addEventListener("click", this);
    return;
  }

  availableCards.forEach((card) => {
    card.classList.remove("active-card");
    card.addEventListener("click", () => {
      const cardId = card.dataset.cardId;
      if (card.classList.contains("active-card")) {
        card.classList.remove("active-card");

        delete selectedCards[cardId];
      } else {
        card.classList.add("active-card");

        selectedCards[cardId] = card;
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

    buffDefButton.className = "button buff-def-button";
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
    if (buffDefButton.classList.contains("active-buff-button")) {
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

  diffButton.addEventListener("click", this);
});

deleteButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentElement.remove();
  });
});

function createKazameta(parent, difficulty, buff, cards) {
  const wrap = document.createElement("div");
  wrap.className = "kazameta-wrap";
  wrap.dataset.buff = buff;
  wrap.dataset.difficulty = difficulty;

  const container = document.createElement("div");
  container.className = "kazameta-container";

  if (typeof cards === "object") {
    Object.values(cards).forEach((card) => {
      const newCard = card.cloneNode(true);
      container.appendChild(newCard);
      newCard.className = "card-small";
    });
  } else {
    cards.forEach((card) => {
      const newCard = card.cloneNode(true);
      container.appendChild(newCard);
      newCard.className = "card-small";
    });
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
  let activeChallenges = [];
  const challengeWraps = document.querySelectorAll(".kazameta-wrap");
  challengeWraps.forEach((wrap) => {
    const difficulty = wrap.dataset.difficulty;
    const buff = wrap.dataset.buff;
    const cards = Array.from(wrap.querySelectorAll(".card-small")).map(
      (card) => card.dataset.cardId
    );
    activeChallenges.push({ difficulty, buff, cards });
  });
  return activeChallenges;
}
