const mqtt = require('mqtt');
const { v4: uuidv4 } = require('uuid');

// MQTT broker connection
const BROKER_URL = 'mqtt://localhost:1883';
const client = mqtt.connect(BROKER_URL);

// Device configurations (same greenhouses as index.js)
const devices = [
  { id: uuidv4(), greenhouse: 1, name: 'Greenhouse-1' },
  { id: uuidv4(), greenhouse: 2, name: 'Greenhouse-2' },
  { id: uuidv4(), greenhouse: 3, name: 'Greenhouse-3' }
];

// Device status state
const deviceStatuses = devices.map(device => ({
  ...device,
  online: true,
  lastSeen: Date.now(),
  signalStrength: randomInRange(-80, -30), // dBm
  batteryLevel: randomInRange(20, 100), // percentage
  firmwareVersion: '1.2.3',
  uptime: 0 // seconds
}));

// Helper: random number in range
function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

// Update device statuses
function updateDeviceStatuses() {
  const now = Date.now();
  
  deviceStatuses.forEach((status, index) => {
    // Random chance to change online status (10%)
    if (Math.random() < 0.1) {
      status.online = !status.online;
      if (status.online) {
        status.lastSeen = now;
        status.uptime = 0;
      }
    }
    
    // Update uptime if online
    if (status.online) {
      status.uptime += 60; // seconds
    }
    
    // Randomly adjust signal strength
    status.signalStrength = Math.round(
      Math.max(-90, Math.min(-20, status.signalStrength + randomInRange(-5, 5)))
    );
    
    // Battery slowly decreases if online
    if (status.online) {
      status.batteryLevel = Math.max(0, status.batteryLevel - randomInRange(0, 0.5));
    }
    
    // Create status message
    const statusMessage = {
      ts: now,
      device_id: status.id,
      greenhouse: status.greenhouse,
      online: status.online,
      last_seen: status.lastSeen,
      signal_strength: status.signalStrength,
      battery_level: Math.round(status.batteryLevel * 10) / 10,
      firmware_version: status.firmwareVersion,
      uptime: status.uptime,
      ip_address: `192.168.1.${100 + index}`,
      mac_address: `AA:BB:CC:DD:EE:${String(index).padStart(2, '0')}`
    };
    
    // Publish to MQTT
    const topic = `farm/1/greenhouse/${status.greenhouse}/status`;
    client.publish(topic, JSON.stringify(statusMessage), { qos: 1 }, (err) => {
      if (err) {
        console.error(`Failed to publish status to ${topic}:`, err);
      } else {
        const statusStr = status.online ? 'ONLINE' : 'OFFLINE';
        console.log(`[${new Date().toISOString()}] ${status.name} status: ${statusStr} | Signal: ${status.signalStrength}dBm | Battery: ${status.batteryLevel.toFixed(1)}%`);
      }
    });
  });
}

// Connection event handlers
client.on('connect', () => {
  console.log('Device status simulator connected to MQTT broker:', BROKER_URL);
  console.log(`Monitoring ${devices.length} devices\n`);
  
  // Send initial status
  updateDeviceStatuses();
  
  // Update status every 60 seconds
  setInterval(updateDeviceStatuses, 60000);
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

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down device status simulator...');
  client.end();
  process.exit(0);
});