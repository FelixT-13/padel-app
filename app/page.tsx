'use client';

import React, { useState } from 'react';
import { 
  Calendar, Trophy, User, Settings, Users, 
  MapPin, Award, Plus, Shuffle, Share2, 
  CheckCircle2, Flame, Sparkles, Shield, Trash2, Layers, Lock, Unlock
} from 'lucide-react';

const JUGADORES_INICIALES = [
  { id: '1', nombre: 'Felix', nivel: 4.0, pozos: 6, puntosPozos: 580, torneosJugados: 3, puntosTorneos: 340, racha: '3W' },
  { id: '2', nombre: 'Angel', nivel: 3.9, pozos: 5, puntosPozos: 490, torneosJugados: 2, puntosTorneos: 280, racha: '1W' },
  { id: '3', nombre: 'Lidia', nivel: 3.8, pozos: 5, puntosPozos: 460, torneosJugados: 4, puntosTorneos: 410, racha: '2W' },
  { id: '4', nombre: 'Rober', nivel: 3.5, pozos: 4, puntosPozos: 350, torneosJugados: 2, puntosTorneos: 210, racha: '1L' },
];

const EVENTOS_INICIALES = [
  {
    id: 1,
    titulo: 'Pozo Sube-Baja Top Level',
    tipo: 'Pozo',
    fecha: 'Sábado, 11 Oct • 10:00h',
    club: 'Club Pádel Center',
    plazas_totales: 16,
    plazas_ocupadas: 12,
    precio: 12,
  },
  {
    id: 2,
    titulo: 'Torneo Express Otoño',
    tipo: 'Torneo',
    fecha: '24-26 Oct • Cat. Abierta',
    club: 'Pádel Indoor Madrid',
    plazas_totales: 12,
    plazas_ocupadas: 8,
    precio: 20,
  }
];

export default function PadelApp() {
  const [activeTab, setActiveTab] = useState<'eventos' | 'pistas' | 'rankings' | 'admin' | 'perfil'>('eventos');
  const [ranking, setRanking] = useState(JUGADORES_INICIALES);
  const [inscritos, setInscritos] = useState<number[]>([1]);

  // Sub-pestana para Ranking (Pozos vs Torneos)
  const [tipoRanking, setTipoRanking] = useState<'pozos' | 'torneos'>('pozos');

  // Seguridad de Organizador
  const [pinAdmin, setPinAdmin] = useState('');
  const [esOrganizador, setEsOrganizador] = useState(false);
  const [errorPin, setErrorPin] = useState(false);

  // Estado de Eventos
  const [eventos, setEventos] = useState(EVENTOS_INICIALES);
  const [nuevoTituloEvento, setNuevoTituloEvento] = useState('');
  const [nuevoTipoEvento, setNuevoTipoEvento] = useState('Pozo');
  const [nuevoClubEvento, setNuevoClubEvento] = useState('Club Pádel Center');
  const [nuevoPrecioEvento, setNuevoPrecioEvento] = useState('12');

  // Perfil del Usuario
  const [miPerfil, setMiPerfil] = useState({ nombre: 'Felix', nivel: 4.0, club: 'Pádel Club Central' });

  const [pistas, setPistas] = useState([
    { numero: 1, nombre: 'Pista 1 • Central WPT', parej1: ['Felix', 'Lidia'], pareja2: ['Angel', 'Rober'] },
    { numero: 2, nombre: 'Pista 2', parej1: ['Jugador 5', 'Jugador 6'], pareja2: ['Jugador 7', 'Jugador 8'] },
  ]);

  const [cierreJugador, setCierreJugador] = useState('Felix');
  const [cierreTipoEvento, setCierreTipoEvento] = useState<'Pozo' | 'Torneo'>('Pozo');
  const [cierrePista, setCierrePista] = useState('1');
  const [cierreGano, setCierreGano] = useState(true);
  const [mensajeExito, setMensajeExito] = useState('');

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoNivel, setNuevoNivel] = useState('3.5');

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

  const handleInscribirse = (id: number) => {
    if (inscritos.includes(id)) {
      setInscritos(inscritos.filter((item) => item !== id));
    } else {
      setInscritos([...inscritos, id]);
    }
  };

  const calcularPuntos = (pista: number, gano: boolean) => {
    const base = 100 - (pista - 1) * 25;
    const bonus = pista === 1 ? (gano ? 15 : 0) : (gano ? 10 : 0);
    return Math.max(base + bonus, 10);
  };

  const handleGuardarCierre = (e: React.FormEvent) => {
    e.preventDefault();
    const pts = calcularPuntos(parseInt(cierrePista), cierreGano);

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

    setMensajeExito(`¡+${pts} Pts (${cierreTipoEvento}) asignados a ${cierreJugador}!`);
    setTimeout(() => setMensajeExito(''), 3000);
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
      precio: parseInt(nuevoPrecioEvento) || 10,
    };

    setEventos([...eventos, nuevoEv]);
    setNuevoTituloEvento('');
    setMensajeExito('¡Nuevo evento publicado!');
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleEliminarEvento = (id: number) => {
    setEventos(eventos.filter(ev => ev.id !== id));
    setInscritos(inscritos.filter(i => i !== id));
  };

  const handleAgregarJugador = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;

    const nuevo = {
      id: Date.now().toString(),
      nombre: nuevoNombre.trim(),
      nivel: parseFloat(nuevoNivel),
      pozos: 0,
      puntosPozos: 0,
      torneosJugados: 0,
      puntosTorneos: 0,
      racha: '-',
    };

    setRanking((prev) => [...prev, nuevo]);
    setNuevoNombre('');
    setMensajeExito(`¡${nuevo.nombre} guardado en el club!`);
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleMezclarPistas = () => {
    const nombres = ranking.map((r) => r.nombre);
    const mezclados = [...nombres].sort(() => Math.random() - 0.5);

    setPistas([
      {
        numero: 1,
        nombre: 'Pista 1 • Central WPT',
        parej1: [mezclados[0] || miPerfil.nombre, mezclados[1] || 'Lidia'],
        pareja2: [mezclados[2] || 'Angel', mezclados[3] || 'Rober'],
      },
      {
        numero: 2,
        nombre: 'Pista 2',
        parej1: ['Jugador A', 'Jugador B'],
        pareja2: ['Jugador C', 'Jugador D'],
      },
    ]);
  };

  const compartirEvento = (evento: any) => {
    const texto = `🎾 *${evento.titulo.toUpperCase()}* 🎾\n📅 ${evento.fecha}\n📍 ${evento.club}\n\n👉 ¡Apúntate en nuestra app del club!`;
    if (navigator.share) {
      navigator.share({ title: evento.titulo, text: texto, url: window.location.href }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
    }
  };

  // Ordenar ranking según la categoría activa
  const rankingOrdenado = [...ranking].sort((a, b) => {
    if (tipoRanking === 'pozos') {
      return b.puntosPozos - a.puntosPozos;
    } else {
      return b.puntosTorneos - a.puntosTorneos;
    }
  });

  return (
    <div className="min-h-screen bg-[#112948] text-slate-100 font-sans pb-32 max-w-md mx-auto relative border-x border-[#1A3D6C] shadow-2xl">
      {/* Marcador Superior Estilo WPT */}
      <header className="sticky top-0 z-30 bg-[#0B1D35]/95 backdrop-blur-md p-4 border-b-2 border-cyan-400/30 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-md">
            🎾
          </div>
          <div>
            <h1 className="text-base font-black tracking-wider text-white uppercase flex items-center gap-1.5">
              PÁDEL MATCH <span className="text-[10px] bg-cyan-400 text-slate-950 px-1.5 py-0.5 rounded font-extrabold">WPT</span>
            </h1>
            <p className="text-[10px] text-cyan-200/80 font-medium">Circuito Privado de Pádel</p>
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('perfil')}
          className="bg-[#1A3D6C] border border-cyan-500/40 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 active:scale-95 transition-all"
        >
          <User className="w-3.5 h-3.5 text-cyan-300" /> {miPerfil.nombre} ({miPerfil.nivel.toFixed(1)})
        </button>
      </header>

      <main className="p-4 space-y-5">
        
        {/* PESTAÑA EVENTOS */}
        {activeTab === 'eventos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black tracking-widest text-cyan-200 uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" /> Próximos Partidos & Torneos
              </h2>
            </div>

            <div className="space-y-4">
              {eventos.map((evento) => {
                const isInscrito = inscritos.includes(evento.id);
                const isPozo = evento.tipo === 'Pozo';
                const pct = Math.round((evento.plazas_ocupadas / evento.plazas_totales) * 100);

                return (
                  <div key={evento.id} className="bg-[#18365C]/90 border-2 border-cyan-500/30 rounded-3xl p-4.5 space-y-3.5 relative overflow-hidden shadow-xl">
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                        isPozo 
                          ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-extrabold' 
                          : 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold'
                      }`}>
                        {evento.tipo}
                      </span>

                      <button onClick={() => compartirEvento(evento)} className="text-cyan-200 hover:text-white bg-[#112948] p-2 rounded-full border border-cyan-500/40">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-white leading-tight">{evento.titulo}</h3>
                      <p className="text-xs text-cyan-100 mt-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {evento.club}
                      </p>
                      <p className="text-xs text-cyan-100 mt-0.5 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" /> {evento.fecha}
                      </p>
                    </div>

                    {/* Medidor Ocupación */}
                    <div className="bg-[#112948] p-3 rounded-2xl border border-cyan-900 space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-cyan-200">Jugadores Confirmados</span>
                        <span className="text-white font-mono">{evento.plazas_ocupadas} / {evento.plazas_totales}</span>
                      </div>
                      <div className="w-full bg-[#0B1D35] h-2.5 rounded-full overflow-hidden p-0.5 border border-cyan-950">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${isPozo ? 'bg-cyan-400' : 'bg-amber-400'}`} 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>

                    {/* Precio y Botón */}
                    <div className="pt-1 flex items-center justify-between gap-3">
                      <div className="bg-[#112948] px-3 py-2 rounded-xl border border-cyan-900">
                        <span className="text-sm font-black text-white">{evento.precio}€</span>
                      </div>

                      <button
                        onClick={() => handleInscribirse(evento.id)}
                        className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md ${
                          isInscrito
                            ? 'bg-[#1A3D6C] text-cyan-300 border-2 border-cyan-400'
                            : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                        }`}
                      >
                        {isInscrito ? <><CheckCircle2 className="w-4 h-4" /> Ya estás en lista</> : 'Inscribirme'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PESTAÑA PISTAS DE SALIDA (CONDICIONAL Y COMPLETAMENTE LLENA) */}
        {activeTab === 'pistas' && (
          <div className="space-y-4">
            {inscritos.length === 0 ? (
              <div className="bg-[#18365C] border border-cyan-500/30 rounded-3xl p-6 text-center space-y-3 shadow-xl">
                <Layers className="w-10 h-10 text-cyan-400 mx-auto" />
                <h3 className="text-base font-bold text-white">No estás inscrito en ningún evento</h3>
                <p className="text-xs text-cyan-200">Para ver la distribución de pistas y partidos, apúntate primero a un Pozo o Torneo en la pestaña de Eventos.</p>
                <button 
                  onClick={() => setActiveTab('eventos')}
                  className="bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider mt-2"
                >
                  Ver Eventos Disponibles
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xs font-black tracking-widest text-cyan-200 uppercase flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" /> Reparto de Pistas
                    </h2>
                    <p className="text-[10px] text-cyan-300">Tus cruces activos</p>
                  </div>

                  <button
                    onClick={handleMezclarPistas}
                    className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
                  >
                    <Shuffle className="w-3.5 h-3.5" /> Sortear
                  </button>
                </div>

                {pistas.map((p) => (
                  <div key={p.numero} className="bg-[#18365C]/90 border-2 border-cyan-500/30 rounded-3xl p-4 space-y-3 shadow-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> {p.nombre}
                      </span>
                      <span className="text-[10px] bg-[#112948] text-cyan-300 font-bold px-2.5 py-0.5 rounded-full border border-cyan-900">
                        Activa
                      </span>
                    </div>

                    {/* MINIATURA PISTA AZUL WPT - LLENA Y BALANCEADA */}
                    <div className="relative bg-[#174F8A] border-4 border-white rounded-2xl p-4 overflow-hidden shadow-inner flex items-center justify-between h-36">
                      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-r-2 border-dashed border-white/80 z-10" />

                      {/* Pareja A (Izquierda) */}
                      <div className="w-1/2 text-center relative z-20 space-y-1 pr-2">
                        <span className="text-[9px] font-black text-cyan-200 uppercase tracking-widest block">PAREJA A</span>
                        <p className="text-xs font-black text-white drop-shadow-md truncate">{p.parej1[0]}</p>
                        <p className="text-xs font-black text-white drop-shadow-md truncate">{p.parej1[1]}</p>
                      </div>

                      {/* Pareja B (Derecha) */}
                      <div className="w-1/2 text-center relative z-20 space-y-1 pl-2">
                        <span className="text-[9px] font-black text-cyan-200 uppercase tracking-widest block">PAREJA B</span>
                        <p className="text-xs font-black text-white drop-shadow-md truncate">{p.pareja2[0]}</p>
                        <p className="text-xs font-black text-white drop-shadow-md truncate">{p.pareja2[1]}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA RANKING (DIVIDIDO EN DOS: POZOS Y TORNEOS) */}
        {activeTab === 'rankings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black tracking-widest text-cyan-200 uppercase flex items-center gap-2">
                <Trophy className="w-4 h-4 text-cyan-400" /> Clasificación
              </h2>
            </div>

            {/* Selector de Tipo de Ranking */}
            <div className="grid grid-cols-2 gap-2 bg-[#0B1D35] p-1.5 rounded-2xl border border-cyan-900">
              <button
                onClick={() => setTipoRanking('pozos')}
                className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  tipoRanking === 'pozos' ? 'bg-cyan-400 text-slate-950 shadow-md' : 'text-cyan-200 hover:text-white'
                }`}
              >
                ⚡ Ranking Pozos
              </button>
              <button
                onClick={() => setTipoRanking('torneos')}
                className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  tipoRanking === 'torneos' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-cyan-200 hover:text-white'
                }`}
              >
                🏆 Ranking Torneos
              </button>
            </div>

            <div className="bg-[#18365C]/90 border-2 border-cyan-500/30 rounded-3xl overflow-hidden shadow-xl">
              {/* Líder #1 */}
              {rankingOrdenado.length > 0 && (
                <div className={`p-4 text-slate-950 flex items-center justify-between ${tipoRanking === 'pozos' ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-amber-400 to-amber-300'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-950 text-white font-black text-lg flex items-center justify-center">
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
                  <div key={jugador.id} className="flex items-center justify-between p-3.5 hover:bg-[#112948]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs font-black text-cyan-300">
                        {index === 0 ? '🥈' : index === 1 ? '🥉' : `${index + 3}º`}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-white text-xs">{jugador.nombre}</h4>
                        <p className="text-[10px] text-cyan-200">
                          Nivel {jugador.nivel.toFixed(1)} • {tipoRanking === 'pozos' ? `${jugador.pozos} pozos` : `${jugador.torneosJugados} torneos`}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-xs text-cyan-300">
                      {tipoRanking === 'pozos' ? `${jugador.puntosPozos} pts` : `${jugador.puntosTorneos} pts`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA ADMIN / ORGANIZADOR (PROTEGIDO POR PIN) */}
        {activeTab === 'admin' && (
          <div className="space-y-5">
            {!esOrganizador ? (
              <div className="bg-[#18365C] border-2 border-cyan-500/30 rounded-3xl p-6 text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 bg-cyan-400 text-slate-950 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Acceso Restringido</h3>
                  <p className="text-xs text-cyan-200 mt-1">Introduce el PIN de organizador para acceder a la gestión de torneos y cierre de puntos.</p>
                </div>

                <form onSubmit={handleLoginOrganizador} className="space-y-3 pt-2">
                  <input
                    type="password"
                    placeholder="PIN (ej. 1234)"
                    value={pinAdmin}
                    onChange={(e) => setPinAdmin(e.target.value)}
                    className="w-full bg-[#112948] border border-cyan-900 rounded-2xl p-3 text-center text-lg font-black text-white tracking-widest focus:outline-none focus:border-cyan-400"
                  />
                  {errorPin && (
                    <p className="text-xs font-bold text-rose-400">PIN incorrecto (prueba con 1234)</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg"
                  >
                    Desbloquear Panel
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="flex justify-between items-center bg-[#18365C] p-3 rounded-2xl border border-cyan-500/30">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Unlock className="w-4 h-4 text-cyan-400" /> Modo Organizador Activo
                  </span>
                  <button 
                    onClick={() => setEsOrganizador(false)}
                    className="text-xs text-rose-300 font-bold bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20"
                  >
                    Bloquear
                  </button>
                </div>

                {mensajeExito && (
                  <div className="bg-cyan-400 text-slate-950 p-3 rounded-2xl text-xs font-black animate-bounce shadow-lg">
                    {mensajeExito}
                  </div>
                )}

                {/* Crear y Gestionar Torneos */}
                <div className="bg-[#18365C]/90 border-2 border-cyan-500/30 p-4 rounded-3xl space-y-4 shadow-xl">
                  <h3 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" /> Crear Nuevo Evento
                  </h3>

                  <form onSubmit={handleCrearEvento} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Título (ej. Pozo Especial Viernes)"
                      value={nuevoTituloEvento}
                      onChange={(e) => setNuevoTituloEvento(e.target.value)}
                      className="w-full bg-[#112948] border border-cyan-900 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-bold"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={nuevoTipoEvento}
                        onChange={(e) => setNuevoTipoEvento(e.target.value)}
                        className="bg-[#112948] border border-cyan-900 rounded-xl p-2.5 text-xs text-white font-bold"
                      >
                        <option value="Pozo">Pozo Sube-Baja</option>
                        <option value="Torneo">Torneo</option>
                      </select>

                      <input
                        type="number"
                        placeholder="Precio (€)"
                        value={nuevoPrecioEvento}
                        onChange={(e) => setNuevoPrecioEvento(e.target.value)}
                        className="bg-[#112948] border border-cyan-900 rounded-xl p-2.5 text-xs text-white font-bold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95"
                    >
                      Publicar Evento Nuevo
                    </button>
                  </form>

                  <div className="pt-3 border-t border-cyan-900 space-y-2">
                    <span className="text-[10px] uppercase font-extrabold text-cyan-300 block">Eventos Activos (Borrar)</span>
                    {eventos.map((ev) => (
                      <div key={ev.id} className="flex justify-between items-center bg-[#112948] p-2.5 rounded-xl border border-cyan-900/60">
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

                {/* Cierre Rápido de Puntos (Con selector de categoría Pozo / Torneo) */}
                <div className="bg-[#18365C]/90 border-2 border-cyan-500/30 p-4 rounded-3xl space-y-3.5 shadow-xl">
                  <h3 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-cyan-400" /> Cierre de Puntos (Pozos o Torneo)
                  </h3>

                  <form onSubmit={handleGuardarCierre} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-extrabold text-cyan-200 uppercase mb-1">Categoría</label>
                        <select
                          value={cierreTipoEvento}
                          onChange={(e) => setCierreTipoEvento(e.target.value as 'Pozo' | 'Torneo')}
                          className="w-full bg-[#112948] border border-cyan-900 rounded-xl p-2.5 text-xs text-white font-bold"
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
                          className="w-full bg-[#112948] border border-cyan-900 rounded-xl p-2.5 text-xs text-white font-bold truncate"
                        >
                          {ranking.map((j) => (
                            <option key={j.id} value={j.nombre}>{j.nombre}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-cyan-200 uppercase mb-1">Pista Final / Posición</label>
                      <select
                        value={cierrePista}
                        onChange={(e) => setCierrePista(e.target.value)}
                        className="w-full bg-[#112948] border border-cyan-900 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-bold"
                      >
                        <option value="1">Pista 1 (Ganador / Rey) - Base 100 pts</option>
                        <option value="2">Pista 2 - Base 75 pts</option>
                        <option value="3">Pista 3 - Base 50 pts</option>
                        <option value="4">Pista 4 - Base 25 pts</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#112948] rounded-xl border border-cyan-900">
                      <span className="text-xs font-bold text-white">¿Ganó su último partido?</span>
                      <button
                        type="button"
                        onClick={() => setCierreGano(!cierreGano)}
                        className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                          cierreGano ? 'bg-cyan-400 text-slate-950' : 'bg-[#1A3D6C] text-cyan-300'
                        }`}
                      >
                        {cierreGano ? 'SÍ (+Bonus)' : 'NO (+0 pts)'}
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg"
                    >
                      Sumar Puntos al Ranking ({cierreTipoEvento})
                    </button>
                  </form>
                </div>

                {/* Añadir Jugador al Club */}
                <div className="bg-[#18365C]/90 border border-cyan-900 p-4 rounded-3xl space-y-2.5">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-cyan-400" /> Registrar Nuevo Jugador en el Club
                  </h4>

                  <form onSubmit={handleAgregarJugador} className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={nuevoNombre}
                        onChange={(e) => setNuevoNombre(e.target.value)}
                        className="col-span-2 bg-[#112948] border border-cyan-900 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Nivel"
                        value={nuevoNivel}
                        onChange={(e) => setNuevoNivel(e.target.value)}
                        className="bg-[#112948] border border-cyan-900 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#1A3D6C] hover:bg-[#234F8C] text-white font-bold py-2.5 rounded-xl text-xs transition-all active:scale-95"
                    >
                      Guardar Jugador
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA PERFIL Y CONFIGURACIÓN */}
        {activeTab === 'perfil' && (
          <div className="space-y-4">
            <div className="bg-[#18365C]/90 border-2 border-cyan-500/30 rounded-3xl p-6 text-center space-y-4 shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-3xl mx-auto flex items-center justify-center text-slate-950 font-black text-3xl shadow-lg">
                {miPerfil.nombre.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-black text-white">{miPerfil.nombre}</h2>
                <p className="text-xs text-cyan-200">Jugador & Miembro del Club</p>
              </div>

              <div className="bg-[#112948] p-4 rounded-2xl border border-cyan-900 space-y-3 text-left">
                <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider">Configurar Perfil</h3>
                
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] text-cyan-300 font-bold uppercase">Tu Nombre</label>
                    <input 
                      type="text" 
                      value={miPerfil.nombre}
                      onChange={(e) => setMiPerfil({...miPerfil, nombre: e.target.value})}
                      className="w-full bg-[#18365C] border border-cyan-800 rounded-xl p-2.5 text-xs text-white font-bold mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-cyan-300 font-bold uppercase">Tu Nivel</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={miPerfil.nivel}
                      onChange={(e) => setMiPerfil({...miPerfil, nivel: parseFloat(e.target.value) || 4.0})}
                      className="w-full bg-[#18365C] border border-cyan-800 rounded-xl p-2.5 text-xs text-white font-bold mt-1"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setMensajeExito('¡Perfil actualizado con éxito!');
                      setTimeout(() => setMensajeExito(''), 3000);
                      setActiveTab('eventos');
                    }}
                    className="w-full bg-cyan-400 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navegación Inferior Fija de App */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0B1D35]/95 backdrop-blur-lg border-t-2 border-cyan-400/30 p-2 max-w-md mx-auto z-40">
        <div className="flex justify-around items-center">
          {[
            { id: 'eventos', icon: Calendar, label: 'Eventos' },
            { id: 'pistas', icon: Users, label: 'Pistas' },
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
                  isActive ? 'text-cyan-400' : 'text-cyan-200/60'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}