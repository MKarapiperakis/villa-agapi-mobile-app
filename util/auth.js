import { host } from "../constants/host";

export async function createUser(username, password) {
  let data = {
    username: username,
    email: "email@123.gr",
    password: password,
    cpassword: "cpass",
  };

  

  let userNameExist = false;
  const url = `${host}/data/api/users`;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.error) {
        switch (res.error) {
          case "User already exist":
            this.userNameExist = true;
            break;
          default:
            break;
        }
      } else {
        this.userNameExist = false;
        return "success";
      }
    })
    .catch((error) => console.log("Error:", error));
}

export async function login(username, password) {
  const url = `${host}/data/api/login`;
  const data = {
    username: username,
    password: password,
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
    if (res.token) {
      return res;
    } else {
      console.log("login error1: ", res.error);
      return null;
    }
  } catch (error) {
    console.error("login error2: ", error);
    return null;
  }
}
