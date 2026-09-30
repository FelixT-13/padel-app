'use client';

import React, { useState } from 'react';
import { 
  Calendar, Trophy, User, Settings, Users, 
  MapPin, Award, Plus, Shuffle, Share2, 
  CheckCircle2, Flame, Sparkles, Shield, Trash2, Layers, Lock, Unlock, GitBranch, ArrowLeft, Eye, X, LogOut, LogIn, Phone, Hash
} from 'lucide-react';

const EVENTOS_INICIALES = [
  {
    id: 1,
    titulo: 'Pozo sábado de octubre',
    tipo: 'Pozo',
    fecha: 'Sábado, 11 Oct • 10:00h',
    club: 'Club Pádel Center',
    plazas_totales: 8,
    plazas_ocupadas: 6,
    precioUnitario: 12,
  },
  {
    id: 2,
    titulo: 'Torneo otoño nivel 4',
    tipo: 'Torneo',
    fecha: '24-26 Oct • Cat. Abierta',
    club: 'Pádel Indoor Madrid',
    plazas_totales: 6,
    plazas_ocupadas: 4,
    precioUnitario: 20,
  }
];

const JUGADORES_INICIALES = [
  { id: '1', nombre: 'Felix Gomez', telefono: '600123456', nivel: 4.0, pozos: 6, puntosPozos: 580, torneosJugados: 3, puntosTorneos: 340, racha: '3W', lado: 'derecha', fantasyPuntos: 920 },
  { id: '2', nombre: 'Angel Ruiz', telefono: '611223344', nivel: 3.9, pozos: 5, puntosPozos: 490, torneosJugados: 2, puntosTorneos: 280, racha: '1W', lado: 'reves', fantasyPuntos: 770 },
  { id: '3', nombre: 'Lidia Martin', telefono: '622334455', nivel: 3.8, pozos: 5, puntosPozos: 460, torneosJugados: 4, puntosTorneos: 410, racha: '2W', lado: 'derecha', fantasyPuntos: 870 },
  { id: '4', nombre: 'Rober Sanchez', telefono: '633445566', nivel: 3.5, pozos: 4, puntosPozos: 350, torneosJugados: 2, puntosTorneos: 210, racha: '1L', lado: 'reves', fantasyPuntos: 560 },
];

export default function PadelApp() {
  // Estados de autenticación y flujo de acceso
  const [authStep, setAuthStep] = useState<'login' | 'perfil_setup' | 'app'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  // Datos del perfil de usuario
  const [miPerfil, setMiPerfil] = useState({
    nombreCompleto: '',
    telefono: '',
    nivelPlaytomic: '4.0',
    club: 'Pádel Club Central',
    lado: 'derecha' as 'derecha' | 'reves'
  });

  const [activeTab, setActiveTab] = useState<'inicio' | 'eventos' | 'pistas' | 'rankings' | 'fantasy' | 'admin' | 'perfil'>('inicio');
  const [ranking, setRanking] = useState(JUGADORES_INICIALES);

  // Fantasy de Pádel: minijuego local para el prototipo.
  const [fantasyEquipo, setFantasyEquipo] = useState<string[]>([]);
  const [fantasyPresupuesto, setFantasyPresupuesto] = useState(100);
  const [fantasyJornada, setFantasyJornada] = useState<'actual' | 'historico'>('actual');
  const [jugadorSeleccionadoPista, setJugadorSeleccionadoPista] = useState(0);


  // Mapa de inscripciones: { [eventoId]: nombrePareja }
  const [inscritosMap, setInscritosMap] = useState<{[key: number]: string}>({ 1: 'Lidia Martin' });
  const [participantesEventoMap, setParticipantesEventoMap] = useState<{[key: number]: string[]}>({ 1: ['1','2','3','4'], 2: ['1','2','3','4'] });
  const [ladoPorJugador, setLadoPorJugador] = useState<{[key: string]: 'derecha' | 'reves'}>({ '1': 'derecha', '2': 'reves', '3': 'derecha', '4': 'reves' });
  const [partidosEventoMap, setPartidosEventoMap] = useState<{[key: number]: any[]}>({});
  const [jugadoresSinParejaMap, setJugadoresSinParejaMap] = useState<{[key: number]: string[]}>({});
  const [parejasEventoMap, setParejasEventoMap] = useState<{[key: number]: string[][]}>({});
  const [miInscripcionEventoMap, setMiInscripcionEventoMap] = useState<{[key: number]: { modo: 'pareja' | 'solo'; pareja: string[] | null }}>({});
  
  const [eventoRegistrandoId, setEventoRegistrandoId] = useState<number | null>(null);
  const [nombreParejaInput, setNombreParejaInput] = useState('');
  const [ladoInscripcion, setLadoInscripcion] = useState<'derecha' | 'reves'>('derecha');
  const [ladoParejaInscripcion, setLadoParejaInscripcion] = useState<'derecha' | 'reves'>('reves');
  const [modoInscripcion, setModoInscripcion] = useState<'pareja' | 'solo'>('pareja');

  const [eventoActivoId, setEventoActivoId] = useState<number | null>(null);
  const [tipoRanking, setTipoRanking] = useState<'pozos' | 'torneos'>('pozos');
  const [faseTorneo, setFaseTorneo] = useState<'grupos' | 'principal' | 'consolacion'>('grupos');

  // Organizador: durante este prototipo se simula una cuenta marcada como organizador.
  // Al conectar Supabase se sustituye por la consulta a la tabla `organizadores`.
  const [esOrganizador] = useState(true);

  // Eventos
  const [eventos, setEventos] = useState(EVENTOS_INICIALES);
  const [nuevoTituloEvento, setNuevoTituloEvento] = useState('');
  const [nuevoTipoEvento, setNuevoTipoEvento] = useState('Pozo');
  const [nuevoClubEvento, setNuevoClubEvento] = useState('Club Pádel Center');
  const [nuevoPrecioEvento, setNuevoPrecioEvento] = useState('12');

  const [pistas, setPistas] = useState([
    { numero: 1, nombre: 'Pista 1 • Central', pareja1: ['Felix Gomez', 'Lidia Martin'], pareja2: ['Angel Ruiz', 'Rober Sanchez'] },
    { numero: 2, nombre: 'Pista 2', pareja1: ['Jugador 5', 'Jugador 6'], pareja2: ['Jugador 7', 'Jugador 8'] },
  ]);

  // Cierre admin
  const [cierreJugador, setCierreJugador] = useState('Felix Gomez');
  const [cierreTipoEvento, setCierreTipoEvento] = useState<'Pozo' | 'Torneo'>('Pozo');
  const [cierrePista, setCierrePista] = useState('1');
  const [cierreCuadro, setCierreCuadro] = useState<'principal' | 'consolacion'>('principal');
  const [cierreRondaTorneo, setCierreRondaTorneo] = useState('campeon');
  const [cierreGano, setCierreGano] = useState(true);
  const [mensajeExito, setMensajeExito] = useState('');

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoNivel, setNuevoNivel] = useState('3.5');

  // Manejar Login de Usuario y Contraseña
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) return;

    // Simulamos login correcto y pasamos a configurar/comprobar perfil
    setAuthStep('perfil_setup');
  };

  // Guardar configuración del perfil inicial
  const handleGuardarPerfilSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!miPerfil.nombreCompleto.trim() || !miPerfil.telefono.trim()) {
      setMensajeExito('Por favor, completa nombre y teléfono.');
      setTimeout(() => setMensajeExito(''), 3000);
      return;
    }

    const nivelNum = parseFloat(miPerfil.nivelPlaytomic) || 4.0;

    // Añadir al ranking si no existe
    setRanking(prev => {
      const existe = prev.some(j => j.nombre.toLowerCase() === miPerfil.nombreCompleto.toLowerCase());
      if (!existe) {
        return [...prev, {
          id: Date.now().toString(),
          nombre: miPerfil.nombreCompleto,
          telefono: miPerfil.telefono,
          nivel: nivelNum,
          pozos: 0,
          puntosPozos: 0,
          torneosJugados: 0,
          puntosTorneos: 0,
          racha: '-',
          lado: miPerfil.lado,
          fantasyPuntos: 0
        }];
      }
      return prev;
    });

    setAuthStep('app');
    setMensajeExito(`¡Bienvenido/a, ${miPerfil.nombreCompleto}! 🏓`);
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const crearCalendarioTorneo = (eventoId: number, parejas: string[][]) => {
    const parejasReales = parejas.filter(p => p.length === 2);
    if (parejasReales.length < 2) {
      setPartidosEventoMap(prev => ({ ...prev, [eventoId]: [] }));
      setEventoActivoId(eventoId);
      return;
    }
    const parejaA = parejasReales[0];
    const parejaB = parejasReales[1];
    const base = Date.now();
    const partidos = [
      { id: base + 1, eventoId, fase: 'grupos', ronda: 'Jornada 1', nombre: 'Grupo A · Jornada 1', hora: '10:00h', pareja1: parejaA, pareja2: parejaB, resultado: '' },
      ...(parejasReales[2] ? [{ id: base + 2, eventoId, fase: 'grupos', ronda: 'Jornada 2', nombre: 'Grupo A · Jornada 2', hora: '11:00h', pareja1: parejaA, pareja2: parejasReales[2], resultado: '' }] : []),
      ...(parejasReales[3] ? [{ id: base + 3, eventoId, fase: 'grupos', ronda: 'Jornada 3', nombre: 'Grupo A · Jornada 3', hora: '12:00h', pareja1: parejaA, pareja2: parejasReales[3], resultado: '' }] : []),
      ...(parejasReales.length >= 4 ? [{ id: base + 4, eventoId, fase: 'eliminatoria', ronda: 'Cuartos / Cruce', nombre: 'Eliminatoria · Cruce', hora: '13:30h', pareja1: parejaA, pareja2: parejaB, resultado: '' }] : []),
    ];
    setPartidosEventoMap(prev => ({ ...prev, [eventoId]: partidos }));
    setEventoActivoId(eventoId);
  };


  const generarPartidosTorneo = (eventoId: number, parejaA: string, parejaB: string) => {
    const parejas = parejasEventoMap[eventoId] || [[parejaA, parejaB]];
    crearCalendarioTorneo(eventoId, parejas);
  };

  const emparejarJugadoresSolos = (eventoId: number, jugadores: string[]) => {
    const evento = eventos.find(ev => ev.id === eventoId);
    const parejasActuales = parejasEventoMap[eventoId] || [];
    const pendientes = [...jugadores];
    for (let i = pendientes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pendientes[i], pendientes[j]] = [pendientes[j], pendientes[i]];
    }
    const nuevasParejas = [...parejasActuales];
    while (pendientes.length >= 2) nuevasParejas.push([pendientes.shift()!, pendientes.shift()!]);
    setParejasEventoMap(prev => ({ ...prev, [eventoId]: nuevasParejas }));
    setJugadoresSinParejaMap(prev => ({ ...prev, [eventoId]: pendientes }));
    const parejasNuevas = nuevasParejas.length - parejasActuales.length;
    if (parejasNuevas > 0) setEventos(prev => prev.map(ev => ev.id === eventoId ? { ...ev, plazas_ocupadas: Math.min(ev.plazas_totales, ev.plazas_ocupadas + parejasNuevas) } : ev));
    if (evento?.tipo === 'Pozo') generarSorteoPozo(eventoId, nuevasParejas);
    else if (evento?.tipo === 'Torneo') crearCalendarioTorneo(eventoId, nuevasParejas);
  };


  const generarSorteoPozo = (eventoId: number, parejasEntrada?: string[][]) => {
    const parejasBase = (parejasEntrada || parejasEventoMap[eventoId] || []).filter(p => p.length === 2);
    if (parejasBase.length === 0) {
      setPartidosEventoMap(prev => ({ ...prev, [eventoId]: [] }));
      setEventoActivoId(eventoId);
      return;
    }
    const parejas = parejasBase.map(p => [...p]);
    for (let i = parejas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [parejas[i], parejas[j]] = [parejas[j], parejas[i]];
    }
    const partidos: any[] = [];
    for (let i = 0; i < parejas.length; i += 2) {
      const pista = Math.floor(i / 2) + 1;
      partidos.push({
        id: Date.now() + i,
        eventoId,
        fase: 'pozo',
        ronda: `Pista ${pista}`,
        nombre: parejas[i + 1] ? `Pista ${pista}` : `Pista ${pista} · Descanso`,
        hora: `${10 + Math.floor(i / 2)}:00h`,
        pareja1: ordenarParejaPorLado(parejas[i]),
        pareja2: parejas[i + 1] ? ordenarParejaPorLado(parejas[i + 1]) : ['DESCANSO', 'DESCANSO'],
        resultado: ''
      });
    }
    setPartidosEventoMap(prev => ({ ...prev, [eventoId]: partidos }));
    setEventoActivoId(eventoId);
  };

  const handleConfirmarInscripcion = (eventoId: number) => {
    const miJugador = ranking.find(j => j.nombre.toLowerCase() === miPerfil.nombreCompleto.toLowerCase());
    if (!miJugador) return;
    const parejaNombre = nombreParejaInput.trim();
    const evento = eventos.find(ev => ev.id === eventoId);
    if (!evento) return;
    const inscripcionActual = miInscripcionEventoMap[eventoId];
    if (inscripcionActual) {
      setMensajeExito('Ya estás inscrito en este evento.');
      setTimeout(() => setMensajeExito(''), 2500);
      return;
    }
    setLadoPorJugador(prev => ({ ...prev, [miJugador.id]: ladoInscripcion }));
    setRanking(prev => prev.map(j => j.id === miJugador.id ? { ...j, lado: ladoInscripcion } : j));
    if (modoInscripcion === 'solo') {
      const participantes = Array.from(new Set([...(participantesEventoMap[eventoId] || []), miJugador.id]));
      setParticipantesEventoMap(prev => ({ ...prev, [eventoId]: participantes }));
      const pendientes = Array.from(new Set([...(jugadoresSinParejaMap[eventoId] || []), miPerfil.nombreCompleto]));
      emparejarJugadoresSolos(eventoId, pendientes);
      setMiInscripcionEventoMap(prev => ({ ...prev, [eventoId]: { modo: 'solo', pareja: null } }));
      setInscritosMap(prev => ({ ...prev, [eventoId]: '' }));
      setEventoRegistrandoId(null);
      setMensajeExito(pendientes.length >= 2 ? '¡Pareja formada! Se ha hecho el sorteo aleatorio. 🏓' : '¡Apuntado! Estás esperando pareja.');
    } else {
      if (!parejaNombre) { setMensajeExito('Escribe el nombre de tu pareja para continuar.'); setTimeout(() => setMensajeExito(''), 2500); return; }
      const parejaJugador = ranking.find(j => j.nombre.toLowerCase() === parejaNombre.toLowerCase());
      if (!parejaJugador) { setMensajeExito('No encuentro ese jugador en Padel Arena.'); setTimeout(() => setMensajeExito(''), 2500); return; }
      if (parejaJugador.id === miJugador.id) { setMensajeExito('No puedes seleccionarte como pareja.'); setTimeout(() => setMensajeExito(''), 2500); return; }
      const parejaYaInscrita = (participantesEventoMap[eventoId] || []).includes(parejaJugador.id);
      if (parejaYaInscrita && (parejasEventoMap[eventoId] || []).some(p => p.includes(parejaJugador.nombre))) {
        setMensajeExito(`${parejaJugador.nombre} ya está inscrito en este evento.`);
        setTimeout(() => setMensajeExito(''), 2500);
        return;
      }
      setLadoPorJugador(prev => ({ ...prev, [parejaJugador.id]: ladoParejaInscripcion }));
      setRanking(prev => prev.map(j => j.id === parejaJugador.id ? { ...j, lado: ladoParejaInscripcion } : j));
      const participantes = Array.from(new Set([...(participantesEventoMap[eventoId] || []), miJugador.id, parejaJugador.id]));
      const nuevasParejas = [...(parejasEventoMap[eventoId] || []), [miPerfil.nombreCompleto, parejaJugador.nombre]];
      setParticipantesEventoMap(prev => ({ ...prev, [eventoId]: participantes }));
      setParejasEventoMap(prev => ({ ...prev, [eventoId]: nuevasParejas }));
      setMiInscripcionEventoMap(prev => ({ ...prev, [eventoId]: { modo: 'pareja', pareja: [miPerfil.nombreCompleto, parejaJugador.nombre] } }));
      setInscritosMap(prev => ({ ...prev, [eventoId]: parejaJugador.nombre }));
      setEventos(prev => prev.map(ev => ev.id === eventoId ? { ...ev, plazas_ocupadas: Math.min(ev.plazas_totales, ev.plazas_ocupadas + 1) } : ev));
      if (evento.tipo === 'Pozo') generarSorteoPozo(eventoId, nuevasParejas); else crearCalendarioTorneo(eventoId, nuevasParejas);
      setEventoActivoId(eventoId);
      setMensajeExito(`¡Inscripción confirmada! ${miPerfil.nombreCompleto} · ${ladoInscripcion === 'derecha' ? 'Derecha' : 'Revés'} · ${parejaJugador.nombre} · ${ladoParejaInscripcion === 'derecha' ? 'Derecha' : 'Revés'}`);
    }
    setActiveTab('pistas'); setNombreParejaInput(''); setTimeout(() => setMensajeExito(''), 3500);
  };


  const handleComprarFantasy = (id: string) => {
    if (fantasyEquipo.length >= 2 || fantasyEquipo.includes(id)) return;
    const jugador = fantasyJugadores.find(j => j.id === id);
    if (!jugador) return;
    if (fantasyGastado + jugador.valor > fantasyPresupuesto) {
      setMensajeExito('No tienes saldo suficiente para fichar a este jugador.');
      setTimeout(() => setMensajeExito(''), 2500);
      return;
    }
    setFantasyEquipo(prev => [...prev, id]);
  };

  const handleVenderFantasy = (id: string) => {
    if (!fantasyEquipo.includes(id)) return;
    setFantasyEquipo(prev => prev.filter(playerId => playerId !== id));
  };

  const handleCancelarInscripcion = (eventoId: number) => {
    const miJugador = ranking.find(j => j.nombre.toLowerCase() === miPerfil.nombreCompleto.toLowerCase());
    const inscripcion = miInscripcionEventoMap[eventoId];
    if (!miJugador || !inscripcion) return;

    // Si se apuntó como pareja, sale la pareja completa.
    // Si se apuntó solo y el sistema ya le emparejó, también sale esa pareja completa.
    const parejaRegistrada = (parejasEventoMap[eventoId] || []).find(p => p.includes(miPerfil.nombreCompleto));
    const parejaARemover = parejaRegistrada || inscripcion.pareja;
    const nombresARemover = parejaARemover || [miPerfil.nombreCompleto];

    const nuevasParejas = (parejasEventoMap[eventoId] || []).filter(
      p => !(p.length === 2 && p.some(nombre => nombresARemover.includes(nombre)))
    );
    setParejasEventoMap(prev => ({ ...prev, [eventoId]: nuevasParejas }));

    setParticipantesEventoMap(prev => ({
      ...prev,
      [eventoId]: (prev[eventoId] || []).filter(id => {
        const jugador = ranking.find(j => j.id === id);
        return jugador ? !nombresARemover.includes(jugador.nombre) : true;
      })
    }));

    setJugadoresSinParejaMap(prev => ({
      ...prev,
      [eventoId]: (prev[eventoId] || []).filter(n => !nombresARemover.includes(n))
    }));

    // No dejamos partidos antiguos mostrando una inscripción que ya no existe.
    setPartidosEventoMap(prev => ({
      ...prev,
      [eventoId]: (prev[eventoId] || []).filter(p => {
        const jugadores = [...(p.pareja1 || []), ...(p.pareja2 || [])];
        return !jugadores.some(nombre => nombresARemover.includes(nombre));
      })
    }));

    setMiInscripcionEventoMap(prev => { const next = { ...prev }; delete next[eventoId]; return next; });
    setInscritosMap(prev => { const next = { ...prev }; delete next[eventoId]; return next; });

    // Una plaza de pareja menos. En modo solo, la plaza solo cuenta si llegó a formar pareja.
    if (parejaARemover) {
      setEventos(prev => prev.map(ev =>
        ev.id === eventoId ? { ...ev, plazas_ocupadas: Math.max(0, ev.plazas_ocupadas - 1) } : ev
      ));
    }

    if (eventoActivoId === eventoId) setEventoActivoId(null);
    setEventoRegistrandoId(null);
    setMensajeExito('Te has borrado del evento correctamente.');
    setTimeout(() => setMensajeExito(''), 2500);
  };

  const calcularPuntosPozo = (pista: number, gano: boolean) => {
    const base = 100 - (pista - 1) * 25;
    const bonus = pista === 1 ? (gano ? 15 : 0) : (gano ? 10 : 0);
    return Math.max(base + bonus, 10);
  };

  const calcularPuntosTorneo = (ronda: string, cuadro: 'principal' | 'consolacion') => {
    if (cuadro === 'principal') {
      switch (ronda) {
        case 'campeon': return 200;
        case 'subcampeon': return 140;
        case 'semifinal': return 90;
        case 'cuartos': return 60;
        default: return 40;
      }
    } else {
      switch (ronda) {
        case 'campeon': return 50;
        case 'subcampeon': return 35;
        case 'semifinal': return 20;
        default: return 10;
      }
    }
  };

  const handleGuardarCierre = (e: React.FormEvent) => {
    e.preventDefault();
    let pts = 0;

    if (cierreTipoEvento === 'Pozo') {
      pts = calcularPuntosPozo(parseInt(cierrePista), cierreGano);
    } else {
      pts = calcularPuntosTorneo(cierreRondaTorneo, cierreCuadro);
    }

    setRanking((prev) =>
      prev.map((j) => {
        if (j.nombre === cierreJugador) {
          if (cierreTipoEvento === 'Pozo') {
            return { ...j, puntosPozos: j.puntosPozos + pts, pozos: j.pozos + 1, fantasyPuntos: (j.fantasyPuntos ?? 0) + pts };
          } else {
            return { ...j, puntosTorneos: j.puntosTorneos + pts, torneosJugados: j.torneosJugados + 1, fantasyPuntos: (j.fantasyPuntos ?? 0) + pts };
          }
        }
        return j;
      })
    );

    setMensajeExito(`¡+${pts} Pts asignados a ${cierreJugador}!`);
    setTimeout(() => setMensajeExito(''), 3500);
  };

  const handleCrearEvento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTituloEvento.trim()) return;

    const nuevoEv = {
      id: Date.now(),
      titulo: nuevoTituloEvento.trim(),
      tipo: nuevoTipoEvento,
      fecha: 'Próxima fecha • Por definir',
      club: nuevoClubEvento,
      plazas_totales: 8,
      plazas_ocupadas: 0,
      precioUnitario: parseInt(nuevoPrecioEvento) || 10,
    };

    setEventos([...eventos, nuevoEv]);
    setNuevoTituloEvento('');
    setMensajeExito('¡Nuevo evento publicado!');
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleEliminarEvento = (id: number) => {
    setEventos(eventos.filter(ev => ev.id !== id));
    handleCancelarInscripcion(id);
  };

  const eventoSeleccionado = eventos.find(ev => ev.id === eventoActivoId);
  const parejaInscritaActual = eventoSeleccionado ? (inscritosMap[eventoSeleccionado.id] || 'Pareja') : 'Lidia Martin';

  const ladoDeJugador = (nombre: string) => {
    const jugador = ranking.find((j) => j.nombre === nombre);
    if (jugador && ladoPorJugador[jugador.id]) return ladoPorJugador[jugador.id];
    return jugador?.lado || (nombre === miPerfil.nombreCompleto ? miPerfil.lado : 'derecha');
  };

  const ordenarParejaPorLado = (pareja: string[]) => {
    const copia = [...pareja];
    if (copia.length !== 2) return copia;
    const [a, b] = copia;
    const la = ladoDeJugador(a);
    const lb = ladoDeJugador(b);
    if (la === 'derecha' && lb === 'reves') return [a, b];
    if (la === 'reves' && lb === 'derecha') return [b, a];
    return copia;
  };

  const clasePosicionPista = (indice: number) => {
    const posiciones = [
      'left-[17%] top-[28%]',
      'left-[17%] bottom-[28%]',
      'right-[17%] top-[28%]',
      'right-[17%] bottom-[28%]'
    ];
    return posiciones[indice] || posiciones[0];
  };

  const etiquetaLado = (lado: string) => lado === 'derecha' ? 'DERECHA' : 'REVÉS';

  // Sorteo siempre aleatorio: ni el nivel ni el lado condicionan el reparto inicial.
  const handleMezclarPistas = () => {
    if (!eventoActivoId) return;
    const evento = eventos.find(ev => ev.id === eventoActivoId);
    if (!evento) return;
    if (evento.tipo === 'Pozo') generarSorteoPozo(evento.id);
    else crearCalendarioTorneo(evento.id, parejasEventoMap[evento.id] || []);
    setMensajeExito('Sorteo realizado al azar. El lado no influye en el reparto.');
    setTimeout(() => setMensajeExito(''), 2500);
  };

  const compartirEvento = (evento: any) => {
    const texto = `PADEL ARENA · ${evento.titulo.toUpperCase()}\n📅 ${evento.fecha}\n📍 ${evento.club}\n\n👉 ¡Apúntate desde Padel Arena!`;
    if (navigator.share) {
      navigator.share({ title: evento.titulo, text: texto, url: window.location.href }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
    }
  };

  // Fantasy: solo entran jugadores que hayan sido inscritos en al menos un evento.
  // Sus puntos Fantasy salen de los puntos que realmente consiguen en eventos.
  const idsParticipantes = new Set(Object.values(participantesEventoMap).flat());
  const fantasyJugadores = ranking
    .filter((j) => idsParticipantes.has(j.id))
    .map((j) => ({
      ...j,
      valor: Number((12 + j.nivel * 4 + (j.fantasyPuntos ?? 0) / 250).toFixed(1)),
      fantasyPts: j.fantasyPuntos ?? (j.puntosTorneos + j.puntosPozos),
    }));
  // Mercado diario de 4 jugadores. En la versión con Supabase esto pasará a salir de fantasy_mercado.
  const fantasyMercado = fantasyJugadores.slice(0, 4);
  const fantasySeleccionados = fantasyJugadores.filter(j => fantasyEquipo.includes(j.id));
  const fantasyGastado = fantasySeleccionados.reduce((sum, j) => sum + j.valor, 0);
  const fantasySaldo = fantasyPresupuesto - fantasyGastado;
  const fantasyPts = fantasySeleccionados.reduce((sum, j) => sum + j.fantasyPts, 0);
  const partidosDelEvento = eventoActivoId ? (partidosEventoMap[eventoActivoId] || []) : [];
  const partidosVisibles = esOrganizador
    ? partidosDelEvento
    : partidosDelEvento.filter((p) => [...p.pareja1, ...p.pareja2].includes(miPerfil.nombreCompleto));

  const rankingOrdenado = [...ranking].sort((a, b) => {
    if (tipoRanking === 'pozos') {
      return b.puntosPozos - a.puntosPozos;
    } else {
      return b.puntosTorneos - a.puntosTorneos;
    }
  });

  // 1. PANTALLA DE LOGIN NORMAL (USUARIO Y CONTRASEÑA)
  if (authStep === 'login') {
    return (
      <div className="min-h-screen bg-[#f4f7f5] text-slate-900 font-sans p-5 max-w-md mx-auto flex flex-col justify-center items-center border-x border-slate-200 shadow-2xl">
        <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black tracking-wider text-slate-900 uppercase">
              Padel Arena
            </h1>
            <p className="text-xs text-slate-500">Tu comunidad de eventos de pádel</p>
          </div>

          <div className="bg-white/90 border-2 border-emerald-200 rounded-3xl p-6 space-y-4 shadow-xl">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase mb-1.5">Usuario o Correo</label>
                <input
                  type="text"
                  placeholder="usuario@clubpadel.com"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                  className="w-full bg-[#f4f7f5] border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase mb-1.5">Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  className="w-full bg-[#f4f7f5] border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" /> Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 2. PANTALLA DE CONFIGURACIÓN DE PERFIL INICIAL
  if (authStep === 'perfil_setup') {
    return (
      <div className="min-h-screen bg-[#f4f7f5] text-slate-900 font-sans p-5 max-w-md mx-auto flex flex-col justify-center items-center border-x border-slate-200 shadow-2xl">
        <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center space-y-2">
            <h1 className="text-xl font-black tracking-wider text-slate-900 uppercase">
              Crea tu perfil de jugador
            </h1>
            <p className="text-xs text-slate-500">Tu nivel y tu lado nos ayudan a colocarte mejor en pista.</p>
          </div>

          {mensajeExito && (
            <div className="bg-rose-500 text-slate-900 p-3 rounded-2xl text-xs font-black text-center shadow-lg">
              {mensajeExito}
            </div>
          )}

          <div className="bg-white/90 border-2 border-emerald-200 rounded-3xl p-6 space-y-4 shadow-xl">
            <form onSubmit={handleGuardarPerfilSetup} className="space-y-4">
              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase mb-1.5">Nombre y Apellido</label>
                <input
                  type="text"
                  placeholder="Ej: Carlos Gómez"
                  value={miPerfil.nombreCompleto}
                  onChange={(e) => setMiPerfil({...miPerfil, nombreCompleto: e.target.value})}
                  required
                  className="w-full bg-[#f4f7f5] border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase mb-1.5">Número de Teléfono</label>
                <input
                  type="tel"
                  placeholder="Ej: 600123456"
                  value={miPerfil.telefono}
                  onChange={(e) => setMiPerfil({...miPerfil, telefono: e.target.value})}
                  required
                  className="w-full bg-[#f4f7f5] border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase mb-1.5">Lado habitual</label>
                <select value={miPerfil.lado} onChange={(e) => setMiPerfil({...miPerfil, lado: e.target.value as 'derecha' | 'reves'})} className="w-full bg-[#f4f7f5] border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-500">
                  <option value="derecha">Derecha</option>
                  <option value="reves">Revés</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-3"
              >
                Guardar y Entrar a la App
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 3. APLICACIÓN PRINCIPAL
  return (
    <div className="min-h-screen bg-[#f4f7f5] text-slate-900 font-sans pb-32 max-w-md mx-auto relative border-x border-slate-200 shadow-2xl">
      {/* Marcador Superior */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md p-4 border-b-2 border-emerald-200 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2.5">
          <div>
            <h1 className="text-base font-black tracking-wider text-slate-900 uppercase">
              PADEL ARENA
            </h1>
            <p className="text-[10px] text-slate-500/80 font-medium">Jugador: <strong className="text-emerald-700">{miPerfil.nombreCompleto}</strong></p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setActiveTab('admin')} className="h-9 w-9 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center shadow-sm active:scale-95" title="Panel organizador">
            <Shield className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === 'admin' ? 'inicio' : 'perfil')}
            className="bg-slate-100 border border-emerald-200 text-slate-900 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 active:scale-95 transition-all shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-emerald-700" /> {miPerfil.nombreCompleto.split(' ')[0]}
          </button>
        </div>
      </header>

      <main className="p-4 space-y-5">

        {mensajeExito && (
          <div className="bg-emerald-500 text-white p-3 rounded-2xl text-xs font-black animate-bounce shadow-lg text-center">
            {mensajeExito}
          </div>
        )}
        
        {/* INICIO / DASHBOARD */}
        {activeTab === 'inicio' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <section className="relative overflow-hidden rounded-[32px] bg-[#101b17] p-5 text-white shadow-[0_18px_45px_rgba(16,185,129,.20)]">
              <div className="absolute inset-0 opacity-70" style={{backgroundImage:'radial-gradient(circle at 85% 15%, rgba(190,242,100,.35), transparent 28%), linear-gradient(135deg, rgba(16,185,129,.9), rgba(16,27,23,.98) 58%)'}} />
              <div className="absolute -right-16 -bottom-24 h-64 w-64 rounded-full border-[34px] border-lime-300/10" />
              <div className="absolute right-5 top-5 opacity-95">
                <svg width="112" height="128" viewBox="0 0 112 128" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="8" y="8" width="96" height="112" rx="18" fill="#0B1713" stroke="#D9F99D" stroke-width="2"/>
                  <rect x="22" y="20" width="68" height="88" rx="8" stroke="white" stroke-width="2" opacity=".9"/>
                  <path d="M56 20V108M22 64H90" stroke="white" stroke-width="2" opacity=".75"/>
                  <path d="M22 42H90M22 86H90" stroke="white" stroke-width="1" opacity=".35"/>
                  <path d="M38 35H74V93H38V35Z" stroke="#BEF264" stroke-width="2" opacity=".9"/>
                  <circle cx="56" cy="64" r="8" fill="#BEF264"/>
                  <circle cx="56" cy="64" r="3" fill="#0B1713"/>
                  <path d="M30 114H82" stroke="#BEF264" stroke-width="4" stroke-linecap="round"/>
                  <text x="56" y="16" text-anchor="middle" fill="white" font-size="7" font-weight="800" letter-spacing="2">PADEL</text>
                </svg>
              </div>
              <div className="relative z-10 max-w-[72%]">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,.9)]" /> Padel Arena
                </div>
                <h2 className="mt-3 text-[31px] font-black leading-[.92] tracking-tight">Donde empieza<br/>el próximo partido.</h2>
                <p className="mt-3 text-xs font-medium leading-relaxed text-white/75">Eventos reales, partidos, ranking y Fantasy. Entra, compite y sigue tu evolución.</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setActiveTab('eventos')} className="rounded-xl bg-lime-300 px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-[#101b17] shadow-lg shadow-lime-300/20 active:scale-95">Ver eventos</button>
                  <button onClick={() => setActiveTab('fantasy')} className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-white active:scale-95">Fantasy</button>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200"><span className="text-[9px] font-black uppercase text-slate-400">Eventos</span><b className="mt-1 block text-xl font-black text-slate-900">{eventos.length}</b><span className="text-[9px] font-semibold text-emerald-600">activos</span></div>
              <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200"><span className="text-[9px] font-black uppercase text-slate-400">Ranking</span><b className="mt-1 block text-xl font-black text-slate-900">{ranking.length}</b><span className="text-[9px] font-semibold text-emerald-600">jugadores</span></div>
              <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200"><span className="text-[9px] font-black uppercase text-slate-400">Mi Fantasy</span><b className="mt-1 block text-xl font-black text-slate-900">{fantasyEquipo.length}/2</b><span className="text-[9px] font-semibold text-emerald-600">fichajes</span></div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveTab('pistas')} className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:-translate-y-0.5 transition">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl">🏟️</div><div className="mt-2 text-sm font-black text-slate-900">Mis partidos</div><div className="text-[10px] text-slate-500">Tu pista y tus horarios</div>
              </button>
              <button onClick={() => setActiveTab('fantasy')} className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:-translate-y-0.5 transition">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-50 text-xl">⚡</div><div className="mt-2 text-sm font-black text-slate-900">Fantasy</div><div className="text-[10px] text-slate-500">Ficha 2 jugadores</div>
              </button>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div><span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Mis partidos</span><h2 className="text-lg font-black">Mi pista de pádel</h2></div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black text-emerald-700">SOLO TUS PARTIDOS</span>
              </div>
              {partidosVisibles.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <div className="text-3xl">🗓️</div>
                  <b className="mt-2 block text-sm text-slate-900">Todavía no tienes un partido asignado</b>
                  <p className="mt-1 text-[10px] text-slate-500">Cuando el organizador genere el sorteo, aquí aparecerá únicamente tu pista, tu pareja, tus rivales y tu posición.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {partidosVisibles.map((p, matchIndex) => {
                    const jugadores = [p.pareja1[0], p.pareja1[1], p.pareja2[0], p.pareja2[1]];
                    return (
                      <div key={p.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-slate-500">{p.nombre}</span>
                          <span className="text-[9px] font-bold text-emerald-700">Partido {matchIndex + 1}</span>
                        </div>
                        <div className="relative mx-auto aspect-[1.7/1] max-w-[520px] overflow-hidden rounded-[22px] border-[8px] border-slate-300 bg-emerald-600 shadow-lg ring-1 ring-emerald-200">
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:12px_12px]" />
                          <div className="absolute inset-[7%] rounded-lg border-2 border-white/95" />
                          <div className="absolute left-1/2 top-[7%] bottom-[7%] border-l-2 border-white/95" />
                          <div className="absolute left-[7%] right-[7%] top-1/2 border-t-2 border-white/95" />
                          <div className="absolute left-[7%] right-[7%] top-[31%] border-t border-white/85" />
                          <div className="absolute left-[7%] right-[7%] bottom-[31%] border-t border-white/85" />
                          <div className="absolute inset-y-[5%] left-0 w-2 bg-slate-200/60 border-r border-slate-400/70" />
                          <div className="absolute inset-y-[5%] right-0 w-2 bg-slate-200/60 border-l border-slate-400/70" />
                          <div className="absolute left-0 right-0 top-0 h-2 bg-slate-200/70 border-b border-slate-400/70" />
                          <div className="absolute left-0 right-0 bottom-0 h-2 bg-slate-200/70 border-t border-slate-400/70" />
                          <span className="absolute left-2 top-1 text-[7px] font-black tracking-widest text-white/80">CRISTAL + MALLA</span>
                          {jugadores.map((name,i) => <button key={name+i} type="button" onClick={() => setJugadorSeleccionadoPista(i)} className={`absolute ${clasePosicionPista(i)} -translate-y-1/2 rounded-xl border-2 px-2.5 py-1.5 text-[8px] font-black shadow-lg transition-all ${jugadorSeleccionadoPista===i ? 'scale-110 border-lime-300 bg-white text-emerald-700' : 'border-white/90 bg-white/95 text-slate-900'}`}><span className="block truncate max-w-[88px]">{name}</span><span className="block text-[7px] text-emerald-700">{etiquetaLado(ladoDeJugador(name))}</span></button>)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {partidosVisibles.length > 0 && <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-center"><span className="text-[9px] font-bold uppercase text-slate-400">Jugador seleccionado</span><b className="mt-0.5 block text-sm">{[...(partidosVisibles[0]?.pareja1 || []), ...(partidosVisibles[0]?.pareja2 || [])][jugadorSeleccionadoPista] || miPerfil.nombreCompleto}</b><p className="text-[10px] text-slate-500">Lado: <strong>{ladoDeJugador([...(partidosVisibles[0]?.pareja1 || []), ...(partidosVisibles[0]?.pareja2 || [])][jugadorSeleccionadoPista] || miPerfil.nombreCompleto)}</strong></p></div>}
            </section>

            {!eventoActivoId || !eventoSeleccionado ? (
              <div className="bg-white border border-emerald-200 rounded-3xl p-6 text-center space-y-3 shadow-xl">
                <Layers className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Ningún torneo seleccionado</h3>
                <p className="text-xs text-slate-500">Entra a uno de tus eventos inscritos para ver sus pistas y cruces.</p>
                <button 
                  onClick={() => setActiveTab('eventos')}
                  className="bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider mt-2"
                >
                  Ir a Mis Eventos
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-white border border-emerald-200 p-3 rounded-2xl flex justify-between items-center shadow-md">
                  <div>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Estás consultando:</span>
                    <h3 className="text-sm font-black text-slate-900">{eventoSeleccionado.titulo}</h3>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventoSeleccionado.club)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-700 underline block mt-0.5"
                    >
                      📍 {eventoSeleccionado.club} (Ver en Maps)
                    </a>
                  </div>
                  <button
                    onClick={() => setEventoActivoId(null)}
                    className="bg-[#f4f7f5] hover:bg-white text-emerald-700 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-slate-200"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Cambiar
                  </button>
                </div>

                {eventoSeleccionado.tipo === 'Pozo' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black tracking-widest text-slate-500 uppercase">Mis partidos • Pozo</h3>
                      <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-slate-500">Sorteo aleatorio</span>
                    </div>

                    {partidosVisibles.map((p) => {
                      const pareja1Actual = (p.id === partidosVisibles[0]?.id) ? [miPerfil.nombreCompleto, parejaInscritaActual] : p.pareja1;

                      return (
                        <div key={p.id} className="bg-white/90 border-2 border-emerald-200 rounded-3xl p-4 space-y-3 shadow-xl">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> {p.nombre}
                            </span>
                          </div>

                          <div className="relative bg-emerald-600 border-4 border-white rounded-2xl p-4 overflow-hidden shadow-inner flex items-center justify-between h-36">
                            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-r-2 border-dashed border-white/80 z-10" />
                            <div className="w-1/2 text-center relative z-20 space-y-1 pr-2">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">PAREJA A</span>
                              <p className="text-xs font-black text-slate-900 drop-shadow-md truncate">{pareja1Actual[0]} <span className="text-[8px] font-bold opacity-70">({ladoDeJugador(pareja1Actual[0])})</span></p>
                              <p className="text-xs font-black text-slate-900 drop-shadow-md truncate">{pareja1Actual[1]} <span className="text-[8px] font-bold opacity-70">({ladoDeJugador(pareja1Actual[1])})</span></p>
                            </div>
                            <div className="w-1/2 text-center relative z-20 space-y-1 pl-2">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">PAREJA B</span>
                              <p className="text-xs font-black text-slate-900 drop-shadow-md truncate">{p.pareja2[0]} <span className="text-[8px] font-bold opacity-70">({ladoDeJugador(p.pareja2[0])})</span></p>
                              <p className="text-xs font-black text-slate-900 drop-shadow-md truncate">{p.pareja2[1]} <span className="text-[8px] font-bold opacity-70">({ladoDeJugador(p.pareja2[1])})</span></p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {eventoSeleccionado.tipo === 'Torneo' && (
                  <div className="space-y-4">
                    <div className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Tu torneo</span>
                          <h3 className="mt-1 text-lg font-black text-slate-900">{eventoSeleccionado.titulo}</h3>
                          <p className="mt-1 text-[10px] text-slate-500">Primero cuadro de grupos · después eliminatoria · mínimo 4 partidos.</p>
                        </div>
                        <span className="rounded-xl bg-amber-50 px-2 py-1 text-[9px] font-black uppercase text-amber-700">TORNEO</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setFaseTorneo('grupos')} className={`rounded-xl py-2 text-[10px] font-black uppercase ${faseTorneo === 'grupos' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>📊 Cuadro / Grupos</button>
                      <button onClick={() => setFaseTorneo('principal')} className={`rounded-xl py-2 text-[10px] font-black uppercase ${faseTorneo === 'principal' ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-500'}`}>🏆 Eliminatoria</button>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div><h3 className="font-black text-slate-900">{faseTorneo === 'grupos' ? 'Cuadro de grupos' : 'Cuadro de eliminatoria'}</h3><p className="text-[10px] text-slate-500">{faseTorneo === 'grupos' ? '3 partidos garantizados en la fase inicial.' : 'Tras el cuadro, avanzas al cruce eliminatorio.'}</p></div>
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-700">{partidosVisibles.length}/4 partidos</span>
                      </div>
                      <div className="space-y-2">
                        {partidosVisibles.map((p, idx) => (
                          <div key={p.id || idx} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                            <div className="flex items-center justify-between gap-2"><span className="text-[9px] font-black uppercase text-emerald-700">{p.fase === 'grupos' ? `Grupo · ${p.ronda}` : 'Eliminatoria · ' + p.ronda}</span><span className="text-[9px] font-bold text-slate-500">{p.hora}</span></div>
                            <div className="mt-2 flex items-center justify-between gap-2"><div className="min-w-0"><b className="block text-xs text-slate-900 truncate">{p.pareja1[0]} / {p.pareja1[1]}</b><span className="text-[9px] text-slate-500">{etiquetaLado(ladoDeJugador(p.pareja1[0]))} · {etiquetaLado(ladoDeJugador(p.pareja1[1]))}</span></div><span className="text-[10px] font-black text-slate-400">VS</span><div className="min-w-0 text-right"><b className="block text-xs text-slate-900 truncate">{p.pareja2[0]} / {p.pareja2[1]}</b><span className="text-[9px] text-slate-500">{etiquetaLado(ladoDeJugador(p.pareja2[0]))} · {etiquetaLado(ladoDeJugador(p.pareja2[1]))}</span></div></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* PESTAÑA MIS PARTIDOS */}
        {activeTab === 'pistas' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Mi competición</p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">Mis partidos</h2>
                <p className="mt-1 text-xs text-slate-500">Solo ves los partidos en los que participas.</p>
              </div>
              {eventoActivoId && <button onClick={() => setActiveTab('eventos')} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase text-slate-600">Cambiar evento</button>}
            </div>
            {!eventoActivoId || !eventoSeleccionado ? (
              <div className="rounded-3xl border border-emerald-200 bg-white p-7 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">🏟️</div>
                <h3 className="mt-3 text-base font-black text-slate-900">Todavía no tienes un evento seleccionado</h3>
                <p className="mt-1 text-xs text-slate-500">Apúntate a un evento y aquí aparecerán tus pistas, pareja, rivales y horarios.</p>
                <button onClick={() => setActiveTab('eventos')} className="mt-4 rounded-xl bg-emerald-500 px-4 py-2.5 text-[10px] font-black uppercase text-white shadow-md">Ver eventos</button>
              </div>
            ) : (
              <>
                <div className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`inline-flex rounded-full px-2 py-1 text-[9px] font-black uppercase ${eventoSeleccionado.tipo === 'Pozo' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{eventoSeleccionado.tipo}</span>
                      <h3 className="mt-2 text-lg font-black text-slate-900">{eventoSeleccionado.titulo}</h3>
                      <p className="mt-1 text-[10px] text-slate-500">{eventoSeleccionado.fecha} · {eventoSeleccionado.club}</p>
                    </div>
                    {esOrganizador && <button onClick={handleMezclarPistas} className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-[9px] font-black uppercase text-white"><Shuffle className="h-3.5 w-3.5" /> Sortear</button>}
                  </div>
                </div>
                {partidosVisibles.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-amber-300 bg-amber-50 p-6 text-center">
                    <div className="text-3xl">⏳</div>
                    <h3 className="mt-2 text-sm font-black text-slate-900">Pendiente de sorteo</h3>
                    <p className="mt-1 text-[10px] text-slate-600">Tu inscripción está registrada. Cuando haya suficientes parejas, el organizador podrá realizar el sorteo.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {partidosVisibles.map((p, matchIndex) => {
                      const jugadores = [p.pareja1?.[0], p.pareja1?.[1], p.pareja2?.[0], p.pareja2?.[1]].filter(Boolean);
                      return (
                        <article key={p.id} className="rounded-3xl border-2 border-emerald-200 bg-white p-4 shadow-lg">
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <div><span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">{p.fase === 'pozo' ? 'Pozo' : p.fase === 'grupos' ? 'Fase de grupos' : 'Eliminatoria'}</span><h3 className="mt-0.5 text-sm font-black text-slate-900">{p.nombre}</h3></div>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-black text-slate-600">{p.hora}</span>
                          </div>
                          <div className="relative mx-auto aspect-[1.65/1] max-w-[520px] overflow-hidden rounded-[22px] border-[7px] border-slate-300 bg-emerald-600 shadow-inner">
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:12px_12px]" />
                            <div className="absolute inset-[7%] rounded-lg border-2 border-white/95" />
                            <div className="absolute left-1/2 top-[7%] bottom-[7%] border-l-2 border-white/95" />
                            <div className="absolute left-[7%] right-[7%] top-1/2 border-t-2 border-white/95" />
                            <div className="absolute left-0 right-0 top-0 h-2 bg-slate-200/70 border-b border-slate-400/70" />
                            <div className="absolute left-0 right-0 bottom-0 h-2 bg-slate-200/70 border-t border-slate-400/70" />
                            <span className="absolute left-2 top-1 text-[7px] font-black tracking-widest text-white/80">PADEL · CRISTAL + MALLA</span>
                            {jugadores.map((name: string, i: number) => (
                              <button key={`${p.id}-${name}-${i}`} type="button" onClick={() => setJugadorSeleccionadoPista(i)} className={`absolute ${clasePosicionPista(i)} -translate-y-1/2 rounded-xl border-2 px-2.5 py-1.5 text-[8px] font-black shadow-lg transition-all ${jugadorSeleccionadoPista === i ? 'scale-110 border-lime-300 bg-white text-emerald-700' : 'border-white/90 bg-white/95 text-slate-900'}`}><span className="block max-w-[92px] truncate">{name}</span><span className="block text-[7px] text-emerald-700">{etiquetaLado(ladoDeJugador(name))}</span></button>
                            ))}
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="rounded-2xl bg-emerald-50 p-3"><span className="block text-[8px] font-black uppercase text-emerald-700">Pareja A</span><b className="mt-1 block text-[10px] text-slate-900">{p.pareja1?.[0]} · {p.pareja1?.[1]}</b></div>
                            <div className="rounded-2xl bg-slate-50 p-3"><span className="block text-[8px] font-black uppercase text-slate-500">Pareja B</span><b className="mt-1 block text-[10px] text-slate-900">{p.pareja2?.[0]} · {p.pareja2?.[1]}</b></div>
                          </div>
                          <p className="mt-2 text-center text-[9px] font-bold uppercase tracking-wide text-slate-400">Partido {matchIndex + 1} · Los jugadores se muestran en su posición</p>
                        </article>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* PESTAÑA EVENTOS */}
        {activeTab === 'eventos' && (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Calendario</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">Próximos eventos</h2>
              <p className="mt-1 text-xs text-slate-600">Pozos y torneos organizados por la comunidad.</p>
            </div>
            {eventos.map((evento) => {
              const inscrito = participantesEventoMap[evento.id]?.includes(ranking.find(j => j.nombre === miPerfil.nombreCompleto)?.id || '');
              return (
                <article key={evento.id} className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm">
                  <div className={`h-2 ${evento.tipo === 'Pozo' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className={`inline-flex rounded-full px-2 py-1 text-[9px] font-black uppercase ${evento.tipo === 'Pozo' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{evento.tipo}</span>
                        <h3 className="mt-2 text-base font-black text-slate-900">{evento.titulo}</h3>
                      </div>
                      <span className="rounded-xl bg-slate-100 px-2 py-1 text-xs font-black text-slate-800">€{evento.precioUnitario}</span>
                    </div>
                    <div className="mt-4 grid gap-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-800"><Calendar className="h-4 w-4 shrink-0 text-emerald-600" /><strong>{evento.fecha}</strong></div>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evento.club)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-semibold text-slate-800 underline decoration-emerald-400 underline-offset-2"><MapPin className="h-4 w-4 shrink-0 text-emerald-600" /><span>{evento.club}</span></a>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-600">{evento.plazas_ocupadas}/{evento.plazas_totales} parejas inscritas</span>
                      {inscrito ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setEventoActivoId(evento.id); setActiveTab('pistas'); }} className="rounded-xl bg-slate-900 px-3 py-2 text-[10px] font-black uppercase text-white">Ver mis partidos</button>
                          {miInscripcionEventoMap[evento.id] && (
                            <button onClick={() => handleCancelarInscripcion(evento.id)} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] font-black uppercase text-rose-600">Borrarme</button>
                          )}
                        </div>
                      ) : (
                        <button onClick={() => { setEventoRegistrandoId(evento.id); setLadoInscripcion(miPerfil.lado); setLadoParejaInscripcion(miPerfil.lado === 'derecha' ? 'reves' : 'derecha'); }} className="rounded-xl bg-emerald-500 px-3 py-2 text-[10px] font-black uppercase text-white shadow-md">Apuntarme</button>
                      )}
                    </div>
                    {eventoRegistrandoId === evento.id && (
                      <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 space-y-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Inscripción al {evento.tipo}</p>
                          <p className="mt-1 text-[10px] text-slate-600">El lado es informativo para colocar a cada jugador en pista. El sorteo siempre es aleatorio.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="mb-1 block text-[9px] font-black uppercase text-slate-500">Tu lado</label>
                            <select value={ladoInscripcion} onChange={e => setLadoInscripcion(e.target.value as 'derecha' | 'reves')} className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-900">
                              <option value="derecha">Derecha</option><option value="reves">Revés</option>
                            </select>
                          </div>
                          <div>
                            <label className="mb-1 block text-[9px] font-black uppercase text-slate-500">Lado pareja</label>
                            <select value={ladoParejaInscripcion} onChange={e => setLadoParejaInscripcion(e.target.value as 'derecha' | 'reves')} className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-900">
                              <option value="derecha">Derecha</option><option value="reves">Revés</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button type="button" onClick={() => setModoInscripcion('pareja')} className={`rounded-xl p-2.5 text-[10px] font-black uppercase ${modoInscripcion === 'pareja' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>👥 Tengo pareja</button>
                          <button type="button" onClick={() => setModoInscripcion('solo')} className={`rounded-xl p-2.5 text-[10px] font-black uppercase ${modoInscripcion === 'solo' ? 'bg-amber-400 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>🙋 Me apunto solo</button>
                        </div>
                        {modoInscripcion === 'pareja' ? (
                          <input value={nombreParejaInput} onChange={e => setNombreParejaInput(e.target.value)} placeholder="Nombre de tu pareja" className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400" />
                        ) : (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[10px] text-amber-800"><b>Sin pareja</b><br/>Te añadimos a la lista de jugadores solos. Cuando haya otra persona sola en este evento, el sistema formará automáticamente la pareja.</div>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => handleConfirmarInscripcion(evento.id)} className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-[10px] font-black uppercase text-white">Confirmar inscripción</button>
                          <button onClick={() => { setEventoRegistrandoId(null); setNombreParejaInput(''); setModoInscripcion('pareja'); }} className="rounded-xl bg-white px-3 py-2 text-[10px] font-black uppercase text-slate-600 border border-slate-200">Cancelar</button>
                        </div>
                      </div>
                    )}
                    {(jugadoresSinParejaMap[evento.id] || []).length > 0 && (
                      <div className="mt-3 rounded-2xl bg-amber-50 border border-amber-200 p-3">
                        <div className="flex items-center justify-between"><span className="text-[9px] font-black uppercase text-amber-800">Jugadores sin pareja</span><span className="rounded-full bg-white px-2 py-1 text-[9px] font-black text-amber-700">{jugadoresSinParejaMap[evento.id].length}</span></div>
                        <p className="mt-1 text-[10px] text-amber-700">Cuando haya 2, Padel Arena los junta automáticamente.</p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* PESTAÑA RANKINGS */}
        {activeTab === 'rankings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black tracking-widest text-slate-500 uppercase flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-600" /> Rankings independientes
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-white p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setTipoRanking('pozos')}
                className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  tipoRanking === 'pozos' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                ⚡ Ranking Pozos
              </button>
              <button
                onClick={() => setTipoRanking('torneos')}
                className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  tipoRanking === 'torneos' ? 'bg-amber-400 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                🏆 Ranking Torneos
              </button>
            </div>

            <div className="bg-white/90 border-2 border-emerald-200 rounded-3xl overflow-hidden shadow-xl">
              {rankingOrdenado.length > 0 && (
                <div className={`p-4 text-white flex items-center justify-between ${tipoRanking === 'pozos' ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-amber-400 to-amber-300'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-950 text-slate-900 font-black text-lg flex items-center justify-center">
                      🥇
                    </div>
                    <div>
                      <h3 className="text-base font-black">{rankingOrdenado[0].nombre}</h3>
                      <p className="text-[10px] font-extrabold text-slate-900 uppercase">
                        {tipoRanking === 'pozos' ? 'Líder de Pozos' : 'Campeón de Torneos'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black block">
                      {tipoRanking === 'pozos' ? rankingOrdenado[0].puntosPozos : rankingOrdenado[0].puntosTorneos}
                    </span>
                    <span className="text-[9px] font-black uppercase">PUNTOS</span>
                  </div>
                </div>
              )}

              <div className="divide-y divide-cyan-900/60 p-1">
                {rankingOrdenado.slice(1).map((jugador, index) => (
                  <div key={jugador.id} className="flex items-center justify-between p-3.5 hover:bg-[#f4f7f5]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs font-black text-emerald-700">
                        {index === 0 ? '🥈' : index === 1 ? '🥉' : `${index + 3}º`}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs">{jugador.nombre}</h4>
                        <p className="text-[10px] text-slate-500">
                          Nivel {jugador.nivel.toFixed(1)} • {tipoRanking === 'pozos' ? `${jugador.pozos} pozos` : `${jugador.torneosJugados} torneos`}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-xs text-emerald-700">
                      {tipoRanking === 'pozos' ? `${jugador.puntosPozos} pts` : `${jugador.puntosTorneos} pts`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA FANTASY */}
        {activeTab === 'fantasy' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="rounded-3xl bg-white border border-emerald-200 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div><span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Fantasy Padel</span><h2 className="mt-1 text-2xl font-black text-slate-900">Fíchalos. Véndelos. Compite.</h2><p className="mt-1 text-xs text-slate-500">Solo puedes llevar 2 jugadores. Gasta tu presupuesto, compite y vende cuando quieras recuperar valor.</p></div>
                <div className="text-right shrink-0"><span className="block text-2xl font-black text-emerald-600">{fantasyPts}</span><span className="text-[9px] uppercase font-bold text-slate-400">pts Fantasy</span></div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-slate-50 p-3"><span className="block text-[9px] font-black uppercase text-slate-400">Saldo disponible</span><b className="mt-1 block text-lg text-slate-900">{fantasySaldo.toFixed(1)}M</b></div>
                <div className="rounded-2xl bg-emerald-50 p-3"><span className="block text-[9px] font-black uppercase text-emerald-600">Plazas de equipo</span><b className="mt-1 block text-lg text-emerald-800">{fantasyEquipo.length}/2</b></div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3"><div><h3 className="font-black text-slate-900">Mi equipo</h3><p className="text-[10px] text-slate-500">Compra 2 jugadores para competir esta jornada.</p></div><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black text-slate-600">{fantasyEquipo.length}/2</span></div>
              {fantasySeleccionados.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center"><div className="text-2xl">🏓</div><p className="mt-1 text-xs font-black text-slate-800">Aún no tienes jugadores</p><p className="text-[10px] text-slate-500">Fícha jugadores de eventos en los que ya participan.</p></div>
              ) : (
                <div className="space-y-2">{fantasySeleccionados.map(j => <div key={j.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><div><b className="block text-xs text-slate-900">{j.nombre}</b><span className="text-[9px] font-bold text-slate-500">{j.lado === 'derecha' ? 'Derecha' : 'Revés'} · {j.fantasyPts} pts</span></div><div className="flex items-center gap-2"><b className="text-xs text-emerald-700">{j.valor}M</b><button onClick={() => handleVenderFantasy(j.id)} className="rounded-lg bg-white border border-slate-200 px-2 py-1 text-[9px] font-black uppercase text-slate-600 hover:border-red-200 hover:text-red-600">Vender</button></div></div>)}</div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between"><div><h3 className="font-black text-slate-900">Mercado de hoy</h3><p className="mt-1 text-[10px] text-slate-500">4 jugadores disponibles hoy. Los fichajes se mantienen hasta que los vendas.</p></div><span className="text-[9px] font-black uppercase text-emerald-600">Compra / venta</span></div>
              <div className="mt-3 space-y-2">{fantasyMercado.map(j => { const elegido=fantasyEquipo.includes(j.id); const puedeComprar=!elegido && fantasyEquipo.length<2 && fantasySaldo>=j.valor; return <div key={j.id} className="flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3"><div className="min-w-0"><div className="flex items-center gap-2"><b className="text-xs truncate text-slate-900">{j.nombre}</b><span className="text-[8px] font-black uppercase text-slate-400">{j.lado}</span></div><div className="mt-1 flex gap-3 text-[9px] text-slate-500"><span>{j.fantasyPts} pts</span><span>Nivel {j.nivel.toFixed(1)}</span></div></div><div className="flex items-center gap-2 shrink-0"><b className="text-xs text-slate-900">{j.valor}M</b>{elegido ? <button onClick={() => handleVenderFantasy(j.id)} className="rounded-xl bg-white border border-slate-200 px-2.5 py-1.5 text-[9px] font-black uppercase text-red-600">Vender</button> : <button disabled={!puedeComprar} onClick={() => handleComprarFantasy(j.id)} className={`rounded-xl px-2.5 py-1.5 text-[9px] font-black uppercase ${puedeComprar ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Fichar</button>}</div></div> })}</div>
            </div>
          </div>
        )}

        {/* PESTAÑA ADMIN */}
        {activeTab === 'admin' && (
          <div className="space-y-5">
            {esOrganizador ? (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <Unlock className="w-4 h-4 text-emerald-600" /> Modo Organizador
                  </span>
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase text-emerald-700">Cuenta autorizada</span>
                </div>

                <div className="bg-white/90 border-2 border-emerald-200 p-4 rounded-3xl space-y-4 shadow-xl">
                  <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" /> Publicar nuevo evento
                  </h3>

                  <form onSubmit={handleCrearEvento} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Título del evento"
                      value={nuevoTituloEvento}
                      onChange={(e) => setNuevoTituloEvento(e.target.value)}
                      className="w-full bg-[#f4f7f5] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-400 font-bold"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={nuevoTipoEvento}
                        onChange={(e) => setNuevoTipoEvento(e.target.value)}
                        className="bg-[#f4f7f5] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                      >
                        <option value="Pozo">Pozo</option>
                        <option value="Torneo">Torneo</option>
                      </select>

                      <input
                        type="number"
                        placeholder="Precio x Jugador (€)"
                        value={nuevoPrecioEvento}
                        onChange={(e) => setNuevoPrecioEvento(e.target.value)}
                        className="bg-[#f4f7f5] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95"
                    >
                      Publicar Evento
                    </button>
                  </form>

                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <span className="text-[10px] uppercase font-extrabold text-emerald-700 block">Eventos publicados</span>
                    {eventos.map((ev) => (
                      <div key={ev.id} className="flex justify-between items-center bg-[#f4f7f5] p-2.5 rounded-xl border border-slate-200/60">
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{ev.titulo}</span>
                        <button 
                          onClick={() => handleEliminarEvento(ev.id)}
                          className="text-rose-400 hover:text-rose-300 p-1 bg-rose-500/10 rounded-lg border border-rose-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/90 border-2 border-emerald-200 p-4 rounded-3xl space-y-3.5 shadow-xl">
                  <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" /> Resultados y puntos
                  </h3>

                  <form onSubmit={handleGuardarCierre} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Modalidad</label>
                        <select
                          value={cierreTipoEvento}
                          onChange={(e) => setCierreTipoEvento(e.target.value as 'Pozo' | 'Torneo')}
                          className="w-full bg-[#f4f7f5] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                        >
                          <option value="Pozo">Pozo</option>
                          <option value="Torneo">Torneo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Jugador</label>
                        <select
                          value={cierreJugador}
                          onChange={(e) => setCierreJugador(e.target.value)}
                          className="w-full bg-[#f4f7f5] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold truncate"
                        >
                          {ranking.map((j) => (
                            <option key={j.id} value={j.nombre}>{j.nombre}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {cierreTipoEvento === 'Pozo' ? (
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Pista Final en el Pozo</label>
                        <select
                          value={cierrePista}
                          onChange={(e) => setCierrePista(e.target.value)}
                          className="w-full bg-[#f4f7f5] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                        >
                          <option value="1">Pista 1 (Rey) - Base 100 pts</option>
                          <option value="2">Pista 2 - Base 75 pts</option>
                          <option value="3">Pista 3 - Base 50 pts</option>
                          <option value="4">Pista 4 - Base 25 pts</option>
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-3 p-3 bg-[#f4f7f5] rounded-2xl border border-slate-200">
                        <div>
                          <label className="block text-[10px] font-extrabold text-emerald-700 uppercase mb-1">Cuadro del Torneo</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setCierreCuadro('principal')}
                              className={`py-2 rounded-xl text-xs font-black uppercase transition-all ${
                                cierreCuadro === 'principal' ? 'bg-amber-400 text-white' : 'bg-white text-slate-500 border border-slate-200'
                              }`}
                            >
                              🏆 Principal
                            </button>
                            <button
                              type="button"
                              onClick={() => setCierreCuadro('consolacion')}
                              className={`py-2 rounded-xl text-xs font-black uppercase transition-all ${
                                cierreCuadro === 'consolacion' ? 'bg-emerald-400 text-white' : 'bg-white text-slate-500 border border-slate-200'
                              }`}
                            >
                              🛡️ Consolación
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Fase / Ronda Alcanzada</label>
                          <select
                            value={cierreRondaTorneo}
                            onChange={(e) => setCierreRondaTorneo(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                          >
                            <option value="campeon">{cierreCuadro === 'principal' ? '🥇 Campeón (200 pts)' : '🏆 Campeón Consolación (50 pts)'}</option>
                            <option value="subcampeon">{cierreCuadro === 'principal' ? '🥈 Subcampeón (140 pts)' : '🥈 Subcampeón Consolación (35 pts)'}</option>
                            <option value="semifinal">{cierreCuadro === 'principal' ? '🥉 Semifinalista (90 pts)' : '🥉 Semifinalista Consolación (20 pts)'}</option>
                            {cierreCuadro === 'principal' && <option value="cuartos">Quartos de Final (60 pts)</option>}
                          </select>
                        </div>
                      </div>
                    )}

                    {cierreTipoEvento === 'Pozo' && (
                      <div className="flex items-center justify-between p-3 bg-[#f4f7f5] rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-900">¿Victoria en último partido?</span>
                        <button
                          type="button"
                          onClick={() => setCierreGano(!cierreGano)}
                          className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                            cierreGano ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-emerald-700'
                          }`}
                        >
                          {cierreGano ? 'SÍ (+Bonus)' : 'NO'}
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg"
                    >
                      Guardar Puntos en el Ranking
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <Shield className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-3 text-base font-black text-slate-900">Panel de organizador</h3>
                <p className="mt-1 text-xs text-slate-500">Tu cuenta no está marcada como organizador.</p>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA PERFIL */}
        {activeTab === 'perfil' && (
          <div className="space-y-4">
            <div className="bg-white/90 border-2 border-emerald-200 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white font-black text-2xl shadow-lg">
                  {miPerfil.nombreCompleto ? miPerfil.nombreCompleto.substring(0, 2).toUpperCase() : 'JD'}
                </div>
                <h2 className="text-lg font-black text-slate-900">{miPerfil.nombreCompleto}</h2>
                <p className="text-xs text-slate-500">Jugador Activo del Club</p>
              </div>

              <div className="bg-[#f4f7f5] p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-black text-emerald-600 uppercase tracking-wider">Tus Datos de Perfil</h3>
                
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[10px] text-emerald-700 font-bold uppercase">Nombre y Apellido</label>
                    <input 
                      type="text" 
                      value={miPerfil.nombreCompleto}
                      onChange={(e) => setMiPerfil({...miPerfil, nombreCompleto: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-emerald-700 font-bold uppercase">Teléfono</label>
                    <input 
                      type="tel" 
                      value={miPerfil.telefono}
                      onChange={(e) => setMiPerfil({...miPerfil, telefono: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-emerald-700 font-bold uppercase">Nivel en Playtomic</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={miPerfil.nivelPlaytomic}
                      onChange={(e) => setMiPerfil({...miPerfil, nivelPlaytomic: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold mt-1"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button 
                    onClick={() => {
                      setMensajeExito('¡Perfil actualizado con éxito!');
                      setTimeout(() => setMensajeExito(''), 3000);
                      setActiveTab('eventos');
                    }}
                    className="w-full bg-emerald-500 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider"
                  >
                    Guardar Cambios
                  </button>

                  <button
                    onClick={() => setActiveTab('admin')}
                    className="w-full bg-slate-900 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5" /> Modo Organizador
                  </button>

                  <button 
                    onClick={() => {
                      setAuthStep('login');
                      setPasswordInput('');
                    }}
                    className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="px-4 pb-4 pt-1 text-center">
        <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">PADEL ARENA · Eventos · Partidos · Ranking · Fantasy</span>
      </div>

      {/* Navegación Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/96 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_30px_rgba(15,23,42,.06)] p-2 max-w-md mx-auto z-40">
        <div className="flex justify-around items-center gap-0.5">
          {[
            { id: 'inicio', icon: Sparkles, label: 'Inicio' },
            { id: 'eventos', icon: Calendar, label: 'Eventos' },
            { id: 'pistas', icon: Users, label: 'Mis partidos' },
            { id: 'rankings', icon: Trophy, label: 'Ranking' },
            { id: 'fantasy', icon: Flame, label: 'Fantasy' },
            { id: 'perfil', icon: Settings, label: 'Perfil' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center gap-1 p-1.5 text-[10px] font-bold transition-all active:scale-95 ${
                  isActive ? 'text-emerald-600' : 'text-slate-500/60'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span><span>{item.label}</span></span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}