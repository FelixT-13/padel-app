'use client';

import React, { useState } from 'react';
import { Calendar, Trophy, User, Settings, Check, Users, MapPin, Award } from 'lucide-react';

// Datos de prueba iniciales
const MOCK_EVENTOS = [
  {
    id: 1,
    titulo: 'Pozo Sube-Baja - Nivel 3.5 a 4.5',
    tipo: 'pozo',
    fecha: 'Sábado, 11 Oct • 10:00h',
    club: 'Club Pádel Center (Pistas 1 a 4)',
    plazas_totales: 16,
    plazas_ocupadas: 12,
    precio: 12,
    estado: 'abierto',
  },
  {
    id: 2,
    titulo: 'I Torneo Otoño (Grupos + Cuadro)',
    tipo: 'torneo',
    fecha: '24-26 Oct • Categoría 3ª',
    club: 'Pádel Indoor Madrid',
    plazas_totales: 12,
    plazas_ocupadas: 8,
    precio: 20,
    estado: 'abierto',
  },
];

const MOCK_RANKING = [
  { id: '1', nombre: 'Carlos M.', nivel: 4.0, pozos: 5, puntos: 515 },
  { id: '2', nombre: 'Dani R.', nivel: 3.9, pozos: 5, puntos: 485 },
  { id: '3', nombre: 'Alex G.', nivel: 4.1, pozos: 4, puntos: 390 },
  { id: '4', nombre: 'Santi L.', nivel: 3.5, pozos: 4, puntos: 310 },
  { id: '5', nombre: 'Juan P.', nivel: 3.8, pozos: 3, puntos: 250 },
];

export default function PadelApp() {
  const [activeTab, setActiveTab] = useState<'eventos' | 'rankings' | 'admin' | 'perfil'>('eventos');
  const [inscritos, setInscritos] = useState<number[]>([1]);

  // Estado para el panel de Cierre de Pozo
  const [cierrePista, setCierrePista] = useState('1');
  const [cierreGano, setCierreGano] = useState(true);
  const [cierreJugador, setCierreJugador] = useState('Carlos M.');
  const [mensajeExito, setMensajeExito] = useState('');

  // Cálculo automático de puntos según pista final y resultado
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

  const handleGuardarCierre = (e: React.FormEvent) => {
    e.preventDefault();
    const pts = calcularPuntos(parseInt(cierrePista), cierreGano);
    setMensajeExito(`¡Puntos asignados a ${cierreJugador}! Se le han sumado ${pts} pts en el Ranking.`);
    setTimeout(() => setMensajeExito(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans pb-24 max-w-md mx-auto relative border-x border-gray-800">
      {/* Header Fijo */}
      <header className="sticky top-0 z-10 bg-[#161B22]/90 backdrop-blur-md p-4 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#CCFF00]">PÁDEL CLUB</h1>
          <p className="text-xs text-gray-400">Pozos & Ranking Comunitario</p>
        </div>
        <div className="bg-gray-800 text-xs px-2.5 py-1 rounded-full text-gray-300 font-medium">
          Nivel 3.85
        </div>
      </header>

      {/* Contenido principal */}
      <main className="p-4 space-y-4">
        {/* PESTAÑA 1: EVENTOS */}
        {activeTab === 'eventos' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#CCFF00]" /> Próximos Pozos y Torneos
            </h2>

            {MOCK_EVENTOS.map((evento) => {
              const isInscrito = inscritos.includes(evento.id);
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

                  <div className="text-xs text-gray-400 space-y-1">
                    <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-500" /> {evento.club}</p>
                    <p className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-500" /> Plazas: {evento.plazas_ocupadas} / {evento.plazas_totales} jugadores</p>
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

        {/* PESTAÑA 2: RANKINGS */}
        {activeTab === 'rankings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#CCFF00]" /> Ranking Pozos
              </h2>
              <span className="text-xs text-gray-400">Octubre 2026</span>
            </div>

            <div className="bg-[#161B22] border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-900/60 text-xs text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Jugador</th>
                    <th className="p-3 text-center">Pozos</th>
                    <th className="p-3 text-right">Puntos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {MOCK_RANKING.map((jugador, index) => (
                    <tr key={jugador.id} className="hover:bg-gray-800/30">
                      <td className="p-3 font-bold text-gray-400">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </td>
                      <td className="p-3 font-semibold text-white">
                        {jugador.nombre}
                        <span className="block text-[10px] font-normal text-gray-500">Nivel {jugador.nivel}</span>
                      </td>
                      <td className="p-3 text-center text-gray-400">{jugador.pozos}</td>
                      <td className="p-3 text-right font-extrabold text-[#CCFF00]">{jugador.puntos} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: ADMIN CIERRE DE POZO */}
        {activeTab === 'admin' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#CCFF00]" /> Cierre Rápido de Pozo
            </h2>
            <p className="text-xs text-gray-400">Registra en qué pista terminó cada jugador al finalizar el pozo para calcular los puntos del ranking.</p>

            {mensajeExito && (
              <div className="bg-lime-950/80 border border-[#CCFF00] text-[#CCFF00] p-3 rounded-lg text-xs font-semibold">
                {mensajeExito}
              </div>
            )}

            <form onSubmit={handleGuardarCierre} className="bg-[#161B22] border border-gray-800 p-4 rounded-xl space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Jugador</label>
                <select
                  value={cierreJugador}
                  onChange={(e) => setCierreJugador(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                >
                  {MOCK_RANKING.map((j) => (
                    <option key={j.id} value={j.nombre}>{j.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Pista Final en la que terminó</label>
                <select
                  value={cierrePista}
                  onChange={(e) => setCierrePista(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                >
                  <option value="1">Pista 1 (Pista del Rey) - Base 100 pts</option>
                  <option value="2">Pista 2 - Base 75 pts</option>
                  <option value="3">Pista 3 - Base 50 pts</option>
                  <option value="4">Pista 4 - Base 25 pts</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-800">
                <span className="text-xs font-medium">¿Ganó el último partido de su pista?</span>
                <button
                  type="button"
                  onClick={() => setCierreGano(!cierreGano)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    cierreGano ? 'bg-[#CCFF00] text-black' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {cierreGano ? 'SÍ (+10/15 pts)' : 'NO (+0 pts)'}
                </button>
              </div>

              <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800/80 text-xs space-y-1">
                <span className="text-gray-400">Total puntos a asignar en este pozo:</span>
                <div className="text-lg font-black text-[#CCFF00]">
                  {calcularPuntos(parseInt(cierrePista), cierreGano)} PTS
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#CCFF00] text-black font-extrabold py-3 rounded-lg text-sm hover:bg-lime-400 transition-all"
              >
                Guardar y Sumar Puntos al Ranking
              </button>
            </form>
          </div>
        )}

        {/* PESTAÑA 4: MI PERFIL */}
        {activeTab === 'perfil' && (
          <div className="space-y-4">
            <div className="bg-[#161B22] border border-gray-800 rounded-xl p-5 text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#CCFF00] to-lime-600 rounded-full mx-auto flex items-center justify-center text-black font-extrabold text-xl shadow-lg">
                CM
              </div>
              <div>
                <h2 className="text-lg font-bold">Carlos M.</h2>
                <p className="text-xs text-gray-400">Jugador de Pádel</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800 text-left">
                <div className="bg-gray-900 p-3 rounded-lg">
                  <span className="block text-[10px] text-gray-400">Nivel Playtomic</span>
                  <span className="text-sm font-extrabold text-[#CCFF00]">3.85</span>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg">
                  <span className="block text-[10px] text-gray-400">Pozos Jugados</span>
                  <span className="text-sm font-extrabold text-white">5 ses.</span>
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
            <Award className="w-5 h-5" /> Cierre
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