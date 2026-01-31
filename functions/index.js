const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Create Express app
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// ==================== API ROUTES ====================

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Portfolio API is running' });
});

// Submit application
app.post('/apply', async (req, res) => {
    try {
        const { name, email, projectType, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        await db.collection('applications').add({
            name,
            email,
            projectType: projectType || 'General',
            message,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(200).json({ success: true, message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ success: false, message: 'Failed to submit application' });
    }
});

// Submit contact form
app.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        await db.collection('contacts').add({
            name,
            email,
            message,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error submitting contact:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
});

// Get active reels (public)
app.get('/reels', async (req, res) => {
    try {
        const snapshot = await db.collection('reels')
            .orderBy('createdAt', 'desc')
            .get();

        const reels = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.isActive === true) {
                reels.push({
                    id: doc.id,
                    title: data.title,
                    category: data.category,
                    url: data.url,
                    mimetype: data.mimetype
                });
            }
        });

        res.status(200).json({ success: true, data: reels });
    } catch (error) {
        console.error('Error fetching reels:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch reels' });
    }
});

// Get active web designs (public)
app.get('/webdesigns', async (req, res) => {
    try {
        const snapshot = await db.collection('webdesigns')
            .orderBy('createdAt', 'desc')
            .get();

        const webdesigns = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.isActive === true) {
                webdesigns.push({
                    id: doc.id,
                    title: data.title,
                    category: data.category,
                    tech: data.tech,
                    url: data.url,
                    mimetype: data.mimetype
                });
            }
        });

        res.status(200).json({ success: true, data: webdesigns });
    } catch (error) {
        console.error('Error fetching webdesigns:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch web designs' });
    }
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
