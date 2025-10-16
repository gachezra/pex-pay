# PexPay - Seamless M-Pesa STK Push Integration

![PexPay Dashboard](https://storage.googleapis.com/gemini-assisted-coding-images/pexhub_dashboard_screenshot.png)

PexPay provides developers with a powerful and easy-to-use platform for integrating M-Pesa STK push notifications into their applications. With a focus on security, developer experience, and real-time analytics, PexPay is the perfect solution for businesses of all sizes looking to accept M-Pesa payments.

## ✨ Features

- **🛡️ Secure API Keys:** Bank-grade encryption for all your API keys and sensitive data.
- **💻 Developer Friendly:** Clean, well-documented API with code examples in multiple languages.
- **📈 Real-time Analytics:** Track every transaction with detailed insights and reporting.
- **⚡ Instant Processing:** Lightning-fast STK push notifications delivered in milliseconds.
- **🔒 PCI Compliant:** Enterprise-grade security that meets industry standards.
- **📊 Detailed Reports:** Comprehensive transaction history and financial reporting.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.x or later)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/your_username/pexhub.git
   ```
2. **Navigate to the project directory**
    ```sh
    cd pexhub
    ```
3. **Install NPM packages**
   ```sh
   npm install
   ```
4. **Set up your environment variables**

   Create a `.env.local` file in the root of your project and add your Firebase configuration:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```sh
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ API Usage

Integrate with our API using the examples below. You can find your API key and account ID on the testing page of your dashboard.

### Node.js

```javascript
const axios = require('axios');

const stkPush = async () => {
  try {
    const response = await axios.post(
      'https://pexhub-api.onrender.com/api/mpesa/stkPush',
      {
        amount: 1,
        phoneNumber: '254712345678',
        accountId: 'YOUR_ACCOUNT_ID'
      },
      {
        headers: {
          'x-api-key': 'YOUR_API_KEY_HERE'
        }
      }
    );

    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

stkPush();
```

### Python

```python
import requests

def stk_push():
    url = 'https://pexhub-api.onrender.com/api/mpesa/stkPush'
    headers = {
        'x-api-key': 'YOUR_API_KEY_HERE',
        'Content-Type': 'application/json'
    }
    data = {
        'amount': 1,
        'phoneNumber': '254712345678',
        'accountId': 'YOUR_ACCOUNT_ID'
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        print('Success:', response.json())
    except requests.exceptions.RequestException as e:
        print('Error:', e)

stk_push()
```

### cURL

```bash
curl -X POST https://pexhub-api.onrender.com/api/mpesa/stkPush \
  -H "x-api-key: YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1,
    "phoneNumber": "254712345678",
    "accountId": "YOUR_ACCOUNT_ID"
  }'
```

## 💰 Pricing

We offer a range of plans to suit your needs.

| Plan         | Price          | Key Features                                       |
|--------------|----------------|----------------------------------------------------|
| **Flex**     | KES 500/week   | 250 transactions/week, Basic API access            |
| **Pro**      | KES 1,500/mo   | 2,000 transactions/month, Full API access, Analytics|
| **Enterprise**| Custom         | Unlimited transactions, Dedicated support          |

All plans come with a 14-day free trial. Visit our [pricing page](https://pexhub.vercel.app/pricing) for more details.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
