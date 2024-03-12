import { host } from "../constants/host";

export async function EditUserUpdateRequest(
  userId,
  token,
  firstName,
  lastName,
  email,
  arrival,
  departure,
  cleaningprogram
) {
  const url = `${host}/data/api/user/${userId}`;
  let data = {
    email: email,
    firstname: firstName,
    lastname: lastName,
    arrival: arrival,
    departure: departure,
    cleaningprogram: cleaningprogram
  };

  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify(data),
  };

  console.log(data.cleaningprogram)
  try {
    const response = await fetch(url, requestOptions);
    const res = await response.json();

    if (response.status === 200) return response.status;
    else return res.status;
  } catch (error) {
    console.error("User request error: ", error);
    return null;
  }
}
