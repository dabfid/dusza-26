const cards = document.querySelectorAll(".card-data");
const cardsContainer = document.querySelector("#card-container");

let selectedCards = [];

const imageUrlsData = document.querySelector("#url-data");
const imageUrls = JSON.parse(imageUrlsData.dataset.imageUrls);

const charactersInput = document.querySelector("#characters_input");

const difficultyData = document.querySelector("#difficulty-data");
const difficulty = parseInt(difficultyData.dataset.difficulty);

const worldData = document.querySelector("#world-id-data");
const worldId = worldData.dataset.worldId;

cards.forEach((card) => {
  createCardElement({
    cardName: card.dataset.name,
    cardHp: card.dataset.hp,
    cardDmg: card.dataset.dmg,
    cardType: card.dataset.type,
    cardBackgroundImageIndex: card.dataset.img,
  });
});

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

async function createCardElement(cardData) {
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

  newCard.addEventListener("click", async () => {
    if (difficulty === 0) {
      const old = newCard.dataset.cardDmg;
      newCard.dataset.cardDmg = parseInt(old) + 1;
    } else if (difficulty === 1) {
      const old = newCard.dataset.cardHp;
      newCard.dataset.cardHp = parseInt(old) + 2;
    } else if (difficulty === 2) {
      const old = newCard.dataset.cardDmg;
      newCard.dataset.cardDmg = parseInt(old) + 3;
    }
    const cardState = JSON.stringify({
      cards: Array.from(cards).map((card) => ({
        cardName: card.dataset.name,
        cardHp: card.dataset.hp,
        cardDmg: card.dataset.dmg,
        cardType: card.dataset.type,
        cardBackgroundImageIndex: card.dataset.img,
      })),
    });

    try {
      const cookie = getCookie("Cookie");

      const res = await fetch("/game/api/get/?id=" + worldId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
      });

      if (res.ok) {
        const response = await fetch(
          "/api/update_or_create/?id=" + res.body.id,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: cookie,
            },
            body: JSON.stringify({
              name: nameTextbox.value,
              level_data: data,
            }),
          }
        );
        if (response.ok) {
          window.location.href = "/game/difficulty/" + worldId;
        } else {
          alert("Hiba az adatok mentésekor.");
        }
      } else {
        const response = await fetch("/game/api/update_or_create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookie,
          },
          body: JSON.stringify({
            world: worldId,
            save_data: cardState,
          }),
        });
        if (response.ok) {
          window.location.href = "/game/difficulty/" + worldId;
        } else {
          alert("Hiba az adatok mentésekor.");
        }
      }
    } catch (error) {
      console.error("Hiba:", error);
    }

    window.location.href = `/game/difficulty/${worldId}`;
  });

  cardsContainer.appendChild(newCard);
}
