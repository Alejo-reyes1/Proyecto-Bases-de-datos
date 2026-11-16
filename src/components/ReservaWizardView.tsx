import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Restaurante, Mesa, ExperienciaTuristica } from '../types';
import {
  CalendarCheck,
  UtensilsCrossed,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  Sparkles,
  Download,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Compass,
  FileText
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const ReservaWizardView: React.FC = () => {
  const {
    restaurantes,
    mesas,
    experiencias,
    peticionesEspeciales,
    clientes,
    addReserva,
    user
  } = useDatabase();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [selectedRestId, setSelectedRestId] = useState<number>(1);
  const [fechaReserva, setFechaReserva] = useState<string>('2026-11-20');
  const [horaReserva, setHoraReserva] = useState<string>('19:30');
  const [cantidadPersonas, setCantidadPersonas] = useState<number>(2);
  const [selectedMesaId, setSelectedMesaId] = useState<number>(2);

  const [selectedPeticiones, setSelectedPeticiones] = useState<string[]>([
    'Mesa con vista panorámica'
  ]);
  const [selectedExpId, setSelectedExpId] = useState<number | 0>(1); // e.g., Tour de café

  // Tourist info
  const [turistaNombre, setTuristaNombre] = useState<string>(
    user?.rol === 'Turista' ? user.nombre : 'Carlos Gómez'
  );
  const [turistaDoc, setTuristaDoc] = useState<string>('1094900101');
  const [turistaEmail, setTuristaEmail] = useState<string>('carlos.gomez@gmail.com');
  const [turistaTelefono, setTuristaTelefono] = useState<string>('3104501122');
  const [turistaPais, setTuristaPais] = useState<string>('CO');

  const [confirmedCode, setConfirmedCode] = useState<string>('');

  const currentRestaurante = restaurantes.find(r => r.idRestaurante === selectedRestId) || restaurantes[0];
  const availableMesas = mesas.filter(m => m.Restaurante_idRestaurante === selectedRestId);
  const restExperiencias = experiencias.filter(e => e.Restaurante_idRestaurante === selectedRestId);
  const selectedExpObj = experiencias.find(e => e.idExperiencia === selectedExpId);

  const handleTogglePeticion = (nombre: string) => {
    setSelectedPeticiones(prev =>
      prev.includes(nombre) ? prev.filter(p => p !== nombre) : [...prev, nombre]
    );
  };

  const handleConfirmReservation = () => {
    const code = `RES-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedCode(code);

    addReserva({
      fechaReserva,
      horaReserva,
      cantidadPersonas,
      Cliente_numeroDocumento: turistaDoc,
      Restaurante_idRestaurante: selectedRestId,
      Estado_idEstado: 2, // Confirmada
      peticionesEspeciales: selectedPeticiones,
      experienciaTuristicaId: selectedExpId > 0 ? selectedExpId : undefined
    });

    setStep(5);
  };

  const handleDownloadVoucherPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(245, 158, 11);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SABOR & RUTA', 12, 11);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('VOUCHER OFICIAL DE RESERVA TURÍSTICA', 12, 17);
    doc.text('Universidad del Quindío • Bases de Datos I', 12, 22);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(245, 158, 11);
    doc.text(confirmedCode, pageWidth - 12, 16, { align: 'right' });

    // Body
    let y = 36;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(12, y, pageWidth - 24, 32, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Restaurante: ${currentRestaurante.nombre}`, 16, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Dirección: ${currentRestaurante.direccion}`, 16, y + 14);
    doc.text(`Fecha y Hora: ${fechaReserva} a las ${horaReserva}`, 16, y + 20);
    doc.text(`Comensales: ${cantidadPersonas} personas | Mesa asignada: #${selectedMesaId}`, 16, y + 26);

    y += 38;
    const tableData = [
      ['Titular de la Reserva', turistaNombre],
      ['Documento / Pasaporte', `${turistaDoc} (${turistaPais})`],
      ['Teléfono Móvil', turistaTelefono],
      ['Experiencia Incluida', selectedExpObj ? selectedExpObj.nombreExperiencia : 'Ninguna'],
      ['Peticiones Especiales', selectedPeticiones.join(', ') || 'Estándar'],
      ['Estado en Oracle DB', 'CONFIRMADA Y REGISTRADA']
    ];

    autoTable(doc, {
      startY: y,
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      columnStyles: { 0: { fontStyle: 'bold', fillColor: [241, 245, 249], cellWidth: 45 } },
      margin: { left: 12, right: 12 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 8;
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Presente este comprobante digital a su llegada al restaurante.', 12, finalY);
    doc.text('Instancia Oracle Cloud Autonomous DB • Sistema Sabor & Ruta', 12, finalY + 5);

    doc.save(`Voucher_${confirmedCode}_SaborRuta.pdf`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            EXPERIENCIA DE USUARIO (TURISTA)
          </span>
          <span className="text-xs text-slate-400">Módulo de Reservas y Actividades Turísticas</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-emerald-400" />
          <span>Reserva de Mesas y Experiencias Gastronómicas</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Flujo guiado para comensales: selecciona restaurante, asigna mesa, solicita peticiones especiales y contrata tours.
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="grid grid-cols-5 gap-2 pb-2">
        {[
          { num: 1, label: 'Sede' },
          { num: 2, label: 'Fecha & Mesa' },
          { num: 3, label: 'Peticiones & Tour' },
          { num: 4, label: 'Datos Turista' },
          { num: 5, label: 'Confirmación' }
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              step === s.num
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                : step > s.num
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <p className="text-[10px] uppercase font-bold tracking-wider">Paso {s.num}</p>
            <p className="text-xs truncate">{s.label}</p>
          </div>
        ))}
      </div>

      {/* STEP 1: Select Restaurant */}
      {step === 1 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-amber-400" />
            <span>Selecciona el Restaurante Anfitrión</span>
          </h3>
          <p className="text-xs text-slate-400">
            Escoge entre nuestras sedes gastronómicas en el Eje Cafetero, Caribe, Antioquia y Bogotá:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurantes.map((r) => {
              const isSelected = selectedRestId === r.idRestaurante;
              return (
                <div
                  key={r.idRestaurante}
                  onClick={() => setSelectedRestId(r.idRestaurante)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-white">{r.nombre}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      {r.categoriaCocina}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{r.direccion}</span>
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {r.horaApertura} - {r.horaCierre}
                    </span>
                    <span className="text-amber-400 font-semibold">{r.Ciudad_idCiudad}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <span>Continuar: Fecha y Mesa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Date, Time & Table */}
      {step === 2 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Fecha, Horario y Selección de Mesa en {currentRestaurante.nombre}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha de la Reserva *</label>
              <input
                type="date"
                value={fechaReserva}
                onChange={(e) => setFechaReserva(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hora Estimada *</label>
              <select
                value={horaReserva}
                onChange={(e) => setHoraReserva(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value="12:00">12:00 PM (Almuerzo)</option>
                <option value="13:30">01:30 PM</option>
                <option value="15:00">03:00 PM (Cata / Café)</option>
                <option value="19:00">07:00 PM (Cena)</option>
                <option value="20:00">08:00 PM</option>
                <option value="21:00">09:00 PM</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Comensales (Personas) *</label>
              <input
                type="number"
                min={1}
                max={12}
                value={cantidadPersonas}
                onChange={(e) => setCantidadPersonas(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Seleccione una Mesa Física Disponible ({availableMesas.length} mesas en esta sede)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {availableMesas.map((m) => {
                const isSelected = selectedMesaId === m.idMesa;
                return (
                  <div
                    key={m.idMesa}
                    onClick={() => setSelectedMesaId(m.idMesa)}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">Mesa #{m.numeroMesa}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Capacidad: {m.capacidad} personas</p>
                    <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Disponible
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <span>Continuar: Peticiones y Tour</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Special Requests & Tour */}
      {step === 3 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Peticiones Especiales & Actividad Turística Opcional</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Peticiones Especiales para el Comensal (Tabla: PeticionEspecial)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {peticionesEspeciales.map((p) => {
                const isChecked = selectedPeticiones.includes(p.nombre);
                return (
                  <div
                    key={p.idPeticion}
                    onClick={() => handleTogglePeticion(p.nombre)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 accent-amber-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-200">{p.nombre}</p>
                      <p className="text-[11px] text-slate-500 leading-tight">{p.descripcion}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              ¿Deseas agregar una Experiencia Turística vinculada a esta visita?
            </label>
            <div className="space-y-2">
              <div
                onClick={() => setSelectedExpId(0)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedExpId === 0
                    ? 'bg-slate-800 border-amber-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-xs font-semibold">Solo Reserva de Mesa (Sin Tour)</span>
                <span className="text-xs font-mono">$0 COP</span>
              </div>

              {restExperiencias.map((exp) => {
                const isSelected = selectedExpId === exp.idExperiencia;
                return (
                  <div
                    key={exp.idExperiencia}
                    onClick={() => setSelectedExpId(exp.idExperiencia)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{exp.nombreExperiencia}</span>
                      </p>
                      <p className="text-[11px] text-slate-500">{exp.duracion} horas • {exp.descripcion.slice(0, 70)}...</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      +${exp.precioPorPersona.toLocaleString('es-CO')} COP/persona
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <span>Continuar: Datos de Contacto</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Tourist Details */}
      {step === 4 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Datos del Titular de la Reserva</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                value={turistaNombre}
                onChange={(e) => setTuristaNombre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nº Documento o Pasaporte *</label>
              <input
                type="text"
                required
                value={turistaDoc}
                onChange={(e) => setTuristaDoc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico *</label>
              <input
                type="email"
                required
                value={turistaEmail}
                onChange={(e) => setTuristaEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil / WhatsApp *</label>
              <input
                type="text"
                required
                value={turistaTelefono}
                onChange={(e) => setTuristaTelefono(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Booking Summary Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider">Resumen de la Solicitud</h4>
            <div className="flex justify-between text-slate-300">
              <span>Restaurante:</span>
              <span className="font-bold text-white">{currentRestaurante.nombre} ({currentRestaurante.Ciudad_idCiudad})</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Fecha & Hora:</span>
              <span className="font-mono text-white">{fechaReserva} a las {horaReserva}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Mesa y Capacidad:</span>
              <span>Mesa #{selectedMesaId} ({cantidadPersonas} comensales)</span>
            </div>
            {selectedExpObj && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Tour Turístico Incluido:</span>
                <span>{selectedExpObj.nombreExperiencia}</span>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              onClick={handleConfirmReservation}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirmar y Guardar Reserva en Oracle DB</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Official Voucher Confirmation */}
      {step === 5 && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto text-2xl">
            🎉
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              CÓDIGO OFICIAL: {confirmedCode}
            </span>
            <h3 className="text-2xl font-black text-white mt-2">¡Reserva Confirmada Exitosamente!</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Los registros han sido insertados de manera conforme en las tablas <strong>Reserva</strong> y <strong>ReservaPeticionesEsp</strong> de Oracle Autonomous DB.
            </p>
          </div>

          {/* Voucher Preview Card */}
          <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-extrabold text-amber-400 text-sm">{currentRestaurante.nombre}</span>
              <span className="text-[10px] text-slate-500 font-mono">{confirmedCode}</span>
            </div>
            <p className="text-slate-300"><strong>Titular:</strong> {turistaNombre} ({turistaDoc})</p>
            <p className="text-slate-300"><strong>Fecha y Hora:</strong> {fechaReserva} — {horaReserva}</p>
            <p className="text-slate-300"><strong>Mesa Asignada:</strong> #{selectedMesaId} ({cantidadPersonas} personas)</p>
            {selectedExpObj && (
              <p className="text-emerald-400"><strong>Tour:</strong> {selectedExpObj.nombreExperiencia}</p>
            )}
            <p className="text-slate-400 text-[11px]">
              <strong>Peticiones Especiales:</strong> {selectedPeticiones.join(', ') || 'Ninguna'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleDownloadVoucherPdf}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Voucher en PDF</span>
            </button>
            <button
              onClick={() => setStep(1)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700"
            >
              Hacer Otra Reserva
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
