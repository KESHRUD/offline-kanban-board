
import type { Deck, User } from '../types';

declare global {
  interface Window {
    jspdf: any;
  }
}

export const generateDeckPDF = (deck: Deck, user: User | null) => {
  if (!window.jspdf) {
    alert("Module d'export PDF non chargé.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Branding Colors
  const primaryColor = '#06b6d4'; // Cyan
  const secondaryColor = '#1e293b'; // Slate

  // Header
  doc.setFillColor(secondaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor('#ffffff');
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text("GALILÉE OS", 20, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text("FICHE DE RÉVISION", 20, 30);

  // User Info
  doc.setFontSize(10);
  doc.text(`Étudiant: ${user?.name || 'Inconnu'}`, 150, 20);
  doc.text(`Spécialité: ${user?.speciality || 'Général'}`, 150, 26);
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 150, 32);

  // Deck Title
  doc.setTextColor(secondaryColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(deck.title.toUpperCase(), 20, 55);
  
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(1);
  doc.line(20, 58, 190, 58);

  // Content Loop
  let y = 70;
  
  deck.cards.forEach((card, index) => {
    // Check page break
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    // Question Box
    doc.setFillColor(240, 248, 255); // AliceBlue
    doc.rect(20, y, 170, 15, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(secondaryColor);
    doc.text(`Q${index + 1}: ${card.question}`, 25, y + 10);
    
    y += 20;

    // Answer Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor('#333333');
    
    // Wrap text
    const splitAnswer = doc.splitTextToSize(card.answer, 160);
    doc.text(splitAnswer, 25, y);
    
    y += (splitAnswer.length * 7) + 10;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor('#aaaaaa');
    doc.text(`Sup Galilée Engineering School - Page ${i}/${pageCount}`, 105, 290, { align: 'center' });
  }

  doc.save(`Galilee_Revision_${deck.title.replace(/\s+/g, '_')}.pdf`);
};
