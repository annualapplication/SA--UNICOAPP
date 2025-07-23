// Provinces and institutions with fees
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

// Globals
let currentStep = 1;

function initPage() {
  generateTrackingID();
  buildUniversitiesList();
  addSubject(); // Add initial subject input
  setupEventListeners();
  updateTotalFee();
  updateAPS();
  renderQRCode();

  // Show only step 1 at start
  showStep(1);
}

function setupEventListeners() {
  document.getElementById('applicationForm').addEventListener('submit', submitApplication);
  document.getElementById('downloadBtn').addEventListener('click', downloadPDF);
  document.getElementById('whatsappBtn').addEventListener('click', sendWhatsApp);
  document.getElementById('resultsSelect').addEventListener('change', () => {
    clearSubjects();
    addSubject();
    updateAPS();
  });
  document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
  document.getElementById('subjectsContainer').addEventListener('input', updateAPS);
}

// Step navigation
function showStep(step) {
  currentStep = step;
  document.querySelectorAll('.step').forEach((el, idx) => {
    el.style.display = (idx + 1 === step) ? 'block' : 'none';
  });
}

function nextStep(step) {
  if (validateStep(currentStep)) {
    showStep(step);
  }
}

function prevStep(step) {
  showStep(step);
}

// Validation for each step
function validateStep(step) {
  if (step === 1) {
    const fullname = document.getElementById('fullname').value.trim();
    if (!fullname) {
      alert('Please enter your full name.');
      return false;
    }
  }
  if (step === 2) {
    const resultsType = document.getElementById('resultsSelect').value;
    if (!resultsType) {
      alert('Please select your results type.');
      return false;
    }
    const subjects = getSubjects();
    if (subjects.length < 5) {
      alert('Please enter at least 5 subjects and marks.');
      return false;
    }
    for (const sub of subjects) {
      if (!sub.subject || sub.mark === null || isNaN(sub.mark)) {
        alert('Please fill in all subject names and marks.');
        return false;
      }
      if (sub.mark < 0 || sub.mark > 100) {
        alert('Marks must be between 0 and 100.');
        return false;
      }
    }
  }
  if (step === 3) {
    const nsfas = document.getElementById('nsfasSelect').value;
    if (!nsfas) {
      alert('Please select NSFAS funding option.');
      return false;
    }
    const checkedInstitutions = Array.from(document.querySelectorAll('.university-checkbox:checked'));
    if (checkedInstitutions.length === 0) {
      alert('Please select at least one institution.');
      return false;
    }
  }
  return true;
}

// Subjects logic
function addSubject() {
  const container = document.getElementById('subjectsContainer');
  const row = document.createElement('div');
  row.classList.add('subject-row');
  row.style.marginBottom = '10px';

  row.innerHTML = `
    <input type="text" class="form-control subject-name" placeholder="Subject" style="width: 70%; display: inline-block;" />
    <input type="number" class="form-control subject-mark" placeholder="Mark" min="0" max="100" style="width: 25%; display: inline-block; margin-left: 5px;" />
    <button type="button" onclick="removeSubject(this)" class="btn btn-danger" style="display: inline-block; margin-left: 5px;">X</button>
  `;

  container.appendChild(row);
}

function removeSubject(button) {
  const row = button.parentElement;
  row.remove();
  updateAPS();
}

function clearSubjects() {
  document.getElementById('subjectsContainer').innerHTML = '';
}

function getSubjects() {
  const rows = document.querySelectorAll('.subject-row');
  const subjects = [];
  rows.forEach(row => {
    const subject = row.querySelector('.subject-name').value.trim();
    const markStr = row.querySelector('.subject-mark').value;
    const mark = markStr === '' ? null : parseInt(markStr, 10);
    subjects.push({ subject, mark });
  });
  return subjects;
}

// APS Calculation logic (Example logic, adjust per actual APS rules)
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
  let totalAPS = 0;
  subjects.forEach(({ mark }) => {
    if (mark !== null && !isNaN(mark)) {
      totalAPS += calculateAPS(mark);
    }
  });
  document.getElementById('totalAps').textContent = totalAPS;
}

// Universities list building
function buildUniversitiesList() {
  const container = document.getElementById('universitiesList');
  container.innerHTML = '';

  for (const province in provinces) {
    const provDiv = document.createElement('div');
    provDiv.classList.add('province-block');
    provDiv.style.marginBottom = '15px';

    const title = document.createElement('h4');
    title.textContent = province;
    provDiv.appendChild(title);

    provinces[province].forEach(inst => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('university-checkbox');
      checkbox.dataset.fee = inst.fee;
      checkbox.value = inst.name;
      checkbox.id = inst.name.replace(/\s+/g, '_');

      checkbox.addEventListener('change', updateTotalFee);

      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.textContent = `${inst.name} (R${inst.fee})`;

      const div = document.createElement('div');
      div.appendChild(checkbox);
      div.appendChild(label);

      provDiv.appendChild(div);
    });

    container.appendChild(provDiv);
  }
}

function updateTotalFee() {
  const checked = document.querySelectorAll('.university-checkbox:checked');
  let total = 0;
  checked.forEach(cb => {
    total += parseFloat(cb.dataset.fee) || 0;
  });
  document.getElementById('totalFee').textContent = total.toFixed(2);
}

// Tracking ID generator
function generateTrackingID() {
  const id = 'APP' + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('trackingId').value = id;
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Form data getter
function getFormData() {
  const fullname = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const resultsType = document.getElementById('resultsSelect').value;
  const subjects = getSubjects();
  const nsfas = document.getElementById('nsfasSelect').value;
  const selectedInstitutions = Array.from(document.querySelectorAll('.university-checkbox:checked')).map(cb => cb.value);
  const aps = document.getElementById('totalAps').textContent;
  const totalFee = document.getElementById('totalFee').textContent;
  const trackingId = document.getElementById('trackingId').value;

  return { fullname, email, resultsType, subjects, nsfas, selectedInstitutions, aps, totalFee, trackingId };
}

// Submission handler
function submitApplication(e) {
  e.preventDefault();
  if (!validateStep(3)) return; // Validate last step

  const data = getFormData();

  // Show confirmation
  alert(`Thank you ${data.fullname}! Your application with Tracking ID ${data.trackingId} has been received.`);

  // Email fallback
  if (data.email) {
    const mailtoLink = `mailto:${data.email}?subject=SA University Application Confirmation&body=${encodeURIComponent(
      `Dear ${data.fullname},\n\nThank you for your application.\nYour Tracking ID: ${data.trackingId}\nSelected Institutions: ${data.selectedInstitutions.join(', ')}\nTotal Fee: R${data.totalFee}\n\nRegards,\nSA Uni Portal`
    )}`;
    window.location.href = mailtoLink;
  }
}

// PDF download (simple styled text PDF)
function downloadPDF() {
  const data = getFormData();

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("SA University Application Summary", 14, 22);

  doc.setFontSize(12);
  doc.text(`Name: ${data.fullname}`, 14, 40);
  doc.text(`Tracking ID: ${data.trackingId}`, 14, 50);
  doc.text(`Results Type: ${data.resultsType}`, 14, 60);
  doc.text(`APS Score: ${data.aps}`, 14, 70);

  doc.text('Subjects and Marks:', 14, 80);
  data.subjects.forEach((sub, i) => {
    doc.text(`- ${sub.subject}: ${sub.mark}`, 20, 90 + i * 10);
  });

  doc.text(`Selected Institutions:`, 14, 100 + data.subjects.length * 10);
  data.selectedInstitutions.forEach((inst, i) => {
    doc.text(`- ${inst}`, 20, 110 + (data.subjects.length + i) * 10);
  });

  doc.text(`Total Application Fee: R${data.totalFee}`, 14, 120 + (data.subjects.length + data.selectedInstitutions.length) * 10);

  doc.save('ApplicationSummary.pdf');
}

// WhatsApp submission
function sendWhatsApp() {
  const data = getFormData();

  if (!data.fullname) {
    alert("Please enter your full name before sending.");
    return;
  }
  if (data.selectedInstitutions.length === 0) {
    alert("Please select at least one institution.");
    return;
  }

  const msg = `SA University Application Submission:\n` +
    `Name: ${data.fullname}\n` +
    `Tracking ID: ${data.trackingId}\n` +
    `Results Type: ${data.resultsType}\n` +
    `APS: ${data.aps}\n` +
    `Subjects:\n` +
    data.subjects.map(s => ` - ${s.subject}: ${s.mark}`).join('\n') + `\n` +
    `Selected Institutions:\n` +
    data.selectedInstitutions.map(i => ` - ${i}`).join('\n') + `\n` +
    `Total Fee: R${data.totalFee}\n` +
    `NSFAS: ${data.nsfas}`;

  // Your WhatsApp number here (international format without +, e.g. 27631234567)
  const waNumber = "27683683912";

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

// QR code generation (blue on white)
function renderQRCode() {
  const qrContainer = document.createElement('div');
  qrContainer.id = 'qrCodeContainer';
  qrContainer.style.textAlign = 'center';
  qrContainer.style.marginTop = '20px';

  const container = document.querySelector('.container');
  container.appendChild(qrContainer);

  // Use QRCode.js (https://davidshimjs.github.io/qrcodejs/)
  const qr = new QRCode(qrContainer, {
    text: "https://annualapplication.github.io/SA-UniApp/",
    width: 120,
    height: 120,
    colorDark: "#0055a5",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}
