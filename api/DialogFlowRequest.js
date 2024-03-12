import { host } from "../constants/host";
export async function dialogFlowRequest(input) {
  const url = `${host}/data/api/dialogFlow`;

  let data = {
    text: input,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, requestOptions);
    const res = await response.json();

    if (res) return res;
    else return "error";
  } catch (error) {
    console.error("dialogFlow request error: ", error);
    return null;
  }
}
