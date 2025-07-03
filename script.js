
const allSubjects = ["Mathematics","Mathematical Literacy","Physical Sciences","Life Sciences","Accounting","Business Studies","Economics","Geography","History","Tourism","Computer Applications Technology","Visual Arts","Electrical Technology","Mechanical Technology","Agricultural Sciences","English","IsiZulu","Afrikaans","Sesotho","Life Orientation"];

const provinces = {
  "Gauteng": { universities:[{name:"UP",fee:300},{name:"Wits",fee:100}], tvets:["Central Johannesburg TVET"] },
  "KZN": { universities:[{name:"UKZN",fee:250}], tvets:["Coastal KZN TVET"] }
};

function calculateAPS(m){ return m>=80?7:m>=70?6:m>=60?5:m>=50?4:m>=40?3:m>=30?2:0; }

function buildSubjects(count=7){
  const c=document.getElementById('subjectsContainer'); c.innerHTML='';
  for(let i=0;i<count;i++) addSubject();
}

function addSubject(){
  const d=document.createElement('div');
  d.innerHTML=`<select class="subjectSelect"><option value="">Add Subject</option>${allSubjects.map(s=>`<option>${s}</option>`).join('')}</select><input type="number" min="0" max="100" class="markInput" placeholder="Mark">`;
  d.querySelector('.markInput').addEventListener('input', updateAPS);
  document.getElementById('subjectsContainer').appendChild(d);
}

function updateAPS(){
  let total=0;
  document.querySelectorAll('.markInput').forEach(i=> total+=calculateAPS(parseInt(i.value)||0));
  document.getElementById('totalAps').textContent=total;
}

function buildUniversities(){
  const container=document.getElementById('universitiesList'); container.innerHTML='';
  for(const prov in provinces){
    container.innerHTML+=\`<div class="province-title">\${prov}</div>
    <div class="province-container">
      <div class="institution-column"><h4>Universities</h4>\${provinces[prov].universities.map(u=>\`<label><input type="checkbox" class="uniCheckbox" data-fee="\${u.fee}" value="\${u.name}">\${u.name} (R\${u.fee})</label>\`).join('')}</div>
      <div class="institution-column"><h4>TVET Colleges</h4>\${provinces[prov].tvets.map(t=>\`<label><input type="checkbox" class="uniCheckbox" data-fee="0" value="\${t}">\${t}</label>\`).join('')}</div>
    </div>\`;
  }
  container.addEventListener('change', updateFee);
}

function updateFee(){
  let sum=0;
  document.querySelectorAll('.uniCheckbox:checked').forEach(c=> sum+=parseFloat(c.dataset.fee));
  document.getElementById('totalFee').textContent=sum;
}

function nextStep(s){ document.querySelectorAll('.step').forEach(e=> e.style.display='none'); document.getElementById(\`step\${s}\`).style.display='block'; }
function prevStep(s){ nextStep(s); }

window.onload=()=>{ buildSubjects(); buildUniversities(); nextStep(1); }

document.getElementById('submitApplicationBtn').onclick=()=>{
  const e=document.getElementById('errorMsg'); e.textContent='';
  const n=document.getElementById('fullName').value.trim(), c=document.getElementById('contact').value.trim();
  const resultsType = document.getElementById('resultsSelect').value;
  const f = document.getElementById('nsfasSelect').value;
  const s=document.querySelectorAll('.subjectSelect'), m=document.querySelectorAll('.markInput');
  if(!resultsType){ e.textContent='Please select the results type.'; nextStep(2); return; }
  if(s.length<7){ e.textContent='Minimum 7 subjects required.'; nextStep(2); return; }
  let subM=[], valid=true;
  for(let i=0;i<s.length;i++){ if(!s[i].value || !m[i].value){ valid=false; break; } subM.push(\`\${s[i].value}: \${m[i].value}\`); }
  if(!valid){ e.textContent='Complete all subjects.'; nextStep(2); return; }
  const sel=[...document.querySelectorAll('.uniCheckbox:checked')].map(c=>c.value);
  if(sel.length==0){ e.textContent='Select at least one institution.'; nextStep(3); return; }
  if(f===''){ e.textContent='Select NSFAS option.'; nextStep(3); return; }
  const msg=\`SA Application:\nName: \${n}\nWhatsApp: \${c}\nResults: \${resultsType}\nAPS: \${document.getElementById('totalAps').textContent}\nSubjects:\n\${subM.join('\n')}\nInstitutions: \${sel.join(', ')}\nTotal Fees: R\${document.getElementById('totalFee').textContent}\nNSFAS: \${f}\`;
  window.open(\`https://wa.me/27683683912?text=\${encodeURIComponent(msg)}\`,'_blank');
};
