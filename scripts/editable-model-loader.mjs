import fs from 'node:fs';
import {createRequire,stripTypeScriptTypes} from 'node:module';
const require=createRequire(new URL('../src/lib/editable-pages.ts',import.meta.url));
export function loadEditableModels(){
 const code=stripTypeScriptTypes(fs.readFileSync('src/lib/editable-pages.ts','utf8'))
 .replace('import "server-only";','')
 .replace('import fs from "node:fs";','const fs=require("node:fs");')
 .replace('import path from "node:path";','const path=require("node:path");')
 .replace('import { cache } from "react";','const cache=fn=>fn;')
 .replace('import { brotliDecompressSync } from "node:zlib";','const {brotliDecompressSync}=require("node:zlib");')
 .replace('import index from "../../content/editable-pages-index.json";','const index=require("../../content/editable-pages-index.json");')
 .replaceAll('export const ','const ').replaceAll('export function ','function ')
 +'\nmodule.exports={getEditablePage,editablePageIndex};';
 const module={exports:{}};new Function('require','module',code)(require,module);return module.exports;
}
