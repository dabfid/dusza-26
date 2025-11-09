const saveClicks = document.querySelectorAll(".save-click");

saveClicks.forEach(async (saveClick) => {
  const saveId = saveClick.dataset.saveId;
  const response = await fetch(`/game/api/get?id=${saveId}`);
  const data = await response.json();
  const { world, save_data } = data;
  saveClick.addEventListener("click", () => {
    const saveId = saveClick
      .querySelector(".game-id")
      .textContent.replace("ID: ", "")
      .trim();
    window.location.href = `/game/difficulty/${world}?id=${saveId}`;
  });
});
