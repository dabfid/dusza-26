const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

const deckTabContainer = document.querySelector("#deck .card-container");

const worldCards = document.querySelectorAll("#world_cards .card");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetTab = button.dataset.tab;

    tabButtons.forEach((btn) => {
      btn.classList.remove("active");
    });
    tabContents.forEach((tab) => {
      tab.classList.add("hidden");
    });

    button.classList.add("active");
    document.getElementById(targetTab).classList.remove("hidden");
  });
});

worldCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (card.classList.contains("active-card")) {
      card.classList.remove("active-card");

      const div = document.querySelector(
        "#deck .card-container .card[data-card-id='" +
          card.dataset.cardId +
          "']"
      );
      div.remove();
    } else {
      card.classList.add("active-card");

      const newCard = card.cloneNode(true);
      newCard.classList.remove("active-card");

      newCard.addEventListener("click", () => {
        if (newCard.classList.contains("active-card")) {
          newCard.classList.remove("active-card");
        } else {
          newCard.classList.add("active-card");
        }
      });

      deckTabContainer.appendChild(newCard);
    }
  });
});

export function gatherCardData() {
  let activeWorldCards = new Array();
  worldCards.forEach((card) => {
    if (card.classList.contains("active-card")) {
      activeWorldCards.push(card.dataset.cardId);
    }
  });

  const deckCards = document.querySelectorAll("#deck .card");
  let activeDeckCards = new Array();
  deckCards.forEach((card) => {
    if (card.classList.contains("active-card")) {
      activeDeckCards.push(card.dataset.cardId);
    }
  });

  return {
    active_world_cards: activeWorldCards,
    active_deckCards: activeDeckCards,
  };
}
