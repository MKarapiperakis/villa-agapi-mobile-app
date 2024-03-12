import { host } from "../constants/host";

export async function availabilityRequest(start_date, end_date, token) {
  const url = `${host}/data/api/availability`;
  let data = {
    start_date: start_date,
    end_date: end_date,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, requestOptions);
    const res = await response.json();

    return response.status;
  } catch (error) {
    console.error("availability request error: ", error);
    return null;
  }
}
