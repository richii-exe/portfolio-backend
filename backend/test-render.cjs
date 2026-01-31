const fetch = require('node-fetch');

async function testRender() {
    const url = 'https://portfolio-backend-t40v.onrender.com/api/apply';
    const body = {
        name: 'Render Test User',
        email: 'test@render.com',
        projectType: 'Video Editing',
        message: 'This is a test message from the verification script.'
    };

    try {
        console.log('Sending request to:', url);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok) {
            console.log('✅ SUCCESS: Render Backend accepted the request.');
        } else {
            console.log('❌ FAILED: Render Backend returned an error.');
        }
    } catch (error) {
        console.error('❌ NETWORK ERROR:', error.message);
    }
}

testRender();
