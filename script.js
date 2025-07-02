
const allSubjects = ["Mathematics","Mathematical Literacy","Physical Sciences","Life Sciences","Accounting","Business Studies","Economics","Geography","History","Tourism","Computer Applications Technology","Visual Arts","Electrical Technology","Mechanical Technology","Agricultural Sciences","English","IsiZulu","Afrikaans","Sesotho","Life Orientation"];

const provinces = {
  "Gauteng": {
    universities: [
      {name:"University of Pretoria",fee:"R300"},
      {name:"University of Johannesburg",fee:"Free"},
      {name:"University of the Witwatersrand (Wits)",fee:"R100"},
      {name:"University of South Africa (Unisa)",fee:"Free"},
      {name:"Sefako Makgatho Health Sciences University",fee:"R200"}
    ],
    tvets:["Central Johannesburg TVET College","Ekurhuleni East TVET College","Ekurhuleni West TVET College","Sedibeng TVET College","Tshwane North TVET College","Tshwane South TVET College"]
  }
};

function calculateAPS(m){ return m>=80?7:m>=70?6:m>=60?5:m>=50?4:m>=40?3:m>=30?2:0; }

function buildSubjects(count=7){
  const container = document.getElementById('subjectsContainer');
  container.innerHTML = '';
  for(let i=1; i<=count; i++) addSubject();
}

function addSubject(){
  const container = document.getElementById('subjectsContainer');
  container.innerHTML += `<div>
    <select class="subjectSelect"><option value="">-- Subject --</option>${allSubjects.map(s=>`<option>${s}</option>`).join('')}</select>
    <input type="number" min="0" max="100" class="markInput" placeholder="Mark">
  </div>`;
  updateAPS();
}

function updateAPS(){
  let total=0;
  document.querySelectorAll('.markInput').forEach(inp=>{
    total+=calculateAPS(parseInt(inp.value)||0);
  });
  document.getElementById('totalAps').textContent = total;
}

function buildUniversities(){
  const list = document.getElementById('universitiesList');
  list.innerHTML = '';
  for(const prov in provinces){
    list.innerHTML += `<div class="province-title">${prov}</div>
    <div class="province-container">
      <div class="institution-column">
        <h4>Universities</h4>
        ${provinces[prov].universities.map(u => `<label><input type="checkbox" class="uniCheckbox" value="${u.name}"> ${u.name} (${u.fee})</label>`).join('')}
      </div>
      <div class="institution-column">
        <h4>TVET Colleges</h4>
        ${provinces[prov].tvets.map(t => `<label><input type="checkbox" class="uniCheckbox" value="${t}"> ${t}</label>`).join('')}
      </div>
    </div>`;
  }
}

function nextStep(step){
  document.querySelectorAll('.step').forEach(s=>s.style.display='none');
  document.getElementById(`step${step}`).style.display='block';
}

function prevStep(step){ nextStep(step); }

document.getElementById('submitApplicationBtn').onclick = ()=>{
  const err = document.getElementById('errorMsg');
  err.textContent='';
  const name = document.getElementById('fullName').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const nsfas = document.getElementById('nsfasSelect').value;

  const subjects = document.querySelectorAll('.subjectSelect');
  const marks = document.querySelectorAll('.markInput');
  let valid = true, subMarks = [];
  if(subjects.length < 7){ err.textContent='Minimum 7 subjects required.'; nextStep(2); return; }
  for(let i=0; i<subjects.length; i++){
    const s = subjects[i].value, m = marks[i].value.trim();
    if(!s || m==='' || isNaN(m)){ valid = false; break; }
    subMarks.push(`${s}: ${m}`);
  }
  if(!valid){ err.textContent='Complete all subjects.'; nextStep(2); return; }
  const selected = [...document.querySelectorAll('.uniCheckbox:checked')].map(c=>c.value);
  if(selected.length===0){ err.textContent='Select at least one institution.'; nextStep(3); return; }
  if(nsfas===''){ err.textContent='Select NSFAS option.'; nextStep(3); return; }

  const msg = `SA Application:\nName: ${name}\nWhatsApp: ${contact}\nTotal APS: ${document.getElementById('totalAps').textContent}\nSubjects:\n${subMarks.join('\n')}\nInstitutions: ${selected.join(', ')}\nNSFAS: ${nsfas}`;
  window.open(`https://wa.me/27683683912?text=${encodeURIComponent(msg)}`,'_blank');
  alert('Application sent via WhatsApp!');
};

window.onload = ()=>{
  buildSubjects();
  buildUniversities();
  nextStep(1);
};
