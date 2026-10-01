import type { Dispatch, SetStateAction } from 'react';
import { Calendar, MapPin } from 'lucide-react';

import type { Evento, Jugador } from '../../types/padel';

type ModoInscripcion = 'pareja' | 'solo';
type Lado = 'derecha' | 'reves';

type EventCardProps = {
  evento: Evento;
  inscrito: boolean;

  miInscripcionExiste: boolean;

  onVerMisPartidos: (evento: Evento) => void;
  onBorrarme: (eventoId: number) => void;

  eventoRegistrandoId: number | null;
  setEventoRegistrandoId: Dispatch<SetStateAction<number | null>>;

  nombreParejaInput: string;
  setNombreParejaInput: Dispatch<SetStateAction<string>>;

  ladoInscripcion: Lado;
  setLadoInscripcion: Dispatch<SetStateAction<Lado>>;

  ladoParejaInscripcion: Lado;
  setLadoParejaInscripcion: Dispatch<SetStateAction<Lado>>;

  modoInscripcion: ModoInscripcion;
  setModoInscripcion: Dispatch<SetStateAction<ModoInscripcion>>;

  miPerfilNombre: string;
  miPerfilLado: Lado;

  ranking: Jugador[];
  participantesEventoMap: Record<number, string[]>;

  jugadoresSinParejaMap: Record<number, string[]>;

  onAbrirInvitacion: (eventoId: number) => void;
  onConfirmarInscripcion: (eventoId: number) => void;
};

export default function EventCard({
  evento,
  inscrito,
  miInscripcionExiste,
  onVerMisPartidos,
  onBorrarme,
  eventoRegistrandoId,
  setEventoRegistrandoId,
  nombreParejaInput,
  setNombreParejaInput,
  ladoInscripcion,
  setLadoInscripcion,
  ladoParejaInscripcion,
  setLadoParejaInscripcion,
  modoInscripcion,
  setModoInscripcion,
  miPerfilNombre,
  miPerfilLado,
  ranking,
  participantesEventoMap,
  jugadoresSinParejaMap,
  onAbrirInvitacion,
  onConfirmarInscripcion,
}: EventCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm">
      <div
        className={`h-2 ${
          evento.tipo === 'Pozo' ? 'bg-emerald-500' : 'bg-amber-400'
        }`}
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className={`inline-flex rounded-full px-2 py-1 text-[9px] font-black uppercase ${
                evento.tipo === 'Pozo'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {evento.tipo}
            </span>

            <h3 className="mt-2 text-base font-black text-slate-900">
              {evento.titulo}
            </h3>
          </div>

          <span className="rounded-xl bg-slate-100 px-2 py-1 text-xs font-black text-slate-800">
            €{evento.precioUnitario}
          </span>
        </div>

        <div className="mt-4 grid gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-800">
            <Calendar className="h-4 w-4 shrink-0 text-emerald-600" />
            <strong>{evento.fecha}</strong>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              evento.club
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-semibold text-slate-800 underline decoration-emerald-400 underline-offset-2"
          >
            <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{evento.club}</span>
          </a>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-slate-600">
            {evento.plazas_ocupadas}/{evento.plazas_totales} parejas inscritas
          </span>

          {inscrito ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onVerMisPartidos(evento)}
                className="rounded-xl bg-slate-900 px-3 py-2 text-[10px] font-black uppercase text-white"
              >
                Ver mis partidos
              </button>

              {miInscripcionExiste && (
                <button
                  onClick={() => onBorrarme(evento.id)}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] font-black uppercase text-rose-600"
                >
                  Borrarme
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setEventoRegistrandoId(evento.id);
                setNombreParejaInput('');
                setModoInscripcion('pareja');
                setLadoInscripcion(miPerfilLado);
                setLadoParejaInscripcion(
                  miPerfilLado === 'derecha' ? 'reves' : 'derecha'
                );
              }}
              className="rounded-xl bg-emerald-500 px-3 py-2 text-[10px] font-black uppercase text-white shadow-md"
            >
              Apuntarme
            </button>
          )}
        </div>

        {eventoRegistrandoId === evento.id && (
          <div className="mt-3 space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                Inscripción al {evento.tipo}
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                El lado es informativo para colocar a cada jugador en pista.
                El sorteo siempre es aleatorio.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[9px] font-black uppercase text-slate-500">
                  Tu lado
                </label>

                <select
                  value={ladoInscripcion}
                  onChange={(e) =>
                    setLadoInscripcion(e.target.value as Lado)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-900"
                >
                  <option value="derecha">Derecha</option>
                  <option value="reves">Revés</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[9px] font-black uppercase text-slate-500">
                  Lado pareja
                </label>

                <select
                  value={ladoParejaInscripcion}
                  onChange={(e) =>
                    setLadoParejaInscripcion(e.target.value as Lado)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-900"
                >
                  <option value="derecha">Derecha</option>
                  <option value="reves">Revés</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setModoInscripcion('pareja')}
                className={`rounded-xl p-2.5 text-[10px] font-black uppercase ${
                  modoInscripcion === 'pareja'
                    ? 'bg-emerald-500 text-white'
                    : 'border border-slate-200 bg-white text-slate-500'
                }`}
              >
                👥 Tengo pareja
              </button>

              <button
                type="button"
                onClick={() => setModoInscripcion('solo')}
                className={`rounded-xl p-2.5 text-[10px] font-black uppercase ${
                  modoInscripcion === 'solo'
                    ? 'bg-amber-400 text-white'
                    : 'border border-slate-200 bg-white text-slate-500'
                }`}
              >
                🙋 Me apunto solo
              </button>
            </div>

            {modoInscripcion === 'pareja' ? (
              <>
                <div className="flex gap-2">
                  <select
                    value={nombreParejaInput}
                    onChange={(e) => setNombreParejaInput(e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900"
                  >
                    <option value="">Selecciona tu pareja</option>

                    {ranking
                      .filter(
                        (j) =>
                          j.id !==
                          (ranking.find(
                            (x) =>
                              x.nombre.trim().toLowerCase() ===
                              miPerfilNombre.trim().toLowerCase()
                          )?.id || '')
                      )
                      .filter(
                        (j) =>
                          !(participantesEventoMap[evento.id] || []).includes(
                            j.id
                          )
                      )
                      .map((j) => (
                        <option key={j.id} value={j.nombre}>
                          {j.nombre}
                        </option>
                      ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => onAbrirInvitacion(evento.id)}
                    className="shrink-0 rounded-xl bg-slate-900 px-3 py-2 text-[9px] font-black uppercase text-white"
                  >
                    Invitar
                  </button>
                </div>

                <p className="mt-1.5 text-[9px] font-semibold text-slate-500">
                  Selecciona un usuario registrado. Si no está en Padel Arena,
                  puedes invitarlo directamente por WhatsApp.
                </p>

                <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-[9px] font-bold text-emerald-800">
                  💡 Se registrará primero y, una vez tenga cuenta, podrá
                  seleccionarse como pareja. En la versión con BBDD la
                  invitación quedará vinculada automáticamente al evento.
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[10px] text-amber-800">
                <b>Sin pareja</b>
                <br />
                Te añadimos a la lista de jugadores solos. Cuando haya otra
                persona sola en este evento, el sistema formará automáticamente
                la pareja.
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => onConfirmarInscripcion(evento.id)}
                className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-[10px] font-black uppercase text-white"
              >
                Confirmar inscripción
              </button>

              <button
                onClick={() => {
                  setEventoRegistrandoId(null);
                  setNombreParejaInput('');
                  setModoInscripcion('pareja');
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase text-slate-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {(jugadoresSinParejaMap[evento.id] || []).length > 0 && (
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-amber-800">
                Jugadores sin pareja
              </span>

              <span className="rounded-full bg-white px-2 py-1 text-[9px] font-black text-amber-700">
                {jugadoresSinParejaMap[evento.id].length}
              </span>
            </div>

            <p className="mt-1 text-[10px] text-amber-700">
              Cuando haya 2, Padel Arena los junta automáticamente.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}