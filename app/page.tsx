'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Trophy, 
  User, 
  Settings, 
  Check, 
  Users, 
  MapPin, 
  Award, 
  Plus, 
  Shuffle, 
  Flame,
  ArrowUpRight
} from 'lucide-react';

// Jugadores iniciales solicitados
const JUGADORES_INICIALES = [
  { id: '1', nombre: 'Felix', nivel: 4.0, pozos: 6, puntos: 580 },
  { id: '2', nombre: 'Angel', nivel: 3.9, pozos: 5, puntos: 490 },
  { id: '3', nombre: 'Lidia', nivel: 3.8, pozos: 5, puntos: 460 },
  { id: '4', nombre: 'Rober', nivel: 3.5, pozos: 4, puntos: 350 },
];

const EVENTOS_INICIALES = [
  {
    id: 1,
    titulo: 'Pozo Sube-Baja - Nivel 3.5 a 4.5',
    tipo: 'pozo',
    fecha: 'Sábado, 11 Oct • 10:00h',
    club: 'Club Pádel Center (Pistas 1 a 4)',
    plazas_totales: 16,
    plazas_ocupadas: 12,
    precio: 12,
  },
  {
    id: 2,
    titulo: 'Torneo Express Otoño',
    tipo: 'torneo',
    fecha: '24-26 Oct • Categoría Abierta',
    club: 'Pádel Indoor Madrid',
    plazas_totales: 12,
    plazas_ocupadas: 8,
    precio: 20,
  },
];

export default function PadelApp() {
  const [activeTab, setActiveTab] = useState<'eventos' | 'pistas' | 'rankings' | 'admin' | 'perfil'>('eventos');
  
  // Estado dinámico del ranking de jugadores
  const [ranking, setRanking] = useState(JUGADORES_INICIALES);
  const [inscritos, setInscritos] = useState<number[]>([1]);

  // Estado para gestión de Pistas de Salida / Sorteo
  const [pistas, setPistas] = useState([
    { numero: 1, parej1: ['Felix', 'Lidia'], pareja2: ['Angel', 'Rober'] },
    { numero: 2, parej1: ['Jugador 5', 'Jugador 6'], pareja2: ['Jugador 7', 'Jugador 8'] },
  ]);

  // Estado para el Cierre de Pozo
  const [cierreJugador, setCierreJugador] = useState('Felix');
  const [cierrePista, setCierrePista] = useState('1');
  const [cierreGano, setCierreGano] = useState(true);
  const [mensajeExito, setMensajeExito] = useState('');

  // Estado para añadir nuevos jugadores
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoNivel, setNuevoNivel] = useState('3.5');

  // Cálculo de puntos
  const calcularPuntos = (pista: number, gano: boolean) => {
    const base = 100 - (pista - 1) * 25;
    const bonus = pista === 1 ? (gano ? 15 : 0) : (gano ? 10 : 0);
    return Math.max(base + bonus, 10);
  };

  const handleInscribirse = (id: number) => {
    if (inscritos.includes(id)) {
      setInscritos(inscritos.filter((item) => item !== id));
    } else {
      setInscritos([...inscritos, id]);
    }
  };

  // Asignar puntos y actualizar el ranking en vivo
  const handleGuardarCierre = (e: React.FormEvent) => {
    e.preventDefault();
    const pts = calcularPuntos(parseInt(cierrePista), cierreGano);

    setRanking((prev) =>
      prev
        .map((j) => {
          if (j.nombre === cierreJugador) {
            return {
              ...j,
              puntos: j.puntos + pts,
              pozos: j.pozos + 1,
            };
          }
          return j;
        })
        .sort((a, b) => b.puntos - a.puntos)
    );

    setMensajeExito(`¡Se le han sumado +${pts} pts a ${cierreJugador}! Ranking actualizado.`);
    setTimeout(() => setMensajeExito(''), 4000);
  };

  // Añadir un nuevo jugador al ranking
  const handleAgregarJugador = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;

    const nuevo = {
      id: Date.now().toString(),
      nombre: nuevoNombre.trim(),
      nivel: parseFloat(nuevoNivel),
      pozos: 0,
      puntos: 0,
    };

    setRanking((prev) => [...prev, nuevo].sort((a, b) => b.puntos - a.puntos));
    setNuevoNombre('');
    setMensajeExito(`¡${nuevo.nombre} añadido al ranking!`);
    setTimeout(() => setMensajeExito(''), 3000);
  };

  // Sortear parejas al azar para Pistas de Salida
  const handleMezclarPistas = () => {
    const nombres = ranking.map((r) => r.nombre);
    const mezclados = [...nombres].sort(() => Math.random() - 0.5);

    setPistas([
      {
        numero: 1,
        parej1: [mezclados[0] || 'Felix', mezclados[1] || 'Lidia'],
        pareja2: [mezclados[2] || 'Angel', mezclados[3] || 'Rober'],
      },
      {
        numero: 2,
        parej1: ['Jugador A', 'Jugador B'],
        pareja2: ['Jugador C', 'Jugador D'],
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans pb-24 max-w-md mx-auto relative border-x border-gray-800">
      {/* Header Fijo */}
      <header className="sticky top-0 z-10 bg-[#161B22]/90 backdrop-blur-md p-4 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#CCFF00] flex items-center gap-1.5">
            PÁDEL CLUB <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </h1>
          <p className="text-xs text-gray-400">Pozos & Ranking Comunitario</p>
        </div>
        <div className="bg-lime-950 border border-lime-800 text-[#CCFF00] text-xs px-3 py-1 rounded-full font-bold">
          Felix (4.0)
        </div>
      </header>

      {/* Contenido principal */}
      <main className="p-4 space-y-4">
        {/* PESTAÑA 1: EVENTOS */}
        {activeTab === 'eventos' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#CCFF00]" /> Próximos Eventos
            </h2>

            {EVENTOS_INICIALES.map((evento) => {
              const isInscrito = inscritos.includes(evento.id);
              const porcentaje = Math.round((evento.plazas_ocupadas / evento.plazas_totales) * 100);

              return (
                <div key={evento.id} className="bg-[#161B22] border border-gray-800 rounded-xl p-4 space-y-3 shadow-lg">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      evento.tipo === 'pozo' ? 'bg-lime-950 text-[#CCFF00] border border-lime-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {evento.tipo}
                    </span>
                    <span className="text-xs text-gray-400">{evento.fecha}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{evento.titulo}</h3>

                  <div className="text-xs text-gray-400 space-y-1.5">
                    <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-500" /> {evento.club}</p>
                    <p className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-500" /> Plazas: {evento.plazas_ocupadas} / {evento.plazas_totales} jugadores</p>
                    
                    {/* Barra de plazas */}
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#CCFF00] h-full transition-all duration-300" style={{ width: `${porcentaje}%` }} />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-gray-800/80">
                    <span className="text-sm font-extrabold text-white">{evento.precio}€ <span className="text-[10px] font-normal text-gray-400">/jugador</span></span>
                    
                    <button
                      onClick={() => handleInscribirse(evento.id)}
                      className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
                        isInscrito
                          ? 'bg-gray-800 text-lime-400 border border-lime-500/30'
                          : 'bg-[#CCFF00] text-black hover:bg-lime-400'
                      }`}
                    >
                      {isInscrito ? <><Check className="w-4 h-4" /> Apuntado</> : 'Apuntarme'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PESTAÑA 2: PISTAS DE SALIDA / SORTEO */}
        {activeTab === 'pistas' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#CCFF00]" /> Pistas de Salida
                </h2>
                <p className="text-xs text-gray-400">Distribución inicial para Ronda 1</p>
              </div>

              <button
                onClick={handleMezclarPistas}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-lime-400 font-semibold"
              >
                <Shuffle className="w-3.5 h-3.5" /> Sortear
              </button>
            </div>

            {pistas.map((p) => (
              <div key={p.numero} className="bg-[#161B22] border border-gray-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="text-xs font-bold text-[#CCFF00] uppercase tracking-wider">Pista {p.numero}</span>
                  <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded">Ronda 1</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Pareja A</span>
                    <p className="font-semibold text-white">{p.parej1[0]}</p>
                    <p className="font-semibold text-white">{p.parej1[1]}</p>
                  </div>

                  <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Pareja B</span>
                    <p className="font-semibold text-white">{p.pareja2[0]}</p>
                    <p className="font-semibold text-white">{p.pareja2[1]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PESTAÑA 3: RANKING */}
        {activeTab === 'rankings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#CCFF00]" /> Ranking General
              </h2>
              <span className="text-xs text-gray-400">Octubre 2026</span>
            </div>

            <div className="bg-[#161B22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-900/80 text-xs text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Jugador</th>
                    <th className="p-3 text-center">Pozos</th>
                    <th className="p-3 text-right">Puntos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {ranking.map((jugador, index) => (
                    <tr key={jugador.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="p-3 font-bold text-gray-400 text-xs">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
                      </td>
                      <td className="p-3 font-semibold text-white">
                        {jugador.nombre}
                        <span className="block text-[10px] font-normal text-gray-400">Nivel {jugador.nivel.toFixed(1)}</span>
                      </td>
                      <td className="p-3 text-center text-gray-400 text-xs">{jugador.pozos}</td>
                      <td className="p-3 text-right font-extrabold text-[#CCFF00]">{jugador.puntos} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 4: ADMIN / CIERRE Y AÑADIR JUGADORES */}
        {activeTab === 'admin' && (
          <div className="space-y-5">
            {mensajeExito && (
              <div className="bg-lime-950/90 border border-[#CCFF00] text-[#CCFF00] p-3 rounded-lg text-xs font-semibold animate-pulse">
                {mensajeExito}
              </div>
            )}

            {/* Formulario Cierre de Pozo */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-[#CCFF00]" /> Cierre y Asignación de Puntos
              </h2>
              <p className="text-xs text-gray-400">Registra el puesto final de cada jugador al terminar el pozo.</p>

              <form onSubmit={handleGuardarCierre} className="bg-[#161B22] border border-gray-800 p-4 rounded-xl space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Seleccionar Jugador</label>
                  <select
                    value={cierreJugador}
                    onChange={(e) => setCierreJugador(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                  >
                    {ranking.map((j) => (
                      <option key={j.id} value={j.nombre}>{j.nombre} (Actual: {j.puntos} pts)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Pista Final alcanzada</label>
                  <select
                    value={cierrePista}
                    onChange={(e) => setCierrePista(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="1">Pista 1 (Rey) - Base 100 pts</option>
                    <option value="2">Pista 2 - Base 75 pts</option>
                    <option value="3">Pista 3 - Base 50 pts</option>
                    <option value="4">Pista 4 - Base 25 pts</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-800">
                  <span className="text-xs font-medium">¿Ganó el último partido?</span>
                  <button
                    type="button"
                    onClick={() => setCierreGano(!cierreGano)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      cierreGano ? 'bg-[#CCFF00] text-black' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {cierreGano ? 'SÍ (+Bonus)' : 'NO (+0 pts)'}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#CCFF00] text-black font-extrabold py-3 rounded-lg text-sm hover:bg-lime-400 transition-all flex items-center justify-center gap-1.5"
                >
                  <ArrowUpRight className="w-4 h-4" /> Sumar Puntos al Ranking
                </button>
              </form>
            </div>

            {/* Formulario Añadir Nuevo Jugador */}
            <div className="space-y-3 pt-2 border-t border-gray-800">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#CCFF00]" /> Añadir Nuevo Jugador
              </h3>

              <form onSubmit={handleAgregarJugador} className="bg-[#161B22] border border-gray-800 p-4 rounded-xl space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Nombre (ej. Pablo)"
                      value={nuevoNombre}
                      onChange={(e) => setNuevoNombre(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Nivel (3.5)"
                      value={nuevoNivel}
                      onChange={(e) => setNuevoNivel(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded-lg text-xs border border-gray-700 transition-all"
                >
                  Guardar Jugador
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PESTAÑA 5: PERFIL */}
        {activeTab === 'perfil' && (
          <div className="space-y-4">
            <div className="bg-[#161B22] border border-gray-800 rounded-xl p-5 text-center space-y-3 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#CCFF00] to-lime-600 rounded-full mx-auto flex items-center justify-center text-black font-extrabold text-xl shadow-lg">
                FX
              </div>
              <div>
                <h2 className="text-lg font-bold">Felix</h2>
                <p className="text-xs text-gray-400">Jugador de Pádel</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800 text-left">
                <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                  <span className="block text-[10px] text-gray-400">Nivel Estimado</span>
                  <span className="text-sm font-extrabold text-[#CCFF00]">4.0</span>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                  <span className="block text-[10px] text-gray-400">Pozos Jugados</span>
                  <span className="text-sm font-extrabold text-white">6 ses.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navegación Inferior Fija */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#161B22]/95 backdrop-blur-lg border-t border-gray-800 p-2 max-w-md mx-auto z-20">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab('eventos')}
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-all ${
              activeTab === 'eventos' ? 'text-[#CCFF00]' : 'text-gray-400'
            }`}
          >
            <Calendar className="w-5 h-5" /> Eventos
          </button>

          <button
            onClick={() => setActiveTab('pistas')}
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-all ${
              activeTab === 'pistas' ? 'text-[#CCFF00]' : 'text-gray-400'
            }`}
          >
            <Users className="w-5 h-5" /> Pistas
          </button>

          <button
            onClick={() => setActiveTab('rankings')}
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-all ${
              activeTab === 'rankings' ? 'text-[#CCFF00]' : 'text-gray-400'
            }`}
          >
            <Trophy className="w-5 h-5" /> Ranking
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-all ${
              activeTab === 'admin' ? 'text-[#CCFF00]' : 'text-gray-400'
            }`}
          >
            <Settings className="w-5 h-5" /> Cierre
          </button>

          <button
            onClick={() => setActiveTab('perfil')}
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-all ${
              activeTab === 'perfil' ? 'text-[#CCFF00]' : 'text-gray-400'
            }`}
          >
            <User className="w-5 h-5" /> Perfil
          </button>
        </div>
      </nav>
    </div>
  );
}