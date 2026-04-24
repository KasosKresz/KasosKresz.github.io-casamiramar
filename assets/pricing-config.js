window.SierraMarPricing = {
  currency: 'EUR',
  cleaningFee: 20,
  defaultMinStay: 2,
  oneNightMultiplier: 2,

  // Edit any month here if you want a different minimum stay for that month.
  // Example: '07': 4 means July requires at least 4 nights.
  monthlyMinimumStay: {
    '01': 2,
    '02': 2,
    '03': 2,
    '04': 2,
    '05': 2,
    '06': 2,
    '07': 2,
    '08': 2,
    '09': 2,
    '10': 2,
    '11': 2,
    '12': 2
  },

  // Each season can have:
  // nightlyRates:
  //   '2' = regular nightly rate for 2-3 nights
  //   '4' = lower nightly rate for 4+ nights
  //
  // One-night stays are still allowed, but they use:
  // oneNightMultiplier x the regular '2' nightly rate
  //
  // weeklyRate = fixed price for each full 7-night block
  // monthlyRate = fixed price for each full 28-night block
  seasons: [
    {
      name: 'Low season',
      start: '2026-01-01',
      end: '2026-03-31',
      nightlyRates: { '2': 60, '4': 55 },
      weeklyRate: 350,
      monthlyRate: 1200
    },
    {
      name: 'Mid season',
      start: '2026-04-01',
      end: '2026-05-31',
      nightlyRates: { '2': 80, '4': 75 },
      weeklyRate: 490,
      monthlyRate: 1700
    },
    {
      name: 'High season',
      start: '2026-06-01',
      end: '2026-08-31',
      nightlyRates: { '2': 160, '4': 150 },
      weeklyRate: 1200,
      monthlyRate: 4000
    },
    {
      name: 'Autumn season',
      start: '2026-09-01',
      end: '2026-12-31',
      nightlyRates: { '2': 100, '4': 90 },
      weeklyRate: 650,
      monthlyRate: 1800
    }
  ]
};
