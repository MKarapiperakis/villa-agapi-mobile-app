import { host } from "../constants/host";
import { basic_auth } from "../constants/auth";

export async function BookingRequest(
  peopleValue,
  fullName,
  email,
  startDate,
  endDate,
  comments
) {
  let sDate = startDate.toString().split(" ").slice(1, 4).join(" ");
  let eDate = endDate.toString().split(" ").slice(1, 4).join(" ");

  let data = {
    visitors: peopleValue,
    fullName: fullName,
    email: email,
    startDate: sDate,
    endDate: eDate,
    comments: comments,
  };

  const url = `${host}/data/api/booking`;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + basic_auth,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, requestOptions);
    const res = await response.json();

    if (response.status == "200") return "success";
    else return "error";
  } catch (error) {
    console.error("booking request error: ", error);
    return null;
  }
}
