const loginSection = document.getElementById('loginSection');
const appSection = document.getElementById('appSection');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const switchForm = document.getElementById('switchForm');
const errorMsg = document.getElementById('errorMsg');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const logoutBtn = document.getElementById('logoutBtn');
const userEmail = document.getElementById('userEmail');
const totalApsEl = document.getElementById('totalAps');
const subjectsContainer = document.getElementById('subjectsContainer');
const universitiesList = document.getElementById('universitiesList');
const nsfasSection = document.getElementById('nsfasSection');
const nsfasSelect = document.getElementById('nsfasSelect');
const submitApplicationBtn = document.getElementById('submitApplicationBtn');
const appErrorMsg = document.getElementById('appErrorMsg');

let isLogin = true;

const subjects = [
  "Mathematics", "Physical Sciences", "Life Sciences", "English", "IsiZulu",
  "Accounting", "Business Studies", "Geography", "Mathematical Literacy",
  "Computer Applications Technology", "Economics", "History", "Agricultural Sciences",
  "Tourism", "Visual Arts", "Electrical Technology", "Mechanical Technology", "Life orientation"
];

function calculateAPS(mark) {
  if (mark >= 80) return 7;
  if (mark >= 70) return 6;
  if (mark >= 60) return 5;
  if (mark >= 50) return 4;
  if (mark >= 40) return 3;
  if (mark >= 30) return 2;
  return 0;
}

function buildSubjects() {
  subjectsContainer.innerHTML = '';
  subjects.forEach(subj => {
    subjectsContainer.innerHTML += `<label>${subj} mark:</label><input type="number" min="0" max="100" data-subject="${subj}" class="markInput">`;
  });
  subjectsContainer.addEventListener('input', updateAPS);
}

function updateAPS() {
  const marks = document.querySelectorAll('.markInput');
  let total = 0;
  marks.forEach(input => {
    total += calculateAPS(parseInt(input.value) || 0);
  });
  totalApsEl.textContent = total;
}

const provinces = {
  "Gauteng": [
    "University of Pretoria", "University of Johannesburg", "University of the Witwatersrand (Wits)",
    "Tshwane University of Technology", "Vaal University of Technology",
    "Sedibeng TVET College", "Tshwane South TVET College", "Ekurhuleni East TVET College"
  ],
  "KwaZulu-Natal": [
    "University of KwaZulu-Natal (UKZN)", "Durban University of Technology (DUT)", "Mangosuthu University of Technology (MUT)",
    "University of Zululand (UNIZULU)",
    "Elangeni TVET College", "Majuba TVET College", "UMgungundlovu TVET College"
  ],
  "Western Cape": [
    "University of Cape Town (UCT)", "Stellenbosch University", "Cape Peninsula University of Technology (CPUT)",
    "Boland TVET College", "South Cape TVET College", "West Coast TVET College"
  ],
  "Eastern Cape": [
    "Nelson Mandela University (NMU)", "Rhodes University", "Walter Sisulu University (WSU)", "Fort Hare University (FHU)",
    "Border TVET College", "OR Tambo TVET College", "Alfred Nzo TVET College"
  ],
  "Free State": [
    "University of the Free State (UFS)", "Central University of Technology (CUT)",
    "Motheo TVET College", "Flavius Mareka TVET College"
  ],
  "Limpopo": [
    "University of Limpopo (UL)", "University of Venda (UNIVEN)",
    "Limpopo TVET College"
  ],
  "Mpumalanga": [
    "University of Mpumalanga (UMP)", "Ehlanzeni TVET College"
  ],
  "Northern Cape": [
    "Sol Plaatje University", "Northern Cape Rural TVET College"
  ],
  "North West": [
    "North-West University (NWU)", "North West TVET College"
  ]
};

function buildUniversities() {
  universitiesList.innerHTML = '';
  for (const province in provinces) {
    universitiesList.innerHTML += `<div class="province-title">${province}</div>`;
    provinces[province].forEach(inst => {
      universitiesList.innerHTML += `<label><input type="checkbox" class="uniCheckbox" value="${inst}"> ${inst}</label>`;
    });
  }
}

function sendConfirmationEmail(email, token) {
  const confirmationLink = `${window.location.origin}?email=${encodeURIComponent(email)}&token=${token}`;
  const templateParams = {
    to_email: email,
    confirmation_link: confirmationLink
  };
  
  emailjs.send('service_2ytuwrb', 'template_dhpvtix', templateParams) 
    .then(() => {
      alert(`Confirmation email sent to ${email}. Please check your inbox.`);
    }, (error) => {
      alert('Failed to send confirmation email. Please try again later.');
      console.error('EmailJS error:', error);
    });
}

function isValidPassword(pw) {
  return pw.length >= 9 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);
}

function showError(msg) { errorMsg.textContent = msg; }
function clearError() { errorMsg.textContent = ''; }

function login(email, pass) {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[email] && users[email].pass === pass) {
    if (!users[email].verified) {
      showError('Please confirm your email using the link sent to you.');
      return;
    }
    sessionStorage.setItem('user', email); // Save logged-in user
    appSection.classList.remove('hidden');
    loginSection.classList.add('hidden');
    userEmail.textContent = email;
    buildSubjects();
    buildUniversities();
    nsfasSection.classList.remove('hidden');
  } else {
    showError('Invalid credentials');
  }
}

function register(email, pass) {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[email]) { showError('User already exists'); return; }
  const token = Math.random().toString(36).substring(2);
  users[email] = { pass, verified: false, token };
  localStorage.setItem('users', JSON.stringify(users));
  sendConfirmationEmail(email, token);
  alert('Registration successful! Please confirm your email before logging in.');
  toggleMode();
}

function toggleMode() {
  clearError();
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? 'Login' : 'Register';
  submitBtn.textContent = isLogin ? 'Login' : 'Register';
  switchForm.textContent = isLogin ? "Don't have an account? Register here" : 'Already have an account? Login';
}

submitBtn.onclick = () => {
  clearError();
  const email = emailInput.value.trim();
  const pass = passwordInput.value;
  if (!email || !pass) { showError('Fill in all fields'); return; }
  if (isLogin) login(email, pass);
  else {
    if (!isValidPassword(pass)) { showError('Password must be 9+ chars, include uppercase, lowercase, number, and symbol'); return; }
    register(email, pass);
  }
};

switchForm.onclick = toggleMode;
logoutBtn.onclick = () => { 
  sessionStorage.removeItem('user'); // clear session
  location.reload(); 
};

submitApplicationBtn.onclick = () => {
  appErrorMsg.textContent = '';
  const marks = document.querySelectorAll('.markInput');
  let filledSubjectsCount = 0;
  let subjectMarks = [];
  marks.forEach(input => {
    const val = input.value.trim();
    if (val !== '' && !isNaN(val) && Number(val) >= 0) {
      filledSubjectsCount++;
      subjectMarks.push(`${input.dataset.subject}: ${val}`);
    }
  });

  if (filledSubjectsCount < 7) {
    appErrorMsg.textContent = 'Please enter marks for at least 7 subjects before submitting your application.';
    return;
  }

  const selectedInstitutions = [];
  document.querySelectorAll('.uniCheckbox:checked').forEach(cb => {
    selectedInstitutions.push(cb.value);
  });

  if(selectedInstitutions.length === 0) {
    appErrorMsg.textContent = 'Please select at least one University or TVET College.';
    return;
  }

  const nsfasValue = nsfasSelect.value;
  if(nsfasValue === '') {
    appErrorMsg.textContent = 'Please select your NSFAS funding requirement.';
    return;
  }

  const emailParams = {
    to_email: userEmail.textContent,
    subject_marks: subjectMarks.join('\n'),
    total_aps: totalApsEl.textContent,
    selected_institutions: selectedInstitutions.join(', '),
    nsfas: nsfasValue,
    applicant_email: userEmail.textContent
  };

  emailjs.send('service_2ytuwrb', 'template_application', emailParams)
    .then(() => {
      alert('Application submitted successfully! Please check your email for confirmation.');
    }, (error) => {
      alert('Failed to submit application. Please try again later.');
      console.error('EmailJS error:', error);
    });
};

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email');
  const token = urlParams.get('token');
  if (email && token) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email] && users[email].token === token) {
      users[email].verified = true;
      users[email].token = '';
      localStorage.setItem('users', JSON.stringify(users));
      alert('Email successfully confirmed. You can now log in.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  const loggedInUser = sessionStorage.getItem('user');
  if (loggedInUser) {
    appSection.classList.remove('hidden');
    loginSection.classList.add('hidden');
    userEmail.textContent = loggedInUser;
    buildSubjects();
    buildUniversities();
    nsfasSection.classList.remove('hidden');
  }
};
