import { gatherCardData } from "./cards.js";
import { gatherChallengeData } from "./challenges.js";

const nameTextbox = document.querySelector("#world-name");
const doneButton = document.querySelector("#done-button");

const world = document.querySelector("#world");

function gatherData() {
  const cardData = gatherCardData();
  const challengeData = gatherChallengeData();

  return {
    cardData,
    challengeData,
  };
}

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

doneButton.addEventListener("click", async () => {
  const data = gatherData();
  const cookie = getCookie("Cookie");

  if (!nameTextbox.value) {
    alert("Please enter a world name.");
    return;
  }

  try {
    const response = await fetch(
      "/editor/worlds/update/" + world.dataset.worldId,
      {
        method: "PUT",
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
      alert("Data saved successfully!");
      //window.location.href = "/editor/";
    } else {
      alert("Error saving data.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
