const getImage = async () => {
  try {
    const res = await fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature");
    const data = await res.json();
    if (!data.errors) {
      return data;
    } else {
      throw new Error(data.errors[0]);
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const setImage = async () => {
  try {
    const defaultURL = "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODk2ODM3OTF8&ixlib=rb-4.0.3&q=80&w=1080";
    const defaultAuthor = "By: Henry Be";
    const img = await getImage();
    document.body.style.backgroundImage = `url(${img?.urls?.regular || defaultURL})`;
    document.getElementById("author").textContent = `Image By: ${img?.user?.name || defaultAuthor}`;
  } catch (error) {
    console.error(error);
  };
};

const getCoin = async () => {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin");
    const data = await res.json();
    if (!data.error) {
      return data;
    } else {
      throw new Error(data.error);
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const setCoin = async () => {
  try {
    const coin = await getCoin();
    document.getElementById("crypto-header").innerHTML = `
      ${coin ? `<img src="${coin?.image?.small}" alt=${coin?.name} />` : ""}
      <h1>${coin?.name || "Coin Not Found"}</h1>
    `;
    document.getElementById("crypto-info").innerHTML = `
      ${coin ? `
        <h3>Current: $${coin?.market_data?.current_price?.usd}</h3>
        <h3>Max in 24hrs: $${coin?.market_data?.high_24h?.usd}</h3>
        <h3>Min in 24hrs: $${coin?.market_data?.low_24h?.usd}</h3>
      ` : ""}
    `
  } catch (error) {
    console.error(error);
  }
};

const getTime = () => {
  const d = new Date();
  return d.toLocaleTimeString("en-us", {timeStyle: "short"});
};

const setTime = () => {
  const time = getTime();
  document.getElementById("time").textContent = time;
}

const getWeather = async (lat, lon) => {
  try {
    const baseURL = "https://apis.scrimba.com/openweathermap/data/2.5/weather?"
    const res = await fetch(`${baseURL}lat=${lat}&lon=${lon}&units=metric`);
    const data = await res.json();
    if (!data.message) {
      return data;
    } else {
      throw new Error(data.message);
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const setWeather = async () => {
  try {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const data = await getWeather(lat, lon);
      if (data) {
        document.getElementById("weather").innerHTML = `
          <div id="weather-main">
            <div id="weather-info">
              <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
              <h1 id="weather-temp">${Math.floor(data?.main?.temp)}º</h1>
            </div>
            <div id="weather-name">
              <h1>${data?.name}</h1>
            </div>
          </div>
        `;
      }
    });
  } catch (error) {
    console.error(error);
  }
}

await setImage();
await setCoin();
await setWeather();
setTime();

setInterval(setImage, 300000);
setInterval(setCoin, 600000);
setInterval(setWeather, 1800000);
setInterval(setTime, 1000);