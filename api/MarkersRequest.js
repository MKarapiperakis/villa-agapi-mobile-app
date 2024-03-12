import { host } from "../constants/host";

export async function MarkersRequest() {
  const url = `${host}/data/api/markers`;

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    const res = await response.json();
    
    if (res) return res;
    else return "error";
  } catch (error) {
    console.error("markers request error: ", error);
    return null;
  }
}
