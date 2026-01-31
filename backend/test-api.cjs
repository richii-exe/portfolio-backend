// Test the /api/apply endpoint
const http = require('http');

const data = JSON.stringify({
    name: 'John Richardson Dyriaraj',
    email: 'richardson240806@gmail.com',
    projectType: 'Web Design',
    message: 'ecommerce'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/apply',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('🔄 Testing /api/apply endpoint...\n');

const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', responseData);

        if (res.statusCode === 200) {
            console.log('\n✅ API endpoint working correctly!');
        } else {
            console.log('\n❌ API endpoint returned error');
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Error:', error.message);
});

req.write(data);
req.end();
