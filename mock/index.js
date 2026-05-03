const mqtt = require('mqtt');
const { v4: uuidv4 } = require('uuid');

const BROKER_URL = 'mqtt://localhost:1883';
const client = mqtt.connect(BROKER_URL);

const devices = [
  { id: 'device-001', greenhouse: 'gh-001', name: 'Greenhouse-1' },
  { id: 'device-002', greenhouse: 'gh-002', name: 'Greenhouse-2' },
  { id: 'device-003', greenhouse: 'gh-003', name: 'Greenhouse-3' }
];

const sensorStates = devices.map(() => ({
  soil_moisture: [45.0, 42.0],
  ph: 6.8,
  ec: 1.2,
  relay_state: [false, false, false, false, false, false, false, false],
  lastIrrigation: Date.now(),
  isOnline: true
}));

let startTime = Date.now();

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function generateSensorData(deviceIndex) {
  const state = sensorStates[deviceIndex];
  const now = Date.now();
  const elapsed = (now - startTime) / 1000;
  
  const hourOfDay = (new Date().getHours() + new Date().getMinutes() / 60);
  const tempBase = 25 + 8 * Math.sin((hourOfDay - 6) * Math.PI / 12);
  const humiBase = 65 - 15 * Math.sin((hourOfDay - 6) * Math.PI / 12);
  
  const temp = tempBase + randomInRange(-2, 2);
  const humi = humiBase + randomInRange(-5, 5);
  const light = Math.max(0, 50000 * Math.sin((hourOfDay - 6) * Math.PI / 12) + randomInRange(-5000, 5000));
  const co2 = 600 + randomInRange(-100, 100);
  
  state.soil_moisture[0] = Math.max(20, Math.min(80, state.soil_moisture[0] + randomInRange(-0.5, 0.5)));
  state.soil_moisture[1] = Math.max(20, Math.min(80, state.soil_moisture[1] + randomInRange(-0.5, 0.5)));
  state.ph = Math.max(5.5, Math.min(8.0, state.ph + randomInRange(-0.05, 0.05)));
  state.ec = Math.max(0.5, Math.min(3.0, state.ec + randomInRange(-0.02, 0.02)));
  
  if (Math.random() < 0.02) {
    const channel = Math.floor(Math.random() * 8);
    state.relay_state[channel] = !state.relay_state[channel];
  }
  
  return {
    temp: Math.round(temp * 10) / 10,
    humi: Math.round(humi * 10) / 10,
    light: Math.round(light),
    co2: Math.round(co2),
    soil_moisture: state.soil_moisture.map(m => Math.round(m * 10) / 10),
    ph: Math.round(state.ph * 100) / 100,
    ec: Math.round(state.ec * 100) / 100,
    relay_state: state.relay_state
  };
}

function printSummary(deviceIndex, data) {
  const device = devices[deviceIndex];
  const relaysOn = data.relay_state.filter(Boolean).length;
  
  console.log(`[${new Date().toISOString()}] ${device.name}:`);
  console.log(`  Temp: ${data.temp}°C | Humidity: ${data.humi}% | Light: ${data.light} lux`);
  console.log(`  CO2: ${data.co2}ppm | Soil: ${data.soil_moisture.join('%, ')}%`);
  console.log(`  pH: ${data.ph} | EC: ${data.ec} | Relays: ${relaysOn}/8 ON`);
  console.log('');
}

function sendSensorData(deviceIndex) {
  const device = devices[deviceIndex];
  const state = sensorStates[deviceIndex];
  
  if (!state.isOnline) {
    console.log(`[${new Date().toISOString()}] ${device.name} is OFFLINE, skipping`);
    return;
  }
  
  const data = generateSensorData(deviceIndex);
  const topic = `greenhouse/${device.greenhouse}/sensor/data`;
  
  client.publish(topic, JSON.stringify(data), { qos: 1 }, (err) => {
    if (err) {
      console.error(`Failed to publish to ${topic}:`, err);
    } else {
      printSummary(deviceIndex, data);
    }
  });
}

function updateDeviceStatus() {
  devices.forEach((device, index) => {
    if (Math.random() < 0.1) {
      sensorStates[index].isOnline = !sensorStates[index].isOnline;
      const status = sensorStates[index].isOnline ? 'ONLINE' : 'OFFLINE';
      console.log(`[${new Date().toISOString()}] ${device.name} is now ${status}`);
    }
  });
}

client.on('connect', () => {
  console.log('Connected to MQTT broker:', BROKER_URL);
  console.log('Starting ESP32 mock data generator...');
  console.log(`Simulating ${devices.length} devices\n`);
  
  devices.forEach((_, index) => {
    sendSensorData(index);
  });
  
  setInterval(() => {
    devices.forEach((_, index) => {
      sendSensorData(index);
    });
  }, 5000);
  
  setInterval(updateDeviceStatus, 30000);
});

client.on('error', (err) => {
  console.error('MQTT connection error:', err);
});

client.on('offline', () => {
  console.log('MQTT client offline');
});

client.on('reconnect', () => {
  console.log('MQTT client reconnecting...');
});

process.on('SIGINT', () => {
  console.log('\nShutting down mock data generator...');
  client.end();
  process.exit(0);
});
