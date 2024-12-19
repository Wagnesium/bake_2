// Configuration
const CONFIG = {
  TARGET_LOCATION: { lat: 41.6986, lng: -88.0683 }, // Bolingbrook, IL
  MAX_DELIVERY_DISTANCE: 5, // miles
  PRICES: {
    pancakes: 5,
    tamales: 8,
  },
  MAX_ITEMS_PER_TYPE: 20,
  ORDER_ENDPOINT: '/api/orders',
  CRYPTO_RATE: 150, // USD to XMR conversion rate
}

// State management
class OrderState {
  constructor() {
    this.items = {
      pancakes: 0,
      tamales: 0
    };
    this.bindEvents();
    this.updateUI();
  }

  bindEvents() {
    // Bind increment/decrement buttons
    document.querySelectorAll('[data-action]').forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const item = e.target.dataset.item;
        if (action === 'increment') this.incrementItem(item);
        if (action === 'decrement') this.decrementItem(item);
      });
    });

    // Bind order submit
    document.getElementById('submitOrder').addEventListener('click', () => this.processOrder());
  }

  incrementItem(item) {
    if (this.items[item] < CONFIG.MAX_ITEMS_PER_TYPE) {
      this.items[item]++;
      this.updateUI();
    }
  }

  decrementItem(item) {
    if (this.items[item] > 0) {
      this.items[item]--;
      this.updateUI();
    }
  }

  updateUI() {
    // Update counters
    Object.keys(this.items).forEach(item => {
      document.getElementById(`${item}Count`).textContent = this.items[item];
    });

    // Update total
    const total = this.calculateTotal();
    document.getElementById('totalAmount').textContent = total.toFixed(2);
    document.getElementById('cryptoAmount').textContent = (total / CONFIG.CRYPTO_RATE).toFixed(4);
  }

  calculateTotal() {
    return Object.entries(this.items).reduce((sum, [item, quantity]) => {
      return sum + (quantity * CONFIG.PRICES[item]);
    }, 0);
  }

  async processOrder() {
    try {
      // Validate order
      if (!this.validateOrder()) {
        this.showMessage('Please select at least one item to order.', 'error');
        return;
      }

      // Check location
      const userLocation = await this.getUserLocation();
      const distance = this.calculateDistance(userLocation, CONFIG.TARGET_LOCATION);

      if (distance > CONFIG.MAX_DELIVERY_DISTANCE) {
        this.showMessage(`Sorry, we only deliver within ${CONFIG.MAX_DELIVERY_DISTANCE} miles of Bolingbrook, IL. You are ${distance.toFixed(1)} miles away.`, 'error');
        return;
      }

      // Prepare order data
      const orderData = {
        items: this.items,
        total: this.calculateTotal(),
        cryptoAmount: this.calculateTotal() / CONFIG.CRYPTO_RATE,
        location: userLocation,
        distance: distance,
        timestamp: new Date().toISOString()
      };

      // Submit order
      const response = await this.submitOrder(orderData);
      if (response.success) {
        this.showMessage('Order placed successfully! Check your email for confirmation.', 'success');
        this.resetOrder();
      } else {
        throw new Error(response.message || 'Order processing failed');
      }
    } catch (error) {
      console.error('Order processing error:', error);
      this.showMessage(error.message || 'Failed to process order. Please try again.', 'error');
    }
  }

  validateOrder() {
    return Object.values(this.items).some(quantity => quantity > 0);
  }

  async getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }),
        error => {
          let message = 'Failed to get your location: ';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message += 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              message += 'Location information unavailable';
              break;
            case error.TIMEOUT:
              message += 'Location request timed out';
              break;
            default:
              message += 'Unknown error occurred';
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  calculateDistance(pos1, pos2) {
    const R = 3958.8; // Earth's radius in miles
    const dLat = this.toRadians(pos2.lat - pos1.lat);
    const dLon = this.toRadians(pos2.lng - pos1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(pos1.lat)) * Math.cos(this.toRadians(pos2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  async submitOrder(orderData) {
    const response = await fetch(CONFIG.ORDER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  showMessage(message, type) {
    const messageElement = document.getElementById(`${type}Message`);
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 5000);
  }

  resetOrder() {
    Object.keys(this.items).forEach(item => {
      this.items[item] = 0;
    });
    this.updateUI();
  }
}

// Initialize order system
document.addEventListener('DOMContentLoaded', () => {
  window.orderSystem = new OrderState();
});
