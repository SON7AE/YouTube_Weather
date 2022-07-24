<template>
  <div class="rightContainer">
    <div id="cityNameBox">
      <div class="cityName">
        <p>{{ cityName }}</p>
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
        <div class="airCondition">
          <p>{{ feeling }}</p>
        </div>
        <div class="detail">
          <div class="title">
            <p>🌈상세한 날씨 데이터🌞</p>
          </div>
          <div class="data" v-for="(detailData, index) in subWeatherData" :key="index">
            <div class="dataName">
              <p></p>
              <p>{{ detailData.name }}</p>
            </div>
            <div class="dataValue">
              <p>{{ detailData.value }}<span></span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Map />
    <nav>
      <i class="fas fa-home"></i>
      <i class="fas fa-search-location"></i>
      <i class="fas fa-chart-line"></i>
      <i class="fas fa-cog"></i>
    </nav>
  </div>
</template>

<script>
import Map from "~/components/Map.vue";
import { ref } from "vue";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko"); // global로 한국어 locale 사용

export default {
  components: {
    Map,
  },
  setup() {
    // 화면에서 보여질 데이터
    let currentTime = dayjs().format("YYYY. MM. DD. ddd"); // 현재 시간

    let cityName = ref(""); // 도시 이름
    let feeling = ref(""); // 현재 온도에 대한 체감을 나타내는 데이터
    let subWeatherData = ref([]); // 상세 날씨 데이터

    // 타임스탬프로 변환
    const Unix_timestamp = (dt) => {
      let date = new Date(dt * 1000);
      // padStart() 메서드는 현재 문자열의 시작을 다른 문자열로 채워, 주어진 길이를 만족하는 새로운 문자열을 반환합니다.
      // 채워넣기는 대상 문자열의 시작(좌측)부터 적용됩니다.
      let hour = date.getHours().toString().padStart(2, "0");
      return hour.substring(-2) + "시";
    };

    // OpenWeatherAPI 호출 함수
    const fetchOpenWeatherApi = async () => {
      // API 호출을 위한 필수 데이터
      const API_KEY = "362cfb1a49fa98d009a2c14a7a1ae5cb"; // env
      let initialLat = 36.5683;
      let initialLon = 126.9778;

      try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${initialLat}&lon=${initialLon}&appid=${API_KEY}&units=metric`);

        let isInitialData = res.data.current; // 초기데이터
        let isInitialCityName = res.data.timezone; // 초기 도시이름 데이터
        let isFeelLikeTemp = isInitialData.feels_like; // 초기 체감온도 데이터
        let isTimeOfSunrise = isInitialData.sunrise; // 일출시간 데이터
        let isTimeOfSunSet = isInitialData.sunset; // 일몰시간 데이터
        let isLineOfSight = isInitialData.visibility; // 가시거리 데이터

        // 기준점에 따른 Array를 하나 만들고
        // 기준에 따른 메시지에 따른 Array를 하나 만들어서
        // 체감온도 데이터가 탐색을 해서
        // 원하는 값을 뽑는 로직으로 구성

        const pivots = [0, 10, 15, 20, 25, 30];
        const labels = ["매우 추움", "추움", "쌀쌀함", "선선함", "보통", "더움", "매우 더움"];

        let index = 0;
        for (const p of pivots) {
          if (isFeelLikeTemp <= p) break;
          index++;
        }
        feeling.value = labels[index];

        // 가공한 데이터를 가지고 새로운 배열 생성
        let isProcessedData = [
          { name: "일출시간", value: Unix_timestamp(isTimeOfSunrise) },
          {
            name: "일몰시간",
            value: Unix_timestamp(isTimeOfSunSet),
          },
          {
            name: "가시거리",
            value: isLineOfSight.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "M",
          },
        ];

        // Composition API에서 AJAX요청과 데이터 변경을 하려면 데이터.value로 접근해야한다.
        cityName.value = isInitialCityName.split("/")[1];
        subWeatherData.value = isProcessedData;
      } catch (error) {
        console.log(error);
      }
    };

    fetchOpenWeatherApi();

    return {
      cityName,
      currentTime,
      feeling,
      subWeatherData,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~/scss/main.scss";

.rightContainer {
  // width: 40%;
  // height: 100%;
  width: 324px;
  min-width: 324px;
  height: 700px;
  border-radius: 50px;
  background: linear-gradient(#cb0000, #0e1239);
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
    height: calc(45% - 16px);
    margin-top: 16px;

    .buttonBox {
      @include center;
      width: 100%;
      height: 20%;

      .buttonBackground {
        width: 224px;
        height: 35px;
        background-color: #370505;
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
            background-color: transparent;
            color: #a52727;
          }
          &.airquality {
            background: #ff0000;
            color: white;
          }
        }
      }
    }
    .weatherBox {
      width: 100%;
      height: 80%;

      .airCondition {
        @include center;
        width: 100%;
        height: 35%;

        p {
          text-align: center;
          font-size: 2.25rem;
          font-weight: 500;
          font-family: "GmarketSansBold";
          color: #fff;
        }
      }
      .detail {
        width: 100%;
        height: 65%;

        .title {
          @include center;
          width: 100%;
          height: 25%;
          color: white;

          p {
            font-family: "LeferiPoint-WhiteObliqueA";
          }
        }
        .data {
          display: flex;
          width: 100%;
          height: 27.5%;
          // background-color: rgb(187, 127, 255);

          .dataName {
            display: flex;
            align-items: center;
            width: 50%;
            height: 100%;
            font-family: "LeferiPoint-WhiteObliqueA";

            p {
              &:first-child {
                display: block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #ffde23;
                margin-left: 50px;
              }
              &:last-child {
                margin-left: 10px;
                color: white;
                font-weight: 300;
                font-size: 0.9rem;
              }
            }
          }
          .dataValue {
            display: flex;
            align-items: center;
            justify-content: right;
            width: 50%;
            height: 100%;
            font-family: "LeferiPoint-WhiteObliqueA";

            p {
              color: white;
              font-weight: 300;
              margin-right: 50px;

              span {
                font-weight: 600;
              }
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
