import { host } from "../constants/host";

export async function UserUpdateRequest(
  userId,
  token,
  firstName,
  lastName,
  email,
  phone,
  country,
  device
) {
  const url = `${host}/data/api/user/${userId}`;
  let data = {
    email: email,
    firstname: firstName,
    lastname: lastName,
    phone: phone,
    country: country,
    device: device
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
