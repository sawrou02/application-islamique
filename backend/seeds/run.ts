import { Client } from 'pg';
import dotenv from 'dotenv';
import { seedBadges } from './badges';
import { seedQuestions } from './questions';
import { seedQuestionsExtra } from './questions_extra';
import { seedQuestionsExtra2 } from './questions_extra2';
import { seedQuestionsExtra3 } from './questions_extra3';
import { seedQuestionsExtra4 } from './questions_extra4';
import { seedQuestionsAvancees } from './questions_avancees';
import { enrichDalil } from './enrich_dalil';
import { enrichDalilV2 } from './enrich_dalil_v2';
import { seedQuestionsExtra5 } from './questions_extra5';
import { enrichDalilEn } from './enrich_dalil_en';
import { enrichHadithNarrator } from './enrich_hadith_narrator';

dotenv.config();

async function runSeeds(): Promise<void> {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    console.log('Running seeds...');
    await seedBadges(client);
    await seedQuestions(client);
    await seedQuestionsExtra(client);
    await seedQuestionsExtra2(client);
    await seedQuestionsExtra3(client);
    await seedQuestionsExtra4(client);
    await seedQuestionsAvancees(client);
    await enrichDalil(client);
    await enrichDalilV2(client);
    await seedQuestionsExtra5(client);
    await enrichDalilEn(client);
    await enrichHadithNarrator(client);
    console.log('All seeds completed successfully.');
  } finally {
    await client.end();
  }
}

runSeeds().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
