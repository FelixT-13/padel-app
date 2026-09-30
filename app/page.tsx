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
    plazas_totales: 16,
    plazas_ocupadas: 12,
    precioUnitario: 12,
  },
  {
    id: 2,
    titulo: 'Torneo otoño nivel 4',
    tipo: 'Torneo',
    fecha: '24-26 Oct • Cat. Abierta',
    club: 'Pádel Indoor Madrid',
    plazas_totales: 12,
    plazas_ocupadas: 8,
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
  
  const [eventoRegistrandoId, setEventoRegistrandoId] = useState<number | null>(null);
  const [nombreParejaInput, setNombreParejaInput] = useState('');
  const [ladoInscripcion, setLadoInscripcion] = useState<'derecha' | 'reves'>('derecha');
  const [ladoParejaInscripcion, setLadoParejaInscripcion] = useState<'derecha' | 'reves'>('reves');

  const [eventoActivoId, setEventoActivoId] = useState<number | null>(null);
  const [tipoRanking, setTipoRanking] = useState<'pozos' | 'torneos'>('pozos');
  const [faseTorneo, setFaseTorneo] = useState<'grupos' | 'principal' | 'consolacion'>('grupos');

  // Seguridad Organizador
  const [pinAdmin, setPinAdmin] = useState('');
  const [esOrganizador, setEsOrganizador] = useState(false);
  const [errorPin, setErrorPin] = useState(false);

  // Eventos
  const [eventos, setEventos] = useState(EVENTOS_INICIALES);
  const [nuevoTituloEvento, setNuevoTituloEvento] = useState('');
  const [nuevoTipoEvento, setNuevoTipoEvento] = useState('Pozo');
  const [nuevoClubEvento, setNuevoClubEvento] = useState('Club Pádel Center');
  const [nuevoPrecioEvento, setNuevoPrecioEvento] = useState('12');

  const [pistas, setPistas] = useState([
    { numero: 1, nombre: 'Pista 1 • Central', parej1: ['Felix Gomez', 'Lidia Martin'], pareja2: ['Angel Ruiz', 'Rober Sanchez'] },
    { numero: 2, nombre: 'Pista 2', parej1: ['Jugador 5', 'Jugador 6'], pareja2: ['Jugador 7', 'Jugador 8'] },
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
    setMensajeExito(`¡Bienvenido/a, ${miPerfil.nombreCompleto}! 🎾`);
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleLoginOrganizador = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinAdmin === '1234') {
      setEsOrganizador(true);
      setErrorPin(false);
      setPinAdmin('');
    } else {
      setErrorPin(true);
    }
  };

  const handleConfirmarInscripcion = (eventoId: number) => {
    const parejaNombre = nombreParejaInput.trim();
    if (!parejaNombre) return;

    setMiPerfil(prev => ({ ...prev, lado: ladoInscripcion }));
    setRanking(prev => prev.map(j =>
      j.nombre.toLowerCase() === miPerfil.nombreCompleto.toLowerCase()
        ? { ...j, lado: ladoInscripcion }
        : j.nombre.toLowerCase() === parejaNombre.toLowerCase()
          ? { ...j, lado: ladoParejaInscripcion }
          : j
    ));

    setInscritosMap(prev => ({ ...prev, [eventoId]: parejaNombre }));
    const parejaJugador = ranking.find((j) => j.nombre.toLowerCase() === parejaNombre.toLowerCase());
    const miJugador = ranking.find((j) => j.nombre.toLowerCase() === miPerfil.nombreCompleto.toLowerCase());
    setParticipantesEventoMap(prev => ({
      ...prev,
      [eventoId]: Array.from(new Set([...(prev[eventoId] || []), miJugador?.id, parejaJugador?.id].filter(Boolean) as string[]))
    }));
    setEventoRegistrandoId(null);
    setNombreParejaInput('');
    setMensajeExito(`¡Inscripción confirmada! ${miPerfil.nombreCompleto}: ${ladoInscripcion === 'derecha' ? 'Derecha' : 'Revés'} · ${parejaNombre}: ${ladoParejaInscripcion === 'derecha' ? 'Derecha' : 'Revés'}`);
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
    const copia = { ...inscritosMap };
    delete copia[eventoId];
    setInscritosMap(copia);
    setParticipantesEventoMap(prev => {
      const next = { ...prev };
      delete next[eventoId];
      return next;
    });
    if (eventoActivoId === eventoId) setEventoActivoId(null);
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
      plazas_totales: 16,
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
    return jugador?.lado || (nombre === miPerfil.nombreCompleto ? miPerfil.lado : 'derecha');
  };

  const ordenarParejaPorLado = (pareja: string[]) => {
    const copia = [...pareja];
    return copia.sort((a, b) => {
      const la = ladoDeJugador(a);
      const lb = ladoDeJugador(b);
      return la === 'derecha' ? -1 : lb === 'derecha' ? 1 : 0;
    });
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

  const handleMezclarPistas = () => {
    const nombres = ranking.map((r) => r.nombre).filter(n => n !== miPerfil.nombreCompleto && n !== parejaInscritaActual);
    const mezclados = [...nombres];
    for (let i = mezclados.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mezclados[i], mezclados[j]] = [mezclados[j], mezclados[i]];
    }

    setPistas([
      { numero: 1, nombre: 'Pista 1 • Central', parej1: ordenarParejaPorLado([miPerfil.nombreCompleto || 'Felix Gomez', parejaInscritaActual]), pareja2: ordenarParejaPorLado([mezclados[0] || 'Angel Ruiz', mezclados[1] || 'Rober Sanchez']) },
      { numero: 2, nombre: 'Pista 2', parej1: ordenarParejaPorLado([mezclados[2] || 'Jugador A', mezclados[3] || 'Jugador B']), pareja2: ordenarParejaPorLado([mezclados[4] || 'Jugador C', mezclados[5] || 'Jugador D']) },
    ]);
  };

  const compartirEvento = (evento: any) => {
    const texto = `🎾 *${evento.titulo.toUpperCase()}* 🎾\n📅 ${evento.fecha}\n📍 ${evento.club}\n\n👉 ¡Apúntate desde Padel Arena!`;
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
  const fantasySeleccionados = fantasyJugadores.filter(j => fantasyEquipo.includes(j.id));
  const fantasyGastado = fantasySeleccionados.reduce((sum, j) => sum + j.valor, 0);
  const fantasySaldo = fantasyPresupuesto - fantasyGastado;
  const fantasyPts = fantasySeleccionados.reduce((sum, j) => sum + j.fantasyPts, 0);
  const partidosVisibles = pistas.filter((p) => {
    const nombres = [...p.parej1, ...p.pareja2];
    if (esOrganizador) return true;
    return Boolean(miPerfil.nombreCompleto) && nombres.includes(miPerfil.nombreCompleto);
  });

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
            <p className="text-xs text-slate-500">Introduce tus credenciales de acceso</p>
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
              Completa tu Perfil de Jugador
            </h1>
            <p className="text-xs text-slate-500">Necesitamos estos datos para las inscripciones y torneos</p>
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
          <button onClick={() => setActiveTab('admin')} className="h-9 w-9 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center shadow-sm active:scale-95" title="Organizador">
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
            <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-600 via-emerald-500 to-lime-400 p-5 text-white shadow-xl">
              <div className="relative z-10 max-w-[75%]">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Padel Arena</div>
                <h2 className="mt-1 text-3xl font-black leading-none">Juega. Compite. Repite. 🟢</h2>
                <p className="mt-2 text-xs font-semibold text-white/85">Tus eventos, tus partidos, tu ranking y tu Fantasy en un solo sitio.</p>
                <button onClick={() => setActiveTab('eventos')} className="mt-4 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-emerald-700 shadow-lg active:scale-95">Ver próximos eventos →</button>
              </div>
              <div className="absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-white/15" />
              <div className="absolute right-5 top-5 text-6xl rotate-12">🎾</div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveTab('pistas')} className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:-translate-y-0.5 transition">
                <div className="text-2xl">🏟️</div><div className="mt-2 text-sm font-black">Partidos</div><div className="text-[10px] text-slate-500">Entra en la pista</div>
              </button>
              <button onClick={() => setActiveTab('fantasy')} className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:-translate-y-0.5 transition">
                <div className="text-2xl">🧠</div><div className="mt-2 text-sm font-black">Fantasy</div><div className="text-[10px] text-slate-500">Crea tu equipo</div>
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
                    const jugadores = [p.parej1[0], p.parej1[1], p.pareja2[0], p.pareja2[1]];
                    return (
                      <div key={p.numero} className="space-y-2">
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
              {partidosVisibles.length > 0 && <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-center"><span className="text-[9px] font-bold uppercase text-slate-400">Jugador seleccionado</span><b className="mt-0.5 block text-sm">{[...(partidosVisibles[0]?.parej1 || []), ...(partidosVisibles[0]?.pareja2 || [])][jugadorSeleccionadoPista] || miPerfil.nombreCompleto}</b><p className="text-[10px] text-slate-500">Lado: <strong>{ladoDeJugador([...(partidosVisibles[0]?.parej1 || []), ...(partidosVisibles[0]?.pareja2 || [])][jugadorSeleccionadoPista] || miPerfil.nombreCompleto)}</strong></p></div>}
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
                      <button
                        onClick={handleMezclarPistas}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
                      >
                        <Shuffle className="w-3.5 h-3.5" /> Sortear
                      </button>
                    </div>

                    {partidosVisibles.map((p) => {
                      const pareja1Actual = (p.numero === 1) ? [miPerfil.nombreCompleto, parejaInscritaActual] : p.parej1;

                      return (
                        <div key={p.numero} className="bg-white/90 border-2 border-emerald-200 rounded-3xl p-4 space-y-3 shadow-xl">
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
                    <div className="grid grid-cols-3 gap-1 bg-[#f4f7f5] p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setFaseTorneo('grupos')}
                        className={`py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${
                          faseTorneo === 'grupos' ? 'bg-emerald-500 text-white' : 'text-slate-500'
                        }`}
                      >
                        📊 Grupos
                      </button>
                      <button
                        onClick={() => setFaseTorneo('principal')}
                        className={`py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${
                          faseTorneo === 'principal' ? 'bg-amber-400 text-white' : 'text-slate-500'
                        }`}
                      >
                        🏆 Principal
                      </button>
                      <button
                        onClick={() => setFaseTorneo('consolacion')}
                        className={`py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${
                          faseTorneo === 'consolacion' ? 'bg-emerald-400 text-white' : 'text-slate-500'
                        }`}
                      >
                        🛡️ Consolación
                      </button>
                    </div>

                    {faseTorneo === 'grupos' && (
                      <div className="space-y-3">
                        <div className="bg-white/90 border-2 border-emerald-200 rounded-3xl p-4 space-y-3 shadow-xl">
                          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <span className="text-xs font-black text-emerald-700 uppercase">Grupo A (Liguilla)</span>
                            <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded">Mín. 3 partidos</span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center bg-[#f4f7f5] p-2.5 rounded-xl">
                              <span className="font-bold text-slate-900">1. {miPerfil.nombreCompleto} & {parejaInscritaActual}</span>
                              <span className="text-emerald-700 font-mono font-bold">2 PJ • 6 pts</span>
                            </div>
                            <div className="flex justify-between items-center bg-[#f4f7f5] p-2.5 rounded-xl">
                              <span className="font-bold text-slate-900">2. Angel Ruiz & Rober Sanchez</span>
                              <span className="text-emerald-700 font-mono font-bold">2 PJ • 4 pts</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {faseTorneo === 'principal' && (
                      <div className="bg-white/90 border-2 border-amber-400/40 rounded-3xl p-4 space-y-3 shadow-xl">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <span className="text-xs font-black text-amber-300 uppercase flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" /> Cuadro Principal
                          </span>
                        </div>
                        <div className="space-y-3 text-xs">
                          <div className="bg-[#f4f7f5] p-3 rounded-xl border border-slate-200 space-y-1">
                            <span className="text-[9px] text-amber-300 font-bold uppercase block">Semifinal 1</span>
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>{miPerfil.nombreCompleto} & {parejaInscritaActual} vs Pareja C</span>
                              <span className="text-emerald-600 font-mono">Sáb 12:00</span>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-amber-500/20 to-blue-500/20 p-3 rounded-xl border border-amber-400/40 space-y-1 text-center">
                            <span className="text-[10px] text-amber-300 font-black uppercase block">🏆 GRAN FINAL PRINCIPAL</span>
                            <p className="font-bold text-slate-900">Lucha por el título de Campeones</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {faseTorneo === 'consolacion' && (
                      <div className="bg-white/90 border-2 border-emerald-400/40 rounded-3xl p-4 space-y-3 shadow-xl">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <span className="text-xs font-black text-emerald-300 uppercase flex items-center gap-1">
                            <GitBranch className="w-3.5 h-3.5" /> Cuadro de Consolación
                          </span>
                        </div>
                        <div className="space-y-3 text-xs">
                          <p className="text-[11px] text-emerald-700">Garantiza el mínimo de 4 partidos disputados por pareja.</p>
                          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-500/30 space-y-1 text-center">
                            <span className="text-[10px] text-emerald-300 font-black uppercase block">🛡️ FINAL DE CONSOLACIÓN</span>
                            <p className="font-bold text-slate-900">Lucha por el título secundario</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                      <span className="text-[10px] font-bold text-slate-600">{evento.plazas_ocupadas}/{evento.plazas_totales} plazas ocupadas</span>
                      {inscrito ? (
                        <button onClick={() => { setEventoActivoId(evento.id); setActiveTab('pistas'); }} className="rounded-xl bg-slate-900 px-3 py-2 text-[10px] font-black uppercase text-white">Ver mis partidos</button>
                      ) : (
                        <button onClick={() => { setEventoRegistrandoId(evento.id); setLadoInscripcion(miPerfil.lado); setLadoParejaInscripcion(miPerfil.lado === 'derecha' ? 'reves' : 'derecha'); }} className="rounded-xl bg-emerald-500 px-3 py-2 text-[10px] font-black uppercase text-white shadow-md">Apuntarme</button>
                      )}
                    </div>
                    {eventoRegistrandoId === evento.id && (
                      <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 space-y-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Inscripción al {evento.tipo}</p>
                          <p className="mt-1 text-[10px] text-slate-600">Indica el lado de cada jugador para que el organizador pueda colocarlos correctamente en pista.</p>
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
                        <input value={nombreParejaInput} onChange={e => setNombreParejaInput(e.target.value)} placeholder="Nombre de tu pareja" className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400" />
                        <div className="flex gap-2">
                          <button onClick={() => handleConfirmarInscripcion(evento.id)} className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-[10px] font-black uppercase text-white">Confirmar inscripción</button>
                          <button onClick={() => { setEventoRegistrandoId(null); setNombreParejaInput(''); }} className="rounded-xl bg-white px-3 py-2 text-[10px] font-black uppercase text-slate-600 border border-slate-200">Cancelar</button>
                        </div>
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
                <div><span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Fantasy Padel</span><h2 className="mt-1 text-2xl font-black text-slate-900">Fíchalos. Véndelos. Compite.</h2><p className="mt-1 text-xs text-slate-500">Tu equipo tiene solo 2 jugadores. Compra con tu presupuesto y vende para recuperar saldo.</p></div>
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
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center"><div className="text-2xl">🎾</div><p className="mt-1 text-xs font-black text-slate-800">Aún no tienes jugadores</p><p className="text-[10px] text-slate-500">Fícha jugadores de eventos en los que ya participan.</p></div>
              ) : (
                <div className="space-y-2">{fantasySeleccionados.map(j => <div key={j.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><div><b className="block text-xs text-slate-900">{j.nombre}</b><span className="text-[9px] font-bold text-slate-500">{j.lado === 'derecha' ? 'Derecha' : 'Revés'} · {j.fantasyPts} pts</span></div><div className="flex items-center gap-2"><b className="text-xs text-emerald-700">{j.valor}M</b><button onClick={() => handleVenderFantasy(j.id)} className="rounded-lg bg-white border border-slate-200 px-2 py-1 text-[9px] font-black uppercase text-slate-600 hover:border-red-200 hover:text-red-600">Vender</button></div></div>)}</div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between"><div><h3 className="font-black text-slate-900">Mercado de jugadores</h3><p className="mt-1 text-[10px] text-slate-500">Solo jugadores que ya participan en eventos. El precio se basa en su rendimiento.</p></div><span className="text-[9px] font-black uppercase text-emerald-600">Compra / venta</span></div>
              <div className="mt-3 space-y-2">{fantasyJugadores.map(j => { const elegido=fantasyEquipo.includes(j.id); const puedeComprar=!elegido && fantasyEquipo.length<2 && fantasySaldo>=j.valor; return <div key={j.id} className="flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3"><div className="min-w-0"><div className="flex items-center gap-2"><b className="text-xs truncate text-slate-900">{j.nombre}</b><span className="text-[8px] font-black uppercase text-slate-400">{j.lado}</span></div><div className="mt-1 flex gap-3 text-[9px] text-slate-500"><span>{j.fantasyPts} pts</span><span>Nivel {j.nivel.toFixed(1)}</span></div></div><div className="flex items-center gap-2 shrink-0"><b className="text-xs text-slate-900">{j.valor}M</b>{elegido ? <button onClick={() => handleVenderFantasy(j.id)} className="rounded-xl bg-white border border-slate-200 px-2.5 py-1.5 text-[9px] font-black uppercase text-red-600">Vender</button> : <button disabled={!puedeComprar} onClick={() => handleComprarFantasy(j.id)} className={`rounded-xl px-2.5 py-1.5 text-[9px] font-black uppercase ${puedeComprar ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Fichar</button>}</div></div> })}</div>
            </div>
          </div>
        )}

        {/* PESTAÑA ADMIN */}
        {activeTab === 'admin' && (
          <div className="space-y-5">
            {!esOrganizador ? (
              <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Acceso Restringido</h3>
                  <p className="text-xs text-slate-500 mt-1">Introduce el PIN de organizador (1234).</p>
                </div>

                <form onSubmit={handleLoginOrganizador} className="space-y-3 pt-2">
                  <input
                    type="password"
                    placeholder="PIN (1234)"
                    value={pinAdmin}
                    onChange={(e) => setPinAdmin(e.target.value)}
                    className="w-full bg-[#f4f7f5] border border-slate-200 rounded-2xl p-3 text-center text-lg font-black text-slate-900 tracking-widest focus:outline-none focus:border-cyan-400"
                  />
                  {errorPin && (
                    <p className="text-xs font-bold text-rose-400">PIN incorrecto (prueba con 1234)</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg"
                  >
                    Desbloquear Panel
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <Unlock className="w-4 h-4 text-emerald-600" /> Modo Organizador Activo
                  </span>
                  <button 
                    onClick={() => setEsOrganizador(false)}
                    className="text-xs text-rose-300 font-bold bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20"
                  >
                    Bloquear
                  </button>
                </div>

                <div className="bg-white/90 border-2 border-emerald-200 p-4 rounded-3xl space-y-4 shadow-xl">
                  <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" /> Crear Nuevo Evento
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
                    <span className="text-[10px] uppercase font-extrabold text-emerald-700 block">Eventos Activos (Borrar)</span>
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
                    <Award className="w-4 h-4 text-emerald-600" /> Cierre de Puntos & Clasificación
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

      {/* Navegación Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t-2 border-emerald-200 p-2 max-w-md mx-auto z-40">
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