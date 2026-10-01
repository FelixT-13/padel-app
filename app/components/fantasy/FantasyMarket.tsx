import type { Jugador } from '../../types/padel';

type FantasyJugador = Jugador & {
  fantasyPts: number;
  valor: number;
};

type FantasyMarketProps = {
  fantasyPts: number;
  fantasySaldo: number;
  fantasyEquipo: string[];
  fantasySeleccionados: FantasyJugador[];
  fantasyMercado: FantasyJugador[];

  handleVenderFantasy: (jugadorId: string) => void;
  handleComprarFantasy: (jugadorId: string) => void;
};

export default function FantasyMarket({
  fantasyPts,
  fantasySaldo,
  fantasyEquipo,
  fantasySeleccionados,
  fantasyMercado,
  handleVenderFantasy,
  handleComprarFantasy,
}: FantasyMarketProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="rounded-3xl bg-white border border-emerald-200 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
              Fantasy Padel
            </span>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              Fíchalos. Véndelos. Compite.
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Empiezas con 10 M y puedes fichar hasta 2 jugadores que ya hayan
              disputado un torneo. Con 100 puntos el valor se mantiene; por
              encima sube y por debajo baja, hasta un mínimo de 0,5 M.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="block text-2xl font-black text-emerald-600">
              {fantasyPts}
            </span>

            <span className="text-[9px] uppercase font-bold text-slate-400">
              pts Fantasy
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-slate-50 p-3">
            <span className="block text-[9px] font-black uppercase text-slate-400">
              Presupuesto inicial
            </span>

            <b className="mt-1 block text-lg text-slate-900">
              10,0 M
            </b>

            <span className="text-[9px] text-slate-500">
              Disponible: {fantasySaldo.toFixed(1)} M
            </span>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-3">
            <span className="block text-[9px] font-black uppercase text-emerald-600">
              Plazas de equipo
            </span>

            <b className="mt-1 block text-lg text-emerald-800">
              {fantasyEquipo.length}/2
            </b>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-black text-slate-900">
              Mi equipo
            </h3>

            <p className="text-[10px] text-slate-500">
              Compra 2 jugadores para competir esta jornada.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black text-slate-600">
            {fantasyEquipo.length}/2
          </span>
        </div>

        {fantasySeleccionados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center">
            <div className="text-2xl">🏓</div>

            <p className="mt-1 text-xs font-black text-slate-800">
              Aún no tienes jugadores
            </p>

            <p className="text-[10px] text-slate-500">
              Los fichajes se desbloquean cuando el jugador ya ha disputado su
              primer torneo.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {fantasySeleccionados.map((j) => (
              <div
                key={j.id}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"
              >
                <div>
                  <b className="block text-xs text-slate-900">
                    {j.nombre}
                  </b>

                  <span className="text-[9px] font-bold text-slate-500">
                    {j.lado === 'derecha' ? 'Derecha' : 'Revés'} ·{' '}
                    {j.fantasyPts} pts
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <b className="block text-xs text-emerald-700">
                      {j.valor.toFixed(1)} M
                    </b>

                    <span className="block text-[8px] font-bold text-slate-400">
                      valor
                    </span>
                  </div>

                  <button
                    onClick={() => handleVenderFantasy(j.id)}
                    className="rounded-lg bg-white border border-slate-200 px-2 py-1 text-[9px] font-black uppercase text-slate-600 hover:border-red-200 hover:text-red-600"
                  >
                    Vender
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900">
              Mercado de hoy
            </h3>

            <p className="mt-1 text-[10px] text-slate-500">
              Solo salen jugadores que ya han disputado un torneo. 100 puntos
              mantienen el valor y el resto de resultados lo ajustan.
            </p>
          </div>

          <span className="text-[9px] font-black uppercase text-emerald-600">
            Compra / venta
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {fantasyMercado.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-xs font-bold text-slate-500">
              Todavía no hay jugadores con un torneo disputado. Aparecerán aquí
              al cerrar su primer torneo.
            </div>
          ) : (
            fantasyMercado.map((j) => {
              const elegido = fantasyEquipo.includes(j.id);
              const puedeComprar =
                !elegido &&
                fantasyEquipo.length < 2 &&
                fantasySaldo >= j.valor;

              return (
                <div
                  key={j.id}
                  className="flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <b className="text-xs truncate text-slate-900">
                        {j.nombre}
                      </b>

                      <span className="text-[8px] font-black uppercase text-slate-400">
                        {j.lado}
                      </span>
                    </div>

                    <div className="mt-1 flex gap-3 text-[9px] text-slate-500">
                      <span>{j.fantasyPts} pts Fantasy</span>

                      <span>
                        1.º torneo: {j.primerTorneoPuntos ?? 0} pts
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <b className="block text-xs text-slate-900">
                        {j.valor.toFixed(1)} M
                      </b>

                      <span className="block text-[8px] font-bold text-slate-400">
                        valor
                      </span>
                    </div>

                    {elegido ? (
                      <button
                        onClick={() => handleVenderFantasy(j.id)}
                        className="rounded-xl bg-white border border-slate-200 px-2.5 py-1.5 text-[9px] font-black uppercase text-red-600"
                      >
                        Vender
                      </button>
                    ) : (
                      <button
                        disabled={!puedeComprar}
                        onClick={() => handleComprarFantasy(j.id)}
                        className={`rounded-xl px-2.5 py-1.5 text-[9px] font-black uppercase ${
                          puedeComprar
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Fichar
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}