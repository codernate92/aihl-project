import { LAYERS, LNAME, ADAPTATIONS, STEPS, PIPELINE, SCENARIOS, MONITORING, RESP, HEAT_LBL } from './content.js';

const $ = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraphs = values => values.map(value => `<p>${escape(value)}</p>`).join('');
const labels = ['Propaganda video', 'Capture cards', 'Cloned voice'];
const contributions = ['None assigned', 'Supporting', 'Moderate', 'Substantial', 'Primary'];
let activeCase = 0;
let activeStep = 0;

$('lifecycle').innerHTML = PIPELINE.map(stage => `<details><summary><span>${escape(stage.idx)} <b aria-hidden="true">+</b></span>${escape(stage.stage)}</summary><p>${escape(stage.sub)}</p><ul>${stage.info.map(item => `<li>${escape(item)}</li>`).join('')}</ul></details>`).join('');
$('framework-layers').innerHTML = LAYERS.map(layer => `<details><summary><span>${escape(layer.id)}</span><strong>${escape(layer.name)}</strong><b aria-hidden="true">+</b></summary><p>${escape(layer.sub)}</p></details>`).join('');
$('adaptations').innerHTML = ADAPTATIONS.map(item => `<article><h3>${escape(item.name)}</h3><p><strong>MAESTRO starting point.</strong> ${escape(item.maestro)}</p><p><strong>Our application.</strong> ${escape(item.x)}</p><p>${escape(item.why)}</p></article>`).join('');
$('responsibility-matrix').insertAdjacentHTML('beforeend', `<thead><tr><th scope="col">Actor</th>${RESP.functions.map(name => `<th scope="col">${escape(name)}</th>`).join('')}</tr></thead><tbody>${RESP.actors.map(actor => `<tr><th scope="row">${escape(actor.name)}<small>${escape(actor.role)}</small></th>${actor.v.map(value => `<td><span class="level-${value}">${contributions[value]}</span></td>`).join('')}</tr>`).join('')}</tbody>`);

// A compact visual index for the three types of evidence. These are diagrams,
// not depictions of real prisoners, authentic documents, or recorded incidents.
const illustration = [
  `<svg viewBox="0 0 360 240" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="24" y="31" width="312" height="178" stroke="#20231f"/><path d="M24 54H336M24 186H336" stroke="#20231f"/><path d="M37 42H72M287 42H323" stroke="#c84027" stroke-width="3"/><circle cx="180" cy="107" r="27" stroke="#20231f" stroke-width="1.5"/><path d="M128 172C128 130 232 130 232 172" stroke="#20231f" stroke-width="1.5"/><path d="M72 89H153M206 89H289M91 112H221M136 131H310M59 151H164" stroke="#c84027" stroke-width="5"/><path d="M39 198H314" stroke="#a7aa9c"/><path d="M39 198H207" stroke="#c84027" stroke-width="2"/><circle cx="207" cy="198" r="4" fill="#c84027"/></svg>`,
  `<svg viewBox="0 0 360 240" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-5 180 120)"><rect x="62" y="22" width="236" height="196" fill="#e1e3d8" stroke="#a7aa9c"/></g><g transform="rotate(3 180 120)"><rect x="50" y="18" width="260" height="204" fill="#faf8f0" stroke="#20231f"/><path d="M70 64H289M70 101H289M70 138H289M70 175H289M212 64V175" stroke="#a7aa9c"/><path d="M70 41H174" stroke="#20231f" stroke-width="5"/><path d="M70 84H167M225 84H275M70 121H186M225 121H266M70 158H180M225 158H281M70 195H206" stroke="#20231f" stroke-width="2"/><path d="M65 149L189 164M67 162L188 149" stroke="#c84027" stroke-width="3"/><path d="M245 183L281 213M281 183L245 213" stroke="#c84027" stroke-width="2"/></g></svg>`,
  `<svg viewBox="0 0 360 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26 60H334M26 120H334M26 180H334M90 30V210M180 30V210M270 30V210" stroke="#d1d5c6"/><path d="M26 120H66C72 120 72 102 78 102S84 155 90 155S96 59 102 59S108 187 114 187S120 42 126 42S132 193 138 193S144 61 150 61S156 155 162 155S168 98 174 98S180 138 186 138S192 106 198 106S204 129 210 129S216 119 222 119H334" stroke="#20231f" stroke-width="2"/><path d="M26 120H156C162 120 162 102 168 102S174 155 180 155S186 59 192 59S198 187 204 187S210 42 216 42S222 193 228 193S234 61 240 61S246 155 252 155S258 98 264 98S270 138 276 138S282 106 288 106S294 129 300 129S306 120 312 120H334" stroke="#c84027" stroke-width="2"/><path d="M26 219H334" stroke="#a7aa9c"/></svg>`
];

$('case-tabs').innerHTML = labels.map((label, index) => `<button type="button" role="tab" id="case-${index}" aria-controls="case-panel" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-case="${index}"><span>0${index + 1}</span>${escape(label)}<span aria-hidden="true">↗</span></button>`).join('');
$('step-nav').innerHTML = STEPS.map((step, index) => `<button type="button" data-step="${index}"${index === 0 ? ' aria-current="step"' : ''}><span>0${step.n}</span>${escape(step.name)}</button>`).join('');

function record(id, title, text, severity) {
  return `<div class="step-record"><span>${escape(id)}</span><div><h5>${escape(title)}</h5><p>${escape(text)}</p></div>${severity ? `<strong class="risk-level" data-level="${severity}">${HEAT_LBL[severity]}</strong>` : ''}</div>`;
}

function renderStep(focus = false) {
  const scenario = SCENARIOS[activeCase];
  const step = STEPS[activeStep];
  $('step-counter').textContent = `Step ${step.n} of ${STEPS.length}`;
  $('step-title').textContent = step.name;
  $('step-description').textContent = step.blurb;
  $('step-nav').querySelectorAll('button').forEach((button, index) => {
    if (index === activeStep) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  let html = '';
  switch (step.key) {
    case 'decomposition':
      html = LAYERS.map(layer => record(layer.id, layer.name, scenario.decomposition[layer.id])).join('');
      break;
    case 'threats':
      html = LAYERS.map(layer => record(layer.id, layer.name, scenario.threats[layer.id].t, scenario.threats[layer.id].lvl)).join('');
      break;
    case 'crossLayer':
      html = `<ol class="attack-chain">${scenario.chain.map(item => `<li><span>${escape(item.id)}</span><div><h5>${escape(item.b)}</h5><p>${escape(item.t)}</p></div></li>`).join('')}</ol><p class="step-note">${escape(scenario.chainNote)}</p>`;
      break;
    case 'priority':
      html = scenario.priority.map((item, index) => record(`0${index + 1}`, item.t, item.d) + `<p class="layer-reference">Layers: ${item.tags.map(tag => `${escape(tag)} · ${escape(LNAME[tag])}`).join('; ')}</p>`).join('') + `<p class="step-note">${escape(scenario.prioFocus)}</p>`;
      break;
    case 'mitigation':
      html = scenario.mitigation.map(item => record(item.id, LNAME[item.id], item.t)).join('');
      break;
    case 'monitoring':
      html = MONITORING.loop.map(item => record(item.ic, item.b, item.d)).join('') + `<div class="step-note">${paragraphs([MONITORING.text])}<p><strong>Participants:</strong> ${MONITORING.actors.map(escape).join(' · ')}</p></div>`;
      break;
  }
  $('step-body').innerHTML = html;
  $('previous-step').disabled = activeStep === 0;
  $('next-step').disabled = activeStep === STEPS.length - 1;
  $('explorer-status').textContent = `${labels[activeCase]}. Step ${step.n} of ${STEPS.length}: ${step.name}.`;
  if (focus) $('step-title').focus({preventScroll: true});
}

function renderCase(index) {
  activeCase = index;
  activeStep = 0;
  const scenario = SCENARIOS[index];
  $('case-tabs').querySelectorAll('button').forEach((button, i) => {
    button.setAttribute('aria-selected', String(i === index));
    button.tabIndex = i === index ? 0 : -1;
  });
  $('case-panel').setAttribute('aria-labelledby', `case-${index}`);
  $('case-title').textContent = scenario.title;
  $('case-summary').textContent = scenario.summary;
  $('case-references').innerHTML = `<span>${escape(scenario.entitlement)}</span>${scenario.articles.map(article => {
    const number = article.match(/\d+/)?.[0];
    return number ? `<a href="https://ihl-databases.icrc.org/en/ihl-treaties/gciii-1949/article-${number}" target="_blank" rel="noopener noreferrer">${escape(article)} <span aria-hidden="true">↗</span></a>` : escape(article);
  }).join('')}`;
  $('case-illustration').innerHTML = illustration[index];
  renderStep();
}

$('case-tabs').addEventListener('click', event => {
  const button = event.target.closest('button[data-case]');
  if (button) renderCase(Number(button.dataset.case));
});
$('case-tabs').addEventListener('keydown', event => {
  const current = event.target.closest('button[data-case]');
  if (!current) return;
  let next = Number(current.dataset.case);
  if (event.key === 'ArrowRight') next = (next + 1) % SCENARIOS.length;
  else if (event.key === 'ArrowLeft') next = (next + SCENARIOS.length - 1) % SCENARIOS.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = SCENARIOS.length - 1;
  else return;
  event.preventDefault();
  renderCase(next);
  $(`case-${next}`).focus();
});
$('step-nav').addEventListener('click', event => {
  const button = event.target.closest('button[data-step]');
  if (!button) return;
  activeStep = Number(button.dataset.step);
  renderStep();
});
for (const [id, direction] of [['previous-step', -1], ['next-step', 1]]) {
  $(id).addEventListener('click', () => {
    activeStep = Math.max(0, Math.min(STEPS.length - 1, activeStep + direction));
    renderStep(true);
    $('step-title').scrollIntoView({block: 'start', behavior: 'instant'});
  });
}
renderCase(0);

const menu = document.querySelector('.menu-toggle');
const nav = $('site-nav');
function closeMenu(returnFocus = false) {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  if (returnFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
// An attribution anchor should reveal the source text as well as reach it.
function openSource() { if (location.hash === '#sources') $('sources').open = true; }
window.addEventListener('hashchange', openSource);
openSource();
