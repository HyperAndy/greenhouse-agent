<template>
  <div class="card">
    <div class="card-title">天气信息</div>
    <div class="current-weather">
      <div class="weather-icon">{{ currentWeather.icon }}</div>
      <div class="weather-detail">
        <div class="weather-temp">{{ currentWeather.temp }}°C</div>
        <div class="weather-desc">{{ currentWeather.desc }}</div>
        <div class="weather-extra">
          <span>湿度 {{ currentWeather.humidity }}%</span>
          <span>风速 {{ currentWeather.wind }}km/h</span>
        </div>
      </div>
    </div>
    <div class="forecast">
      <div v-for="day in forecast" :key="day.date" class="forecast-item">
        <div class="forecast-date">{{ day.date }}</div>
        <div class="forecast-icon">{{ day.icon }}</div>
        <div class="forecast-temp">{{ day.low }}~{{ day.high }}°C</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentWeather = ref({
  icon: '☀️',
  temp: 28,
  desc: '晴',
  humidity: 45,
  wind: 12
})

const forecast = ref([
  { date: '明天', icon: '⛅', low: 18, high: 26 },
  { date: '后天', icon: '🌧️', low: 16, high: 22 },
  { date: '大后天', icon: '☀️', low: 20, high: 30 }
])
</script>

<style scoped>
.card {
  background: rgba(24, 144, 255, 0.1);
  border: 1px solid rgba(24, 144, 255, 0.3);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 0 15px rgba(24, 144, 255, 0.2);
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(24, 144, 255, 0.3);
}

.current-weather {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.weather-icon {
  font-size: 48px;
  margin-right: 16px;
}

.weather-temp {
  font-size: 32px;
  font-weight: bold;
  color: #faad14;
}

.weather-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 4px 0;
}

.weather-extra {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  display: flex;
  gap: 12px;
}

.forecast {
  display: flex;
  justify-content: space-around;
}

.forecast-item {
  text-align: center;
}

.forecast-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 6px;
}

.forecast-icon {
  font-size: 24px;
  margin-bottom: 6px;
}

.forecast-temp {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}
</style>
