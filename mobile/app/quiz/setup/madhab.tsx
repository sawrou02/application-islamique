import { useEffect } from 'react';
import { router } from 'expo-router';

// Madhab supprimé — redirige directement vers le nombre de questions
export default function StepMadhab() {
  useEffect(() => { router.replace('/quiz/setup/questions'); }, []);
  return null;
}
