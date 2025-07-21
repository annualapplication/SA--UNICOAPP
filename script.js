function addSubject() {
  const container = document.getElementById('subjectsContainer');
  const row = document.createElement('div');
  row.className = 'row g-2';
  row.innerHTML = \`
    <div class="col-md-6"><input type="text" class="form-control mb-2" placeholder="Subject"></div>
    <div class="col-md-6"><input type="number" class="form-control mb-2" placeholder="Mark"></div>\`;
  container.appendChild(row);
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
  const marks = document.querySelectorAll('#subjectsContainer input[type=number]');
  let total = 0;
  marks.forEach(m => total += calculateAPS(parseInt(m.value) || 0));
  document.getElementById('totalAps').textContent = total;
}

function submitApplication() {
  const name = document.getElementById('fullName').value.trim();
  const contact = document.getElementById('contactNumber').value.trim();
  const resultsType = document.getElementById('resultsType').value;
  const nsfas = document.getElementById('nsfasSelect').value;
  const aps = document.getElementById('totalAps').textContent;

  if (!name || !contact || !resultsType || !nsfas) {
    alert("Please complete all fields before submitting.");
    return;
  }

  const msg = \`SA Application:\nName: \${name}\nWhatsApp: \${contact}\nResults: \${resultsType}\nAPS: \${aps}\nNSFAS: \${nsfas}\`;
  window.open(\`https://wa.me/27683683912?text=\${encodeURIComponent(msg)}\`, '_blank');

  const toast = new bootstrap.Toast(document.getElementById('liveToast'));
  toast.show();
}

function initPage() {
  buildInstitutions();
  document.getElementById('subjectsContainer').addEventListener('input', updateAPS);
}

function buildInstitutions() {
  const container = document.getElementById('institutionsContainer');
  container.innerHTML = '<p>Select province...</p>'; // Simplified for this example
}

function filterInstitutions() {
  // Placeholder logic
}


function buildInstitutions() {
  const container = document.getElementById('institutionsContainer');
  const select = document.createElement('select');
  select.className = 'form-select mb-3';
  select.innerHTML = '<option value="">Select Province</option>' +
    Object.keys(provinces).map(p => `<option value="${p}">${p}</option>`).join('');
  select.onchange = () => showInstitutionsByProvince(select.value);
  container.innerHTML = '';
  container.before(select);
}

function showInstitutionsByProvince(province) {
  const container = document.getElementById('institutionsContainer');
  container.innerHTML = '';
  if (!province || !provinces[province]) return;
  provinces[province].forEach(i => {
    if (i.name) {
      container.innerHTML += \`<div class='form-check'>
        <input type='checkbox' class='form-check-input university' data-fee='\${i.fee}' value='\${i.name}'>
        <label class='form-check-label'>\${i.name} (R\${i.fee})</label>
      </div>\`;
    } else if (i.note) {
      container.innerHTML += \`<p class='text-info'><em>\${i.note}</em></p>\`;
    }
  });

  document.querySelectorAll('.university').forEach(cb => {
    cb.addEventListener('change', updateTotalFee);
  });
}

const provinces = {
  "Gauteng": [
    {name: "University of Pretoria", fee: 300},
    {name: "University of Johannesburg", fee: 0},
    {name: "Wits University", fee: 100},
    {name: "Tshwane South TVET College", fee: 0},
    {name: "Ekurhuleni West TVET College", fee: 0}
  ],
  "Western Cape": [
    {name: "University of Cape Town", fee: 125},
    {name: "Stellenbosch University", fee: 100},
    {name: "False Bay TVET College", fee: 0},
    {name: "Northlink TVET College", fee: 0}
  ],
  "KwaZulu-Natal": [
    {note: "Note: One application fee (R250) via CAO for all KZN universities."},
    {name: "University of KwaZulu-Natal", fee: 250},
    {name: "Durban University of Technology", fee: 250},
    {name: "Mangosuthu University of Technology", fee: 250},
    {name: "Coastal KZN TVET College", fee: 0},
    {name: "Elangeni TVET College", fee: 0}
  ],
  "Eastern Cape": [
    {name: "Nelson Mandela University", fee: 0},
    {name: "University of Fort Hare", fee: 120},
    {name: "Walter Sisulu University", fee: 0},
    {name: "Buffalo City TVET College", fee: 0},
    {name: "Ikhala TVET College", fee: 0}
  ],
  "Free State": [
    {name: "University of the Free State", fee: 100},
    {name: "Central University of Technology", fee: 120},
    {name: "Motheo TVET College", fee: 0}
  ],
  "Limpopo": [
    {name: "University of Limpopo", fee: 100},
    {name: "University of Venda", fee: 100},
    {name: "Capricorn TVET College", fee: 0}
  ],
  "Mpumalanga": [
    {name: "University of Mpumalanga", fee: 150},
    {name: "Ehlanzeni TVET College", fee: 0}
  ],
  "North West": [
    {name: "North-West University", fee: 0},
    {name: "Vuselela TVET College", fee: 0}
  ],
  "Northern Cape": [
    {name: "Sol Plaatje University", fee: 100},
    {name: "Northern Cape Urban TVET College", fee: 0}
  ]
};

function updateTotalFee() {
  const checkboxes = Array.from(document.querySelectorAll('.university:checked'));
  const totalFee = checkboxes.reduce((sum, cb) => sum + parseFloat(cb.dataset.fee), 0);
  document.getElementById('totalFee').textContent = totalFee;
}
