import { writeFile } from 'node:fs/promises';

const AIRBNB_ICAL_URL = process.env.AIRBNB_ICAL_URL;
const BOOKING_ICAL_URL = process.env.BOOKING_ICAL_URL;

if (!AIRBNB_ICAL_URL || !BOOKING_ICAL_URL) {
  throw new Error('Missing AIRBNB_ICAL_URL or BOOKING_ICAL_URL environment variable.');
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDate(date);
}

function addMonths(dateString, months) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + months);
  return formatDate(date);
}

function unfoldIcsLines(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n[ \t]/g, '')
    .split('\n');
}

function parseDateValue(rawValue) {
  const match = rawValue.trim().match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function parseEvents(icsText, source) {
  const lines = unfoldIcsLines(icsText);
  const events = [];
  let currentEvent = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      currentEvent = {};
      continue;
    }

    if (line === 'END:VEVENT') {
      if (currentEvent?.start) {
        events.push({
          source,
          start: currentEvent.start,
          end: currentEvent.end || addDays(currentEvent.start, 1),
          status: currentEvent.status || ''
        });
      }
      currentEvent = null;
      continue;
    }

    if (!currentEvent) continue;

    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) continue;

    const keyPart = line.slice(0, separatorIndex);
    const value = line.slice(separatorIndex + 1);
    const key = keyPart.split(';')[0].toUpperCase();

    if (key === 'DTSTART') currentEvent.start = parseDateValue(value);
    if (key === 'DTEND') currentEvent.end = parseDateValue(value);
    if (key === 'STATUS') currentEvent.status = value.trim().toUpperCase();
  }

  return events.filter((event) => event.status !== 'CANCELLED');
}

function expandBlockedDates(events, rangeStart, rangeEnd) {
  const blockedDates = new Set();

  for (const event of events) {
    const effectiveStart = event.start < rangeStart ? rangeStart : event.start;
    const effectiveEnd = event.end > rangeEnd ? rangeEnd : event.end;

    if (effectiveStart >= effectiveEnd) continue;

    for (let cursor = effectiveStart; cursor < effectiveEnd; cursor = addDays(cursor, 1)) {
      blockedDates.add(cursor);
    }
  }

  return Array.from(blockedDates).sort();
}

async function fetchCalendar(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'SierraMar-Availability-Build/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Calendar request failed with status ${response.status}`);
  }

  return response.text();
}

async function main() {
  const today = formatDate(new Date());
  const rangeStart = addDays(today, -1);
  const rangeEnd = addMonths(today, 15);

  const [airbnbText, bookingText] = await Promise.all([
    fetchCalendar(AIRBNB_ICAL_URL),
    fetchCalendar(BOOKING_ICAL_URL)
  ]);

  const events = [
    ...parseEvents(airbnbText, 'airbnb'),
    ...parseEvents(bookingText, 'booking')
  ];

  const payload = {
    generatedAt: new Date().toISOString(),
    rangeStart,
    rangeEnd,
    blockedDates: expandBlockedDates(events, rangeStart, rangeEnd),
    sources: ['airbnb', 'booking']
  };

  await writeFile(
    new URL('../availability-data.json', import.meta.url),
    `${JSON.stringify(payload, null, 2)}\n`,
    'utf8'
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
