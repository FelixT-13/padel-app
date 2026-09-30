'use client';

import React, { useState } from 'react';
import { 
  Calendar, Trophy, User, Settings, Users, Home, 
  MapPin, Award, Plus, Shuffle, Share2, 
  CheckCircle2, Flame, Sparkles, Shield, Trash2, Layers, Lock, Unlock, GitBranch, ArrowLeft, Eye, X, LogOut, LogIn, Phone, Hash
} from 'lucide-react';

const EVENTOS_INICIALES = [
  {
    id: 1,
    titulo: 'Pozo Sube-Baja Fin de Semana',
    tipo: 'Pozo',
    fecha: 'Sábado, 11 Oct • 10:00h',
    club: 'Club Pádel Center',
    plazas_totales: 16,
    plazas_ocupadas: 12,
    precioUnitario: 12,
  },
  {
    id: 2,
    titulo: 'Torneo Express Club',
    tipo: 'Torneo',
    fecha: '24-26 Oct • Cat. Abierta',
    club: 'Pádel Indoor Madrid',
    plazas_totales: 12,
    plazas_ocupadas: 8,
    precioUnitario: 20,
  }
];

const JUGADORES_INICIALES = [
  { id: '1', nombre: 'Felix Gomez', telefono: '600123456', nivel: 4.0, pozos: 6, puntosPozos: 580, torneosJugados: 3, puntosTorneos: 340, racha: '3W' },
  { id: '2', nombre: 'Angel Ruiz', telefono: '611223344', nivel: 3.9, pozos: 5, puntosPozos: 490, torneosJugados: 2, puntosTorneos: 280, racha: '1W' },
  { id: '3', nombre: 'Lidia Martin', telefono: '622334455', nivel: 3.8, pozos: 5, puntosPozos: 460, torneosJugados: 4, puntosTorneos: 410, racha: '2W' },
  { id: '4', nombre: 'Rober Sanchez', telefono: '633445566', nivel: 3.5, pozos: 4, puntosPozos: 350, torneosJugados: 2, puntosTorneos: 210, racha: '1L' },
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
    club: 'Pádel Club Central'
  });

  const [activeTab, setActiveTab] = useState<'inicio' | 'eventos' | 'pistas' | 'rankings' | 'admin' | 'perfil'>('inicio');
  const [ranking, setRanking] = useState(JUGADORES_INICIALES);

  // Mapa de inscripciones: { [eventoId]: nombrePareja }
  const [inscritosMap, setInscritosMap] = useState<{[key: number]: string}>({ 1: 'Lidia Martin' });
  
  const [eventoRegistrandoId, setEventoRegistrandoId] = useState<number | null>(null);
  const [nombreParejaInput, setNombreParejaInput] = useState('');

  const [eventoActivoId, setEventoActivoId] = useState<number | null>(null);
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
  const [nuevoPlazasEvento, setNuevoPlazasEvento] = useState('16');
  const [nuevoFechaEvento, setNuevoFechaEvento] = useState('');

  // Participantes y sorteos: los datos del organizador alimentan partidos y ranking.
  const [participantesPorEvento, setParticipantesPorEvento] = useState<{[key: number]: string[]}>({
    1: ['Felix Gomez', 'Lidia Martin', 'Angel Ruiz', 'Rober Sanchez'],
    2: ['Felix Gomez', 'Lidia Martin', 'Angel Ruiz', 'Rober Sanchez'],
  });
  const [eventoOrganizadorId, setEventoOrganizadorId] = useState<number>(1);
  const [nuevoJugadorEvento, setNuevoJugadorEvento] = useState('');
  const [resultadosPartidos, setResultadosPartidos] = useState<{[key: string]: string}>({});

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
          racha: '-'
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

    setInscritosMap(prev => ({ ...prev, [eventoId]: parejaNombre }));
    setEventoRegistrandoId(null);
    setNombreParejaInput('');
    setMensajeExito(`¡Inscripción confirmada con ${parejaNombre}!`);
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleCancelarInscripcion = (eventoId: number) => {
    const copia = { ...inscritosMap };
    delete copia[eventoId];
    setInscritosMap(copia);
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
            return { ...j, puntosPozos: j.puntosPozos + pts, pozos: j.pozos + 1 };
          } else {
            return { ...j, puntosTorneos: j.puntosTorneos + pts, torneosJugados: j.torneosJugados + 1 };
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
      fecha: nuevoFechaEvento.trim() || 'Próxima fecha • Por definir',
      club: nuevoClubEvento,
      plazas_totales: parseInt(nuevoPlazasEvento) || 16,
      plazas_ocupadas: 0,
      precioUnitario: parseInt(nuevoPrecioEvento) || 10,
    };

    setEventos([...eventos, nuevoEv]);
    setParticipantesPorEvento(prev => ({ ...prev, [nuevoEv.id]: [] }));
    setEventoOrganizadorId(nuevoEv.id);
    setNuevoTituloEvento('');
    setNuevoFechaEvento('');
    setMensajeExito('¡Nuevo evento publicado!');
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleEliminarEvento = (id: number) => {
    setEventos(eventos.filter(ev => ev.id !== id));
    handleCancelarInscripcion(id);
  };

  const eventoSeleccionado = eventos.find(ev => ev.id === eventoActivoId);
  const parejaInscritaActual = eventoSeleccionado ? (inscritosMap[eventoSeleccionado.id] || 'Pareja') : 'Lidia Martin';

  const handleMezclarPistas = () => {
    const nombres = ranking.map((r) => r.nombre).filter(n => n !== miPerfil.nombreCompleto && n !== parejaInscritaActual);
    const mezclados = [...nombres].sort(() => Math.random() - 0.5);

    setPistas([
      {
        numero: 1,
        nombre: 'Pista 1 • Central',
        parej1: [miPerfil.nombreCompleto || 'Felix Gomez', parejaInscritaActual],
        pareja2: [mezclados[0] || 'Angel Ruiz', mezclados[1] || 'Rober Sanchez'],
      },
      {
        numero: 2,
        nombre: 'Pista 2',
        parej1: [mezclados[2] || 'Jugador A', mezclados[3] || 'Jugador B'],
        pareja2: [mezclados[4] || 'Jugador C', mezclados[5] || 'Jugador D'],
      },
    ]);
  };

  const compartirEvento = (evento: any) => {
    const texto = `🎾 *${evento.titulo.toUpperCase()}* 🎾\n📅 ${evento.fecha}\n📍 ${evento.club}\n\n👉 ¡Apúntate al evento!`;
    if (navigator.share) {
      navigator.share({ title: evento.titulo, text: texto, url: window.location.href }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
    }
  };

  const rankingOrdenado = [...ranking].sort((a, b) => (b.puntosPozos + b.puntosTorneos) - (a.puntosPozos + a.puntosTorneos));

  // 1. PANTALLA DE LOGIN NORMAL (USUARIO Y CONTRASEÑA)
  if (authStep === 'login') {
    return (
      <div className="min-h-screen bg-[#0b1727] text-slate-100 font-sans p-5 max-w-6xl mx-auto flex flex-col justify-center items-center border-x border-white/5 shadow-2xl">
        <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black tracking-wider text-white uppercase">
              Eventos de Pádel
            </h1>
            <p className="text-xs text-cyan-200">Introduce tus credenciales de acceso</p>
          </div>

          <div className="bg-white/[0.045] border-2 border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] text-cyan-200 font-bold uppercase mb-1.5">Usuario o Correo</label>
                <input
                  type="text"
                  placeholder="usuario@clubpadel.com"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                  className="w-full bg-[#0b1727] border border-cyan-900 rounded-2xl p-3.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-cyan-200 font-bold uppercase mb-1.5">Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  className="w-full bg-[#0b1727] border border-cyan-900 rounded-2xl p-3.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-lime-300 hover:bg-lime-200 text-slate-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
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
      <div className="min-h-screen bg-[#0b1727] text-slate-100 font-sans p-5 max-w-6xl mx-auto flex flex-col justify-center items-center border-x border-white/5 shadow-2xl">
        <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center space-y-2">
            <h1 className="text-xl font-black tracking-wider text-white uppercase">
              Completa tu Perfil de Jugador
            </h1>
            <p className="text-xs text-cyan-200">Necesitamos estos datos para las inscripciones y torneos</p>
          </div>

          {mensajeExito && (
            <div className="bg-rose-500 text-white p-3 rounded-2xl text-xs font-black text-center shadow-lg">
              {mensajeExito}
            </div>
          )}

          <div className="bg-white/[0.045] border-2 border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <form onSubmit={handleGuardarPerfilSetup} className="space-y-4">
              <div>
                <label className="block text-[11px] text-cyan-200 font-bold uppercase mb-1.5">Nombre y Apellido</label>
                <input
                  type="text"
                  placeholder="Ej: Carlos Gómez"
                  value={miPerfil.nombreCompleto}
                  onChange={(e) => setMiPerfil({...miPerfil, nombreCompleto: e.target.value})}
                  required
                  className="w-full bg-[#0b1727] border border-cyan-900 rounded-2xl p-3.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-cyan-200 font-bold uppercase mb-1.5">Número de Teléfono</label>
                <input
                  type="tel"
                  placeholder="Ej: 600123456"
                  value={miPerfil.telefono}
                  onChange={(e) => setMiPerfil({...miPerfil, telefono: e.target.value})}
                  required
                  className="w-full bg-[#0b1727] border border-cyan-900 rounded-2xl p-3.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-cyan-200 font-bold uppercase mb-1.5">Nivel en Playtomic</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ej: 3.8 o 4.0"
                  value={miPerfil.nivelPlaytomic}
                  onChange={(e) => setMiPerfil({...miPerfil, nivelPlaytomic: e.target.value})}
                  required
                  className="w-full bg-[#0b1727] border border-cyan-900 rounded-2xl p-3.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-lime-300 hover:bg-lime-200 text-slate-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-3"
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
    <div className="min-h-screen bg-[#07111f] text-slate-100 font-sans pb-32 max-w-7xl mx-auto relative border-x border-white/5 shadow-2xl overflow-hidden">
      <style>{`body { background: #07111f; } * { scrollbar-width: thin; scrollbar-color: #334155 transparent; }`}</style>
      <div className="pointer-events-none absolute inset-0 overflow-hidden"><div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-lime-300/10 blur-3xl" /><div className="absolute top-72 -left-40 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" /></div>
      {/* Marcador Superior */}
      <header className="sticky top-0 z-30 bg-[#07111f]/90 backdrop-blur-xl px-5 md:px-8 py-4 border-b border-white/10 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2.5">
          <div>
            <h1 className="text-base font-black tracking-wider text-white uppercase">
              PADEL ARENA
            </h1>
            <p className="text-[10px] text-cyan-200/80 font-medium">Jugador: <strong className="text-lime-300">{miPerfil.nombreCompleto}</strong></p>
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('perfil')}
          className="bg-white/5 border border-white/10 text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 active:scale-95 transition-all shadow-sm"
        >
          <User className="w-3.5 h-3.5 text-lime-300" /> {miPerfil.nombreCompleto.split(' ')[0]}
        </button>
      </header>

      <main className="relative z-10 p-4 md:p-8 lg:p-10 space-y-7">

        {mensajeExito && (
          <div className="bg-lime-300 text-slate-950 p-3 rounded-2xl text-xs font-black animate-bounce shadow-lg text-center">
            {mensajeExito}
          </div>
        )}
        
        {/* INICIO: actividad del jugador, sin duplicar el catálogo de eventos */}
        {activeTab === 'inicio' && (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-lime-300/15 via-cyan-400/10 to-transparent border border-lime-300/20 rounded-3xl p-5">
              <p className="text-[10px] text-lime-300 font-black uppercase tracking-widest">Mi actividad</p>
              <h2 className="text-2xl md:text-4xl font-black text-white mt-1 tracking-tight">Hola, {miPerfil.nombreCompleto || 'jugador'} 👋</h2>
              <p className="text-xs text-cyan-100 mt-1">Aquí verás lo que tienes pendiente. Para consultar todos los eventos, entra en Eventos.</p>
            </div>

            {eventoSeleccionado ? (
              <div className="bg-white/[0.045] border-2 border-white/10 rounded-3xl p-4 shadow-xl">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="text-[10px] text-lime-300 font-black uppercase tracking-wider">Próximo evento seleccionado</span>
                    <h3 className="text-base font-black text-white mt-1">{eventoSeleccionado.titulo}</h3>
                    <p className="text-xs text-cyan-200 mt-1">📍 {eventoSeleccionado.club} · {eventoSeleccionado.fecha}</p>
                  </div>
                  <span className="bg-lime-300 text-slate-950 text-[10px] font-black px-2 py-1 rounded-lg">{eventoSeleccionado.tipo}</span>
                </div>
                <button onClick={() => setActiveTab('pistas')} className="mt-4 w-full bg-lime-300 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase">Ver mis partidos</button>
              </div>
            ) : (
              <div className="bg-white/[0.045] border border-white/10 rounded-3xl p-5 text-center">
                <Calendar className="w-9 h-9 text-lime-300 mx-auto mb-2" />
                <h3 className="text-sm font-black text-white">Todavía no tienes un evento seleccionado</h3>
                <p className="text-xs text-cyan-200 mt-1">Explora el catálogo y apúntate al evento que quieras jugar.</p>
                <button onClick={() => setActiveTab('eventos')} className="mt-3 bg-lime-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs uppercase">Ver eventos</button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/[0.045] rounded-2xl p-3 border border-cyan-900"><span className="text-[9px] text-lime-300 uppercase font-bold">Puntos</span><strong className="block text-lg text-white mt-1">{(ranking.find(j => j.nombre === miPerfil.nombreCompleto)?.puntosPozos || 0) + (ranking.find(j => j.nombre === miPerfil.nombreCompleto)?.puntosTorneos || 0)}</strong></div>
              <div className="bg-white/[0.045] rounded-2xl p-3 border border-cyan-900"><span className="text-[9px] text-lime-300 uppercase font-bold">Pozos</span><strong className="block text-lg text-white mt-1">{ranking.find(j => j.nombre === miPerfil.nombreCompleto)?.pozos || 0}</strong></div>
              <div className="bg-white/[0.045] rounded-2xl p-3 border border-cyan-900"><span className="text-[9px] text-lime-300 uppercase font-bold">Torneos</span><strong className="block text-lg text-white mt-1">{ranking.find(j => j.nombre === miPerfil.nombreCompleto)?.torneosJugados || 0}</strong></div>
            </div>
          </div>
        )}

        {/* PESTAÑA EVENTOS */}
        {activeTab === 'eventos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black tracking-widest text-cyan-200 uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4 text-lime-300" /> DESCUBRE LOS PRÓXIMOS EVENTOS
              </h2>
            </div>

            <div className="space-y-4">
              {eventos.map((evento) => {
                const parejaInscrita = inscritosMap[evento.id];
                const isInscrito = !!parejaInscrita;
                const isPozo = evento.tipo === 'Pozo';
                const pct = Math.round((evento.plazas_ocupadas / evento.plazas_totales) * 100);
                const estaRegistrando = eventoRegistrandoId === evento.id;

                return (
                  <div key={evento.id} className="bg-white/[0.045] border-2 border-white/10 rounded-3xl p-4.5 space-y-3.5 relative overflow-hidden shadow-xl">
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                        isPozo 
                          ? 'bg-lime-300 text-slate-950 border-cyan-300 font-extrabold' 
                          : 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold'
                      }`}>
                        {evento.tipo}
                      </span>

                      <button onClick={() => compartirEvento(evento)} className="text-cyan-200 hover:text-white bg-[#0b1727] p-2 rounded-full border border-cyan-500/40">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-white leading-tight">{evento.titulo}</h3>
                      
                      {/* DIRECCIÓN CON ENLACE A GOOGLE MAPS */}
                      <p className="text-xs text-cyan-100 mt-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-lime-300 shrink-0" /> 
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evento.club)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-lime-300 transition-colors font-medium"
                        >
                          {evento.club} 📍
                        </a>
                      </p>

                      <p className="text-xs text-cyan-100 mt-1 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {evento.fecha}
                      </p>
                    </div>

                    {/* Medidor Ocupación */}
                    <div className="bg-[#0b1727] p-3 rounded-2xl border border-cyan-900 space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-cyan-200">Parejas Confirmadas</span>
                        <span className="text-white font-mono">{evento.plazas_ocupadas} / {evento.plazas_totales}</span>
                      </div>
                      <div className="w-full bg-[#0B1D35] h-2.5 rounded-full overflow-hidden p-0.5 border border-cyan-950">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${isPozo ? 'bg-cyan-400' : 'bg-amber-400'}`} 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>

                    <div className="bg-[#0b1727] px-3 py-2.5 rounded-xl border border-cyan-900 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-lime-300 font-bold uppercase block">Precio por Pareja</span>
                        <span className="text-xs text-white">({evento.precioUnitario}€ x jugador)</span>
                      </div>
                      <span className="text-base font-black text-lime-300">{evento.precioUnitario * 2}€</span>
                    </div>

                    {!isInscrito && !estaRegistrando && (
                      <button
                        onClick={() => {
                          setEventoRegistrandoId(evento.id);
                          setNombreParejaInput('');
                        }}
                        className="w-full bg-lime-300 hover:bg-lime-200 text-slate-950 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                      >
                        Inscribir Pareja
                      </button>
                    )}

                    {estaRegistrando && (
                      <div className="bg-[#0b1727] p-3.5 rounded-2xl border border-cyan-500/50 space-y-3 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-lime-300 uppercase">Indica tu Pareja</span>
                          <button onClick={() => setEventoRegistrandoId(null)} className="text-lime-300 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Nombre y Apellido de tu pareja"
                          value={nombreParejaInput}
                          onChange={(e) => setNombreParejaInput(e.target.value)}
                          className="w-full bg-white/[0.045] border border-cyan-800 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConfirmarInscripcion(evento.id)}
                            className="flex-1 bg-lime-300 text-slate-950 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md"
                          >
                            Confirmar ({evento.precioUnitario * 2}€)
                          </button>
                          <button
                            onClick={() => setEventoRegistrandoId(null)}
                            className="px-3 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl font-bold text-xs"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    {isInscrito && (
                      <div className="space-y-2">
                        <div className="bg-cyan-950/50 border border-white/10 p-2.5 rounded-xl flex justify-between items-center text-xs">
                          <span className="text-cyan-200 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-lime-300" /> Pareja: {miPerfil.nombreCompleto} & {parejaInscrita}
                          </span>
                          <button 
                            onClick={() => handleCancelarInscripcion(evento.id)}
                            className="text-[10px] text-rose-300 underline font-medium hover:text-rose-200"
                          >
                            Anular
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            setEventoActivoId(evento.id);
                            setActiveTab('pistas');
                          }}
                          className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 py-3 px-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                        >
                          <Eye className="w-4 h-4" /> Ver partidos
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PESTAÑA PISTAS */}
        {activeTab === 'pistas' && (
          <div className="space-y-4">
            {!eventoActivoId || !eventoSeleccionado ? (
              <div className="bg-white/[0.045] border border-white/10 rounded-3xl p-6 text-center space-y-3 shadow-xl">
                <Layers className="w-10 h-10 text-lime-300 mx-auto" />
                <h3 className="text-base font-bold text-white">Ningún evento seleccionado</h3>
                <p className="text-xs text-cyan-200">Entra a uno de tus eventos inscritos para ver sus pistas y cruces.</p>
                <button 
                  onClick={() => setActiveTab('eventos')}
                  className="bg-lime-300 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider mt-2"
                >
                  Ir a Eventos
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-white/[0.045] border border-white/10 p-3 rounded-2xl flex justify-between items-center shadow-md">
                  <div>
                    <span className="text-[10px] text-lime-300 font-bold uppercase tracking-wider block">Estás consultando:</span>
                    <h3 className="text-sm font-black text-white">{eventoSeleccionado.titulo}</h3>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventoSeleccionado.club)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-lime-300 underline block mt-0.5"
                    >
                      📍 {eventoSeleccionado.club} (Ver en Maps)
                    </a>
                  </div>
                  <button
                    onClick={() => setEventoActivoId(null)}
                    className="bg-[#0b1727] hover:bg-[#0B1D35] text-lime-300 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-cyan-900"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Cambiar
                  </button>
                </div>

                {eventoSeleccionado.tipo === 'Pozo' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black tracking-widest text-cyan-200 uppercase">Sorteo inicial • Pozo</h3>
                      <button
                        onClick={handleMezclarPistas}
                        className="bg-lime-300 hover:bg-lime-200 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
                      >
                        <Shuffle className="w-3.5 h-3.5" /> Sortear
                      </button>
                    </div>

                    {pistas.map((p) => {
                      const pareja1Actual = (p.numero === 1) ? [miPerfil.nombreCompleto, parejaInscritaActual] : p.parej1;

                      return (
                        <div key={p.numero} className="bg-white/[0.045] border-2 border-white/10 rounded-3xl p-4 space-y-3 shadow-xl">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-lime-300" /> {p.nombre}
                            </span>
                          </div>

                          <div className="relative bg-[#174F8A] border-4 border-white rounded-2xl p-4 overflow-hidden shadow-inner flex items-center justify-between h-36">
                            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-r-2 border-dashed border-white/80 z-10" />
                            <div className="w-1/2 text-center relative z-20 space-y-1 pr-2">
                              <span className="text-[9px] font-black text-cyan-200 uppercase tracking-widest block">PAREJA A</span>
                              <p className="text-xs font-black text-white drop-shadow-md truncate">{pareja1Actual[0]}</p>
                              <p className="text-xs font-black text-white drop-shadow-md truncate">{pareja1Actual[1]}</p>
                            </div>
                            <div className="w-1/2 text-center relative z-20 space-y-1 pl-2">
                              <span className="text-[9px] font-black text-cyan-200 uppercase tracking-widest block">PAREJA B</span>
                              <p className="text-xs font-black text-white drop-shadow-md truncate">{p.pareja2[0]}</p>
                              <p className="text-xs font-black text-white drop-shadow-md truncate">{p.pareja2[1]}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {eventoSeleccionado.tipo === 'Torneo' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-1 bg-[#0b1727] p-1 rounded-xl border border-cyan-900">
                      <button
                        onClick={() => setFaseTorneo('grupos')}
                        className={`py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${
                          faseTorneo === 'grupos' ? 'bg-cyan-500 text-slate-950' : 'text-cyan-200'
                        }`}
                      >
                        📊 Grupos
                      </button>
                      <button
                        onClick={() => setFaseTorneo('principal')}
                        className={`py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${
                          faseTorneo === 'principal' ? 'bg-amber-400 text-slate-950' : 'text-cyan-200'
                        }`}
                      >
                        🏆 Principal
                      </button>
                      <button
                        onClick={() => setFaseTorneo('consolacion')}
                        className={`py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${
                          faseTorneo === 'consolacion' ? 'bg-emerald-400 text-slate-950' : 'text-cyan-200'
                        }`}
                      >
                        🛡️ Consolación
                      </button>
                    </div>

                    {faseTorneo === 'grupos' && (
                      <div className="space-y-3">
                        <div className="bg-white/[0.045] border-2 border-white/10 rounded-3xl p-4 space-y-3 shadow-xl">
                          <div className="flex justify-between items-center border-b border-cyan-900 pb-2">
                            <span className="text-xs font-black text-lime-300 uppercase">Grupo A (Liguilla)</span>
                            <span className="text-[10px] bg-lime-300 text-slate-950 font-bold px-2 py-0.5 rounded">Mín. 3 partidos</span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center bg-[#0b1727] p-2.5 rounded-xl">
                              <span className="font-bold text-white">1. {miPerfil.nombreCompleto} & {parejaInscritaActual}</span>
                              <span className="text-lime-300 font-mono font-bold">2 PJ • 6 pts</span>
                            </div>
                            <div className="flex justify-between items-center bg-[#0b1727] p-2.5 rounded-xl">
                              <span className="font-bold text-white">2. Angel Ruiz & Rober Sanchez</span>
                              <span className="text-lime-300 font-mono font-bold">2 PJ • 4 pts</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {faseTorneo === 'principal' && (
                      <div className="bg-white/[0.045] border-2 border-amber-400/40 rounded-3xl p-4 space-y-3 shadow-xl">
                        <div className="flex justify-between items-center border-b border-cyan-900 pb-2">
                          <span className="text-xs font-black text-amber-300 uppercase flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" /> Cuadro Principal
                          </span>
                        </div>
                        <div className="space-y-3 text-xs">
                          <div className="bg-[#0b1727] p-3 rounded-xl border border-cyan-900 space-y-1">
                            <span className="text-[9px] text-amber-300 font-bold uppercase block">Semifinal 1</span>
                            <div className="flex justify-between font-bold text-white">
                              <span>{miPerfil.nombreCompleto} & {parejaInscritaActual} vs Pareja C</span>
                              <span className="text-lime-300 font-mono">Sáb 12:00</span>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-amber-500/20 to-blue-500/20 p-3 rounded-xl border border-amber-400/40 space-y-1 text-center">
                            <span className="text-[10px] text-amber-300 font-black uppercase block">🏆 GRAN FINAL PRINCIPAL</span>
                            <p className="font-bold text-white">Lucha por el título de Campeones</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {faseTorneo === 'consolacion' && (
                      <div className="bg-white/[0.045] border-2 border-emerald-400/40 rounded-3xl p-4 space-y-3 shadow-xl">
                        <div className="flex justify-between items-center border-b border-cyan-900 pb-2">
                          <span className="text-xs font-black text-emerald-300 uppercase flex items-center gap-1">
                            <GitBranch className="w-3.5 h-3.5" /> Cuadro de Consolación
                          </span>
                        </div>
                        <div className="space-y-3 text-xs">
                          <p className="text-[11px] text-emerald-200">Garantiza el mínimo de 4 partidos disputados por pareja.</p>
                          <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/30 space-y-1 text-center">
                            <span className="text-[10px] text-emerald-300 font-black uppercase block">🛡️ FINAL DE CONSOLACIÓN</span>
                            <p className="font-bold text-white">Lucha por el título secundario</p>
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

        {/* PESTAÑA RANKINGS */}
        {activeTab === 'rankings' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-black tracking-widest text-cyan-200 uppercase flex items-center gap-2"><Trophy className="w-4 h-4 text-lime-300" /> Ranking global de jugadores</h2>
              <p className="text-xs text-cyan-200 mt-1">Los resultados de los eventos suman aquí, independientemente del club donde se jueguen.</p>
            </div>
            <div className="bg-white/[0.045] border-2 border-white/10 rounded-3xl overflow-hidden shadow-xl">
              {rankingOrdenado.map((jugador, index) => {
                const puntos = jugador.puntosPozos + jugador.puntosTorneos;
                return <div key={jugador.id} className="flex items-center justify-between p-3.5 border-b border-cyan-900/60">
                  <div className="flex items-center gap-3"><span className="w-7 text-center font-black text-lime-300">{index + 1}º</span><div><h4 className="font-extrabold text-white text-xs">{jugador.nombre}</h4><p className="text-[10px] text-cyan-200">Nivel {jugador.nivel.toFixed(1)} · {jugador.pozos + jugador.torneosJugados} eventos</p></div></div>
                  <span className="font-black text-xs text-lime-300">{puntos} pts</span>
                </div>;
              })}
            </div>
          </div>
        )}

        {/* PESTAÑA ADMIN */}
        {activeTab === 'admin' && (
          <div className="space-y-5">
            {!esOrganizador ? (
              <div className="bg-white/[0.045] border-2 border-white/10 rounded-3xl p-6 text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 bg-lime-300 text-slate-950 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Acceso Restringido</h3>
                  <p className="text-xs text-cyan-200 mt-1">Introduce el PIN de organizador (1234).</p>
                </div>

                <form onSubmit={handleLoginOrganizador} className="space-y-3 pt-2">
                  <input
                    type="password"
                    placeholder="PIN (1234)"
                    value={pinAdmin}
                    onChange={(e) => setPinAdmin(e.target.value)}
                    className="w-full bg-[#0b1727] border border-cyan-900 rounded-2xl p-3 text-center text-lg font-black text-white tracking-widest focus:outline-none focus:border-cyan-400"
                  />
                  {errorPin && (
                    <p className="text-xs font-bold text-rose-400">PIN incorrecto (prueba con 1234)</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-lime-300 hover:bg-lime-200 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg"
                  >
                    Desbloquear Panel
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="flex justify-between items-center bg-white/[0.045] p-3 rounded-2xl border border-white/10">
                  <span className="text-xs font-bold text-lime-300 flex items-center gap-1.5">
                    <Unlock className="w-4 h-4 text-lime-300" /> Modo Organizador Activo
                  </span>
                  <button 
                    onClick={() => setEsOrganizador(false)}
                    className="text-xs text-rose-300 font-bold bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20"
                  >
                    Bloquear
                  </button>
                </div>

                <div className="bg-white/[0.045] border-2 border-white/10 p-4 rounded-3xl space-y-4 shadow-xl">
                  <h3 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-lime-300" /> Crear Nuevo Evento
                  </h3>

                  <form onSubmit={handleCrearEvento} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Título del evento"
                      value={nuevoTituloEvento}
                      onChange={(e) => setNuevoTituloEvento(e.target.value)}
                      className="w-full bg-[#0b1727] border border-cyan-900 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-bold"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Fecha y hora" value={nuevoFechaEvento} onChange={(e) => setNuevoFechaEvento(e.target.value)} className="bg-[#0b1727] border border-cyan-900 rounded-xl p-2.5 text-xs text-white font-bold" />
                      <input type="number" min="4" placeholder="Nº jugadores" value={nuevoPlazasEvento} onChange={(e) => setNuevoPlazasEvento(e.target.value)} className="bg-[#0b1727] border border-cyan-900 rounded-xl p-2.5 text-xs text-white font-bold" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={nuevoTipoEvento}
                        onChange={(e) => setNuevoTipoEvento(e.target.value)}
                        className="bg-[#0b1727] border border-cyan-900 rounded-xl p-2.5 text-xs text-white font-bold"
                      >
                        <option value="Pozo">Pozo Sube-Baja</option>
                        <option value="Torneo">Torneo (Grupos + Cuadro)</option>
                      </select>

                      <input
                        type="number"
                        placeholder="Precio x Jugador (€)"
                        value={nuevoPrecioEvento}
                        onChange={(e) => setNuevoPrecioEvento(e.target.value)}
                        className="bg-[#0b1727] border border-cyan-900 rounded-xl p-2.5 text-xs text-white font-bold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-lime-300 hover:bg-lime-200 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95"
                    >
                      Publicar Evento
                    </button>
                  </form>

                  <div className="pt-3 border-t border-cyan-900 space-y-2">
                    <span className="text-[10px] uppercase font-extrabold text-lime-300 block">Eventos Activos (Borrar)</span>
                    {eventos.map((ev) => (
                      <div key={ev.id} className="flex justify-between items-center bg-[#0b1727] p-2.5 rounded-xl border border-cyan-900/60">
                        <span className="text-xs font-bold text-white truncate max-w-[200px]">{ev.titulo}</span>
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

                <div className="bg-white/[0.045] border-2 border-white/10 p-4 rounded-3xl space-y-4 shadow-xl">
                  <h3 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-lime-300" /> Participantes y sorteo inicial
                  </h3>
                  <select value={eventoOrganizadorId} onChange={(e) => setEventoOrganizadorId(Number(e.target.value))} className="w-full bg-[#0b1727] border border-cyan-900 rounded-xl p-2.5 text-xs text-white font-bold">
                    {eventos.map(ev => <option key={ev.id} value={ev.id}>{ev.titulo} · {ev.club}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <input value={nuevoJugadorEvento} onChange={(e) => setNuevoJugadorEvento(e.target.value)} placeholder="Añadir jugador" className="flex-1 bg-[#0b1727] border border-cyan-900 rounded-xl p-2.5 text-xs text-white font-bold" />
                    <button type="button" onClick={() => { const n=nuevoJugadorEvento.trim(); if(!n) return; setParticipantesPorEvento(prev => ({...prev, [eventoOrganizadorId]: Array.from(new Set([...(prev[eventoOrganizadorId]||[]), n]))})); setNuevoJugadorEvento(''); }} className="bg-lime-300 text-slate-950 px-3 rounded-xl font-black"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(participantesPorEvento[eventoOrganizadorId] || []).map((n,i) => <span key={`${n}-${i}`} className="bg-[#0b1727] border border-cyan-900 text-cyan-100 text-[10px] px-2 py-1 rounded-lg">{n}</span>)}
                  </div>
                  <button type="button" onClick={() => { const registrados=participantesPorEvento[eventoOrganizadorId] || []; const pool=registrados.length ? registrados : ranking.map(j=>j.nombre); const shuffled=[...pool].sort(()=>Math.random()-0.5); const nuevas:any[]=[]; for(let i=0;i<shuffled.length;i+=4){ if(shuffled[i+1] && shuffled[i+2] && shuffled[i+3]) nuevas.push({numero:nuevas.length+1,nombre:`Pista ${nuevas.length+1}`,parej1:[shuffled[i],shuffled[i+1]],pareja2:[shuffled[i+2],shuffled[i+3]]}); } setPistas(nuevas); setEventoActivoId(eventoOrganizadorId); setMensajeExito(`Sorteo generado: ${nuevas.length} pistas`); setTimeout(()=>setMensajeExito(''),3000); }} className="w-full bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase flex items-center justify-center gap-2"><Shuffle className="w-4 h-4" /> Sortear pistas</button>
                  <p className="text-[10px] text-cyan-200">Si no añades jugadores manualmente, el prototipo utiliza los jugadores del ranking como base para el sorteo.</p>
                </div>

                <div className="bg-white/[0.045] border-2 border-white/10 p-4 rounded-3xl space-y-3.5 shadow-xl">
                  <h3 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-lime-300" /> Cierre de resultados y puntos
                  </h3>

                  <form onSubmit={handleGuardarCierre} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-extrabold text-cyan-200 uppercase mb-1">Modalidad</label>
                        <select
                          value={cierreTipoEvento}
                          onChange={(e) => setCierreTipoEvento(e.target.value as 'Pozo' | 'Torneo')}
                          className="w-full bg-[#0b1727] border border-cyan-900 rounded-xl p-2.5 text-xs text-white font-bold"
                        >
                          <option value="Pozo">Pozo</option>
                          <option value="Torneo">Torneo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-cyan-200 uppercase mb-1">Jugador</label>
                        <select
                          value={cierreJugador}
                          onChange={(e) => setCierreJugador(e.target.value)}
                          className="w-full bg-[#0b1727] border border-cyan-900 rounded-xl p-2.5 text-xs text-white font-bold truncate"
                        >
                          {ranking.map((j) => (
                            <option key={j.id} value={j.nombre}>{j.nombre}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {cierreTipoEvento === 'Pozo' ? (
                      <div>
                        <label className="block text-[10px] font-extrabold text-cyan-200 uppercase mb-1">Pista Final en el Pozo</label>
                        <select
                          value={cierrePista}
                          onChange={(e) => setCierrePista(e.target.value)}
                          className="w-full bg-[#0b1727] border border-cyan-900 rounded-xl p-2.5 text-xs text-white font-bold"
                        >
                          <option value="1">Pista 1 (Rey) - Base 100 pts</option>
                          <option value="2">Pista 2 - Base 75 pts</option>
                          <option value="3">Pista 3 - Base 50 pts</option>
                          <option value="4">Pista 4 - Base 25 pts</option>
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-3 p-3 bg-[#0b1727] rounded-2xl border border-cyan-900">
                        <div>
                          <label className="block text-[10px] font-extrabold text-lime-300 uppercase mb-1">Cuadro del Torneo</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setCierreCuadro('principal')}
                              className={`py-2 rounded-xl text-xs font-black uppercase transition-all ${
                                cierreCuadro === 'principal' ? 'bg-amber-400 text-slate-950' : 'bg-white/[0.045] text-cyan-200 border border-cyan-800'
                              }`}
                            >
                              🏆 Principal
                            </button>
                            <button
                              type="button"
                              onClick={() => setCierreCuadro('consolacion')}
                              className={`py-2 rounded-xl text-xs font-black uppercase transition-all ${
                                cierreCuadro === 'consolacion' ? 'bg-emerald-400 text-slate-950' : 'bg-white/[0.045] text-cyan-200 border border-cyan-800'
                              }`}
                            >
                              🛡️ Consolación
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold text-cyan-200 uppercase mb-1">Fase / Ronda Alcanzada</label>
                          <select
                            value={cierreRondaTorneo}
                            onChange={(e) => setCierreRondaTorneo(e.target.value)}
                            className="w-full bg-white/[0.045] border border-cyan-800 rounded-xl p-2.5 text-xs text-white font-bold"
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
                      <div className="flex items-center justify-between p-3 bg-[#0b1727] rounded-xl border border-cyan-900">
                        <span className="text-xs font-bold text-white">¿Victoria en último partido?</span>
                        <button
                          type="button"
                          onClick={() => setCierreGano(!cierreGano)}
                          className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                            cierreGano ? 'bg-lime-300 text-slate-950' : 'bg-[#1A3D6C] text-lime-300'
                          }`}
                        >
                          {cierreGano ? 'SÍ (+Bonus)' : 'NO'}
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-lime-300 hover:bg-lime-200 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg"
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
            <div className="bg-white/[0.045] border-2 border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-3xl mx-auto flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg">
                  {miPerfil.nombreCompleto ? miPerfil.nombreCompleto.substring(0, 2).toUpperCase() : 'JD'}
                </div>
                <h2 className="text-lg font-black text-white">{miPerfil.nombreCompleto}</h2>
                <p className="text-xs text-cyan-200">Jugador activo</p>
              </div>

              <div className="bg-[#0b1727] p-4 rounded-2xl border border-cyan-900 space-y-3">
                <h3 className="text-xs font-black text-lime-300 uppercase tracking-wider">Tus Datos de Perfil</h3>
                
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[10px] text-lime-300 font-bold uppercase">Nombre y Apellido</label>
                    <input 
                      type="text" 
                      value={miPerfil.nombreCompleto}
                      onChange={(e) => setMiPerfil({...miPerfil, nombreCompleto: e.target.value})}
                      className="w-full bg-white/[0.045] border border-cyan-800 rounded-xl p-2.5 text-xs text-white font-bold mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-lime-300 font-bold uppercase">Teléfono</label>
                    <input 
                      type="tel" 
                      value={miPerfil.telefono}
                      onChange={(e) => setMiPerfil({...miPerfil, telefono: e.target.value})}
                      className="w-full bg-white/[0.045] border border-cyan-800 rounded-xl p-2.5 text-xs text-white font-bold mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-lime-300 font-bold uppercase">Nivel en Playtomic</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={miPerfil.nivelPlaytomic}
                      onChange={(e) => setMiPerfil({...miPerfil, nivelPlaytomic: e.target.value})}
                      className="w-full bg-white/[0.045] border border-cyan-800 rounded-xl p-2.5 text-xs text-white font-bold mt-1"
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
                    className="w-full bg-lime-300 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider"
                  >
                    Guardar Cambios
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
      <nav className="fixed bottom-0 left-0 right-0 bg-[#07111f]/95 backdrop-blur-lg border-t-2 border-lime-300/20 p-2 max-w-md mx-auto z-40">
        <div className="flex justify-around items-center">
          {[
            { id: 'eventos', icon: Calendar, label: 'Eventos' },
            { id: 'pistas', icon: Users, label: 'Partidos' },
            { id: 'rankings', icon: Trophy, label: 'Ranking' },
            { id: 'admin', icon: Shield, label: 'Organizador' },
            { id: 'perfil', icon: Settings, label: 'Perfil' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center gap-1 p-1.5 text-[10px] font-bold transition-all active:scale-95 ${
                  isActive ? 'text-lime-300' : 'text-white/45'
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