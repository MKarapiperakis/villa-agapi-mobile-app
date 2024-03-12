import { host } from "../constants/host";

export async function DeleteMarkerRequest(id, token) {
  const url = `${host}/data/api/marker/${id}`;

  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  
  try {
    const response = await fetch(url, requestOptions);
    const res = await response.json();
    
    return response.status
  } catch (error) {
    console.error("marker request error: ", error);
    return null;
  }
}
