<template>
  <div id="mapContainer">
    <div id="map"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      position: {},
      cityName: "",
    };
  },
  mounted() {
    const API_KEY = "3aa888462f58f13780e9ee7439a5db03";

    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${API_KEY}`;
      document.head.appendChild(script);
    }
  },
  watch: {
    cityName(value) {
      this.$store.commit("openWeatherApi/SET_CITYNAME", value);
      this.$store.dispatch("openWeatherApi/FETCH_OPENWEATHER_API");
    },
    position(value) {
      this.$store.commit("openWeatherApi/SET_LATLON", value);
      this.$store.dispatch("openWeatherApi/FETCH_OPENWEATHER_API");
    },
  },
  methods: {
    initMap() {
      var mapContainer = document.getElementById("map"), // 지도를 표시할 div
        mapOption = {
          center: new kakao.maps.LatLng(36.73035, 127.967487), // 지도의 중심좌표
          level: 13, // 지도의 확대 레벨
        };

      var map = new kakao.maps.Map(mapContainer, mapOption);

      var positions = [
        {
          // 서울
          latlng: new kakao.maps.LatLng(36.5683, 126.9778),
          cityName: "Seoul",
        },
        {
          // 인천
          latlng: new kakao.maps.LatLng(37.40864282648822, 126.65071862847725),
          cityName: "Incheon",
        },
        {
          // 수원
          latlng: new kakao.maps.LatLng(37.2911, 127.0089),
          cityName: "Suwon",
        },
        {
          // 대전
          latlng: new kakao.maps.LatLng(36.3519957815787, 127.39131469478555),
          cityName: "Daejeon",
        },
        {
          // 태백
          latlng: new kakao.maps.LatLng(37.15818414766273, 128.928560966107),
          cityName: "Taebaek",
        },
        {
          // 강릉
          latlng: new kakao.maps.LatLng(37.791688035246636, 128.82867301427635),
          cityName: "Gangneung",
        },
        {
          // 대구
          latlng: new kakao.maps.LatLng(35.871148697228875, 128.61345034272617),
          cityName: "Daegu",
        },
        {
          // 울산
          latlng: new kakao.maps.LatLng(35.5372, 129.3167),
          cityName: "Ulsan",
        },
        {
          // 부산
          latlng: new kakao.maps.LatLng(35.185997613083536, 129.0662809358643),
          cityName: "Busan",
        },
        {
          // 전주
          latlng: new kakao.maps.LatLng(35.90493196781132, 127.17357575637105),
          cityName: "Jeonju",
        },
        {
          // 광주
          latlng: new kakao.maps.LatLng(35.166611792579545, 126.84603104436039),
          cityName: "Gwangju",
        },
        {
          // 목포
          latlng: new kakao.maps.LatLng(34.823630139082525, 126.39766650967137),
          cityName: "Mokpo",
        },
        {
          // 제주도
          latlng: new kakao.maps.LatLng(33.5097, 126.5219),
          cityName: "Jeju",
        },
      ];

      const vm = this;
      // 마커를 생성합니다.
      positions.forEach(function (pos) {
        var marker = new kakao.maps.Marker({
          position: pos.latlng, // 마커의 위치
        });
        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);

        kakao.maps.event.addListener(marker, "click", function () {
          // 클릭한 위도, 경도 정보를 가져옵니다
          vm.cityName = pos.cityName;
          vm.position = this.getPosition();
        });

        // 아래 코드는 지도 위의 마커를 제거하는 코드입니다
        // marker.setMap(null);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/scss/main.scss";

#mapContainer {
  @include center;
  width: 100%;
  height: 35%;

  #map {
    width: 80%;
    height: 90%;
    border-radius: 10px;
  }
}
</style>
