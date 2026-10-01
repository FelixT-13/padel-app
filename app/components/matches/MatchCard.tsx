import type { Partido } from '../../types/padel';

type PartidoVisual = Partido & {
  fase?: string;
  nombre?: string;
  pista?: string | number;
  hora?: string;
  ladosPorJugador?: Record<string, 'derecha' | 'reves'>;
};

type MatchCardProps = {
  partido: PartidoVisual;
  matchIndex: number;
  jugadores: string[];
  jugadorSeleccionadoPista: number | null;

  onSeleccionarJugador: (index: number) => void;

  clasePosicionPista: (
    index: number,
    jugadores: string[],
    ladosPorJugador?: Record<string, 'derecha' | 'reves'>
  ) => string;

  etiquetaLado: (lado: string) => string;
  ladoDeJugador: (nombre: string) => string;
};

export default function MatchCard({
  partido,
  matchIndex,
  jugadores,
  jugadorSeleccionadoPista,
  onSeleccionarJugador,
  clasePosicionPista,
  etiquetaLado,
  ladoDeJugador,
}: MatchCardProps) {
  return (
    <article className="rounded-3xl border-2 border-emerald-200 bg-white p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
            {partido.fase === 'pozo'
              ? 'Pozo'
              : partido.fase === 'grupos'
                ? 'Fase de grupos'
                : 'Eliminatoria'}
          </span>

          <h3 className="mt-0.5 text-sm font-black text-slate-900">
            {partido.nombre}
          </h3>
        </div>

        <div className="text-right">
          {partido.pista && (
            <span className="block text-[9px] font-black uppercase text-emerald-700">
              Pista {partido.pista}
            </span>
          )}

          <span className="mt-0.5 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-black text-slate-600">
            {partido.hora}
          </span>
        </div>
      </div>

      <div className="relative mx-auto w-full aspect-[16/9] max-w-[680px] overflow-hidden rounded-[22px] border-[7px] border-slate-300 bg-emerald-600 shadow-inner">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:12px_12px]" />

        <div className="absolute inset-[7%] rounded-lg border-2 border-white/95" />

        <div className="absolute left-1/2 top-[7%] bottom-[7%] border-l-2 border-white/95" />

        <div className="absolute left-[7%] right-[7%] top-1/2 border-t-2 border-white/95" />

        <div className="absolute left-0 right-0 top-0 h-2 border-b border-slate-400/70 bg-slate-200/70" />

        <div className="absolute left-0 right-0 bottom-0 h-2 border-t border-slate-400/70 bg-slate-200/70" />

        <span className="absolute left-2 top-1 text-[7px] font-black tracking-widest text-white/80">
          PADEL · CRISTAL + MALLA
        </span>

        {jugadores.map((name, i) => (
          <button
            key={`${partido.id}-${name}-${i}`}
            type="button"
            onClick={() => onSeleccionarJugador(i)}
            className={`absolute ${clasePosicionPista(
              i,
              jugadores,
              partido.ladosPorJugador
            )} -translate-y-1/2 rounded-xl border-2 px-2.5 py-1.5 text-[8px] font-black shadow-lg transition-all ${
              jugadorSeleccionadoPista === i
                ? 'scale-110 border-lime-300 bg-white text-emerald-700'
                : 'border-white/90 bg-white/95 text-slate-900'
            }`}
          >
            <span className="block max-w-[92px] truncate">
              {name}
            </span>

            <span className="block text-[7px] text-emerald-700">
              {etiquetaLado(
                partido.ladosPorJugador?.[name] ||
                  ladoDeJugador(name)
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-emerald-50 p-3">
          <span className="block text-[8px] font-black uppercase text-emerald-700">
            Pareja A
          </span>

          <b className="mt-1 block text-[10px] text-slate-900">
            {partido.pareja1?.[0]} · {partido.pareja1?.[1]}
          </b>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <span className="block text-[8px] font-black uppercase text-slate-500">
            Pareja B
          </span>

          <b className="mt-1 block text-[10px] text-slate-900">
            {partido.pareja2?.[0]} · {partido.pareja2?.[1]}
          </b>
        </div>
      </div>

      <p className="mt-2 text-center text-[9px] font-bold uppercase tracking-wide text-slate-400">
        Partido {matchIndex + 1} · Los jugadores se muestran en su posición
      </p>
    </article>
  );
}