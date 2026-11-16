import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportDefinition, ReportSummaryItem } from '../services/reportService';
import { Orden, Cliente, Restaurante, ItemMenu, ExperienciaTuristica } from '../types';

export const exportReportToPdf = (
  report: ReportDefinition,
  data: any[],
  summary: ReportSummaryItem[],
  userName: string = 'Administrador'
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Encabezado Institucional
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('UNIVERSIDAD DEL QUINDÍO - FACULTAD DE INGENIERÍA', 14, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Proyecto Final: Bases de Datos I | Sistema Sabor & Ruta - Gastronomía y Turismo', 14, 18);
  doc.text(`Generado: ${new Date().toLocaleString('es-CO')} | Usuario: ${userName}`, 14, 23);

  // Categoría & Título del Reporte
  let currentY = 36;
  doc.setFillColor(245, 158, 11); // amber-500
  doc.roundedRect(14, currentY - 4, 30, 6, 1, 1, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`REPORTE ${report.category.toUpperCase()}`, 16, currentY);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.text(report.title, 14, currentY + 9);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  const splitGoal = doc.splitTextToSize(`Utilidad para toma de decisiones: ${report.businessGoal}`, pageWidth - 28);
  doc.text(splitGoal, 14, currentY + 16);

  currentY += 18 + splitGoal.length * 4;

  // Resumen / KPIs
  if (summary && summary.length > 0) {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, currentY, pageWidth - 28, 12, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    let kpiX = 18;
    summary.forEach((item) => {
      doc.text(`${item.label.toUpperCase()}:`, kpiX, currentY + 7);
      doc.setTextColor(180, 83, 9); // amber-700
      doc.text(String(item.value), kpiX + doc.getTextWidth(`${item.label.toUpperCase()}: `) + 1, currentY + 7);
      doc.setTextColor(51, 65, 85);
      kpiX += 60;
    });

    currentY += 17;
  }

  // Tabla con autoTable
  const tableHeaders = report.columns.map(c => c.header);
  const tableRows = data.map(row => {
    return report.columns.map(col => {
      const val = row[col.key];
      if (col.isCurrency && typeof val === 'number') {
        return `$${val.toLocaleString('es-CO')} COP`;
      }
      return val !== undefined && val !== null ? String(val) : '-';
    });
  });

  autoTable(doc, {
    startY: currentY,
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (dataHook) => {
      // Pie de página con numeración
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Página ${dataHook.pageNumber} de ${pageCount} | Sabor & Ruta - Plataforma Gastronómica Turística`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: 'center' }
      );
    }
  });

  doc.save(`Reporte_${report.id}_${report.category}_SaborRuta.pdf`);
};

export const exportToCsv = (report: ReportDefinition, data: any[]) => {
  const headers = report.columns.map(c => `"${c.header}"`).join(',');
  const rows = data.map(row => {
    return report.columns.map(col => {
      const val = row[col.key];
      return `"${val !== undefined && val !== null ? val : ''}"`;
    }).join(',');
  });

  const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Reporte_${report.id}_${report.title.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportFacturaToPdf = (
  orden: Orden,
  cliente: Cliente | undefined,
  restaurante: Restaurante | undefined,
  itemsMenu: ItemMenu[],
  experiencias: ExperienciaTuristica[]
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Cabecera Comercial
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setTextColor(245, 158, 11);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SABOR & RUTA', 14, 12);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('SISTEMA INTEGRADO DE RESTAURANTES Y TURISMO GASTRONÓMICO', 14, 18);
  doc.text('Universidad del Quindío - Proyecto Final de Bases de Datos I', 14, 23);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(`FACTURA Nº FAC-00${orden.idOrden}`, pageWidth - 14, 14, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${orden.fecha}`, pageWidth - 14, 20, { align: 'right' });
  doc.text(`Estado: PAGADA (OFICIAL)`, pageWidth - 14, 25, { align: 'right' });

  // Cuadro Restaurante
  let y = 42;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, (pageWidth - 32) / 2, 28, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('RESTAURANTE EMISOR', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Razón Social: ${restaurante?.nombre || 'El Fogón Cafetero'}`, 18, y + 12);
  doc.text(`NIT: ${restaurante?.nit || '900123451-1'}`, 18, y + 17);
  doc.text(`Dirección: ${restaurante?.direccion || 'Calle Real # 6-15'}`, 18, y + 22);

  // Cuadro Turista / Cliente
  const xRight = 14 + (pageWidth - 32) / 2 + 4;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(xRight, y, (pageWidth - 32) / 2, 28, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('DATOS DEL TURISTA / CLIENTE', xRight + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Nombre: ${cliente ? `${cliente.Nombre} ${cliente.apellido}` : 'Cliente Mostrador'}`, xRight + 4, y + 12);
  doc.text(`Identificación: ${cliente?.numeroDocumento || 'N/A'}`, xRight + 4, y + 17);
  doc.text(`País de Origen: ${cliente?.paisOrigen || 'CO'} | Tel: ${cliente?.telefono || 'N/A'}`, xRight + 4, y + 22);

  // Items de la Orden
  y += 34;
  const tableRows: any[] = [];

  // Menú items
  orden.detallesMenu?.forEach(item => {
    const menuItem = itemsMenu.find(m => m.idItem === item.ItemMenu_idItem);
    tableRows.push([
      `Plato: ${menuItem?.nombrItem || `Item #${item.ItemMenu_idItem}`}`,
      'Consumo Gastronómico',
      String(item.cantidad),
      `$${(menuItem?.precio || 0).toLocaleString('es-CO')} COP`,
      `$${item.subTotal.toLocaleString('es-CO')} COP`
    ]);
  });

  // Experiencias
  orden.detallesExperiencia?.forEach(exp => {
    const expObj = experiencias.find(e => e.idExperiencia === exp.ExperienciaTuristica_idExperiencia);
    tableRows.push([
      `Tour: ${expObj?.nombreExperiencia || `Experiencia #${exp.ExperienciaTuristica_idExperiencia}`}`,
      'Experiencia Turística',
      `${exp.asistentes} persona(s)`,
      `$${(expObj?.precioPorPersona || 0).toLocaleString('es-CO')} COP`,
      `$${exp.subtotal.toLocaleString('es-CO')} COP`
    ]);
  });

  if (orden.costoDomicilio && orden.costoDomicilio > 0) {
    tableRows.push([
      'Servicio de Domicilio en Zona Turística',
      'Logística / Transporte',
      '1',
      `$${orden.costoDomicilio.toLocaleString('es-CO')} COP`,
      `$${orden.costoDomicilio.toLocaleString('es-CO')} COP`
    ]);
  }

  autoTable(doc, {
    startY: y,
    head: [['Concepto / Descripción', 'Tipo Servicio', 'Cant / Cupos', 'Tarifa Unitaria', 'Subtotal']],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8.5
    },
    margin: { left: 14, right: 14 }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;

  // Totalizadores
  const totalBoxWidth = 85;
  const totalBoxX = pageWidth - 14 - totalBoxWidth;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(totalBoxX, finalY, totalBoxWidth, 34, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal Base:', totalBoxX + 4, finalY + 7);
  doc.text(`$${Math.round(orden.total / 1.08).toLocaleString('es-CO')} COP`, totalBoxX + totalBoxWidth - 4, finalY + 7, { align: 'right' });

  doc.text('Impoconsumo (8%):', totalBoxX + 4, finalY + 14);
  doc.text(`$${Math.round(orden.total - (orden.total / 1.08)).toLocaleString('es-CO')} COP`, totalBoxX + totalBoxWidth - 4, finalY + 14, { align: 'right' });

  doc.text('Propina Voluntaria (10%):', totalBoxX + 4, finalY + 21);
  doc.text(`$${Math.round(orden.total * 0.1).toLocaleString('es-CO')} COP`, totalBoxX + totalBoxWidth - 4, finalY + 21, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(180, 83, 9);
  doc.text('TOTAL FACTURADO:', totalBoxX + 4, finalY + 29);
  doc.text(`$${orden.total.toLocaleString('es-CO')} COP`, totalBoxX + totalBoxWidth - 4, finalY + 29, { align: 'right' });

  // Pie legal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Documento equivalente de factura expedido bajo los lineamientos académicos de Bases de Datos I.', 14, finalY + 45);
  doc.text('Oracle Autonomous Database Cloud (OCI) - Instancia ProyectoRestaurante | Grupo SINFOCI', 14, finalY + 50);

  doc.save(`Factura_Orden_${orden.idOrden}_SaborRuta.pdf`);
};
