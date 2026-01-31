// Test script to verify Firebase connection
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

console.log('🔄 Testing Firebase connection...\n');

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'portfolio-d9148'
});

const db = admin.firestore();

async function testFirebase() {
    try {
        // Test write
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            projectType: 'Video Editing',
            message: 'Test message from script',
            type: 'application',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'pending'
        };

        console.log('📝 Adding test document to applications collection...');
        const docRef = await db.collection('applications').add(testData);
        console.log('✅ SUCCESS! Document written with ID:', docRef.id);

        // Test read
        console.log('\n📖 Reading back the document...');
        const doc = await db.collection('applications').doc(docRef.id).get();
        if (doc.exists) {
            console.log('✅ Document data:', doc.data());
        }

        console.log('\n🎉 Firebase connection is working properly!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Firebase Error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testFirebase();
