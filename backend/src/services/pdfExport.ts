import PDFDocument from 'pdfkit';
import { Response } from 'express';

interface MembreResult {
  pseudo: string;
  score: number;
  nb_correctes: number;
  nb_questions: number;
  xp_gagne: number;
  date: string;
}

interface HalaqaReport {
  nom: string;
  code_acces: string;
  date_generation: string;
  membres: MembreResult[];
}

export function generateHalaqaPDF(report: HalaqaReport, res: Response): void {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="halaqa-${report.code_acces}.pdf"`);
  doc.pipe(res);

  // En-tête
  doc.fontSize(20).text('Quiz Islamique — Rapport Halaqat', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(14).text(report.nom, { align: 'center' });
  doc.fontSize(10).fillColor('#666').text(`Code : ${report.code_acces} • Généré le ${report.date_generation}`, { align: 'center' });
  doc.moveDown(1);

  // Ligne séparatrice
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#1B5E20');
  doc.moveDown(1);

  // Tableau des résultats
  doc.fillColor('#000').fontSize(12).text('Résultats des membres', { underline: true });
  doc.moveDown(0.5);

  // En-têtes colonnes
  const cols = [50, 200, 290, 360, 430, 500];
  doc.fontSize(9).fillColor('#1B5E20');
  doc.text('Membre', cols[0], doc.y, { width: 140 });
  doc.text('Score', cols[1], doc.y - doc.currentLineHeight(), { width: 80 });
  doc.text('Correctes', cols[2], doc.y - doc.currentLineHeight(), { width: 70 });
  doc.text('Total', cols[3], doc.y - doc.currentLineHeight(), { width: 60 });
  doc.text('XP', cols[4], doc.y - doc.currentLineHeight(), { width: 60 });
  doc.moveDown(0.3);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ccc');
  doc.moveDown(0.3);

  // Lignes
  doc.fillColor('#000').fontSize(9);
  for (const m of report.membres) {
    const y = doc.y;
    const pct = m.nb_questions > 0 ? Math.round((m.nb_correctes / m.nb_questions) * 100) : 0;
    doc.text(m.pseudo, cols[0], y, { width: 140 });
    doc.text(`${pct}%`, cols[1], y, { width: 80 });
    doc.text(`${m.nb_correctes}`, cols[2], y, { width: 70 });
    doc.text(`${m.nb_questions}`, cols[3], y, { width: 60 });
    doc.text(`+${m.xp_gagne}`, cols[4], y, { width: 60 });
    doc.moveDown(0.6);
  }

  doc.moveDown(1);
  doc.fontSize(8).fillColor('#999').text('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', { align: 'center' });

  doc.end();
}
