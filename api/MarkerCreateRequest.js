import { host } from "../constants/host";

export async function MarkerCreateRequest(token,title,markerType,keyWords,pin,icon) {
  const url = `${host}/data/api/markers`;
 
  let data = {
    latitude: pin.latitude,
    longitude: pin.longitude,
    title: title,
    type: markerType,
    icon: icon,
    keyWords: keyWords
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
    console.error("markers request error: ", error);
    return null;
  }
}
