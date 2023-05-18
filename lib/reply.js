import xlsx from 'xlsx';
import * as fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const setting = JSON.parse(fs.readFileSync('./config.json'));
const filePath = resolve(__dirname, `../${setting.flowFileName}`);


export default async function replyMessage() {
  const workbook = xlsx.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]])

  return data;
}
