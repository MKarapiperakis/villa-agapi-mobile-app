export function calculateDuration(arrival, departure) {
  const arrivalDate = new Date(arrival);
  const departureDate = new Date(departure);

  const durationInMilliseconds = departureDate - arrivalDate;

  // Convert milliseconds to a readable format (e.g., days, hours, minutes)
  const days = Math.floor(durationInMilliseconds / (24 * 60 * 60 * 1000));

  return days + 1;
}

export function getMonthFromDate(dateString) {
  const date = new Date(dateString);
  return date.getMonth();
}

export function getYearFromDate(dateString) {
  const date = new Date(dateString);
  return date.getFullYear();
}

export function getDayFromDate(dateString) {
  const date = new Date(dateString);
  return date.getDate();
}

export function calculateDays(arrival, departure, month) {
  const arrivalDate = new Date(arrival);
  const departureDate = new Date(departure);

  let totalDaysInMay = 0;
  let currentDate = new Date(arrivalDate);

  while (currentDate <= departureDate) {
    if (currentDate.getMonth() === month) {
      totalDaysInMay++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return totalDaysInMay;
}

export function filterYearlyData(yearlyData, selectedYear) {
  if (selectedYear in yearlyData) {
    const selectedYearData = yearlyData[selectedYear];

    const monthlyDataArray = Object.entries(selectedYearData).map(
      ([month, data]) => ({
        month: parseInt(month, 10),
        ...data,
      })
    );

    return monthlyDataArray;
  } else {
    return [];
  }
}

export function getCountriesByYear(users) {
  const yearlyCountryCounts = {};

  users.forEach((user) => {
    if (user.role === "visitor" || user.role === "primeVisitor") {
      const arrivalYear = getYearFromDate(user.arrival);

      if (!yearlyCountryCounts[arrivalYear]) {
        yearlyCountryCounts[arrivalYear] = {};
      }

      const country = user.country;

      if (!yearlyCountryCounts[arrivalYear][country]) {
        yearlyCountryCounts[arrivalYear][country] = 0;
      }

      yearlyCountryCounts[arrivalYear][country] += 1;
    }
  });

  return yearlyCountryCounts;
}

export function getDevicesByYear(users) {
  const yearlyDeviceCounts = {};

  users.forEach((user) => {
    if (user.role === "visitor" || user.role === "primeVisitor") {
      const arrivalYear = getYearFromDate(user.arrival);

      if (!yearlyDeviceCounts[arrivalYear]) {
        yearlyDeviceCounts[arrivalYear] = {};
      }

      const device = user.device;

      if (!yearlyDeviceCounts[arrivalYear][device]) {
        yearlyDeviceCounts[arrivalYear][device] = 0;
      }

      yearlyDeviceCounts[arrivalYear][device] += 1;
    }
  });

  return yearlyDeviceCounts;
}

export function getMinDate(data) {
  const dates = Object.keys(data);

  const minDate = dates.reduce((minDate, currentDate) => {
    return new Date(currentDate) < new Date(minDate) ? currentDate : minDate;
  });

  return minDate;
}

export function getMaxDate(data) {
  const dates = Object.keys(data);

  const maxDate = dates.reduce((maxDate, currentDate) => {
    return new Date(currentDate) > new Date(maxDate) ? currentDate : maxDate;
  });

  return maxDate;
}

