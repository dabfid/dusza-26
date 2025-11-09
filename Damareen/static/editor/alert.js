export function showAlert(message) {
  // Ellenőrizzük, hogy van-e már alert az oldalon
  const existingAlert = document.querySelector('.custom-alert-overlay');
  if (existingAlert) {
    existingAlert.remove();
  }

  // Overlay létrehozása
  const overlay = document.createElement('div');
  overlay.className = 'custom-alert-overlay';

  // Alert box létrehozása
  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert-box';

  // Pixeles sarkok
  const corners = ['tl', 'tr', 'bl', 'br'];
  corners.forEach(corner => {
    const cornerDiv = document.createElement('div');
    cornerDiv.className = `pixel-corner pixel-corner-${corner}`;
    alertBox.appendChild(cornerDiv);
  });

  // Hibaüzenet
  const messageElement = document.createElement('p');
  messageElement.className = 'custom-alert-message';
  messageElement.textContent = message;
  alertBox.appendChild(messageElement);

  // Bezárás gomb
  const closeButton = document.createElement('button');
  closeButton.className = 'button custom-alert-close';
  closeButton.textContent = 'Bezárás';
  closeButton.addEventListener('click', () => {
    overlay.remove();
  });
  alertBox.appendChild(closeButton);

  overlay.appendChild(alertBox);
  document.body.appendChild(overlay);

  // ESC billentyűre is bezárható
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Overlay-re kattintva is bezárható
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      document.removeEventListener('keydown', handleEscape);
    }
  });
}