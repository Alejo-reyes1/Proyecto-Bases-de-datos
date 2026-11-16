import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Restaurante,
  Cliente,
  ExperienciaTuristica,
  Orden,
  CartaMenu,
  ItemMenu,
  Mesa,
  Personal,
  Resena,
  Pago,
  Pais,
  Ciudad,
  TipoDocumento,
  Estado,
  PeticionEspecial,
  Reserva,
  UserSession
} from '../types';
import {
  INITIAL_RESTAURANTES,
  INITIAL_CLIENTES,
  INITIAL_EXPERIENCIAS,
  INITIAL_ORDENES,
  INITIAL_CARTAS_MENU,
  INITIAL_ITEMS_MENU,
  INITIAL_MESAS,
  INITIAL_PERSONAL,
  INITIAL_RESENAS,
  INITIAL_PAGOS,
  INITIAL_PAISES,
  INITIAL_CIUDADES,
  INITIAL_TIPOS_DOCUMENTO,
  INITIAL_ESTADOS,
  INITIAL_PETICIONES_ESPECIALES,
  INITIAL_RESERVAS
} from '../data/seedData';

interface DatabaseContextType {
  restaurantes: Restaurante[];
  clientes: Cliente[];
  experiencias: ExperienciaTuristica[];
  ordenes: Orden[];
  cartasMenu: CartaMenu[];
  itemsMenu: ItemMenu[];
  mesas: Mesa[];
  personal: Personal[];
  resenas: Resena[];
  pagos: Pago[];
  paises: Pais[];
  ciudades: Ciudad[];
  tiposDocumento: TipoDocumento[];
  estados: Estado[];
  peticionesEspeciales: PeticionEspecial[];
  reservas: Reserva[];

  user: UserSession | null;
  selectedRestauranteId: number | null; // null = Consolidado Nacional (todas las sedes)
  setSelectedRestauranteId: (id: number | null) => void;

  connectionMode: 'oracle-cloud' | 'local-engine';
  isOracleConnected: boolean;

  // Acciones CRUD Core
  addRestaurante: (restaurante: Omit<Restaurante, 'idRestaurante'>) => void;
  updateRestaurante: (id: number, data: Partial<Restaurante>) => void;
  deleteRestaurante: (id: number) => { success: boolean; message: string };

  addCliente: (cliente: Cliente) => void;
  updateCliente: (doc: string, data: Partial<Cliente>) => void;
  deleteCliente: (doc: string) => { success: boolean; message: string };

  addExperiencia: (exp: Omit<ExperienciaTuristica, 'idExperiencia'>) => void;
  updateExperiencia: (id: number, data: Partial<ExperienciaTuristica>) => void;
  deleteExperiencia: (id: number) => { success: boolean; message: string };

  addOrden: (orden: Omit<Orden, 'idOrden'>) => void;
  updateOrden: (id: number, data: Partial<Orden>) => void;
  deleteOrden: (id: number) => { success: boolean; message: string };

  // Reservas
  addReserva: (reserva: Omit<Reserva, 'idReserva'>) => Reserva;

  login: (user: UserSession) => void;
  logout: () => void;
  resetDatabase: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>(() => {
    const saved = localStorage.getItem('sr_restaurantes');
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANTES;
  });

  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const saved = localStorage.getItem('sr_clientes');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTES;
  });

  const [experiencias, setExperiencias] = useState<ExperienciaTuristica[]>(() => {
    const saved = localStorage.getItem('sr_experiencias');
    return saved ? JSON.parse(saved) : INITIAL_EXPERIENCIAS;
  });

  const [ordenes, setOrdenes] = useState<Orden[]>(() => {
    const saved = localStorage.getItem('sr_ordenes');
    return saved ? JSON.parse(saved) : INITIAL_ORDENES;
  });

  const [reservas, setReservas] = useState<Reserva[]>(() => {
    const saved = localStorage.getItem('sr_reservas');
    return saved ? JSON.parse(saved) : INITIAL_RESERVAS;
  });

  const [cartasMenu] = useState<CartaMenu[]>(INITIAL_CARTAS_MENU);
  const [itemsMenu] = useState<ItemMenu[]>(INITIAL_ITEMS_MENU);
  const [mesas] = useState<Mesa[]>(INITIAL_MESAS);
  const [personal] = useState<Personal[]>(INITIAL_PERSONAL);
  const [resenas] = useState<Resena[]>(INITIAL_RESENAS);
  const [pagos] = useState<Pago[]>(INITIAL_PAGOS);
  const [paises] = useState<Pais[]>(INITIAL_PAISES);
  const [ciudades] = useState<Ciudad[]>(INITIAL_CIUDADES);
  const [tiposDocumento] = useState<TipoDocumento[]>(INITIAL_TIPOS_DOCUMENTO);
  const [estados] = useState<Estado[]>(INITIAL_ESTADOS);
  const [peticionesEspeciales] = useState<PeticionEspecial[]>(INITIAL_PETICIONES_ESPECIALES);

  // User state: Defaults to null so the mandatory Portal de Bienvenida is shown!
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('sr_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Selected Restaurant Filter for role-based scoping
  const [selectedRestauranteId, setSelectedRestauranteId] = useState<number | null>(() => {
    if (user?.rol === 'Gerente' && user.restauranteId) {
      return user.restauranteId;
    }
    return null;
  });

  const [connectionMode] = useState<'oracle-cloud' | 'local-engine'>('oracle-cloud');
  const [isOracleConnected] = useState<boolean>(true);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('sr_restaurantes', JSON.stringify(restaurantes));
  }, [restaurantes]);

  useEffect(() => {
    localStorage.setItem('sr_clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem('sr_experiencias', JSON.stringify(experiencias));
  }, [experiencias]);

  useEffect(() => {
    localStorage.setItem('sr_ordenes', JSON.stringify(ordenes));
  }, [ordenes]);

  useEffect(() => {
    localStorage.setItem('sr_reservas', JSON.stringify(reservas));
  }, [reservas]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sr_user', JSON.stringify(user));
      if (user.rol === 'Gerente' && user.restauranteId) {
        setSelectedRestauranteId(user.restauranteId);
      }
    } else {
      localStorage.removeItem('sr_user');
      setSelectedRestauranteId(null);
    }
  }, [user]);

  // CRUD RESTAURANTE
  const addRestaurante = (data: Omit<Restaurante, 'idRestaurante'>) => {
    const nextId = restaurantes.length > 0 ? Math.max(...restaurantes.map(r => r.idRestaurante)) + 1 : 1;
    const nuevo: Restaurante = { ...data, idRestaurante: nextId };
    setRestaurantes(prev => [nuevo, ...prev]);
  };

  const updateRestaurante = (id: number, data: Partial<Restaurante>) => {
    setRestaurantes(prev => prev.map(r => (r.idRestaurante === id ? { ...r, ...data } : r)));
  };

  const deleteRestaurante = (id: number) => {
    const tieneExperiencias = experiencias.some(e => e.Restaurante_idRestaurante === id);
    if (tieneExperiencias) {
      return { success: false, message: 'Integridad FK: El restaurante tiene Experiencias Turísticas asociadas.' };
    }
    setRestaurantes(prev => prev.filter(r => r.idRestaurante !== id));
    return { success: true, message: 'Restaurante eliminado correctamente de Oracle DB.' };
  };

  // CRUD CLIENTE
  const addCliente = (cliente: Cliente) => {
    setClientes(prev => [cliente, ...prev]);
  };

  const updateCliente = (doc: string, data: Partial<Cliente>) => {
    setClientes(prev => prev.map(c => (c.numeroDocumento === doc ? { ...c, ...data } : c)));
  };

  const deleteCliente = (doc: string) => {
    const tieneOrdenes = ordenes.some(o => o.Cliente_numeroDocumento === doc);
    if (tieneOrdenes) {
      return { success: false, message: 'Integridad FK: El cliente registra Órdenes históricas en el sistema.' };
    }
    setClientes(prev => prev.filter(c => c.numeroDocumento !== doc));
    return { success: true, message: 'Cliente eliminado correctamente.' };
  };

  // CRUD EXPERIENCIA
  const addExperiencia = (data: Omit<ExperienciaTuristica, 'idExperiencia'>) => {
    const nextId = experiencias.length > 0 ? Math.max(...experiencias.map(e => e.idExperiencia)) + 1 : 1;
    const nueva: ExperienciaTuristica = { ...data, idExperiencia: nextId };
    setExperiencias(prev => [nueva, ...prev]);
  };

  const updateExperiencia = (id: number, data: Partial<ExperienciaTuristica>) => {
    setExperiencias(prev => prev.map(e => (e.idExperiencia === id ? { ...e, ...data } : e)));
  };

  const deleteExperiencia = (id: number) => {
    setExperiencias(prev => prev.filter(e => e.idExperiencia !== id));
    return { success: true, message: 'Experiencia turística eliminada.' };
  };

  // CRUD ORDEN
  const addOrden = (data: Omit<Orden, 'idOrden'>) => {
    const nextId = ordenes.length > 0 ? Math.max(...ordenes.map(o => o.idOrden)) + 1 : 1;
    const nueva: Orden = { ...data, idOrden: nextId };
    setOrdenes(prev => [nueva, ...prev]);
  };

  const updateOrden = (id: number, data: Partial<Orden>) => {
    setOrdenes(prev => prev.map(o => (o.idOrden === id ? { ...o, ...data } : o)));
  };

  const deleteOrden = (id: number) => {
    setOrdenes(prev => prev.filter(o => o.idOrden !== id));
    return { success: true, message: 'Orden eliminada.' };
  };

  // RESERVAS
  const addReserva = (reservaData: Omit<Reserva, 'idReserva'>): Reserva => {
    const nextId = reservas.length > 0 ? Math.max(...reservas.map(r => r.idReserva)) + 1 : 1;
    const nueva: Reserva = { ...reservaData, idReserva: nextId };
    setReservas(prev => [nueva, ...prev]);
    return nueva;
  };

  const login = (userSession: UserSession) => {
    setUser(userSession);
    if (userSession.rol === 'Gerente' && userSession.restauranteId) {
      setSelectedRestauranteId(userSession.restauranteId);
    } else {
      setSelectedRestauranteId(null);
    }
  };

  const logout = () => {
    setUser(null);
    setSelectedRestauranteId(null);
  };

  const resetDatabase = () => {
    localStorage.removeItem('sr_restaurantes');
    localStorage.removeItem('sr_clientes');
    localStorage.removeItem('sr_experiencias');
    localStorage.removeItem('sr_ordenes');
    localStorage.removeItem('sr_reservas');
    setRestaurantes(INITIAL_RESTAURANTES);
    setClientes(INITIAL_CLIENTES);
    setExperiencias(INITIAL_EXPERIENCIAS);
    setOrdenes(INITIAL_ORDENES);
    setReservas(INITIAL_RESERVAS);
  };

  return (
    <DatabaseContext.Provider
      value={{
        restaurantes,
        clientes,
        experiencias,
        ordenes,
        cartasMenu,
        itemsMenu,
        mesas,
        personal,
        resenas,
        pagos,
        paises,
        ciudades,
        tiposDocumento,
        estados,
        peticionesEspeciales,
        reservas,
        user,
        selectedRestauranteId,
        setSelectedRestauranteId,
        connectionMode,
        isOracleConnected,
        addRestaurante,
        updateRestaurante,
        deleteRestaurante,
        addCliente,
        updateCliente,
        deleteCliente,
        addExperiencia,
        updateExperiencia,
        deleteExperiencia,
        addOrden,
        updateOrden,
        deleteOrden,
        addReserva,
        login,
        logout,
        resetDatabase
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase debe ser usado dentro de un DatabaseProvider');
  }
  return context;
};
