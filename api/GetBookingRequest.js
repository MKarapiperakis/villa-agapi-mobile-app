import { host } from "../constants/host";

export async function GetBookingRequest(token) {
  const url = `${host}/data/api/booking`;

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    const res = await response.json();

    if (response.status == "200") return res["booking_requests"];
    else return response.status;
  } catch (error) {
    console.error("booking request error: ", error);
    return null;
  }
}
