import fs from 'fs';

// Adres do pliku
const URL = 'https://raw.githubusercontent.com/slaweklatka/sql-polish-namedays/master/2018-namedays.sql';

console.log('⏳ Pobieranie pliku SQL...');

try {
  const response = await fetch(URL);
  if (!response.ok) throw new Error(`Błąd: ${response.statusText}`);
  
  const sqlContent = await response.text();
  console.log(`✅ Pobrano. Przetwarzam format ('Dzień', 'Miesiąc', 'Imiona')...`);

  const result = {};
  let count = 0;

  // POPRAWIONY REGEX:
  // Uwzględnia apostrofy wokół liczb: '(\d+)'
  const regex = /\('\s*(\d{1,2})\s*'\s*,\s*'\s*(\d{1,2})\s*'\s*,\s*'([^']+)'/g;
  
  let match;
  // Pętla po wszystkich znaleziskach
  while ((match = regex.exec(sqlContent)) !== null) {
    // match[1] to Dzień (bez apostrofów)
    // match[2] to Miesiąc (bez apostrofów)
    // match[3] to Imiona
    
    const day = match[1].padStart(2, '0');
    const month = match[2].padStart(2, '0');
    const names = match[3];

    const key = `${month}-${day}`;
    result[key] = names;
    count++;
  }

  // Zapis do pliku
  if (!fs.existsSync('./src/data')){
      fs.mkdirSync('./src/data', { recursive: true });
  }

  fs.writeFileSync('./src/data/namedays.json', JSON.stringify(result, null, 2), 'utf-8');
  
  console.log(`🎉 Sukces! Przetworzono ${count} dni.`);
  console.log('📁 Plik zapisany w: ./src/data/namedays.json');

} catch (error) {
  console.error('❌ Błąd:', error);
}