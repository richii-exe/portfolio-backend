const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize exactly like server.cjs
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Use the default implied bucket name if not specified
    storageBucket: 'portfolio-d9148.firebasestorage.app'
});

const bucket = admin.storage().bucket();

async function configureCORS() {
    try {
        console.log(`Attempting to set CORS on bucket: ${bucket.name}...`);

        // Set CORS configuration
        await bucket.setCorsConfiguration([
            {
                origin: ['*'],
                method: ['GET', 'HEAD', 'OPTIONS'],
                responseHeader: ['Content-Type', 'Content-Range', 'Accept-Ranges', 'Content-Length'],
                maxAgeSeconds: 3600
            }
        ]);

        console.log('✅ CORS configuration set successfully!');

        // Verify
        const [metadata] = await bucket.getMetadata();
        console.log('Current CORS config:', JSON.stringify(metadata.cors, null, 2));

    } catch (error) {
        console.error('❌ Failed:', error.message);
    }
}

configureCORS();
