import { gatherCardData } from "./cards.js";
import { gatherChallengeData } from "./challenges.js";

const doneButton = document.querySelector("#done-button");

function gatherData() {
  const cardData = gatherCardData();
  const challengeData = gatherChallengeData();

  return {
    cardData,
    challengeData,
  };
}

doneButton.addEventListener("click", async () => {
  const data = gatherData();
});
