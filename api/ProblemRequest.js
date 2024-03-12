import { host } from "../constants/host";

export async function ProblemRequest(fullName, token, subject, problem) {
  const url = `${host}/data/api/problem`;
  let data = {
    subject: subject,
    problem: problem,
    fullName: fullName,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
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
