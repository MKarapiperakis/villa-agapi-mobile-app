import { host } from "../constants/host";

export async function UserCreateRequest(
  token,
  username,
  email,
  password,
  arrival,
  departure,
  firstName,
  lastName,
  phone,
  cleaningprogram
) {
  const url = `${host}/data/api/users`;
  let data = {
    username: username,
    email: email,
    password: password,
    arrival: arrival,
    departure: departure,
    role: "visitor",
    firstname: firstName,
    lastname: lastName,
    cleaningprogram: cleaningprogram,
    phone: phone,
    country: "",
  };

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, requestOptions);
    const res = await response.json();

    return response.status;
  } catch (error) {
    console.error("User request error: ", error);
    return null;
  }
}
