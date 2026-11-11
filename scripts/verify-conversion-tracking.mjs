import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
const source = fs.readFileSync('src/lib/conversion-tracking.ts', 'utf8');
const js = stripTypeScriptTypes(source).replace('export async function recordConfirmedLead', 'exports.recordConfirmedLead = async function recordConfirmedLead');
let checks = 0;
for (const host of ['inceptivesdigital.com', 'www.inceptivesdigital.com', 'localhost', 'inceptives-homepage-review.vercel.app']) {
  const events = [], module = { exports: {} };
  const window = { setTimeout, clearTimeout, dataLayer: events };
  vm.runInNewContext(js, { exports: module.exports, module, window, location: { hostname: host, pathname: '/ios-app-development' }, crypto: { randomUUID: () => 'qa-event-id' } });
  await module.exports.recordConfirmedLead({ id: 'id-ios-form' });
  assert.equal(events.length, host.includes('vercel') || host === 'localhost' ? 0 : 1);
  if (events.length) {
    assert.equal(events[0].event, 'lead_submitted');
    assert.equal(events[0].lead_type, 'ios_assessment');
    assert.equal(Object.keys(events[0]).some(k => /email|phone|name/i.test(k)), false);
  }
  checks++;
}
const endpoint = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8') : '';
for (const scenario of endpoint ? ['accepted', 'provider-error', 'network-error', 'invalid', 'bad-origin', 'get'] : []) {
  let calls = 0, response;
  const module = { exports: {} };
  vm.runInNewContext(endpoint, { module, URLSearchParams, AbortSignal, fetch: async () => {
    calls++; if (scenario === 'network-error') throw Error('mock');
    return { ok: scenario !== 'provider-error' };
  } });
  const res = { setHeader() {}, status(code) { this.code = code; return this; }, json(body) { response = { code: this.code, ...body }; } };
  await module.exports({ method: scenario === 'get' ? 'GET' : 'POST', headers: { origin: scenario === 'bad-origin' ? 'https://untrusted.example' : 'https://app.inceptivesdigital.com' }, body: { email: scenario === 'invalid' ? 'invalid' : 'migration-qa@example.test', fullName: 'QA' } }, res);
  assert.equal(response.success, scenario === 'accepted');
  assert.equal(calls, ['accepted', 'provider-error', 'network-error'].includes(scenario) ? 1 : 0);
  checks++;
}
console.log(`${checks} conversion checks passed; provider and analytics requests mocked, no real leads.`);
const base = fs.readFileSync('integrations/google-tag-manager/openai-base.html', 'utf8').replace(/<\/?script>/g, '');
const lead = fs.readFileSync('integrations/google-tag-manager/openai-lead.html', 'utf8').replace(/<\/?script>/g, '');
for (const hostname of ['inceptivesdigital.com', 'app.inceptivesdigital.com', 'inceptives-homepage-review.vercel.app']) {
  const scripts = [], events = [], location = { hostname, pathname: '/healthcare-app-development' };
  const window = { addEventListener() {}, oaiq: (...args) => events.push(args) };
  const history = { pushState() { location.pathname = '/android-app-development'; return 123; }, replaceState() {} };
  const context = vm.createContext({ window, location, history, navigator: { globalPrivacyControl: true }, document: { createElement: () => ({}), head: { appendChild: s => scripts.push(s) } } });
  vm.runInContext(base, context);
  vm.runInContext(base, context);
  assert.equal(history.pushState(), 123);
  vm.runInContext(lead, context);
  const enabled = !hostname.endsWith('vercel.app');
  assert.equal(events.filter(e => e[0] === 'init').length, enabled ? 1 : 0);
  assert.equal(events.filter(e => e[1] === 'page_viewed').length, enabled ? 2 : 0);
  assert.equal(events.filter(e => e[1] === 'lead_created').length, enabled ? 1 : 0);
  if (enabled) assert.deepEqual(events[0], ['consent', false]);
}
console.log('GTM initialization, SPA route views, privacy signal and staging exclusion checks passed.');
