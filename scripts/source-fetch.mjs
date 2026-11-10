import https from 'node:https';import http from 'node:http';import {Resolver} from 'node:dns/promises';
const resolver=new Resolver();resolver.setServers(['1.1.1.1','8.8.8.8']);
const addresses=new Map();
function lookup(host,options,callback){
 const query=addresses.get(host)||resolver.resolve4(host).then(ips=>ips.map(address=>({address,family:4})));
 addresses.set(host,query);
 query.then(list=>options?.all?callback(null,list):callback(null,list[0].address,4),callback);
}
// Only this audit process uses the public resolver. TLS hostname validation stays enabled.
export async function sourceFetch(input,options={},hops=0){
 if(hops>8)throw Error('Redirect limit exceeded');const url=new URL(input);
 const result=await new Promise((resolve,reject)=>{
  const request=(url.protocol==='https:'?https:http).request(url,{lookup,method:options.method||'GET',headers:options.headers,signal:options.signal,timeout:40000},res=>{
   const chunks=[];res.on('data',b=>chunks.push(b));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks)}));res.on('error',reject);
  });request.on('timeout',()=>request.destroy(new Error('Source request timeout')));request.on('error',reject);request.end();
 });
 if([301,302,303,307,308].includes(result.status)&&result.headers.location&&options.redirect!=='manual')return sourceFetch(new URL(result.headers.location,url),options,hops+1);
 const response=new Response(result.status===204||result.status===304?null:result.body,{status:result.status,headers:Object.fromEntries(Object.entries(result.headers).filter(([,v])=>v!==undefined).map(([k,v])=>[k,Array.isArray(v)?v.join(', '):v]))});
 Object.defineProperties(response,{url:{value:url.href},redirected:{value:hops>0}});return response;
}
