import { host } from "../constants/host";

export async function UserRequest(userId, token) {
  const url = `${host}/data/api/user/${userId}`;

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    const res = await response.json();

    if (response.status === 200) return res.user[0];
    else return res.status;
  } catch (error) {
    console.error("User request error: ", error);
    return null;
  }
}
