window.SierraMarPricing = {
  currency: 'EUR',
  cleaningFee: 70,
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
      nightlyRates: { '2': 150, '4': 140 },
      weeklyRate: 900,
      monthlyRate: 3000
    },
    {
      name: 'Mid season',
      start: '2026-04-01',
      end: '2026-06-15',
      nightlyRates: { '2': 185, '4': 170 },
      weeklyRate: 1150,
      monthlyRate: 3900
    },
    {
      name: 'High season',
      start: '2026-06-16',
      end: '2026-09-15',
      nightlyRates: { '2': 250, '4': 230 },
      weeklyRate: 1600,
      monthlyRate: 5600
    },
    {
      name: 'Autumn season',
      start: '2026-09-16',
      end: '2026-12-31',
      nightlyRates: { '2': 165, '4': 150 },
      weeklyRate: 980,
      monthlyRate: 3300
    }
  ]
};
