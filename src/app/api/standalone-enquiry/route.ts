import {stagingFormsEnabled,verifyStagingTurnstile} from "@/lib/staging-turnstile";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const forms=new Set(["custom-mobile-hero-enquiry","custom-mobile-footer-enquiry","custom-mobile-modal-enquiry"]);
const reply=(message:string,status:number)=>Response.json({success:false,message},{status,headers:{"Cache-Control":"no-store"}});
export async function POST(request:Request) {
 if(request.headers.get("origin")!==new URL(request.url).origin)return reply("Request not permitted.",403);
 if(Number(request.headers.get("content-length")||0)>100_000)return reply("Message is too large.",413);
 let data:FormData;
 try {data=await request.formData();}catch{return reply("Invalid form submission.",400);}
 if([...data.values()].some(value=>typeof value!=="string"||value.length>10_000))return reply("Invalid form submission.",400);
 if(!forms.has(String(data.get("form_id")))||data.get("source_path")!=="/custom-mobile-application-development")return reply("Unknown form.",400);
 for(const name of ["name","email","phone"])if(!String(data.get(name)||"").trim())return reply("Please complete all required fields.",400);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email"))))return reply("Please enter a valid email address.",400);
 const token=String(data.get("cf-turnstile-response")||"");
 if(!token||token.length>2048)return reply("Please complete the security verification.",400);
 if(!stagingFormsEnabled(request))return reply("Form delivery is not configured for this environment.",503);
 try {
  if(!await verifyStagingTurnstile(request,token))return reply("Security verification failed. Please retry.",400);
  return Response.json({success:true,delivery:"ghl-pending"},{headers:{"Cache-Control":"no-store"}});
 }catch{return reply("Security verification is unavailable. Please retry.",502);}
}
