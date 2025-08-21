import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export async function exportToPDF(studyPlan, elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `avukatlik-sinavi-plan-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('PDF export error:', error);
    alert('PDF oluşturulurken bir hata oluştu.');
  }
}

export function exportToCSV(studyPlan) {
  try {
    const csvData = [
      ['Tarih', 'Gün', 'Konu', 'Alt Konular', 'Durum']
    ];

    studyPlan.weeks.forEach(week => {
      week.days.forEach(day => {
        if (day.isDayOff) {
          csvData.push([
            format(day.date, 'dd/MM/yyyy', { locale: tr }),
            day.dayOfWeek,
            'Tatil',
            '',
            'Tatil'
          ]);
        } else {
          day.subjects.forEach(subjectData => {
            csvData.push([
              format(day.date, 'dd/MM/yyyy', { locale: tr }),
              day.dayOfWeek,
              subjectData.subject.name,
              subjectData.topics.join(', '),
              'Çalışma'
            ]);
          });
        }
      });
    });

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `avukatlik-sinavi-plan-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('CSV export error:', error);
    alert('CSV oluşturulurken bir hata oluştu.');
  }
}

export function exportToExcel(studyPlan) {
  try {
    const workbook = XLSX.utils.book_new();
    
    // Ana plan sayfası
    const mainData = [];
    studyPlan.weeks.forEach(week => {
      mainData.push([`${week.weekNumber}. Hafta - ${week.description}`]);
      mainData.push(['Tarih', 'Gün', 'Konu', 'Alt Konular', 'Durum']);
      
      week.days.forEach(day => {
        if (day.isDayOff) {
          mainData.push([
            format(day.date, 'dd/MM/yyyy', { locale: tr }),
            day.dayOfWeek,
            'Tatil',
            '',
            'Tatil'
          ]);
        } else {
          day.subjects.forEach(subjectData => {
            mainData.push([
              format(day.date, 'dd/MM/yyyy', { locale: tr }),
              day.dayOfWeek,
              subjectData.subject.name,
              subjectData.topics.join(', '),
              'Çalışma'
            ]);
          });
        }
      });
      mainData.push([]); // Boş satır
    });

    const mainWorksheet = XLSX.utils.aoa_to_sheet(mainData);
    XLSX.utils.book_append_sheet(workbook, mainWorksheet, 'Çalışma Planı');

    // Özet sayfası
    const summaryData = [
      ['Avukatlık Sınavı Çalışma Planı Özeti'],
      [],
      ['Başlangıç Tarihi', format(studyPlan.startDate, 'dd/MM/yyyy', { locale: tr })],
      ['Bitiş Tarihi', format(studyPlan.endDate, 'dd/MM/yyyy', { locale: tr })],
      ['Toplam Gün', studyPlan.totalDays],
      ['Çalışma Günü', studyPlan.studyDays],
      ['Toplam Hafta', studyPlan.weeks.length],
      [],
      ['Haftalık Dağılım'],
      ['Hafta', 'Açıklama', 'Başlangıç', 'Bitiş']
    ];

    studyPlan.weeks.forEach(week => {
      summaryData.push([
        week.weekNumber,
        week.description,
        format(week.startDate, 'dd/MM/yyyy', { locale: tr }),
        format(week.endDate, 'dd/MM/yyyy', { locale: tr })
      ]);
    });

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Özet');

    const fileName = `avukatlik-sinavi-plan-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error('Excel export error:', error);
    alert('Excel dosyası oluşturulurken bir hata oluştu.');
  }
}
