import type { Deck, User } from '../types';

declare global {
  interface Window {
    jspdf: {
      jsPDF: new () => PDFDoc;
    };
  }
}

interface PDFDoc {
  setFillColor: (color: string) => void;
  rect: (x: number, y: number, w: number, h: number, style: string) => void;
  setTextColor: (color: string) => void;
  setFontSize: (size: number) => void;
  setFont: (font: string, style: string) => void;
  text: (text: string | string[], x: number, y: number) => void;
  setDrawColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  addPage: () => void;
  splitTextToSize: (text: string, maxWidth: number) => string[];
  getNumberOfPages: () => number;
  setPage: (page: number) => void;
  save: (filename: string) => void;
}

export const generateDeckPDF = (deck: Deck, user: User | null) => {
  if (!window.jspdf) {
    alert("Module d'export PDF non chargé. Ajoutez jsPDF à votre projet.");
    return;
  }

  const { jsPDF } = window.jspdf;
  if (!jsPDF) {
      alert("Erreur d'initialisation PDF.");
      return;
  }
  
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
    doc.setFillColor('#f0f8ff'); // AliceBlue
    doc.rect(20, y, 170, 15, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(secondaryColor);
    
    // Sanitize text to avoid PDF errors with unsupported chars
    const safeQuestion = card.question.replace(/[^\x00-\xFF]/g, " "); 
    doc.text(`Q${index + 1}: ${safeQuestion}`, 25, y + 10);
    
    y += 20;

    // Answer Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor('#333333');
    
    // Wrap text
    const safeAnswer = card.answer.replace(/[^\x00-\xFF]/g, " ");
    const splitAnswer = doc.splitTextToSize(safeAnswer, 160);
    doc.text(splitAnswer, 25, y);
    
    y += (splitAnswer.length * 7) + 10;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor('#999999');
    doc.text(`Page ${i} / ${pageCount} - Généré par Galilée OS`, 105, 290);
  }

  // Save
  doc.save(`${deck.title.replace(/\s+/g, '_')}_flashcards.pdf`);
};
