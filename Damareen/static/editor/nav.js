const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

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
