import { Client } from 'pg';
import dotenv from 'dotenv';
import { seedBadges } from './badges';
import { seedQuestions } from './questions';
import { seedQuestionsExtra } from './questions_extra';

dotenv.config();

async function runSeeds(): Promise<void> {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    console.log('Running seeds...');
    await seedBadges(client);
    await seedQuestions(client);
    await seedQuestionsExtra(client);
    console.log('All seeds completed successfully.');
  } finally {
    await client.end();
  }
}

runSeeds().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
