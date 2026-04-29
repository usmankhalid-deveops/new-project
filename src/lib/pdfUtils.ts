import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { MedicalRecord } from '../types';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateMedicalHistoryPDF = (patientName: string, records: MedicalRecord[]) => {
  const doc = new jsPDF();
  const dateStr = format(new Date(), 'PPPP');

  // Header
  doc.setFillColor(37, 99, 235); // Blue-600
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('HEAL SYNC', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Healthcare Management System', 105, 28, { align: 'center' });

  // Patient Info Section
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Medical History Report', 20, 55);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Patient Name: ${patientName}`, 20, 65);
  doc.text(`Report Date: ${dateStr}`, 20, 71);
  doc.text(`Total Records: ${records.length}`, 20, 77);

  // Table
  const tableRows = records.map((record, index) => [
    index + 1,
    format(new Date(record.timestamp), 'MMM dd, yyyy'),
    record.diagnosis,
    `Dr. ${record.doctorName}`,
    record.prescription
  ]);

  doc.autoTable({
    startY: 85,
    head: [['#', 'Date', 'Diagnosis', 'Doctor', 'Prescription']],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { top: 85 },
    styles: { overflow: 'linebreak', cellPadding: 5 }
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      'This is a computer-generated report. No signature required.',
      105,
      doc.internal.pageSize.height - 15,
      { align: 'center' }
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    );
  }

  doc.save(`Medical_History_${patientName.replace(/\s+/g, '_')}.pdf`);
};

export const generateSingleRecordPDF = (record: MedicalRecord) => {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('HEAL SYNC', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Professional Healthcare Management System', 105, 28, { align: 'center' });

  // Record details
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Medical Record Summary', 20, 55);

  doc.autoTable({
    startY: 65,
    body: [
      ['Report ID', record.id],
      ['Date', format(new Date(record.timestamp), 'PPPP')],
      ['Patient Name', record.patientName],
      ['Attending Physician', `Dr. ${record.doctorName}`],
      ['Primary Diagnosis', record.diagnosis],
    ],
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 4 },
    columnStyles: { 0: { fontStyle: 'bold', width: 40 } }
  });

  // Prescription section
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('℞ Prescription', 20, finalY);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const prescriptionLines = doc.splitTextToSize(record.prescription, 170);
  doc.text(prescriptionLines, 20, finalY + 10);

  // Notes section
  if (record.notes) {
    const notesY = finalY + 15 + (prescriptionLines.length * 6);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Clinical Notes', 20, notesY);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const notesLines = doc.splitTextToSize(record.notes, 170);
    doc.text(notesLines, 20, notesY + 10);
  }

  // Border/Footer
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.line(20, doc.internal.pageSize.height - 30, 190, doc.internal.pageSize.height - 30);
  
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('Confidential Document - For Medical Use Only', 105, doc.internal.pageSize.height - 20, { align: 'center' });

  doc.save(`Medical_Record_${record.diagnosis.replace(/\s+/g, '_')}.pdf`);
};
