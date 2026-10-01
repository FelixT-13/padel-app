export type Lado = 'derecha' | 'reves';

export type TipoEvento = 'Pozo' | 'Torneo';

export type CuadroTorneo = 'principal' | 'consolacion';

export type RondaTorneo =
  | 'campeon'
  | 'subcampeon'
  | 'semifinal'
  | 'cuartos';

export type Jugador = {
  id: string;
  nombre: string;
  telefono: string;
  nivel: number;
  pozos: number;
  puntosPozos: number;
  torneosJugados: number;
  puntosTorneos: number;
  racha: string;
  lado: Lado;
  fantasyPuntos: number;
  primerTorneoPuntos: number | null;
  valorFantasy: number | null;
};

export type ResultadoEvento = {
  eventoId: number;
  jugadorId: string;
  tipo: TipoEvento;
  puntos: number;
};

export type Evento = {
  id: number;
  titulo: string;
  tipo: TipoEvento;
  fecha: string;
  club: string;
  plazas_totales: number;
  plazas_ocupadas: number;
  precioUnitario: number;
};

export type Pareja = [string, string];

export type Partido = {
  id: string;
  pareja1: string[];
  pareja2: string[];
  resultado: string;
};

export type InscripcionEvento = {
  modo: 'pareja' | 'solo';
  pareja?: string[];
};