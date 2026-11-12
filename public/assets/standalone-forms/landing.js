import {ensureGhlTracking,isGhlReplay,recordGhlSubmission,ghlEnabled} from './ghl-tracking.js';
import {loadCallRail,captureCallRailSubmission} from './callrail.js';
import {createTurnstileProtection} from './turnstile.js';
import {recordConfirmedLead} from './conversion-tracking.js';

const forms=[...document.querySelectorAll('.lead-form')];
const protection=createTurnstileProtection(document.body,'[data-contact-verification]');
for(const form of forms) {
 const verification=document.createElement('div');
 verification.dataset.contactVerification='true';
 verification.dataset.theme='light';
 const status=document.createElement('div');
 status.dataset.formStatus='true';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const button=form.querySelector('button[type="submit"]');
 button.parentElement.before(verification);form.append(status);
}
void ensureGhlTracking().catch(()=>{});void loadCallRail();
document.addEventListener('submit',async event=>{
 const form=event.target;
 if(!(form instanceof HTMLFormElement)||!form.matches('.lead-form')||isGhlReplay(form))return;
 event.preventDefault();event.stopPropagation();
 if(!form.reportValidity()||form.dataset.sending==='true')return;
 const status=form.querySelector('[data-form-status]');
 const data=new FormData(form);
 const token=data.get('cf-turnstile-response');
 if(!token){protection.ensure(form);status.textContent='Please complete the security verification before sending your message.';return;}
 if(!ghlEnabled()){status.textContent='Submission delivery is available on the configured staging and production domains.';return;}
 const phone=form.querySelector('[name="phone"]');
 if(phone?._iti)data.set('phone',phone._iti.getNumber()||phone.value);
 data.set('form_id',form.id);data.set('source_path','/custom-mobile-application-development');
 data.set('page_url',location.href);data.set('referrer',document.referrer);
 for(const key of ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid','msclkid','oppref']){
  const value=new URLSearchParams(location.search).get(key);if(value)data.set(key,value);
 }
 form.dataset.sending='true';form.setAttribute('aria-busy','true');
 const button=form.querySelector('button[type="submit"]');button.disabled=true;status.textContent='Sending…';
 try {
  const response=await fetch('/api/standalone-enquiry',{method:'POST',body:data,signal:AbortSignal.timeout(15000)});
  const result=await response.json();
  if(!response.ok||result.success!==true)throw Error(result.message||'Your enquiry could not be validated. Please retry.');
  // Server verification is not a delivery acknowledgement. Wait for GHL's native SDK.
  status.textContent='Recording your enquiry…';
  await recordGhlSubmission(form);
  await captureCallRailSubmission(form);
  await recordConfirmedLead(form);
  form.reset();protection.reset(form);location.assign('/thank-you');
 } catch(error) {
  status.textContent=error instanceof Error?error.message:'Your enquiry could not be sent. Please retry.';
  protection.reset(form);
 } finally {delete form.dataset.sending;form.removeAttribute('aria-busy');button.disabled=false;}
},true);
