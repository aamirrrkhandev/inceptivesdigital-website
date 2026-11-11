import fs from 'node:fs';import assert from 'node:assert/strict';import {scoreIOSAssessment,evaluateIOSAssessment} from '../src/lib/ios-assessment-rules.ts';
const fixtures=JSON.parse(fs.readFileSync('content/ios-assessment-parity-fixtures.json'));for(const fixture of fixtures)assert.deepEqual(scoreIOSAssessment(fixture.answers),fixture.result);
for(const invalid of [{platform:'invalid'},{full_name:'x'.repeat(121)},{email:'not-an-email'},{company:'x'.repeat(121)}]){const fields=new URLSearchParams({...fixtures[0].answers,full_name:'Migration QA',email:'qa@example.invalid',company:'',...invalid});assert.throws(()=>evaluateIOSAssessment(fields));}
console.log(JSON.stringify({originalPHPFixtures:fixtures.length,matched:fixtures.length,invalidInputsRejected:4,pass:true}));
