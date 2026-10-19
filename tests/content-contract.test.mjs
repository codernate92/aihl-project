import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as exportedContent from '../assets/content.js';

const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = fs.readFileSync(new URL('../assets/site.js', import.meta.url), 'utf8').replace(/^import[^;]+;\s*/, '');
const cloneContent = () => structuredClone(Object.fromEntries(Object.entries(exportedContent)));
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));

// Minimal DOM adapter for the real site controller. These tests exercise its
// rendering and events without a browser or third-party DOM dependency.
function createSite(content = cloneContent()) {
  const elements = new Map();
  class Element {
    constructor(id = '', attrs = {}) {
      this.id = id;
      this.attributes = new Map(Object.entries(attrs));
      this.dataset = Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-')).map(([name, value]) => [name.slice(5), value]));
      this.listeners = new Map();
      this.children = [];
      this.textContent = '';
      this._html = '';
      this.focused = false;
      const classes = new Set();
      this.classList = {remove: value => classes.delete(value), toggle: (value, force) => force ? classes.add(value) : classes.delete(value)};
    }
    set innerHTML(value) {
      this._html = value;
      this.children = [...value.matchAll(/<button\b([^>]*)>/g)].map(match => {
        const attrs = Object.fromEntries([...match[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(attribute => [attribute[1], attribute[2]]));
        const button = new Element(attrs.id || '', attrs);
        if (button.id) elements.set(button.id, button);
        return button;
      });
    }
    get innerHTML() { return this._html; }
    insertAdjacentHTML(position, value) {
      assert.equal(position, 'beforeend');
      this.innerHTML += value;
    }
    querySelectorAll(selector) {
      assert.equal(selector, 'button');
      return this.children;
    }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.get(name); }
    removeAttribute(name) { this.attributes.delete(name); }
    addEventListener(type, handler) { this.listeners.set(type, handler); }
    closest(selector) {
      if (selector === 'button[data-case]') return this.dataset.case === undefined ? null : this;
      if (selector === 'button[data-step]') return this.dataset.step === undefined ? null : this;
      return null;
    }
    focus() { this.focused = true; }
    scrollIntoView() {}
  }
  for (const [, id] of index.matchAll(/\bid="([^"]+)"/g)) elements.set(id, new Element(id));
  const menu = new Element('menu', {'aria-expanded':'false'});
  const document = {
    getElementById: id => {
      assert.ok(elements.has(id), `The actual HTML must contain controller target #${id}`);
      return elements.get(id);
    },
    querySelector: selector => {
      assert.equal(selector, '.menu-toggle');
      return menu;
    },
    addEventListener() {},
  };
  const context = vm.createContext({...content, document, location:{hash:''}, window:{addEventListener(){}}, console});
  vm.runInContext(script, context, {filename:'assets/site.js'});
  function send(id, type, event = {}) {
    const element = elements.get(id);
    const handler = element.listeners.get(type);
    assert.ok(handler, `${id} handles ${type}`);
    handler({target:element, preventDefault(){}, ...event});
  }
  return {elements, context, content, send};
}

function selectCase(site, index) {
  site.send('case-tabs', 'click', {target:site.elements.get(`case-${index}`)});
}
function selectStep(site, index) {
  site.send('step-nav', 'click', {target:site.elements.get('step-nav').children[index]});
}
function expectedStepText(content, scenario, key) {
  switch (key) {
    case 'decomposition': return Object.values(scenario.decomposition);
    case 'threats': return Object.values(scenario.threats).map(item => item.t);
    case 'crossLayer': return [...scenario.chain.flatMap(item => [item.b, item.t]), scenario.chainNote];
    case 'priority': return [...scenario.priority.flatMap(item => [item.t, item.d]), scenario.prioFocus];
    case 'mitigation': return scenario.mitigation.map(item => item.t);
    case 'monitoring': return [...content.MONITORING.loop.flatMap(item => [item.b, item.d]), content.MONITORING.text, ...content.MONITORING.actors];
    default: throw new Error(`Uncovered step: ${key}`);
  }
}

test('research structures and original qualitative values are preserved', () => {
  const {LAYERS, ADAPTATIONS, STEPS, PIPELINE, SCENARIOS, RESP} = exportedContent;
  assert.deepEqual(LAYERS.map(item => item.id), ['L1','L2','L3','L4','L5','L6','L7']);
  assert.equal(ADAPTATIONS.length, 6);
  assert.deepEqual(STEPS.map(item => item.key), ['decomposition','threats','crossLayer','priority','mitigation','monitoring']);
  assert.equal(PIPELINE.length, 5);
  assert.deepEqual(PIPELINE.map(item => item.info.length), [8,8,8,8,8]);
  assert.equal(SCENARIOS.length, 3);
  for (const scenario of SCENARIOS) {
    assert.deepEqual(Object.keys(scenario.decomposition), LAYERS.map(item => item.id));
    assert.deepEqual(Object.keys(scenario.threats), LAYERS.map(item => item.id));
    assert.equal(scenario.chain.length, 5);
    assert.equal(scenario.priority.length, 3);
    assert.equal(scenario.mitigation.length, 4);
  }
  assert.deepEqual(SCENARIOS.map(scenario => Object.values(scenario.threats).map(item => item.lvl)), [[4,3,3,4,4,3,4],[4,4,4,2,4,3,3],[4,4,3,3,4,3,3]]);
  assert.deepEqual(RESP.actors.map(actor => actor.v), [[4,1,1,1,1],[1,2,2,2,4],[1,2,2,4,2],[3,2,4,1,1],[1,4,3,1,1],[0,0,0,0,0]]);
});

test('all lifecycle information, layer descriptions, and adaptations reach the rendered page', () => {
  const site = createSite();
  for (const item of site.content.PIPELINE) {
    for (const value of [item.stage, item.sub, ...item.info]) assert.ok(site.elements.get('lifecycle').innerHTML.includes(escapeHTML(value)), value);
  }
  for (const item of site.content.LAYERS) {
    for (const value of [item.name, item.sub]) assert.ok(site.elements.get('framework-layers').innerHTML.includes(escapeHTML(value)), value);
  }
  for (const item of site.content.ADAPTATIONS) {
    for (const value of [item.name, item.maestro, item.x, item.why]) assert.ok(site.elements.get('adaptations').innerHTML.includes(escapeHTML(value)), value);
  }
});

test('all 18 case/step combinations retain their complete analysis', () => {
  const site = createSite();
  for (const [caseIndex, scenario] of site.content.SCENARIOS.entries()) {
    selectCase(site, caseIndex);
    assert.equal(site.elements.get('case-title').textContent, scenario.title);
    assert.equal(site.elements.get('case-summary').textContent, scenario.summary);
    for (const article of scenario.articles) assert.ok(site.elements.get('case-references').innerHTML.includes(escapeHTML(article)));
    for (const [stepIndex, step] of site.content.STEPS.entries()) {
      selectStep(site, stepIndex);
      assert.equal(site.elements.get('step-title').textContent, step.name);
      assert.equal(site.elements.get('step-description').textContent, step.blurb);
      const html = site.elements.get('step-body').innerHTML;
      for (const text of expectedStepText(site.content, scenario, step.key)) assert.ok(html.includes(escapeHTML(text)), `Missing from case ${caseIndex + 1}, ${step.key}: ${text}`);
      assert.ok(!html.includes('undefined'), `Undefined content in case ${caseIndex + 1}, ${step.key}`);
      assert.equal(site.elements.get('previous-step').disabled, stepIndex === 0);
      assert.equal(site.elements.get('next-step').disabled, stepIndex === 5);
      assert.ok(site.elements.get('explorer-status').textContent.includes(`Step ${stepIndex + 1} of 6`));
    }
  }
});

test('responsibility matrix retains all 30 cells and zero burden for prisoners and families', () => {
  const site = createSite();
  const html = site.elements.get('responsibility-matrix').innerHTML;
  const rows = [...html.matchAll(/<tr><th scope="row">([\s\S]*?)<\/tr>/g)];
  assert.equal(rows.length, 6);
  for (const [index, row] of rows.entries()) {
    const actor = site.content.RESP.actors[index];
    assert.ok(row[1].includes(escapeHTML(actor.name)));
    assert.deepEqual([...row[1].matchAll(/class="level-(\d)"/g)].map(match => Number(match[1])), actor.v);
  }
  assert.equal((rows[5][1].match(/None assigned/g) || []).length, 5);
});

test('dynamic text is escaped across all 18 states and supporting sections', () => {
  const content = cloneContent();
  const payload = '<img src=x onerror="alert(\'test\')"> & <script>bad()</script>';
  for (const layer of content.LAYERS) layer.sub = payload;
  for (const stage of content.PIPELINE) stage.info[0] = payload;
  for (const adaptation of content.ADAPTATIONS) adaptation.x = payload;
  content.RESP.actors[0].role = payload;
  for (const scenario of content.SCENARIOS) {
    scenario.summary = payload;
    scenario.entitlement = payload;
    scenario.articles[0] += payload;
    scenario.decomposition.L1 = payload;
    scenario.threats.L1.t = payload;
    scenario.chain[0].t = payload;
    scenario.priority[0].d = payload;
    scenario.mitigation[0].t = payload;
  }
  content.MONITORING.loop[0].d = payload;
  const site = createSite(content);
  for (const id of ['lifecycle','framework-layers','adaptations','responsibility-matrix']) {
    assert.ok(site.elements.get(id).innerHTML.includes(escapeHTML(payload)), id);
    assert.ok(!site.elements.get(id).innerHTML.includes(payload), id);
  }
  for (let caseIndex=0; caseIndex<3; caseIndex++) {
    selectCase(site, caseIndex);
    assert.equal(site.elements.get('case-summary').textContent, payload);
    assert.ok(site.elements.get('case-references').innerHTML.includes(escapeHTML(payload)));
    for (let stepIndex=0; stepIndex<6; stepIndex++) {
      selectStep(site, stepIndex);
      const html = site.elements.get('step-body').innerHTML;
      assert.ok(html.includes(escapeHTML(payload)), `case ${caseIndex}, step ${stepIndex}`);
      assert.ok(!html.includes(payload), `case ${caseIndex}, step ${stepIndex}`);
    }
  }
});

test('case keyboard navigation and step controls keep selected state and boundaries consistent', () => {
  const site = createSite();
  for (const [key, target, expected] of [['ArrowLeft',0,2],['Home',2,0],['End',0,2],['ArrowRight',2,0]]) {
    site.send('case-tabs', 'keydown', {target:site.elements.get(`case-${target}`), key});
    assert.equal(site.elements.get(`case-${expected}`).getAttribute('aria-selected'), 'true');
    assert.equal(site.elements.get('case-panel').getAttribute('aria-labelledby'), `case-${expected}`);
    assert.equal(site.elements.get(`case-${expected}`).focused, true);
  }
  for (let i=0; i<8; i++) site.send('next-step', 'click');
  assert.equal(site.elements.get('step-counter').textContent, 'Step 6 of 6');
  assert.equal(site.elements.get('next-step').disabled, true);
  for (let i=0; i<8; i++) site.send('previous-step', 'click');
  assert.equal(site.elements.get('step-counter').textContent, 'Step 1 of 6');
  assert.equal(site.elements.get('previous-step').disabled, true);
  selectStep(site, 4);
  selectCase(site, 1);
  assert.equal(site.elements.get('step-counter').textContent, 'Step 1 of 6');
});

test('the page distinguishes hypothetical cases and qualitative analysis from legal obligations', () => {
  assert.ok(/Hypothetical case/i.test(index), 'Cases are labeled hypothetical');
  assert.ok(index.includes('qualitative research judgments'), 'Risk ratings are labeled qualitative');
  assert.ok(index.includes('not measured probabilities or legal findings'), 'Risk ratings are not presented as measurements or legal findings');
  assert.ok(index.includes('does not replace or redistribute legal obligations'), 'Practical contributions are distinguished from legal duties');
  assert.ok(exportedContent.SCENARIOS[1].articles.includes('Art. 70'));
  assert.ok(!index.includes('foreseeable, and therefore preventable'));
});
