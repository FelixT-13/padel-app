import type { Jugador } from '../../types/padel';

type TipoRanking = 'pozos' | 'torneos';

type RankingTableProps = {
  tipoRanking: TipoRanking;
  setTipoRanking: (tipo: TipoRanking) => void;
  rankingOrdenado: Jugador[];
};

export default function RankingTable({
  tipoRanking,
  setTipoRanking,
  rankingOrdenado,
}: RankingTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-black tracking-widest text-slate-500 uppercase flex items-center gap-2">
          <span className="text-base">🏆</span> Rankings independientes
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-white p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setTipoRanking('pozos')}
          className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            tipoRanking === 'pozos'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          ⚡ Ranking Pozos
        </button>

        <button
          onClick={() => setTipoRanking('torneos')}
          className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            tipoRanking === 'torneos'
              ? 'bg-amber-400 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          🏆 Ranking Torneos
        </button>
      </div>

      <div className="bg-white/90 border-2 border-emerald-200 rounded-3xl overflow-hidden shadow-xl">
        {rankingOrdenado.length > 0 && (
          <div
            className={`p-4 text-white flex items-center justify-between ${
              tipoRanking === 'pozos'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                : 'bg-gradient-to-r from-amber-400 to-amber-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-950 text-slate-900 font-black text-lg flex items-center justify-center">
                🥇
              </div>

              <div>
                <h3 className="text-base font-black">
                  {rankingOrdenado[0].nombre}
                </h3>

                <p className="text-[10px] font-extrabold text-slate-900 uppercase">
                  {tipoRanking === 'pozos'
                    ? 'Líder de Pozos'
                    : 'Campeón de Torneos'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-black block">
                {tipoRanking === 'pozos'
                  ? rankingOrdenado[0].puntosPozos
                  : rankingOrdenado[0].puntosTorneos}
              </span>

              <span className="text-[9px] font-black uppercase">
                PUNTOS
              </span>
            </div>
          </div>
        )}

        <div className="divide-y divide-cyan-900/60 p-1">
          {rankingOrdenado.slice(1).map((jugador, index) => (
            <div
              key={jugador.id}
              className="flex items-center justify-between p-3.5 hover:bg-[#f4f7f5]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center text-xs font-black text-emerald-700">
                  {index === 0
                    ? '🥈'
                    : index === 1
                      ? '🥉'
                      : `${index + 3}º`}
                </span>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">
                    {jugador.nombre}
                  </h4>

                  <p className="text-[10px] text-slate-500">
                    Nivel {jugador.nivel.toFixed(1)} •{' '}
                    {tipoRanking === 'pozos'
                      ? `${jugador.pozos} pozos`
                      : `${jugador.torneosJugados} torneos`}
                  </p>
                </div>
              </div>

              <span className="font-black text-xs text-emerald-700">
                {tipoRanking === 'pozos'
                  ? `${jugador.puntosPozos} pts`
                  : `${jugador.puntosTorneos} pts`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}