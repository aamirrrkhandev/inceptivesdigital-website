import {stagingFormsEnabled} from "@/lib/staging-turnstile";
import {createHash,randomUUID} from "node:crypto";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const forms=new Set(["custom-mobile-hero-enquiry","custom-mobile-footer-enquiry","custom-mobile-modal-enquiry"]);
// Bounded per-instance throttle; no extra paid service or persistent personal data.
const attempts=new Map<string,{count:number;expires:number}>();
const salt=randomUUID();
function limited(request:Request) {
 const now=Date.now();
 for(const [key,value]of attempts)if(value.expires<=now)attempts.delete(key);
 const address=request.headers.get('x-vercel-forwarded-for')||request.headers.get('x-real-ip')||'local';
 const key=createHash('sha256').update(salt+address).digest('hex');
 const current=attempts.get(key)||{count:0,expires:now+300_000};
 if(attempts.size>=1000&&!attempts.has(key))return true;
 current.count++;attempts.set(key,current);return current.count>10;
}
const reply=(message:string,status:number)=>Response.json({success:false,message},{status,headers:{"Cache-Control":"no-store"}});
export async function POST(request:Request) {
 if(request.headers.get("origin")!==new URL(request.url).origin)return reply("Request not permitted.",403);
 if(Number(request.headers.get("content-length")||0)>100_000)return reply("Message is too large.",413);
 let data:FormData;
 try {data=await request.formData();}catch{return reply("Invalid form submission.",400);}
 if([...data.values()].some(value=>typeof value!=="string"||value.length>10_000))return reply("Invalid form submission.",400);
 if(!forms.has(String(data.get("form_id")))||data.get("source_path")!=="/custom-mobile-application-development")return reply("Unknown form.",400);
 if(String(data.get('website_confirmation')||''))return reply("Invalid form submission.",400);
 for(const name of ["name","email","phone"])if(!String(data.get(name)||"").trim())return reply("Please complete all required fields.",400);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email"))))return reply("Please enter a valid email address.",400);
 if(!stagingFormsEnabled(request))return reply("Form delivery is not configured for this environment.",503);
 if(limited(request))return reply("Too many attempts. Please wait a few minutes and retry.",429);
 return Response.json({success:true,delivery:"ghl-pending"},{headers:{"Cache-Control":"no-store"}});
}
