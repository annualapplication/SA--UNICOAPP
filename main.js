
// Referral tracking logic
const baseFee = 200;
const referralThreshold = 3;
const discountFee = 100;

function getReferrer() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ref') || null;
}

function storeReferral(referrer) {
  if (!referrer) return;
  let referrals = JSON.parse(localStorage.getItem('referrals') || '{}');
  referrals[referrer] = referrals[referrer] ? referrals[referrer] + 1 : 1;
  localStorage.setItem('referrals', JSON.stringify(referrals));
}

function hasDiscount(referrer) {
  if (!referrer) return false;
  const referrals = JSON.parse(localStorage.getItem('referrals') || '{}');
  return referrals[referrer] >= referralThreshold;
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

function addSubject() {
  const container = document.getElementById('subjectsContainer');
  const row = document.createElement('div');
  row.className = 'row g-2';
  row.innerHTML = `
    <div class="col-md-6"><input type="text" class="form-control mb-2" placeholder="Subject"></div>
    <div class="col-md-6"><input type="number" class="form-control mb-2" placeholder="Mark"></div>`;
  container.appendChild(row);
}

function submitApplication() {
  const name = document.getElementById('fullName').value.trim();
  const contact = document.getElementById('contactNumber').value.trim();
  const resultsType = document.getElementById('resultsType').value;
  const nsfas = document.getElementById('nsfasSelect').value;
  const subjects = Array.from(document.querySelectorAll('#subjectsContainer .row')).map(row => {
    const inputs = row.querySelectorAll('input');
    return `${inputs[0].value.trim()}: ${inputs[1].value.trim()}`;
  }).filter(s => s.includes(':'));
  const aps = document.getElementById('totalAps').textContent;

  const referrer = getReferrer();
  const hasRefBonus = hasDiscount(referrer);
  const fee = hasRefBonus ? discountFee : baseFee;

  if (!name || !contact || !resultsType || subjects.length === 0 || !nsfas) {
    alert("Please complete all fields before submitting.");
    return;
  }

  const msg = `SA Application:\nName: ${name}\nWhatsApp: ${contact}\nResults: ${resultsType}\nSubjects:\n${subjects.join('\n')}\nAPS: ${aps}\nApplication Fee: R${fee}\nNSFAS: ${nsfas}`;
  window.open(`https://wa.me/27683683912?text=${encodeURIComponent(msg)}`, '_blank');
}

function initReferral() {
  const ref = getReferrer();
  if (ref) storeReferral(ref);
}

window.onload = () => {
  initReferral();
  addSubject();
  document.getElementById('subjectsContainer').addEventListener('input', updateAPS);
  alert("To process your application, you must pay R200.");
};
