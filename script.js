function initPage() {
  generateTrackingId();
  renderQRCode();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function generateTrackingId() {
  const id = "APP" + Math.floor(100000 + Math.random() * 900000);
  document.getElementById("trackingId").value = id;
}

function renderQRCode() {
  const qrContainer = document.getElementById("qrCode");
  qrContainer.innerHTML = "";

  const trackingId = document.getElementById("trackingId").value;
  const referralURL = "https://annualapplication.github.io/SA-UniApp/?ref=" + trackingId;

  new QRCode(qrContainer, {
    text: referralURL,
    width: 130,
    height: 130,
    colorDark: "#003B99",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}
