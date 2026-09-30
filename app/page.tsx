'use client';

import React, { useState } from 'react';
import { 
  Calendar, Trophy, User, Settings, Users, 
  MapPin, Award, Plus, Shuffle, Share2, 
  CheckCircle2
} from 'lucide-react';

const JUGADORES_INICIALES = [
  { id: '1', nombre: 'Felix', nivel: 4.0, pozos: 6, puntos: 580, racha: '3W' },
  { id: '2', nombre: 'Angel', nivel: 3.9, pozos: 5, puntos: 490, racha: '1W' },
  { id: '3', nombre: 'Lidia', nivel: 3.8, pozos: 5, puntos: 460, racha: '2W' },
  { id: '4', nombre: 'Rober', nivel: 3.5, pozos: 4, puntos: 350, racha: '1L' },
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
  const [activeTab, setActiveTab] = useState<'eventos' | 'pistas' | 'rankings' | 'admin'>('eventos');
  const [ranking, setRanking] = useState(JUGADORES_INICIALES);
  const [inscritos, setInscritos] = useState<number[]>([1]); // Felix inscrito en el 1 por defecto

  const [pistas, setPistas] = useState([
    { numero: 1, nombre: 'Pista Central', parej1: ['Felix', 'Lidia'], pareja2: ['Angel', 'Rober'] },
    { numero: 2, nombre: 'Pista 2', parej1: ['Jugador 5', 'Jugador 6'], pareja2: ['Jugador 7', 'Jugador 8'] },
  ]);

  const [cierreJugador, setCierreJugador] = useState('Felix');
  const [cierrePista, setCierrePista] = useState('1');
  const [cierreGano, setCierreGano] = useState(true);
  const [mensajeExito, setMensajeExito] = useState('');

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoNivel, setNuevoNivel] = useState('3.5');

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
      prev
        .map((j) => {
          if (j.nombre === cierreJugador) {
            return { ...j, puntos: j.puntos + pts, pozos: j.pozos + 1 };
          }
          return j;
        })
        .sort((a, b) => b.puntos - a.puntos)
    );

    setMensajeExito(`¡+${pts} Puntos para ${cierreJugador}!`);
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleAgregarJugador = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;

    const nuevo = {
      id: Date.now().toString(),
      nombre: nuevoNombre.trim(),
      nivel: parseFloat(nuevoNivel),
      pozos: 0,
      puntos: 0,
      racha: '-',
    };

    setRanking((prev) => [...prev, nuevo].sort((a, b) => b.puntos - a.puntos));
    setNuevoNombre('');
    setMensajeExito(`¡${nuevo.nombre} añadido al club!`);
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleMezclarPistas = () => {
    const nombres = ranking.map((r) => r.nombre);
    const mezclados = [...nombres].sort(() => Math.random() - 0.5);

    setPistas([
      {
        numero: 1,
        nombre: 'Pista Central',
        parej1: [mezclados[0] || 'Felix', mezclados[1] || 'Lidia'],
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
    const texto = `🎾 *${evento.tipo.toUpperCase()} - PÁDEL CLUB* 🎾\n\n🏆 *${evento.titulo}*\n📅 *Fecha:* ${evento.fecha}\n📍 *Lugar:* ${evento.club}\n\n👉 ¡Apúntate en nuestra app!`;
    if (navigator.share) {
      navigator.share({ title: evento.titulo, text: texto, url: window.location.href }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-32 max-w-md mx-auto relative shadow-2xl overflow-x-hidden">
      {/* Header Premium Light */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl p-5 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">
            P
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              PádelClub
            </h1>
            <p className="text-xs text-slate-500 font-medium">Torneos & Pozos</p>
          </div>
        </div>
        <button className="bg-slate-100 hover:bg-slate-200 text-indigo-600 text-sm p-2 rounded-xl font-bold transition-colors">
          <User className="w-5 h-5" />
        </button>
      </header>

      <main className="p-5 space-y-6 animate-in fade-in duration-300">
        
        {/* EVENTOS */}
        {activeTab === 'eventos' && (
          <div className="space-y-5">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Próximos Eventos</h2>
            
            <div className="space-y-5">
              {EVENTOS_INICIALES.map((evento) => {
                const isInscrito = inscritos.includes(evento.id);
                const isPozo = evento.tipo === 'Pozo';
                const pct = Math.round((evento.plazas_ocupadas / evento.plazas_totales) * 100);

                return (
                  <div key={evento.id} className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 relative overflow-hidden transition-all">
                    {/* Elemento decorativo de fondo */}
                    <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-60 ${isPozo ? 'bg-emerald-200' : 'bg-indigo-200'}`}></div>
                    
                    <div className="flex justify-between items-start relative z-10">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        isPozo ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {evento.tipo}
                      </span>
                      <button onClick={() => compartirEvento(evento)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-4 relative z-10">
                      <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{evento.titulo}</h3>
                      <div className="mt-3 space-y-2 text-sm font-medium text-slate-500">
                        <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> {evento.fecha}</p>
                        <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {evento.club}</p>
                      </div>
                    </div>

                    <div className="mt-5 pt-5 border-t border-slate-100 relative z-10">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-slate-500">Ocupación</span>
                        <span className="text-slate-900">{evento.plazas_ocupadas} / {evento.plazas_totales}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${isPozo ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3 relative z-10">
                      <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                        <span className="block text-lg font-black text-slate-900">{evento.precio}€</span>
                      </div>
                      <button
                        onClick={() => handleInscribirse(evento.id)}
                        className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm ${
                          isInscrito
                            ? 'bg-slate-900 text-white'
                            : (isPozo ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200')
                        }`}
                      >
                        {isInscrito ? <><CheckCircle2 className="w-5 h-5" /> Apuntado</> : 'Inscribirme'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PISTAS DE SALIDA - ESTILO WPT (AZUL) */}
        {activeTab === 'pistas' && (
          <div className="space-y-5">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Pistas</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Distribución de la ronda</p>
              </div>
              <button
                onClick={handleMezclarPistas}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2 font-bold active:scale-95 transition-all shadow-md shadow-indigo-600/20"
              >
                <Shuffle className="w-4 h-4" /> Sortear
              </button>
            </div>

            {pistas.map((p) => (
              <div key={p.numero} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    {p.nombre}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-lg">Ronda 1</span>
                </div>

                {/* Pista Realista Azul WPT */}
                <div className="relative bg-[#2068A8] h-48 rounded-xl p-2 w-full border-[6px] border-slate-200 flex flex-col justify-between overflow-hidden shadow-inner">
                  {/* Líneas perimetrales e interiores */}
                  <div className="absolute inset-1 border-2 border-white/60 pointer-events-none"></div>
                  <div className="absolute top-1/2 left-0 right-0 border-t-[3px] border-white shadow-[0_4px_10px_rgba(0,0,0,0.4)] w-full -translate-y-1/2 z-10"></div>
                  <div className="absolute top-1 bottom-1 left-1/2 border-l-2 border-white/60 -translate-x-1/2 pointer-events-none z-0"></div>
                  <div className="absolute top-1/4 left-1 right-1 border-t-2 border-white/60 pointer-events-none z-0"></div>
                  <div className="absolute bottom-1/4 left-1 right-1 border-t-2 border-white/60 pointer-events-none z-0"></div>

                  {/* Pareja 1 (Arriba) */}
                  <div className="relative z-20 flex justify-center items-center h-full pb-2">
                     <div className="bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg text-center flex gap-3 items-center border border-white/30">
                        <span className="text-xs font-black text-slate-900">{p.parej1[0]}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-xs font-black text-slate-900">{p.parej1[1]}</span>
                     </div>
                  </div>
                  
                  {/* Pareja 2 (Abajo) */}
                  <div className="relative z-20 flex justify-center items-center h-full pt-2">
                     <div className="bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg text-center flex gap-3 items-center border border-white/30">
                        <span className="text-xs font-black text-slate-900">{p.pareja2[0]}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-xs font-black text-slate-900">{p.pareja2[1]}</span>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RANKING */}
        {activeTab === 'rankings' && (
          <div className="space-y-5">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Clasificación</h2>
            
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
              {/* TOP 1 Destacado */}
              {ranking.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 text-white relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white text-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">🥇</div>
                      <div>
                        <h3 className="text-xl font-black">{ranking[0].nombre}</h3>
                        <p className="text-indigo-100 text-xs font-medium mt-0.5">Líder Absoluto • {ranking[0].racha}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black block">{ranking[0].puntos}</span>
                      <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">PTS</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Resto de la Lista */}
              <div className="p-2">
                {ranking.slice(1).map((jugador, index) => (
                  <div key={jugador.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="w-6 text-center text-sm font-black text-slate-400">
                        {index === 0 ? '🥈' : index === 1 ? '🥉' : `${index + 3}º`}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{jugador.nombre}</h4>
                        <p className="text-xs text-slate-500 font-medium">Nivel {jugador.nivel.toFixed(1)} • {jugador.pozos} pozos</p>
                      </div>
                    </div>
                    <span className="font-black text-indigo-600">{jugador.puntos} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN / CIERRE */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Gestión de Club</h2>

            {mensajeExito && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm">
                <CheckCircle2 className="w-5 h-5" /> {mensajeExito}
              </div>
            )}

            {/* Formulario Cierre */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-5">
              <h3 className="font-black text-slate-900 flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-indigo-600" /> Cierre de Pozo
              </h3>

              <form onSubmit={handleGuardarCierre} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Jugador</label>
                  <select
                    value={cierreJugador}
                    onChange={(e) => setCierreJugador(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  >
                    {ranking.map((j) => (
                      <option key={j.id} value={j.nombre}>{j.nombre} ({j.puntos} pts)</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Pista Final</label>
                  <select
                    value={cierrePista}
                    onChange={(e) => setCierrePista(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  >
                    <option value="1">Pista 1 (Central) - Base 100 pts</option>
                    <option value="2">Pista 2 - Base 75 pts</option>
                    <option value="3">Pista 3 - Base 50 pts</option>
                    <option value="4">Pista 4 - Base 25 pts</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-sm font-bold text-slate-700">¿Ganó su último partido?</span>
                  <button
                    type="button"
                    onClick={() => setCierreGano(!cierreGano)}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                      cierreGano ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {cierreGano ? 'SÍ (+Bonus)' : 'NO (+0 pts)'}
                  </button>
                </div>

                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl text-sm transition-all active:scale-95 shadow-lg">
                  Guardar Resultado
                </button>
              </form>
            </div>

            {/* Formulario Añadir Jugador */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-4">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" /> Nuevo Jugador
              </h3>

              <form onSubmit={handleAgregarJugador} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Nivel"
                    value={nuevoNivel}
                    onChange={(e) => setNuevoNivel(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
                <button type="submit" className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl text-sm transition-all active:scale-95">
                  Añadir al Club
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Navegación Flotante Píldora (Ingeniosa y Premium) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-slate-200/50 p-2 rounded-3xl z-40 shadow-[0_10px_40px_rgb(0,0,0,0.1)] w-[90%] max-w-sm">
        <div className="flex justify-between items-center px-2">
          {[
            { id: 'eventos', icon: Calendar, label: 'Inicio' },
            { id: 'pistas', icon: Users, label: 'Pistas' },
            { id: 'rankings', icon: Trophy, label: 'Ranking' },
            { id: 'admin', icon: Settings, label: 'Cierre' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center gap-1 p-2.5 px-4 rounded-2xl transition-all duration-300 ${
                  isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {isActive && (
                  <span className="text-[10px] font-bold">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}