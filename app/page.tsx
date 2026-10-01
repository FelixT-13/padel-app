'use client';

import React, { useEffect, useState } from 'react';
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
    plazas_ocupadas: 0,
    precioUnitario: 12,
  },
  {
    id: 2,
    titulo: 'Torneo otoño nivel 4',
    tipo: 'Torneo',
    fecha: '24-26 Oct • Cat. Abierta',
    club: 'Pádel Indoor Madrid',
    plazas_totales: 6,
    plazas_ocupadas: 0,
    precioUnitario: 20,
  }
];

type Jugador = {
  id: string;
  nombre: string;
  telefono: string;
  nivel: number;
  pozos: number;
  puntosPozos: number;
  torneosJugados: number;
  puntosTorneos: number;
  racha: string;
  lado: 'derecha' | 'reves';
  fantasyPuntos: number;
  primerTorneoPuntos: number | null;
  valorFantasy: number | null;
};

type ResultadoEvento = {
  eventoId: number;
  jugadorId: string;
  tipo: 'Pozo' | 'Torneo';
  puntos: number;
};

const JUGADORES_INICIALES: Jugador[] = [
  { id: '1', nombre: 'Felix Gomez', telefono: '600123456', nivel: 4.0, pozos: 6, puntosPozos: 580, torneosJugados: 3, puntosTorneos: 340, racha: '3W', lado: 'derecha', fantasyPuntos: 920, primerTorneoPuntos: 120, valorFantasy: 2.7 },
  { id: '2', nombre: 'Angel Ruiz', telefono: '611223344', nivel: 3.9, pozos: 5, puntosPozos: 490, torneosJugados: 2, puntosTorneos: 280, racha: '1W', lado: 'reves', fantasyPuntos: 770, primerTorneoPuntos: 80, valorFantasy: 2.3 },
  { id: '3', nombre: 'Lidia Martin', telefono: '622334455', nivel: 3.8, pozos: 5, puntosPozos: 460, torneosJugados: 4, puntosTorneos: 410, racha: '2W', lado: 'derecha', fantasyPuntos: 870, primerTorneoPuntos: 150, valorFantasy: 3.0 },
  { id: '4', nombre: 'Rober Sanchez', telefono: '633445566', nivel: 3.5, pozos: 4, puntosPozos: 350, torneosJugados: 2, puntosTorneos: 210, racha: '1L', lado: 'reves', fantasyPuntos: 560, primerTorneoPuntos: 70, valorFantasy: 2.2 },
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
  const [ranking, setRanking] = useState<Jugador[]>(JUGADORES_INICIALES);

  // Fantasy de Pádel: minijuego local para el prototipo.
  const [fantasyEquipo, setFantasyEquipo] = useState<string[]>([]);
  const [fantasyPresupuesto, setFantasyPresupuesto] = useState(10);
  const [fantasyJornada, setFantasyJornada] = useState<'actual' | 'historico'>('actual');
  const [jugadorSeleccionadoPista, setJugadorSeleccionadoPista] = useState(0);


  // Mapa de inscripciones: { [eventoId]: nombrePareja }
  // Inscripciones reales del evento. El ranking NO implica estar inscrito en ningún evento.
  const [participantesEventoMap, setParticipantesEventoMap] = useState<{[key: number]: string[]}>({});
  const [ladoPorJugador, setLadoPorJugador] = useState<{[key: string]: 'derecha' | 'reves'}>({ '1': 'derecha', '2': 'reves', '3': 'derecha', '4': 'reves' });
  const [ladoPorEventoMap, setLadoPorEventoMap] = useState<Record<number, Record<string, 'derecha' | 'reves'>>>({});
  const [partidosEventoMap, setPartidosEventoMap] = useState<{[key: number]: any[]}>({});
  const [jugadoresSinParejaMap, setJugadoresSinParejaMap] = useState<{[key: number]: string[]}>({});
  const [parejasEventoMap, setParejasEventoMap] = useState<{[key: number]: string[][]}>({});
  const [miInscripcionEventoMap, setMiInscripcionEventoMap] = useState<{[key: number]: { modo: 'pareja' | 'solo'; pareja: string[] | null }}>({});
  
  const [eventoRegistrandoId, setEventoRegistrandoId] = useState<number | null>(null);
  const [nombreParejaInput, setNombreParejaInput] = useState('');
  const [ladoInscripcion, setLadoInscripcion] = useState<'derecha' | 'reves'>('derecha');
  const [ladoParejaInscripcion, setLadoParejaInscripcion] = useState<'derecha' | 'reves'>('reves');
  const [modoInscripcion, setModoInscripcion] = useState<'pareja' | 'solo'>('pareja');
  const [mostrarInvitacion, setMostrarInvitacion] = useState(false);
  const [invitacionNombre, setInvitacionNombre] = useState('');
  const [invitacionTelefono, setInvitacionTelefono] = useState('');
  const [invitacionEventoId, setInvitacionEventoId] = useState<number | null>(null);
  const [eventoInvitacionPendienteId, setEventoInvitacionPendienteId] = useState<number | null>(null);
  const [invitacionTextoGenerado, setInvitacionTextoGenerado] = useState('');

  const [eventoActivoId, setEventoActivoId] = useState<number | null>(null);
  const [tipoPartidosFiltro, setTipoPartidosFiltro] = useState<'Pozo' | 'Torneo'>('Pozo');
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

  // Cierre admin
  const [cierreJugador, setCierreJugador] = useState('Felix Gomez');
  const [cierreTipoEvento, setCierreTipoEvento] = useState<'Pozo' | 'Torneo'>('Pozo');
  const [cierreEventoId, setCierreEventoId] = useState<number | null>(null);
  const [cierrePista, setCierrePista] = useState('1');
  const [cierreCuadro, setCierreCuadro] = useState<'principal' | 'consolacion'>('principal');
  const [cierreRondaTorneo, setCierreRondaTorneo] = useState('campeon');
  const [cierresEventoMap, setCierresEventoMap] = useState<Record<string, ResultadoEvento>>({});
  const [mensajeExito, setMensajeExito] = useState('');

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoNivel, setNuevoNivel] = useState('3.5');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invitacionId = Number(params.get('invitar'));
    if (Number.isFinite(invitacionId) && invitacionId > 0 && eventos.some(ev => ev.id === invitacionId)) {
      setEventoInvitacionPendienteId(invitacionId);
    }
  }, [eventos]);

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
          fantasyPuntos: 0,
          primerTorneoPuntos: null,
          valorFantasy: null
        }];
      }
      return prev;
    });

    setAuthStep('app');
    if (eventoInvitacionPendienteId) {
      setEventoActivoId(eventoInvitacionPendienteId);
      setActiveTab('eventos');
      setMensajeExito(`¡Bienvenido/a, ${miPerfil.nombreCompleto}! Te han invitado a un evento.`);
      window.history.replaceState({}, '', window.location.pathname);
      setEventoInvitacionPendienteId(null);
    } else {
      setMensajeExito(`¡Bienvenido/a, ${miPerfil.nombreCompleto}! 🏓`);
    }
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const crearCalendarioTorneo = (
    eventoId: number,
    parejas: string[][],
    ladosPorNombre: Record<string, 'derecha' | 'reves'> = {}
  ) => {
    const parejasReales = parejas.filter(p => p.length === 2);
    if (parejasReales.length < 2) {
      setPartidosEventoMap(prev => ({ ...prev, [eventoId]: [] }));
      setEventoActivoId(eventoId);
      return;
    }

    // Calendario de todos contra todos: cada pareja juega una vez por jornada.
    // Si hay un número impar de parejas, una descansa en cada jornada.
    const descanso = ['__DESCANSO__', '__DESCANSO__'];
    const ladosDelEvento = { ...(ladoPorEventoMap[eventoId] || {}), ...ladosPorNombre };
    const rotacion = parejasReales.map(p => ordenarParejaPorLado(p, ladosDelEvento));
    if (rotacion.length % 2 !== 0) rotacion.push(descanso);

    const base = Date.now();
    const partidos: any[] = [];
    const equiposPorJornada = rotacion.length;

    for (let jornada = 0; jornada < equiposPorJornada - 1; jornada++) {
      let numeroPista = 1;
      for (let indice = 0; indice < equiposPorJornada / 2; indice++) {
        const pareja1 = rotacion[indice];
        const pareja2 = rotacion[equiposPorJornada - 1 - indice];
        if (pareja1 === descanso || pareja2 === descanso) continue;

        partidos.push({
          id: base + partidos.length + 1,
          eventoId,
          fase: 'grupos',
          ronda: `Jornada ${jornada + 1}`,
          nombre: `Jornada ${jornada + 1}`,
          hora: `${10 + jornada}:00h`,
          pista: numeroPista++,
          pareja1,
          pareja2,
          ladosPorJugador: Object.fromEntries(
            [...pareja1, ...pareja2].map(nombre => [nombre, ladosDelEvento[nombre] || ladoDeJugador(nombre)] as const)
          ),
          resultado: ''
        });
      }

      const fijo = rotacion[0];
      const resto = rotacion.slice(1);
      resto.unshift(resto.pop()!);
      rotacion.splice(0, rotacion.length, fijo, ...resto);
    }

    setPartidosEventoMap(prev => ({ ...prev, [eventoId]: partidos }));
    setEventoActivoId(eventoId);
  };


  const generarPartidosTorneo = (eventoId: number, parejaA: string, parejaB: string, ladosPorNombre: Record<string, 'derecha' | 'reves'> = {}) => {
    const parejas = parejasEventoMap[eventoId] || [[parejaA, parejaB]];
    crearCalendarioTorneo(eventoId, parejas, ladosPorNombre);
  };

  const emparejarJugadoresSolos = (
    eventoId: number,
    jugadores: string[],
    ladosPorNombre: Record<string, 'derecha' | 'reves'> = {}
  ) => {
    const evento = eventos.find(ev => ev.id === eventoId);
    const parejasActuales = parejasEventoMap[eventoId] || [];
    const pendientes = [...jugadores];
    for (let i = pendientes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pendientes[i], pendientes[j]] = [pendientes[j], pendientes[i]];
    }
    const huecosPareja = Math.max(0, (evento?.plazas_totales ?? 0) - (evento?.plazas_ocupadas ?? 0));
    const nuevasParejas = [...parejasActuales];
    let parejasNuevas = 0;
    while (pendientes.length >= 2 && parejasNuevas < huecosPareja) {
      nuevasParejas.push([pendientes.shift()!, pendientes.shift()!]);
      parejasNuevas++;
    }
    setParejasEventoMap(prev => ({ ...prev, [eventoId]: nuevasParejas }));
    setJugadoresSinParejaMap(prev => ({ ...prev, [eventoId]: pendientes }));
    if (parejasNuevas > 0) setEventos(prev => prev.map(ev => ev.id === eventoId ? { ...ev, plazas_ocupadas: Math.min(ev.plazas_totales, ev.plazas_ocupadas + parejasNuevas) } : ev));
    if (evento?.tipo === 'Pozo') generarSorteoPozo(eventoId, nuevasParejas, ladosPorNombre);
    else if (evento?.tipo === 'Torneo') crearCalendarioTorneo(eventoId, nuevasParejas, ladosPorNombre);
    return pendientes;
  };


  const generarSorteoPozo = (
    eventoId: number,
    parejasEntrada?: string[][],
    ladosPorNombre: Record<string, 'derecha' | 'reves'> = {}
  ) => {
    const parejasBase = (parejasEntrada || parejasEventoMap[eventoId] || []).filter(p => p.length === 2);
    if (parejasBase.length === 0) {
      setPartidosEventoMap(prev => ({ ...prev, [eventoId]: [] }));
      setEventoActivoId(eventoId);
      return;
    }
    const ladosDelEvento = { ...(ladoPorEventoMap[eventoId] || {}), ...ladosPorNombre };
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
        pista,
        pareja1: ordenarParejaPorLado(parejas[i], ladosDelEvento),
        pareja2: parejas[i + 1] ? ordenarParejaPorLado(parejas[i + 1], ladosDelEvento) : ['DESCANSO', 'DESCANSO'],
        ladosPorJugador: Object.fromEntries(
          [...parejas[i], ...(parejas[i + 1] || [])].map(nombre => [nombre, ladosDelEvento[nombre] || ladoDeJugador(nombre)] as const)
        ),
        resultado: ''
      });
    }
    setPartidosEventoMap(prev => ({ ...prev, [eventoId]: partidos }));
    setEventoActivoId(eventoId);
  };

  const abrirInvitacionCompanero = (eventoId: number) => {
    setInvitacionEventoId(eventoId);
    setInvitacionNombre('');
    setInvitacionTelefono('');
    setMostrarInvitacion(true);
  };

  const enviarInvitacionCompanero = () => {
    const evento = eventos.find(ev => ev.id === invitacionEventoId);
    const nombre = invitacionNombre.trim();
    let telefono = invitacionTelefono.replace(/\D/g, '');
    if (!evento || !nombre) {
      setMensajeExito('Indica al menos el nombre de tu compañero.');
      setTimeout(() => setMensajeExito(''), 2500);
      return;
    }

    // Si se introduce un móvil español de 9 cifras, añadimos el prefijo 34.
    if (telefono.length === 9 && /^[67]/.test(telefono)) telefono = `34${telefono}`;

    const enlace = `${window.location.origin}/?invitar=${evento.id}`;
    const texto = `¡Hola ${nombre}! Te invito a jugar conmigo en Padel Arena\n\n${evento.titulo}\n${evento.fecha} · ${evento.club}\n\n👉 Regístrate desde aquí y podrás unirte al evento conmigo:\n${enlace}`;

    // Guardamos siempre el texto por si el usuario necesita copiarlo manualmente.
    setInvitacionTextoGenerado(texto);

    // WhatsApp funciona mejor abriendo una nueva pestaña desde la acción directa del usuario.
    // Usamos api.whatsapp.com porque es más consistente en escritorio y móvil.
    const url = telefono
      ? `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(texto)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;

    const ventana = window.open(url, '_blank', 'noopener,noreferrer');
    if (!ventana) {
      setMensajeExito('El navegador ha bloqueado la ventana de WhatsApp. Usa "Copiar invitación".');
      setTimeout(() => setMensajeExito(''), 4000);
    } else {
      setMensajeExito('WhatsApp se ha abierto con la invitación preparada.');
      setTimeout(() => setMensajeExito(''), 3000);
    }
  };

  const handleConfirmarInscripcion = (eventoId: number) => {
    const miJugador = ranking.find(
      j => j.nombre.trim().toLowerCase() === miPerfil.nombreCompleto.trim().toLowerCase()
    );
    const evento = eventos.find(ev => ev.id === eventoId);

    if (!miJugador || !evento) {
      setMensajeExito('No se ha podido identificar tu jugador o el evento.');
      setTimeout(() => setMensajeExito(''), 3000);
      return;
    }

    if (modoInscripcion === 'pareja' && evento.plazas_ocupadas >= evento.plazas_totales) {
      setMensajeExito('Este evento ya está completo.');
      setTimeout(() => setMensajeExito(''), 3000);
      return;
    }

    if (miInscripcionEventoMap[eventoId]) {
      setMensajeExito('Ya estás inscrito en este evento.');
      setTimeout(() => setMensajeExito(''), 2500);
      return;
    }

    const participantesActuales = participantesEventoMap[eventoId] || [];
    const parejasActuales = parejasEventoMap[eventoId] || [];

    if (modoInscripcion === 'solo') {
      if (participantesActuales.includes(miJugador.id)) {
        setMensajeExito('Ya figuras como participante en este evento.');
        setTimeout(() => setMensajeExito(''), 2500);
        return;
      }

      setLadoPorJugador(prev => ({ ...prev, [miJugador.id]: ladoInscripcion }));
      setLadoPorEventoMap(prev => ({
        ...prev,
        [eventoId]: { ...(prev[eventoId] || {}), [miPerfil.nombreCompleto.trim()]: ladoInscripcion }
      }));
      setRanking(prev => prev.map(j =>
        j.id === miJugador.id ? { ...j, lado: ladoInscripcion } : j
      ));

      const participantes = [...participantesActuales, miJugador.id];
      const pendientes = Array.from(new Set([
        ...(jugadoresSinParejaMap[eventoId] || []),
        miPerfil.nombreCompleto.trim()
      ]));

      setParticipantesEventoMap(prev => ({ ...prev, [eventoId]: participantes }));
      setJugadoresSinParejaMap(prev => ({ ...prev, [eventoId]: pendientes }));
      setMiInscripcionEventoMap(prev => ({
        ...prev,
        [eventoId]: { modo: 'solo', pareja: null }
      }));

      // Una inscripción individual todavía NO ocupa una plaza de pareja.
      const pendientesTrasEmparejar = emparejarJugadoresSolos(eventoId, pendientes, {
        [miPerfil.nombreCompleto.trim()]: ladoInscripcion
      });

      setEventoActivoId(eventoId);
      setTipoPartidosFiltro(evento.tipo as 'Pozo' | 'Torneo');
      setEventoRegistrandoId(null);
      setNombreParejaInput('');
      setModoInscripcion('pareja');
      setActiveTab('pistas');

      setMensajeExito(
        !pendientesTrasEmparejar.some(nombre => nombre.trim().toLowerCase() === miPerfil.nombreCompleto.trim().toLowerCase())
          ? '¡Pareja formada! Se ha hecho el sorteo aleatorio. 🏓'
          : '¡Apuntado! Estás esperando pareja.'
      );
      setTimeout(() => setMensajeExito(''), 3500);
      return;
    }

    const parejaNombre = nombreParejaInput.trim();

    if (!parejaNombre) {
      setMensajeExito('Escribe el nombre de tu pareja para continuar.');
      setTimeout(() => setMensajeExito(''), 2500);
      return;
    }

    const parejaJugador = ranking.find(
      j => j.nombre.trim().toLowerCase() === parejaNombre.toLowerCase()
    );

    if (!parejaJugador) {
      setMensajeExito('No encuentro ese jugador en Padel Arena.');
      setTimeout(() => setMensajeExito(''), 2500);
      return;
    }

    if (parejaJugador.id === miJugador.id) {
      setMensajeExito('No puedes seleccionarte como pareja.');
      setTimeout(() => setMensajeExito(''), 2500);
      return;
    }

    // El compañero debe estar disponible EN ESTE EVENTO.
    if (participantesActuales.includes(parejaJugador.id)) {
      setMensajeExito(`${parejaJugador.nombre} ya está inscrito en este evento.`);
      setTimeout(() => setMensajeExito(''), 3000);
      return;
    }

    const parejaDuplicada = parejasActuales.some(
      p => p.length === 2 &&
        p.some(nombre => nombre.trim().toLowerCase() === parejaJugador.nombre.trim().toLowerCase())
    );

    if (parejaDuplicada) {
      setMensajeExito(`${parejaJugador.nombre} ya tiene pareja en este evento.`);
      setTimeout(() => setMensajeExito(''), 3000);
      return;
    }

    const nuevaPareja = [miPerfil.nombreCompleto.trim(), parejaJugador.nombre.trim()];
    const nuevasParejas = [...parejasActuales, nuevaPareja];
    const participantes = Array.from(new Set([
      ...participantesActuales,
      miJugador.id,
      parejaJugador.id
    ]));

    setLadoPorJugador(prev => ({
      ...prev,
      [miJugador.id]: ladoInscripcion,
      [parejaJugador.id]: ladoParejaInscripcion
    }));
    setLadoPorEventoMap(prev => ({
      ...prev,
      [eventoId]: {
        ...(prev[eventoId] || {}),
        [miPerfil.nombreCompleto.trim()]: ladoInscripcion,
        [parejaJugador.nombre.trim()]: ladoParejaInscripcion
      }
    }));

    setRanking(prev => prev.map(j => {
      if (j.id === miJugador.id) return { ...j, lado: ladoInscripcion };
      if (j.id === parejaJugador.id) return { ...j, lado: ladoParejaInscripcion };
      return j;
    }));

    setParticipantesEventoMap(prev => ({
      ...prev,
      [eventoId]: participantes
    }));

    setParejasEventoMap(prev => ({
      ...prev,
      [eventoId]: nuevasParejas
    }));

    setMiInscripcionEventoMap(prev => ({
      ...prev,
      [eventoId]: {
        modo: 'pareja',
        pareja: nuevaPareja
      }
    }));

    setEventos(prev => prev.map(ev =>
      ev.id === eventoId
        ? {
            ...ev,
            plazas_ocupadas: Math.min(
              ev.plazas_totales,
              ev.plazas_ocupadas + 1
            )
          }
        : ev
    ));

    // Generamos los partidos usando directamente la nueva colección,
    // no el estado anterior de React.
    const ladosNuevos = {
      [miPerfil.nombreCompleto.trim()]: ladoInscripcion,
      [parejaJugador.nombre.trim()]: ladoParejaInscripcion
    };
    if (evento.tipo === 'Pozo') {
      generarSorteoPozo(eventoId, nuevasParejas, ladosNuevos);
    } else {
      crearCalendarioTorneo(eventoId, nuevasParejas, ladosNuevos);
    }

    setEventoActivoId(eventoId);
    setTipoPartidosFiltro(evento.tipo as 'Pozo' | 'Torneo');
    setEventoRegistrandoId(null);
    setNombreParejaInput('');
    setModoInscripcion('pareja');
    setActiveTab('pistas');

    setMensajeExito(
      `¡Inscripción confirmada! ${miPerfil.nombreCompleto} · ` +
      `${ladoInscripcion === 'derecha' ? 'Derecha' : 'Revés'} · ` +
      `${parejaJugador.nombre} · ` +
      `${ladoParejaInscripcion === 'derecha' ? 'Derecha' : 'Revés'}`
    );
    setTimeout(() => setMensajeExito(''), 3500);
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
    const nombreMiJugador = miPerfil.nombreCompleto.trim().toLowerCase();
    const parejaRegistrada = (parejasEventoMap[eventoId] || []).find(
      p => p.some(nombre => nombre.trim().toLowerCase() === nombreMiJugador)
    );
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
    // Una plaza de pareja menos. En modo solo, la plaza solo cuenta si llegó a formar pareja.
    if (parejaARemover) {
      setEventos(prev => prev.map(ev =>
        ev.id === eventoId ? { ...ev, plazas_ocupadas: Math.max(0, ev.plazas_ocupadas - 1) } : ev
      ));
    }

    if (eventoActivoId === eventoId) setEventoActivoId(null);
    setEventoRegistrandoId(null);
    setNombreParejaInput('');
    setModoInscripcion('pareja');
    setEventoActivoId(null);
    setMensajeExito('Te has borrado del evento correctamente.');
    setTimeout(() => setMensajeExito(''), 2500);
  };

  const calcularPuntosPozo = (pista: number) => {
    // En el ranking del pozo cuenta la pista final alcanzada, sin bonus por victoria.
    return Math.max(100 - (pista - 1) * 25, 10);
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
    const evento = eventos.find(ev => ev.id === cierreEventoId && ev.tipo === cierreTipoEvento)
      || eventos.find(ev => ev.tipo === cierreTipoEvento);
    const jugador = ranking.find(j => j.nombre === cierreJugador);

    const jugadorTienePareja = evento && (parejasEventoMap[evento.id] || []).some(
      pareja => pareja.includes(jugador?.nombre || '')
    );
    if (!evento || !jugador || !(participantesEventoMap[evento.id] || []).includes(jugador.id) || !jugadorTienePareja) {
      setMensajeExito('Selecciona un evento y un jugador inscrito para guardar el resultado.');
      setTimeout(() => setMensajeExito(''), 3000);
      return;
    }

    const keyResultado = `${evento.id}:${jugador.id}`;
    const resultadoAnterior = cierresEventoMap[keyResultado];
    const pts = cierreTipoEvento === 'Pozo'
      ? calcularPuntosPozo(parseInt(cierrePista, 10))
      : calcularPuntosTorneo(cierreRondaTorneo, cierreCuadro);
    const diferenciaPuntos = pts - (resultadoAnterior?.puntos ?? 0);

    setCierresEventoMap(prev => ({
      ...prev,
      [keyResultado]: { eventoId: evento.id, jugadorId: jugador.id, tipo: cierreTipoEvento, puntos: pts }
    }));

    setRanking(prev => prev.map(j => {
      if (j.id !== jugador.id) return j;

      if (cierreTipoEvento === 'Pozo') {
        return {
          ...j,
          puntosPozos: j.puntosPozos + diferenciaPuntos,
          pozos: j.pozos + (resultadoAnterior ? 0 : 1)
        };
      }

      const otrosTorneosCerrados = Object.values(cierresEventoMap).some(
        resultado => resultado.jugadorId === j.id && resultado.tipo === 'Torneo' && resultado.eventoId !== evento.id
      );
      const primerTorneoCorregido = Boolean(
        resultadoAnterior && j.torneosJugados === 1 && j.primerTorneoPuntos === resultadoAnterior.puntos
      );
      const establecerPrimerTorneo = !otrosTorneosCerrados && (j.torneosJugados === 0 || primerTorneoCorregido);
      const valorActual = typeof j.valorFantasy === 'number' ? j.valorFantasy : 1.5;
      // 100 puntos mantienen el valor; superar o no alcanzar esa marca lo mueve.
      const variacionFantasy = resultadoAnterior
        ? diferenciaPuntos / 100
        : (pts - 100) / 100;
      const valorFantasy = Math.max(0.5, Number((valorActual + variacionFantasy).toFixed(1)));

      return {
        ...j,
        puntosTorneos: j.puntosTorneos + diferenciaPuntos,
        torneosJugados: j.torneosJugados + (resultadoAnterior ? 0 : 1),
        fantasyPuntos: (j.fantasyPuntos ?? 0) + diferenciaPuntos,
        primerTorneoPuntos: establecerPrimerTorneo ? pts : j.primerTorneoPuntos,
        valorFantasy
      };
    }));

    setMensajeExito(resultadoAnterior
      ? `Resultado actualizado: ${cierreJugador} tiene ${pts} puntos en este evento.`
      : `¡${pts} puntos asignados a ${cierreJugador} en ${evento.titulo}!`);
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
  const ladoDeJugador = (nombre: string) => {
    const jugador = ranking.find((j) => j.nombre === nombre);
    if (jugador && ladoPorJugador[jugador.id]) return ladoPorJugador[jugador.id];
    return jugador?.lado || (nombre === miPerfil.nombreCompleto ? miPerfil.lado : 'derecha');
  };

  const ordenarParejaPorLado = (
    pareja: string[],
    ladosPorNombre: Record<string, 'derecha' | 'reves'> = {}
  ) => {
    const copia = [...pareja];
    if (copia.length !== 2) return copia;
    const [a, b] = copia;
    const la = ladosPorNombre[a] || ladoDeJugador(a);
    const lb = ladosPorNombre[b] || ladoDeJugador(b);
    if (la === 'derecha' && lb === 'reves') return [a, b];
    if (la === 'reves' && lb === 'derecha') return [b, a];
    return copia;
  };

  const clasePosicionPista = (
    indice: number,
    jugadores: string[],
    ladosDelPartido: Record<string, 'derecha' | 'reves'> = {}
  ) => {
    const nombre = jugadores[indice];
    const esParejaA = indice < 2;
    const esDerecha = nombre
      ? (ladosDelPartido[nombre] || ladoDeJugador(nombre)) === 'derecha'
      : indice % 2 === 0;
    // Desde cada fondo, derecha y revés quedan en posiciones opuestas.
    const vaArriba = esParejaA ? !esDerecha : esDerecha;
    const horizontal = esParejaA ? 'left-[17%]' : 'right-[17%]';
    return `${horizontal} ${vaArriba ? 'top-[27%]' : 'top-[73%]'}`;
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

  // Fantasy: un jugador no aparece en el mercado hasta haber disputado
  // al menos un torneo y tener un valor Fantasy calculado.
  // El valor mínimo es 0,5 M y el presupuesto inicial de cada usuario es 10 M.
  const fantasyJugadores = ranking
    .filter((j) => j.torneosJugados > 0 && typeof j.valorFantasy === 'number')
    .map((j) => ({
      ...j,
      valor: Math.max(0.5, Number(j.valorFantasy)),
      fantasyPts: j.fantasyPuntos ?? j.puntosTorneos,
    }));
  // Solo se muestran jugadores con al menos un torneo disputado.
  const fantasyMercado = fantasyJugadores;
  const fantasySeleccionados = fantasyJugadores.filter(j => fantasyEquipo.includes(j.id));
  const fantasyGastado = fantasySeleccionados.reduce((sum, j) => sum + j.valor, 0);
  const fantasySaldo = fantasyPresupuesto - fantasyGastado;
  const fantasyPts = fantasySeleccionados.reduce((sum, j) => sum + j.fantasyPts, 0);
  const eventosConMiInscripcion = eventos.filter(ev => Boolean(miInscripcionEventoMap[ev.id]));
  const eventosDelTipoPartidos = eventosConMiInscripcion.filter(ev => ev.tipo === tipoPartidosFiltro);
  const eventoActivoValido = eventoSeleccionado && eventoSeleccionado.tipo === tipoPartidosFiltro ? eventoSeleccionado : null;
  const partidosDelEvento = eventoActivoValido ? (partidosEventoMap[eventoActivoValido.id] || []) : [];
  const partidosVisibles = partidosDelEvento.filter((p) =>
    [...(p.pareja1 || []), ...(p.pareja2 || [])].some(nombre =>
      nombre.trim().toLowerCase() === miPerfil.nombreCompleto.trim().toLowerCase()
    )
  );
  const eventosParaCierre = eventos.filter(ev => ev.tipo === cierreTipoEvento);
  const eventoCierreValido = eventosParaCierre.find(ev => ev.id === cierreEventoId) || eventosParaCierre[0] || null;
  const jugadoresEventoCierre = eventoCierreValido
    ? ranking.filter(j =>
        (participantesEventoMap[eventoCierreValido.id] || []).includes(j.id) &&
        (parejasEventoMap[eventoCierreValido.id] || []).some(pareja => pareja.includes(j.nombre))
      )
    : [];

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
      <div className="min-h-screen bg-[#f4f7f5] text-slate-900 font-sans p-5 w-full max-w-lg mx-auto flex flex-col justify-center items-center border-x border-slate-200 shadow-2xl">
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
      <div className="min-h-screen bg-[#f4f7f5] text-slate-900 font-sans p-5 w-full max-w-lg mx-auto flex flex-col justify-center items-center border-x border-slate-200 shadow-2xl">
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
    <div className="min-h-screen bg-[#eef3ef] text-slate-900 font-sans pb-32 w-full">
      {/* Marcador Superior */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md p-4 border-b-2 border-emerald-200 flex justify-between items-center shadow-lg mx-auto w-full max-w-6xl">
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

      <main className="mx-auto w-full max-w-6xl p-4 md:p-6 space-y-5">

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
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em]">Padel Arena</span>
                <h2 className="mt-3 text-3xl font-black leading-none tracking-tight">Donde empieza el próximo partido.</h2>
                <p className="mt-3 max-w-xl text-xs font-medium leading-relaxed text-white/75">Eventos, partidos, rankings y Fantasy en un solo sitio.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => setActiveTab('eventos')} className="rounded-xl bg-lime-300 px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-[#101b17]">Ver eventos</button>
                  <button onClick={() => setActiveTab('pistas')} className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-white">Mis partidos</button>
                  <button onClick={() => setActiveTab('fantasy')} className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-white">Fantasy</button>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"><span className="text-[9px] font-black uppercase text-slate-400">Eventos</span><b className="mt-1 block text-2xl font-black text-slate-900">{eventos.length}</b><span className="text-[9px] font-semibold text-emerald-600">activos</span></div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"><span className="text-[9px] font-black uppercase text-slate-400">Jugadores</span><b className="mt-1 block text-2xl font-black text-slate-900">{ranking.length}</b><span className="text-[9px] font-semibold text-emerald-600">en ranking</span></div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"><span className="text-[9px] font-black uppercase text-slate-400">Mis partidos</span><b className="mt-1 block text-2xl font-black text-slate-900">{partidosVisibles.length}</b><span className="text-[9px] font-semibold text-emerald-600">asignados</span></div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"><span className="text-[9px] font-black uppercase text-slate-400">Fantasy</span><b className="mt-1 block text-2xl font-black text-slate-900">{fantasyEquipo.length}/2</b><span className="text-[9px] font-semibold text-emerald-600">fichajes</span></div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => setActiveTab('eventos')} className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:-translate-y-0.5 transition">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Siguiente paso</span>
                <h3 className="mt-1 text-lg font-black text-slate-900">Encuentra tu próximo evento</h3>
                <p className="mt-1 text-xs text-slate-500">Apúntate a un pozo o torneo y después consulta tus partidos desde una única pantalla.</p>
              </button>
              <button onClick={() => setActiveTab('fantasy')} className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:-translate-y-0.5 transition">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Fantasy</span>
                <h3 className="mt-1 text-lg font-black text-slate-900">Gestiona tu equipo</h3>
                <p className="mt-1 text-xs text-slate-500">Empiezas con 10 M. Solo aparecen jugadores que ya hayan disputado un torneo.</p>
              </button>
            </section>
          </div>
        )}

        {/* PESTAÑA MIS PARTIDOS */}
        {activeTab === 'pistas' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Mi competición</p>
              <div className="mt-1 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Mis partidos</h2>
                  <p className="mt-1 text-xs text-slate-500">Consulta por separado tus partidos de Pozos y Torneos.</p>
                </div>
                <button onClick={() => setActiveTab('eventos')} className="self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase text-slate-600 shadow-sm">Ver eventos</button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
                {(['Pozo', 'Torneo'] as const).map((tipo) => {
                  const activo = tipoPartidosFiltro === tipo;
                  const cantidad = eventosConMiInscripcion.filter(ev => ev.tipo === tipo).length;
                  return (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => {
                        setTipoPartidosFiltro(tipo);
                        const primerEvento = eventosConMiInscripcion.find(ev => ev.tipo === tipo);
                        setEventoActivoId(primerEvento?.id ?? null);
                      }}
                      className={`rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wide transition-all ${activo ? (tipo === 'Pozo' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-amber-400 text-slate-900 shadow-sm') : 'text-slate-500 hover:bg-white'}`}
                    >
                      {tipo === 'Pozo' ? 'Pozos' : 'Torneos'} <span className="ml-1 opacity-70">{cantidad}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {eventosDelTipoPartidos.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">{tipoPartidosFiltro === 'Pozo' ? '🏟️' : '🏆'}</div>
                <h3 className="mt-3 text-base font-black text-slate-900">No estás inscrito en ningún {tipoPartidosFiltro.toLowerCase()}</h3>
                <p className="mt-1 text-xs text-slate-500">Ve a Eventos para apuntarte a un {tipoPartidosFiltro.toLowerCase()} y aparecerá aquí.</p>
                <button onClick={() => setActiveTab('eventos')} className="mt-4 rounded-xl bg-emerald-500 px-4 py-2.5 text-[10px] font-black uppercase text-white shadow-md">Ver eventos</button>
              </div>
            ) : (
              <>
                <div className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-sm">
                  <label className="mb-2 block text-[9px] font-black uppercase tracking-widest text-slate-500">Evento</label>
                  <select
                    value={eventoActivoValido?.id ?? ''}
                    onChange={(e) => setEventoActivoId(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-black text-slate-900 focus:border-emerald-400 focus:outline-none"
                  >
                    {eventosDelTipoPartidos.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.titulo}</option>
                    ))}
                  </select>
                  {eventoActivoValido && (
                    <p className="mt-2 text-[10px] text-slate-500">{eventoActivoValido.fecha} · {eventoActivoValido.club}</p>
                  )}
                </div>

                {eventoActivoValido && (
                  <>
                    <div className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className={`inline-flex rounded-full px-2 py-1 text-[9px] font-black uppercase ${eventoActivoValido.tipo === 'Pozo' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{eventoActivoValido.tipo}</span>
                          <h3 className="mt-2 text-lg font-black text-slate-900">{eventoActivoValido.titulo}</h3>
                          <p className="mt-1 text-[10px] text-slate-500">{eventoActivoValido.fecha} · {eventoActivoValido.club}</p>
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
                      const jugadores = [p.pareja1?.[0], p.pareja1?.[1], p.pareja2?.[0], p.pareja2?.[1]]
                        .filter((nombre): nombre is string => Boolean(nombre) && nombre !== 'DESCANSO' && nombre !== '__DESCANSO__');
                      return (
                        <article key={p.id} className="rounded-3xl border-2 border-emerald-200 bg-white p-4 shadow-lg">
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <div><span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">{p.fase === 'pozo' ? 'Pozo' : p.fase === 'grupos' ? 'Fase de grupos' : 'Eliminatoria'}</span><h3 className="mt-0.5 text-sm font-black text-slate-900">{p.nombre}</h3></div>
                              <div className="text-right">
                                {p.pista && <span className="block text-[9px] font-black uppercase text-emerald-700">Pista {p.pista}</span>}
                                <span className="mt-0.5 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-black text-slate-600">{p.hora}</span>
                              </div>
                          </div>
                          <div className="relative mx-auto w-full aspect-[16/9] max-w-[680px] overflow-hidden rounded-[22px] border-[7px] border-slate-300 bg-emerald-600 shadow-inner">
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:12px_12px]" />
                            <div className="absolute inset-[7%] rounded-lg border-2 border-white/95" />
                            <div className="absolute left-1/2 top-[7%] bottom-[7%] border-l-2 border-white/95" />
                            <div className="absolute left-[7%] right-[7%] top-1/2 border-t-2 border-white/95" />
                            <div className="absolute left-0 right-0 top-0 h-2 bg-slate-200/70 border-b border-slate-400/70" />
                            <div className="absolute left-0 right-0 bottom-0 h-2 bg-slate-200/70 border-t border-slate-400/70" />
                            <span className="absolute left-2 top-1 text-[7px] font-black tracking-widest text-white/80">PADEL · CRISTAL + MALLA</span>
                            {jugadores.map((name: string, i: number) => (
                              <button key={`${p.id}-${name}-${i}`} type="button" onClick={() => setJugadorSeleccionadoPista(i)} className={`absolute ${clasePosicionPista(i, jugadores, p.ladosPorJugador)} -translate-y-1/2 rounded-xl border-2 px-2.5 py-1.5 text-[8px] font-black shadow-lg transition-all ${jugadorSeleccionadoPista === i ? 'scale-110 border-lime-300 bg-white text-emerald-700' : 'border-white/90 bg-white/95 text-slate-900'}`}><span className="block max-w-[92px] truncate">{name}</span><span className="block text-[7px] text-emerald-700">{etiquetaLado(p.ladosPorJugador?.[name] || ladoDeJugador(name))}</span></button>
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
              const inscrito = Boolean(miInscripcionEventoMap[evento.id]);
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
                          <button onClick={() => { setTipoPartidosFiltro(evento.tipo as 'Pozo' | 'Torneo'); setEventoActivoId(evento.id); setActiveTab('pistas'); }} className="rounded-xl bg-slate-900 px-3 py-2 text-[10px] font-black uppercase text-white">Ver mis partidos</button>
                          {miInscripcionEventoMap[evento.id] && (
                            <button onClick={() => handleCancelarInscripcion(evento.id)} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] font-black uppercase text-rose-600">Borrarme</button>
                          )}
                        </div>
                      ) : (
                        <button onClick={() => {
  setEventoRegistrandoId(evento.id);
  setNombreParejaInput('');
  setModoInscripcion('pareja');
  setLadoInscripcion(miPerfil.lado);
  setLadoParejaInscripcion(miPerfil.lado === 'derecha' ? 'reves' : 'derecha');
}} className="rounded-xl bg-emerald-500 px-3 py-2 text-[10px] font-black uppercase text-white shadow-md">Apuntarme</button>
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
                          <>
                            <div className="flex gap-2">
                              <select
                                value={nombreParejaInput}
                                onChange={e => setNombreParejaInput(e.target.value)}
                                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900"
                              >
                              <option value="">Selecciona tu pareja</option>
                              {ranking
                                .filter(j => j.id !== (ranking.find(x => x.nombre.trim().toLowerCase() === miPerfil.nombreCompleto.trim().toLowerCase())?.id || ''))
                                .filter(j => !(participantesEventoMap[evento.id] || []).includes(j.id))
                                .map(j => (
                                  <option key={j.id} value={j.nombre}>{j.nombre}</option>
                                ))}
                              </select>
                              <button type="button" onClick={() => abrirInvitacionCompanero(evento.id)} className="shrink-0 rounded-xl bg-slate-900 px-3 py-2 text-[9px] font-black uppercase text-white">Invitar</button>
                            </div>
                            <p className="mt-1.5 text-[9px] font-semibold text-slate-500">
                              Selecciona un usuario registrado. Si no está en Padel Arena, puedes invitarlo directamente por WhatsApp.
                            </p>
                            <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-[9px] font-bold text-emerald-800">
                              💡 Se registrará primero y, una vez tenga cuenta, podrá seleccionarse como pareja. En la versión con BBDD la invitación quedará vinculada automáticamente al evento.
                            </div>
                          </>
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
                <div><span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Fantasy Padel</span><h2 className="mt-1 text-2xl font-black text-slate-900">Fíchalos. Véndelos. Compite.</h2><p className="mt-1 text-xs text-slate-500">Empiezas con 10 M y puedes fichar hasta 2 jugadores que ya hayan disputado un torneo. Con 100 puntos el valor se mantiene; por encima sube y por debajo baja, hasta un mínimo de 0,5 M.</p></div>
                <div className="text-right shrink-0"><span className="block text-2xl font-black text-emerald-600">{fantasyPts}</span><span className="text-[9px] uppercase font-bold text-slate-400">pts Fantasy</span></div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-slate-50 p-3"><span className="block text-[9px] font-black uppercase text-slate-400">Presupuesto inicial</span><b className="mt-1 block text-lg text-slate-900">10,0 M</b><span className="text-[9px] text-slate-500">Disponible: {fantasySaldo.toFixed(1)} M</span></div>
                <div className="rounded-2xl bg-emerald-50 p-3"><span className="block text-[9px] font-black uppercase text-emerald-600">Plazas de equipo</span><b className="mt-1 block text-lg text-emerald-800">{fantasyEquipo.length}/2</b></div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3"><div><h3 className="font-black text-slate-900">Mi equipo</h3><p className="text-[10px] text-slate-500">Compra 2 jugadores para competir esta jornada.</p></div><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black text-slate-600">{fantasyEquipo.length}/2</span></div>
              {fantasySeleccionados.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center"><div className="text-2xl">🏓</div><p className="mt-1 text-xs font-black text-slate-800">Aún no tienes jugadores</p><p className="text-[10px] text-slate-500">Los fichajes se desbloquean cuando el jugador ya ha disputado su primer torneo.</p></div>
              ) : (
                <div className="space-y-2">{fantasySeleccionados.map(j => <div key={j.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><div><b className="block text-xs text-slate-900">{j.nombre}</b><span className="text-[9px] font-bold text-slate-500">{j.lado === 'derecha' ? 'Derecha' : 'Revés'} · {j.fantasyPts} pts</span></div><div className="flex items-center gap-2"><div className="text-right"><b className="block text-xs text-emerald-700">{j.valor.toFixed(1)} M</b><span className="block text-[8px] font-bold text-slate-400">valor</span></div><button onClick={() => handleVenderFantasy(j.id)} className="rounded-lg bg-white border border-slate-200 px-2 py-1 text-[9px] font-black uppercase text-slate-600 hover:border-red-200 hover:text-red-600">Vender</button></div></div>)}</div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between"><div><h3 className="font-black text-slate-900">Mercado de hoy</h3><p className="mt-1 text-[10px] text-slate-500">Solo salen jugadores que ya han disputado un torneo. 100 puntos mantienen el valor y el resto de resultados lo ajustan.</p></div><span className="text-[9px] font-black uppercase text-emerald-600">Compra / venta</span></div>
              <div className="mt-3 space-y-2">{fantasyMercado.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-xs font-bold text-slate-500">Todavía no hay jugadores con un torneo disputado. Aparecerán aquí al cerrar su primer torneo.</div> : fantasyMercado.map(j => { const elegido=fantasyEquipo.includes(j.id); const puedeComprar=!elegido && fantasyEquipo.length<2 && fantasySaldo>=j.valor; return <div key={j.id} className="flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3"><div className="min-w-0"><div className="flex items-center gap-2"><b className="text-xs truncate text-slate-900">{j.nombre}</b><span className="text-[8px] font-black uppercase text-slate-400">{j.lado}</span></div><div className="mt-1 flex gap-3 text-[9px] text-slate-500"><span>{j.fantasyPts} pts Fantasy</span><span>1.º torneo: {j.primerTorneoPuntos ?? 0} pts</span></div></div><div className="flex items-center gap-2 shrink-0"><div className="text-right"><b className="block text-xs text-slate-900">{j.valor.toFixed(1)} M</b><span className="block text-[8px] font-bold text-slate-400">valor</span></div>{elegido ? <button onClick={() => handleVenderFantasy(j.id)} className="rounded-xl bg-white border border-slate-200 px-2.5 py-1.5 text-[9px] font-black uppercase text-red-600">Vender</button> : <button disabled={!puedeComprar} onClick={() => handleComprarFantasy(j.id)} className={`rounded-xl px-2.5 py-1.5 text-[9px] font-black uppercase ${puedeComprar ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Fichar</button>}</div></div> })}</div>
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
                          onChange={(e) => {
                            const tipo = e.target.value as 'Pozo' | 'Torneo';
                            const primerEvento = eventos.find(ev => ev.tipo === tipo);
                            const primerJugador = primerEvento
                              ? ranking.find(j => (participantesEventoMap[primerEvento.id] || []).includes(j.id))
                              : undefined;
                            setCierreTipoEvento(tipo);
                            setCierreEventoId(primerEvento?.id ?? null);
                            setCierreJugador(primerJugador?.nombre ?? '');
                          }}
                          className="w-full bg-[#f4f7f5] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                        >
                          <option value="Pozo">Pozo</option>
                          <option value="Torneo">Torneo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Evento</label>
                        <select
                          value={eventoCierreValido?.id ?? ''}
                          onChange={(e) => {
                            const eventoId = Number(e.target.value);
                            const jugador = ranking.find(j => (participantesEventoMap[eventoId] || []).includes(j.id));
                            setCierreEventoId(eventoId || null);
                            setCierreJugador(jugador?.nombre ?? '');
                          }}
                          className="w-full bg-[#f4f7f5] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold truncate"
                        >
                          {!eventosParaCierre.length && <option value="">No hay eventos de este tipo</option>}
                          {eventosParaCierre.map((ev) => (
                            <option key={ev.id} value={ev.id}>{ev.titulo}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Jugador inscrito en el evento</label>
                      <select
                        value={jugadoresEventoCierre.some(j => j.nombre === cierreJugador) ? cierreJugador : ''}
                        onChange={(e) => setCierreJugador(e.target.value)}
                        disabled={jugadoresEventoCierre.length === 0}
                        className="w-full bg-[#f4f7f5] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold truncate disabled:opacity-60"
                      >
                        {!jugadoresEventoCierre.length && <option value="">No hay jugadores inscritos todavía</option>}
                        {jugadoresEventoCierre.map((j) => (
                            <option key={j.id} value={j.nombre}>{j.nombre}</option>
                        ))}
                      </select>
                    </div>

                    {cierreTipoEvento === 'Pozo' ? (
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Pista Final en el Pozo</label>
                        <select
                          value={cierrePista}
                          onChange={(e) => setCierrePista(e.target.value)}
                          className="w-full bg-[#f4f7f5] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                        >
                          <option value="1">Pista 1 - 100 pts</option>
                          <option value="2">Pista 2 - 75 pts</option>
                          <option value="3">Pista 3 - 50 pts</option>
                          <option value="4">Pista 4 - 25 pts</option>
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

                    <button
                      type="submit"
                      disabled={!eventoCierreValido || jugadoresEventoCierre.length === 0}
                      className="w-full rounded-2xl bg-emerald-500 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all active:scale-95 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
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

      {mostrarInvitacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div><span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">Invitar compañero</span><h3 className="mt-1 text-xl font-black text-slate-900">Que se una a tu pareja</h3><p className="mt-1 text-[10px] text-slate-500">Le enviaremos un enlace para registrarse en Padel Arena y poder jugar contigo.</p></div>
              <button type="button" onClick={() => setMostrarInvitacion(false)} className="rounded-xl border border-slate-200 p-2 text-slate-500"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <input value={invitacionNombre} onChange={e => setInvitacionNombre(e.target.value)} placeholder="Nombre del compañero" className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-900" />
              <input value={invitacionTelefono} onChange={e => setInvitacionTelefono(e.target.value)} placeholder="Teléfono (opcional)" inputMode="tel" className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-900" />
              <button type="button" onClick={enviarInvitacionCompanero} className="w-full rounded-xl bg-emerald-500 px-3 py-3 text-[10px] font-black uppercase text-white">Invitar por WhatsApp</button>
              {invitacionTextoGenerado && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(invitacionTextoGenerado);
                      setMensajeExito('Invitación copiada. Puedes pegarla en WhatsApp.');
                      setTimeout(() => setMensajeExito(''), 3000);
                    } catch {
                      setMensajeExito('No se pudo copiar automáticamente. Selecciona y copia el texto.');
                      setTimeout(() => setMensajeExito(''), 3500);
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-[10px] font-black uppercase text-slate-700"
                >
                  Copiar invitación
                </button>
              )}
              {invitacionTextoGenerado && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[9px] leading-relaxed text-slate-500 whitespace-pre-wrap">
                  {invitacionTextoGenerado}
                </div>
              )}
              <p className="text-[9px] text-slate-400">El botón abre WhatsApp en otra pestaña. Si tu navegador lo bloquea, usa "Copiar invitación".</p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-6xl px-4 pb-4 pt-1 text-center">
        <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">PADEL ARENA · Eventos · Partidos · Ranking · Fantasy</span>
      </div>

      {/* Navegación Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/96 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_30px_rgba(15,23,42,.06)] p-2 z-40">
        <div className="mx-auto flex max-w-6xl justify-around items-center gap-0.5">
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
