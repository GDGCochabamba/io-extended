import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  type Timestamp,
} from 'firebase/firestore';
import { getDb } from './firebase';

const TZ = 'America/La_Paz';

export interface Venue {
  name: string;
  address: string;
  city: string;
  mapUrl?: string;
}

export interface EventInfo {
  name: string;
  edition: number;
  tagline: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venue: Venue | null;
  externalUrl?: string;
  registrationUrl?: string;
  attendeeCount?: number;
}

export interface Speaker {
  participantId: string;
  name: string;
  photoUrl?: string;
  talkTitle?: string;
  bio?: string;
  socials: Record<string, string>;
}

export interface Session {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: string;
  track?: string;
  speakers: Speaker[];
}

export interface EventPage {
  event: EventInfo;
  sessions: Session[];
  speakers: Speaker[];
}

export async function loadEventPage(slug: string): Promise<EventPage> {
  const db = getDb();
  const eventRef = doc(db, 'events', slug);
  const [eventSnap, sessionSnap, partSnap] = await Promise.all([
    getDoc(eventRef),
    getDocs(
      query(collection(eventRef, 'sessions'), orderBy('startTime', 'asc')),
    ),
    getDocs(
      query(collection(eventRef, 'participants'), orderBy('order', 'asc')),
    ),
  ]);
  if (!eventSnap.exists())
    throw new Error(`Event "${slug}" not found in Firestore`);
  const e = eventSnap.data();

  const personIds = [
    ...new Set(partSnap.docs.map((d) => d.data().personId as string)),
  ];
  const personSnaps = await Promise.all(
    personIds.map((id) => getDoc(doc(db, 'people', id))),
  );
  const people = new Map(
    personSnaps.filter((s) => s.exists()).map((s) => [s.id, s.data()]),
  );

  const speakers = new Map<string, Speaker>();
  for (const d of partSnap.docs) {
    const p = d.data();
    const person = people.get(p.personId);
    if (!person || !['speaker', 'mentor', 'panelist'].includes(p.type))
      continue;
    speakers.set(d.id, {
      participantId: d.id,
      name: person.name,
      photoUrl: person.photoUrl,
      talkTitle: p.talkTitle,
      bio: p.bioOverride ?? person.bio,
      socials: Object.fromEntries(
        Object.entries((person.socials ?? {}) as Record<string, string>).filter(
          ([, url]) => url,
        ),
      ),
    });
  }

  const sessions: Session[] = sessionSnap.docs.map((d) => {
    const s = d.data();
    return {
      id: d.id,
      title: (s.title as string).trim().replace(/^[“"](.*)[”"]$/, '$1'),
      start: (s.startTime as Timestamp).toDate(),
      end: (s.endTime as Timestamp).toDate(),
      type: s.type ?? 'talk',
      track: s.track,
      speakers: ((s.speakerIds as string[]) ?? []).flatMap(
        (id) => speakers.get(id) ?? [],
      ),
    };
  });

  return {
    event: {
      name: e.name,
      edition: e.edition,
      tagline: e.tagline ?? '',
      description: e.description ?? '',
      startDate: (e.startDate as Timestamp).toDate(),
      endDate: (e.endDate as Timestamp).toDate(),
      venue:
        e.primaryVenue?.name && e.primaryVenue.name !== 'TBD'
          ? e.primaryVenue
          : null,
      externalUrl: e.externalUrl || undefined,
      registrationUrl: e.registrationUrl || undefined,
      attendeeCount: e.attendeeCount,
    },
    sessions,
    speakers: [...speakers.values()],
  };
}

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('es-BO', { timeZone: TZ, ...opts });
const dayFmt = fmt({ day: 'numeric' });
const monthFmt = fmt({ month: 'long' });
const yearFmt = fmt({ year: 'numeric' });
const fullFmt = fmt({
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const timeParts = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  hour: 'numeric',
  minute: '2-digit',
  hourCycle: 'h23',
});

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const day = (d: Date) => dayFmt.format(d);
export const month = (d: Date) => capitalize(monthFmt.format(d));
export const year = (d: Date) => yearFmt.format(d);
export const fullDate = (d: Date) => capitalize(fullFmt.format(d));

/** "8:00", in the event's timezone. */
export function time(d: Date): string {
  const parts = timeParts.formatToParts(d);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value);
  return `${hour}:${parts.find((p) => p.type === 'minute')?.value}`;
}

export const isUpcoming = (e: EventInfo) => e.endDate.getTime() > Date.now();
