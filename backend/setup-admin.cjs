// Setup script to create admin user using Firebase Auth REST API
const https = require('https');

const API_KEY = 'AIzaSyAK1V1MIWm-PwIkU5nV89lguVi66a3k6fU';
const ADMIN_EMAIL = 'richardson240806@gmail.com';
const ADMIN_PASSWORD = 'RICH@1024';

async function createAdminUser() {
    console.log('🔄 Creating admin user in Firebase Authentication...\n');

    const data = JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        returnSecureToken: true
    });

    const options = {
        hostname: 'identitytoolkit.googleapis.com',
        port: 443,
        path: `/v1/accounts:signUp?key=${API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                const response = JSON.parse(responseData);

                if (response.error) {
                    if (response.error.message === 'EMAIL_EXISTS') {
                        console.log('⚠️ User already exists!');
                        console.log('✅ You can login with these credentials at /admin\n');
                        console.log('   Email:', ADMIN_EMAIL);
                        console.log('   Password:', ADMIN_PASSWORD);
                    } else {
                        console.error('❌ Error:', response.error.message);
                    }
                } else {
                    console.log('✅ Admin user created successfully!');
                    console.log('   UID:', response.localId);
                    console.log('   Email:', response.email);
                    console.log('\n🎉 You can now login at http://localhost:5000/admin');
                    console.log('   Email:', ADMIN_EMAIL);
                    console.log('   Password:', ADMIN_PASSWORD);
                }
                resolve();
            });
        });

        req.on('error', (error) => {
            console.error('❌ Error:', error.message);
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

createAdminUser().then(() => process.exit(0)).catch(() => process.exit(1));
