import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { UserPlus } from 'lucide-react';

/**
 * Registro de cuenta (característica mínima del caso de estudio: "Creación de cuenta con datos básicos").
 * Inserta el turista en la tabla Cliente y, si existe la tabla UsuarioSistema, guarda la credencial
 * con hash scrypt + salt en Oracle.
 */
export const RegistroCuentaForm: React.FC<{ onDone: (usuario: string, mensaje: string) => void }> = ({ onDone }) => {
  const { registrarCuenta, paises, tiposDocumento } = useDatabase();
  const [f, setF] = useState({
    numeroDocumento: '',
    TipoDocumento_idTipoDocumento: 3,
    Nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    paisOrigen: 'US',
    usuario: '',
    clave: '',
    clave2: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: k === 'TipoDocumento_idTipoDocumento' ? Number(e.target.value) : e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (f.clave.length < 6) return setError('La contraseña debe tener mínimo 6 caracteres.');
    if (f.clave !== f.clave2) return setError('Las contraseñas no coinciden.');
    if (!/^[a-z0-9._-]{4,30}$/i.test(f.usuario)) return setError('Usuario: 4 a 30 caracteres (letras, números, punto, guion).');
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setError('Correo electrónico inválido.');
    setBusy(true);
    const r = await registrarCuenta(
      {
        numeroDocumento: f.numeroDocumento.trim(),
        TipoDocumento_idTipoDocumento: f.TipoDocumento_idTipoDocumento,
        Nombre: f.Nombre.trim(),
        apellido: f.apellido.trim(),
        email: f.email.trim(),
        telefono: f.telefono.trim(),
        paisOrigen: f.paisOrigen,
      },
      f.usuario.trim().toLowerCase(),
      f.clave
    );
    setBusy(false);
    if (!r.success) return setError(r.message);
    onDone(f.usuario.trim().toLowerCase(), r.message);
  };

  const input = 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500';
  const label = 'block text-[11px] font-semibold text-slate-400 mb-1';

  return (
    <form onSubmit={submit} className="space-y-3">
      {error && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">{error}</div>}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Tipo de documento</label>
          <select value={f.TipoDocumento_idTipoDocumento} onChange={set('TipoDocumento_idTipoDocumento')} className={input}>
            {tiposDocumento.map(t => (
              <option key={t.idTipoDocumento} value={t.idTipoDocumento}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Nº documento *</label>
          <input required maxLength={100} value={f.numeroDocumento} onChange={set('numeroDocumento')} className={`${input} font-mono`} />
        </div>
        <div>
          <label className={label}>Nombre *</label>
          <input required maxLength={20} value={f.Nombre} onChange={set('Nombre')} className={input} />
        </div>
        <div>
          <label className={label}>Apellido *</label>
          <input required maxLength={20} value={f.apellido} onChange={set('apellido')} className={input} />
        </div>
        <div>
          <label className={label}>Correo *</label>
          <input required type="email" maxLength={50} value={f.email} onChange={set('email')} className={input} />
        </div>
        <div>
          <label className={label}>Teléfono</label>
          <input maxLength={20} value={f.telefono} onChange={set('telefono')} className={input} placeholder="+1 2125550100" />
        </div>
        <div className="col-span-2">
          <label className={label}>País de origen</label>
          <select value={f.paisOrigen} onChange={set('paisOrigen')} className={input}>
            {paises.map(p => (
              <option key={p.idPais} value={p.idPais}>
                {p.nombre} ({p.idPais})
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className={label}>Usuario *</label>
          <input required value={f.usuario} onChange={set('usuario')} className={input} placeholder="ej. ana.souza" />
        </div>
        <div>
          <label className={label}>Contraseña *</label>
          <input required type="password" value={f.clave} onChange={set('clave')} className={input} />
        </div>
        <div>
          <label className={label}>Repetir contraseña *</label>
          <input required type="password" value={f.clave2} onChange={set('clave2')} className={input} />
        </div>
      </div>
      <button
        type="submit"
        disabled={busy}
        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
      >
        <UserPlus className="w-4 h-4" />
        {busy ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>
    </form>
  );
};
