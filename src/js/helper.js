// Contains the functions that are used over and over again
import { TIMEOUT_SEC } from './config';

// Timeout function - which rejects after a certain amount of time
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    // Getting the recipe from the server(API)
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

    // If the requested item is not there then throw a new error
    if (!response.ok) throw new Error(`${response.status}`);

    // Getting the required data from the promise
    const data = await response.json();

    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    console.log(url);
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uploadData),
    });
    // Getting the recipe from the server(API)
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    // If the requested item is not there then throw a new error
    if (!response.ok) throw new Error(`${response.status}`);

    // Getting the required data from the promise
    const data = await response.json();

    return data;
  } catch (err) {
    throw err;
  }
};
