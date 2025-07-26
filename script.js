document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

const provinces = {
  "Gauteng": [
    { name: "University of Pretoria", fee: 300 },
    { name: "University of Johannesburg", fee: 0 },
    { name: "Wits University", fee: 100 },
    { name: "Tshwane South TVET College", fee: 0 },
    { name: "Ekurhuleni West TVET College", fee: 0 }
  ],
  "Western Cape": [
    { name: "University of Cape Town", fee: 125 },
    { name: "Stellenbosch University", fee: 100 },
    { name: "False Bay TVET College", fee: 0 },
    { name: "Northlink TVET College", fee: 0 }
  ],
  "KwaZulu-Natal": [
    { name: "University of Zululand", fee: 250 },
    { name: "Mangosuthu University of Technology", fee: 250 },
    { name: "University of KwaZulu-Natal", fee: 250 },
    { name: "Durban University of Technology", fee: 250 },
    { name: "Elangeni TVET College", fee: 0 },
    { name: "Umngungundlovu TVET College", fee: 0 },
    { name: "Sayidi TVET College", fee: 0 },
    { name: "Mnambithi TVET College", fee: 0 },
    { name: "Majuba TVET College", fee: 0 },
    { name: "EThekwini TVET College", fee: 0 },
    { name: "Coastal TVET College", fee: 0 }
  ],
  "Eastern Cape": [
    { name: "Nelson Mandela University", fee: 100 },
    { name: "Walter Sisulu University", fee: 150 },
    { name: "Rhodes University", fee: 200 },
    { name: "Buffalo City TVET College", fee: 0 },
    { name: "Ikhala TVET College", fee: 0 },
    { name: "King Hintsa TVET College", fee: 0 }
  ],
  "Limpopo": [
    { name: "University of Limpopo", fee: 200 },
    { name: "University of Venda", fee: 180 },
    { name: "Capricorn TVET College", fee: 0 },
    { name: "Lephalale TVET College", fee: 0 },
    { name: "Mopani South East TVET College", fee: 0 }
  ],
  "Mpumalanga": [
    { name: "University of Mpumalanga", fee: 150 },
    { name: "Ehlanzeni TVET College", fee: 0 },
    { name: "Gert Sibande TVET College", fee: 0 },
    { name: "Nkangala TVET College", fee: 0 }
  ],
  "North West": [
    { name: "North-West University", fee: 100 },
    { name: "Orbit TVET College", fee: 0 },
    { name: "Taletso TVET College", fee: 0 },
    { name: "Vuselela TVET College", fee: 0 }
  ],
  "Free State": [
    { name: "University of the Free State", fee: 120 },
    { name: "Central University of Technology", fee: 150 },
    { name: "Maluti TVET College", fee: 0 },
    { name: "Motheo TVET College", fee: 0 }
  ],
  "Northern Cape": [
    { name: "Sol Plaatje University", fee: 100 },
    { name: "Northern Cape Rural TVET College", fee: 0 },
    { name: "Northern Cape Urban TVET College", fee: 0 }
  ]
};

let currentStep = 1;

function initPage() {
  generateTrackingID();
  buildUniversitiesList();
  addSubject();
  setupEventListeners();
  updateTotalFee();
  updateAPS();
  addTermsAndConditions();
  enhanceUniversityListDisplay();
  showStep(1);
}

function setupEventListeners() {
  document.getElementById("applicationForm").addEventListener("submit", submitApplication);
  document.getElementById("downloadBtn").addEventListener("click", downloadPDF);
  document.getElementById("whatsappBtn").addEventListener("click", sendWhatsApp);
  document.getElementById("resultsSelect").addEventListener("change", () => {
    clearSubjects();
    addSubject();
    updateAPS();
  });
  document.getElementById("subjectsContainer").addEventListener("input", updateAPS);
}

function showStep(step) {
  currentStep = step;
  document.querySelectorAll(".step").forEach((el, idx) => {
    el.style.display = (idx + 1 === step) ? "block" : "none";
  });
  updateStepIndicator(step);
}

function updateStepIndicator(step) {
  const circles = document.querySelectorAll(".step-circle");
  circles.forEach((circle, idx) => {
    circle.classList.toggle("active", idx + 1 === step);
  });
}

function nextStep(step) {
  if (validateStep(currentStep)) showStep(step);
}

function prevStep(step) {
  showStep(step);
}

function validateStep(step) {
  if (step === 1) {
    const name = document.getElementById("fullname").value.trim();
    if (!name) return alert("Enter your full name."), false;
  }

  if (step === 2) {
    const type = document.getElementById("resultsSelect").value;
    if (!type) return alert("Select your results type."), false;
    const subjects = getSubjects();
    if (subjects.length < 5) return alert("Enter at least 5 subjects."), false;
    for (const s of subjects) {
      if (!s.subject || isNaN(s.mark) || s.mark < 0 || s.mark > 100) {
        return alert("Check subject names and marks (0–100)."), false;
      }
    }
  }

  if (step === 3) {
    if (!document.getElementById("nsfasSelect").value) {
      return alert("Select NSFAS option."), false;
    }
    if (document.querySelectorAll(".university-checkbox:checked").length === 0) {
      return alert("Select at least one institution."), false;
    }
    if (!document.getElementById("termsCheckbox").checked) {
      return alert("Agree to the Terms and Conditions."), false;
    }
  }
  return true;
}

function addSubject() {
  const row = document.createElement("div");
  row.className = "subject-row";
  row.innerHTML = `
    <input type="text" class="subject-name" placeholder="Subject" />
    <input type="number" class="subject-mark" placeholder="Mark (0–100)" min="0" max="100" />
    <button type="button" onclick="removeSubject(this)">❌</button>
  `;
  document.getElementById("subjectsContainer").appendChild(row);
}

function removeSubject(btn) {
  btn.parentElement.remove();
  updateAPS();
}

function clearSubjects() {
  document.getElementById("subjectsContainer").innerHTML = "";
}

function getSubjects() {
  return Array.from(document.querySelectorAll(".subject-row")).map(row => {
    const subject = row.querySelector(".subject-name").value.trim();
    const mark = parseInt(row.querySelector(".subject-mark").value);
    return { subject, mark };
  });
}

function calculateAPS(mark) {
  if (mark >= 80) return 7;
  if (mark >= 70) return 6;
  if (mark >= 60) return 5;
  if (mark >= 50) return 4;
  if (mark >= 40) return 3;
  if (mark >= 30) return 2;
  return 0;
}

function updateAPS() {
  const subjects = getSubjects();
  const total = subjects.reduce((sum, s) => sum + (isNaN(s.mark) ? 0 : calculateAPS(s.mark)), 0);
  document.getElementById("totalAps").textContent = total;
}

function buildUniversitiesList() {
  const container = document.getElementById("universitiesList");
  container.innerHTML = "";
  for (const province in provinces) {
    const block = document.createElement("div");
    block.className = "province-block";
    const title = document.createElement("h4");
    title.textContent = province;
    block.appendChild(title);
    provinces[province].forEach(inst => {
      const id = inst.name.replace(/\s+/g, "_");
      block.innerHTML += `
        <div class="university-item">
          <input type="checkbox" id="${id}" class="university-checkbox" value="${inst.name}" data-fee="${inst.fee}" onchange="updateTotalFee()" />
          <label for="${id}">${inst.name} (R${inst.fee})</label>
        </div>
      `;
    });
    container.appendChild(block);
  }
}

function updateTotalFee() {
  const total = Array.from(document.querySelectorAll(".university-checkbox:checked"))
    .reduce((sum, cb) => sum + parseFloat(cb.dataset.fee), 0);
  document.querySelectorAll("#totalFee").forEach(el => el.textContent = total.toFixed(2));
}

function generateTrackingID() {
  document.getElementById("trackingId").value = "APP" + Math.floor(100000 + Math.random() * 900000);
}

function showTermsModal() {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay fade-in";
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-content">
        <h3 style="text-align:center;">Terms and Conditions</h3>
        <p>This portal helps you apply but doesn’t guarantee acceptance. All decisions are made by the institutions. R80 is required for processing and is non-refundable.</p>
        <div style="text-align:center;"><button onclick="closeTermsModal()">Close</button></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function closeTermsModal() {
  document.querySelector(".modal-overlay")?.remove();
}

function addTermsAndConditions() {
  document.getElementById("termsContainer").innerHTML = `
    <label><input type="checkbox" id="termsCheckbox" /> I agree to the <a href="#" onclick="showTermsModal()">Terms and Conditions</a></label>
  `;
}

function enhanceUniversityListDisplay() {
  document.querySelectorAll(".province-block").forEach(block => {
    block.style.border = "1px solid #ccc";
    block.style.padding = "1rem";
    block.style.marginBottom = "1rem";
    block.style.borderRadius = "8px";
    block.style.backgroundColor = "#f9f9f9";
  });
}

function submitApplication(e) {
  e.preventDefault();
  if (!validateStep(3)) return;

  const data = getFormData();
  alert(`Thank you ${data.fullname}! Tracking ID: ${data.trackingId}`);

  if (data.email) {
    const subject = `Your Application Summary (Tracking ID: ${data.trackingId})`;
    const body = `Dear ${data.fullname},\n\nThank you for your application.\nTracking ID: ${data.trackingId}\n\nWe will respond shortly.`;
    const fallbackEmail = "annualuniversitysapplication@gmail.com";
    window.location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}

function getFormData() {
  return {
    fullname: document.getElementById("fullname").value,
    email: document.getElementById("email").value,
    resultsType: document.getElementById("resultsSelect").value,
    subjects: getSubjects(),
    nsfas: document.getElementById("nsfasSelect").value,
    selectedInstitutions: Array.from(document.querySelectorAll(".university-checkbox:checked")).map(cb => cb.value),
    aps: document.getElementById("totalAps").textContent,
    totalFee: document.getElementById("totalFee").textContent,
    trackingId: document.getElementById("trackingId").value
  };
}

function downloadPDF() {
  const data = getFormData();
  const { jsPDF } = window.jspdf; // ✅ required when using the UMD version
  const doc = new jsPDF();

  const base64Logo = "ChatGPT Image Jul 25, 2025, 02_09_40 PM.png"; // your logo here
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.addImage(base64Logo, 'PNG', pageWidth / 2 - 40, pageHeight / 2 - 40, 80, 80, '', 'FAST');

  doc.setFontSize(18);
  doc.text("SA University Application Summary", 14, 20);
  doc.setFontSize(12);
  doc.text(`Full Name: ${data.fullname}`, 14, 35);
  doc.text(`Tracking ID: ${data.trackingId}`, 14, 45);
  doc.text(`Results Type: ${data.resultsType}`, 14, 55);
  doc.text(`APS: ${data.aps}`, 14, 65);

  doc.text("Subjects:", 14, 75);
  data.subjects.forEach((sub, i) => {
    doc.text(`- ${sub.subject}: ${sub.mark}`, 20, 85 + i * 10);
  });

  const offset = 85 + data.subjects.length * 10;
  doc.text("Institutions:", 14, offset);
  data.selectedInstitutions.forEach((name, i) => {
    doc.text(`- ${name}`, 20, offset + 10 + i * 10);
  });

  doc.text(`NSFAS: ${data.nsfas}`, 14, offset + 20 + data.selectedInstitutions.length * 10);
  doc.text(`Total Fee: R${data.totalFee}`, 14, offset + 30 + data.selectedInstitutions.length * 10);
  doc.save("ApplicationSummary.pdf");
}



function sendWhatsApp() {
  const data = getFormData();
  if (!data.fullname || data.selectedInstitutions.length === 0) {
    return alert("Please complete your details and select institutions.");
  }

  const msg = `SA Application:\nName: ${data.fullname}\nTracking ID: ${data.trackingId}\nResults: ${data.resultsType}\nAPS: ${data.aps}\nSubjects:\n${data.subjects.map(s => `- ${s.subject}: ${s.mark}`).join("\n")}\nInstitutions:\n${data.selectedInstitutions.join("\n")}\nFee: R${data.totalFee}\nNSFAS: ${data.nsfas}`;
  const waNumber = "27683683912";
  const waUrl = `https://wa.me/$27683683912?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, "_blank");
}
