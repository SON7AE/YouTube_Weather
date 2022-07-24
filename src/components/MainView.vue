<template>
  <div class="leftContainer">
    <div id="cityNameBox">
      <div class="cityName">
        <p>{{ $store.state.openWeatherApi.cityName }}</p>
        <p>{{ currentTime }}</p>
      </div>
    </div>
    <div id="contentsBox">
      <div class="buttonBox">
        <div class="buttonBackground">
          <button class="forecast">Forecast</button>
          <button class="airquality">Air Quality</button>
        </div>
      </div>
      <div class="weatherBox">
        <div class="weatherDegree">
          <p>{{ currentTemp }}&deg;</p>
        </div>
        <div class="weatherIcon">
          <img src="~/assets/43.png" alt="MainLogo" />
        </div>
        <div class="weatherData">
          <div v-for="temporary in temporaryData" :key="temporary.title" class="detailData">
            <p>{{ temporary.title }}</p>
            <p>{{ temporary.value }}</p>
          </div>
        </div>
      </div>
    </div>
    <div id="todayWeather">
      <div class="textBox">
        <p>시간대별 날씨 정보</p>
        <p>이번주 날씨 보기</p>
      </div>
      <div class="timelyWeatherBox">
        <div class="timelyWeather" v-for="(temp, index) in arrayTemps" :key="index">
          <div class="icon">
            <img src="~/assets/29.png" alt="" />
          </div>
          <div class="data">
            <p class="time">{{ Unix_timestamp(temp.dt) }}</p>
            <p class="currentDegree">{{ Math.round(temp.temp) }}&deg;</p>
            <div>
              <img src="~/assets/drop.png" alt="" />
              <p class="fall">{{ temp.humidity }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav>
      <i class="fas fa-home"></i>
      <i class="fas fa-search-location"></i>
      <i class="fas fa-chart-line"></i>
      <i class="fas fa-cog"></i>
    </nav>
  </div>
</template>

<script>
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko"); // global로 한국어 locale 사용

export default {
  data() {
    return {
      // 마커를 선택했을 때, 레이아웃에 보여지는 도시 이름
      cityName: "",
      // 현재 시간을 나타내기 위한 Dayjs 플러그인 사용
      currentTime: dayjs().format("YYYY. MM. DD. ddd"),
      // 현재 시간에 따른 현재 온도 데이터
      currentTemp: "",
      // 상세 날씨 데이터를 받아주는 데이터 할당
      temporaryData: [
        {
          title: "습도",
          value: "",
        },
        {
          title: "풍속",
          value: "",
        },
        {
          title: "체감온도",
          value: "",
        },
      ],
      arrayTemps: [],
      arrayIcons: [],
    };
  },
  async created() {
    // 초기데이터 선언을 위한 코드 작성
    // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

    // Vuex Store의 Mutations를 실행할 때는 commit() 메서드를
    // Vuex Store의 Actions를 실행할 때는 dispatch() 메서드를 사용한다.
    await this.$store.dispatch("openWeatherApi/FETCH_OPENWEATHER_API");

    const { currentTemp, currentHumidity, currentWindSpeed, currentFeelsLike } = this.$store.state.openWeatherApi.currentWeather;
    this.currentTemp = currentTemp; // 현재시간에 대한 현재온도
    this.temporaryData[0].value = currentHumidity + "%"; // 현재시간에 대한 습도
    this.temporaryData[1].value = currentWindSpeed + "m/s"; // 현재시간에 대한 풍속
    this.temporaryData[2].value = Math.round(currentFeelsLike) + "도"; // 현재시간에 대한 체감온도

    this.arrayTemps = this.$store.state.openWeatherApi.hourlyWeather;
    // console.log(this.arrayTemps);

    // const API_KEY = "e7878598157a92ae89d1403b94d8653d";
    // let initialLat = 36.5683;
    // let initialLon = 126.9778;
    // // get() 메서드를 통해서 우리가 필요로하는 API 데이터를 호출한다.
    // axios
    //   .get(
    //     `https://api.openweathermap.org/data/2.5/onecall?lat=${initialLat}&lon=${initialLon}&appid=${API_KEY}&units=metric`
    //   )
    //   .then((response) => {
    //     // console.log(response);
    //     let initialCityName = response.data.timezone;
    //     let initialCurrentWeatherData = response.data.current;
    //     this.cityName = initialCityName.split("/")[1]; // ['asia', 'seoul']
    //     this.currentTemp = initialCurrentWeatherData.temp; // 현재 시간에 따른 현재 온도
    //     this.temporaryData[0].value = initialCurrentWeatherData.humidity + "%"; // 습도
    //     this.temporaryData[1].value =
    //       initialCurrentWeatherData.wind_speed + "m/s"; // 풍속
    //     this.temporaryData[2].value =
    //       Math.round(initialCurrentWeatherData.feels_like) + "도"; // 체감온도
    //     // 시간대별 날씨 데이터를 제어
    //     // this.arrayTemps = response.data.hourly;
    //     // 우리는 24시간 이내의 데이터만 활용할 것이기 때문에 for문을 활용한다.
    //     for (let i = 0; i < 24; i++) {
    //       this.arrayTemps[i] = response.data.hourly[i];
    //     }
    //     // console.log(this.arrayTemps);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  },
  methods: {
    // 타임스탬프로 변환
    Unix_timestamp(dt) {
      let date = new Date(dt * 1000);
      let hour = date.getHours().toString().padStart(2, "0");
      return hour + "시";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/scss/main.scss";

.leftContainer {
  width: 324px;
  min-width: 324px;
  height: 700px;
  border-radius: 50px;
  background: linear-gradient(#16455f, #0e1239);
  box-shadow: 5px 5px 10px gray;

  #cityNameBox {
    width: 100%;
    height: 10%;

    .cityName {
      @include c-center;
      width: 100%;
      height: 100%;

      p {
        color: white;
        font-family: "Poppins", sans-serif;
        line-height: 2.5;
        text-align: center;

        &:first-child {
          width: 241px;
          height: 33px;
          font-size: 1.35rem;
        }
        &:last-child {
          width: 160px;
          height: 19px;
          font-size: 0.9rem;
          font-weight: 100;
        }
      }
    }
  }

  #contentsBox {
    width: 100%;
    height: 62.5%;

    .buttonBox {
      @include center;
      width: 100%;
      height: 20%;

      .buttonBackground {
        width: 224px;
        height: 35px;
        background-color: #052137;
        border-radius: 10px;
        display: flex;

        button {
          width: 112px;
          height: 35px;
          border: 0;
          border-radius: 7.5px;
          outline: 0;
          cursor: pointer;

          &.forecast {
            background-color: #0889ff;
            color: white;
          }
          &.airquality {
            background: transparent;
            color: #467599;
          }
        }
      }
    }

    .weatherBox {
      width: 100%;
      height: 80%;

      .weatherDegree {
        @include center;
        width: 100%;
        height: 15%;

        p {
          font-size: 3.5rem;
          font-weight: 500;
          font-family: "Be Vietnam Pro", sans-serif;
          color: white;
        }
      }
      .weatherIcon {
        @include center;
        width: 100%;
        height: 60%;

        img {
          width: 168px;
          height: 160px;
        }
      }
      .weatherData {
        display: flex;
        width: 100%;
        height: 25%;

        .detailData {
          @include c-center;
          width: 33.33%;
          height: 100%;
          // 레이아웃이 3개이기 때문에 동일한 레이아웃을 반복시킴을 알 수 있다.
          &:nth-child(1) {
            margin-left: 10px;
          }
          &:nth-child(2) {
            margin-left: 0 -10px;
          }
          &:nth-child(3) {
            margin-right: 10px;
          }

          p {
            line-height: 1.5;
            color: white;

            &:first-child {
              font-size: 1rem;
              font-weight: 300;
              font-family: "Noto Sans KR", sans-serif;
              color: #799ed0;
            }
            &:last-child {
              font-size: 1rem;
              font-weight: 200;
              font-family: "Poppins", sans-serif;
            }
          }
        }
      }
    }
  }

  #todayWeather {
    width: 100%;
    height: 17.5%;

    .textBox {
      @include center-sb;
      width: calc(100% - 70px);
      height: 35%;
      padding: 0 35px;
      font-family: "Noto Sans KR", sans-serif;

      p {
        font-weight: 400;
        font-size: 0.8rem;
        color: white;
        text-align: center;

        &:last-child {
          font-weight: 400;
          font-size: 0.8rem;
          color: #0085ff;
          cursor: pointer;
          margin-bottom: 2px;
        }
      }
    }
    .timelyWeatherBox {
      display: flex;
      align-items: center;
      width: calc(100% - 70px);
      height: 65%;
      padding: 0 30px;
      overflow: scroll;

      -ms-overflow-style: none;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }

      .timelyWeather {
        display: flex;
        width: 126px;
        min-width: 126px;
        height: 70px;
        background-color: #0989ff;
        border-radius: 20px;
        margin-left: 15px;

        &:first-child {
          margin-left: 0;
        }

        .icon {
          @include center;
          width: 45%;
          height: 100%;

          img {
            width: 100%;
          }
        }
        .data {
          @include c-center-se;
          width: 55%;
          height: 100%;

          p {
            color: whitesmoke;
            font-family: "Poppins", sans-serif;
            text-align: center;

            &.time {
              font-size: 0.8rem;
              font-weight: 200;
              margin-top: 7.5px;
            }

            &.currentDegree {
              font-size: 1.2rem;
              margin-top: 7.5px;
            }
          }

          div {
            @include center;
            width: 100%;
            height: 33.33%;

            img {
              height: 55%;
            }
            .fall {
              font-size: 0.9rem;
              margin-top: 1.5px;
            }
          }
        }
      }
    }
  }

  nav {
    @include center-sb;
    width: calc(100% - 100px);
    height: 10%;
    padding: 0 50px;

    i {
      color: rgb(255, 255, 255);
      font-size: 1.15rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        color: #799ed0;
      }
    }
  }
}
</style>
