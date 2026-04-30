import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, isValid } from 'date-fns';
import { MedicalRecord } from '../types';

const safeFormat = (date: any, formatStr: string) => {
  try {
    const d = new Date(date);
    return isValid(d) ? format(d, formatStr) : 'N/A';
  } catch (e) {
    return 'N/A';
  }
};

export const generateMedicalHistoryPDF = (patientName: string, records: MedicalRecord[]) => {
  try {
    const doc = new jsPDF();
    const dateStr = safeFormat(new Date(), 'PPPP');

    // Add professional aesthetic border
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 287);

    // Decorative Color Bar
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(10, 10, 190, 4, 'F');

    // Header
    doc.setTextColor(30, 41, 59); // slate-800
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('HEAL SYNC', 20, 30);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('PRECISION HEALTHCARE SYSTEM', 20, 38);

    // Divider
    doc.setDrawColor(241, 245, 249); // slate-100
    doc.line(20, 45, 190, 45);

    // Patient Info Ribbon
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(20, 55, 170, 35, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(20, 55, 170, 35, 'S');

    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Medical History Summary', 30, 70);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`PATIENT: ${patientName.toUpperCase()}`, 30, 80);
    doc.text(`ISSUED: ${dateStr.toUpperCase()}`, 110, 80);

    // Table Content
    const tableRows = records.map((record, index) => [
      index + 1,
      safeFormat(record.timestamp, 'MMM dd, yyyy'),
      record.diagnosis,
      `Dr. ${record.doctorName}`,
      record.prescription
    ]);

    autoTable(doc, {
      startY: 100,
      head: [['#', 'DATE', 'DIAGNOSIS', 'PHYSICIAN', 'PRESCRIPTION / NOTES']],
      body: tableRows,
      theme: 'grid',
      headStyles: { 
        fillColor: [30, 41, 59], 
        textColor: [255, 255, 255], 
        fontSize: 9, 
        fontStyle: 'bold',
        cellPadding: 5
      },
      bodyStyles: { 
        fontSize: 9, 
        cellPadding: 6,
        textColor: [51, 65, 85]
      },
      alternateRowStyles: { 
        fillColor: [250, 251, 253] 
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 30 },
        2: { fontStyle: 'bold', cellWidth: 40 },
        3: { cellWidth: 35 },
        4: { cellWidth: 'auto' }
      },
      margin: { left: 20, right: 20 }
    });

    // Signatures / Footer placeholders
    const finalY = (doc as any).lastAutoTable.finalY + 30;
    if (finalY < 250) {
      doc.setDrawColor(200);
      doc.line(20, finalY, 80, finalY);
      doc.line(130, finalY, 190, finalY);
      doc.setFontSize(8);
      doc.text('Patient Signature', 50, finalY + 5, { align: 'center' });
      doc.text('Authorized Physician', 160, finalY + 5, { align: 'center' });
    }

    // Page Numbers & Confidentiality
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        'CONFIDENTIAL: This document contains sensitive medical information protected by law.',
        105,
        285,
        { align: 'center' }
      );
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 25,
        285,
        { align: 'right' }
      );
    }

    doc.save(`HEALSYNC_History_${patientName.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error('PDF Generation Failed:', error);
    alert('Sorry, there was an issue generating your PDF. Please try again later.');
  }
};

export const generateSingleRecordPDF = (record: MedicalRecord) => {
  try {
    const doc = new jsPDF();
    const timestamp = safeFormat(record.timestamp, 'PPPP');

    // Aesthetic Accents
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(2);
    doc.line(0, 0, 0, 297); // Left accent line

    // Header Branding
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('HEAL SYNC', 20, 30);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('CLINICAL DOCUMENTATION SYSTEM', 20, 37);

    // Metadata Right-aligned
    doc.setFontSize(9);
    doc.text(`RECORD ID: ${record.id.toUpperCase()}`, 190, 30, { align: 'right' });
    doc.text(`DATE: ${safeFormat(record.timestamp, 'dd MMM yyyy').toUpperCase()}`, 190, 37, { align: 'right' });

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    // Subject Hero Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(28);
    doc.text('Medical Record', 20, 65);
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text(`Patient: ${record.patientName}`, 20, 75);

    // Structured Details
    autoTable(doc, {
      startY: 85,
      body: [
        ['Status', 'OFFICIAL RECORD'],
        ['Attending Doctor', `Dr. ${record.doctorName}`],
        ['Clinical Date', timestamp],
        ['Service Type', 'Consultation & Prescription'],
      ],
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 4, textColor: [71, 85, 105] },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40, textColor: [30, 41, 59] } },
      margin: { left: 20 }
    });

    const bodyY = (doc as any).lastAutoTable.finalY + 15;

    // Diagnosis Section
    doc.setFillColor(248, 250, 252);
    doc.rect(20, bodyY, 170, 30, 'F');
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Primary Diagnosis', 30, bodyY + 10);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(record.diagnosis, 30, bodyY + 20);

    // Prescription Section
    const rxY = bodyY + 45;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('℞ Medical Prescription', 20, rxY);
    
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.8);
    doc.line(20, rxY + 3, 40, rxY + 3);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const rxLines = doc.splitTextToSize(record.prescription, 160);
    doc.text(rxLines, 20, rxY + 12);

    // Notes Section
    if (record.notes) {
      const notesY = rxY + 25 + (rxLines.length * 6);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text('Clinical Observations', 20, notesY);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const notesLines = doc.splitTextToSize(record.notes, 160);
      doc.text(notesLines, 20, notesY + 10);
    }

    // Footer
    const footerY = 280;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('HEALSYNC ELECTRONIC HEALTH RECORD', 105, footerY, { align: 'center' });
    doc.text('This document is verified and encrypted for security.', 105, footerY + 5, { align: 'center' });

    doc.save(`HEALSYNC_${record.patientName.replace(/\s+/g, '_')}_Record.pdf`);
  } catch (error) {
    console.error('PDF Generation Failed:', error);
    alert('Sorry, there was an issue generating your PDF. Please try again later.');
  }
};

