import axios from "axios";

export default {
  // namespaced : 하나의 store에서 모듈화하여 사용될 수 있음을 명시적으로 나타내는 개념
  namespaced: true,
  // state : 실제로 취급해야하는 데이터
  state: {
    position: {
      lat: 0,
      lon: 0,
    },
    cityName: "",
    currentWeather: {
      currentTemp: 0,
      currentHumidity: 0,
      currentWindSpeed: 0,
      currentFeelsLike: 0,
      currentSunrise: 0,
      currentSunset: 0,
      currentVisibility: 0,
    },
    hourlyWeather: [],
  },
  // getters: 계산된 상태를 만들어내는 속성이다.
  // computed와 기능이 유사하다.
  getters: {},
  // mutations, actions : methods와 유사하다.
  // 1. mutations : 변이 메서드, 우리가 관리하는 데이터(state)를 변경시켜줄 수 있다.
  // 즉, state 안의 데이터는 오로지 mutations에서만 데이터를 변경시킬 수 있다.
  mutations: {
    SET_CITYNAME(state, payload) {
      state.cityName = payload;
    },
    SET_CURRENT_WEATHER(state, payload) {
      state.currentWeather.currentTemp = Math.round(payload.temp); // 현재온도
      state.currentWeather.currentHumidity = payload.humidity; // 습도
      state.currentWeather.currentWindSpeed = payload.wind_speed; // 풍속
      state.currentWeather.currentFeelsLike = Math.round(payload.feels_like); // 체감온도
      state.currentWeather.currentSunrise = payload.sunrise; // 일출시간
      state.currentWeather.currentSunset = payload.sunset; // 일몰시간
      state.currentWeather.currentVisibility = payload.visibility; // 가시거리
    },
    SET_TIMELY_WEATHER(state, payload) {
      state.hourlyWeather = payload;
    },
    SET_LATLON(state, payload) {
      console.log(state.position.lat); // 초기값

      state.position.lat = payload.Ma;
      state.position.lon = payload.La;

      console.log(state.position.lat); // 변경된 후
    },
  },
  // 2. actions : 특정한 데이터를 직접적으로 수정하는 것이 허용되지 않는다.
  // 위 사항이 가장 주의해야 할 사항이고, 또한 비동기로 동작한다는 점도 유의해야 한다.
  // async, await
  actions: {
    // 예제
    // actions부분에선 mutations처럼 state를 바로 불러올 순 없고,
    // context라는 객체데이터를 가지고 와서, context를 참조하여 데이터를 불러온다.
    // context: state, getters, mutations을 활용할 수 있는 내용이 들어있다.
    // mutations을 불러오기 위해선 context.mutations가 아니라 context.commit을 활용한다.
    // ------------------------------------------------------------------------------------------
    // searchData({ context }) {
    // 객체 구조분해하여 같은 방법으로 불러올 수 있다.
    // context.state, context.getters, context.commit;
    // },
    // ------------------------------------------------------------------------------------------
    // searchData2({ state, getters, commit }, payload) {},
    // 두 번째 매개변수 자리 (payload): 함수가 실행될 때, 인수로 들어온 특정한 데이터를 payload 자리에 받는다.

    // OPENWEATHER API 데이터 호출
    async FETCH_OPENWEATHER_API(context) {
      // context : 매개변수 전달
      const API_KEY = "6e9435abd019fcfcc2748f9c457cc209";
      // let initialLat = 36.5683;
      // let initialLon = 126.9778;
      let initialLat = context.state.position.lat ? context.state.position.lat : 36.5683;
      let initialLon = context.state.position.lon ? context.state.position.lon : 126.9778;

      try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${initialLat}&lon=${initialLon}&appid=${API_KEY}&units=metric`);
        console.log(res);
        context.commit("SET_CITYNAME", res.data.timezone.split("/")[1]); // 도시이름 데이터
        context.commit("SET_CURRENT_WEATHER", res.data.current); // 조회하는 현재시간에 대한 날씨데이터
        context.commit("SET_TIMELY_WEATHER", res.data.hourly); // 시간대별 날씨데이터
      } catch (error) {
        console.log(error);
      }
    },
  },
};
