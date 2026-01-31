const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

// Initialize Firebase Admin SDK
let serviceAccount;
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        serviceAccount = require('./serviceAccountKey.json');
    }
} catch (error) {
    console.error('Failed to load Firebase credentials:', error);
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PORT = process.env.ADMIN_PORT || 5001;

// Configure multer for memory storage (for Firebase)
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: (req, file, cb) => {
        // Allow both images and videos for all upload types
        const allowedTypes = [
            'video/mp4', 'video/webm', 'video/quicktime',
            'image/jpeg', 'image/png', 'image/gif', 'image/webp'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/uploads', express.static(uploadsDir));

// Helper to upload file to Firebase Storage
const uploadFileToFirebase = async (file, folder) => {
    const filename = `${folder}/${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(filename);

    const stream = fileUpload.createWriteStream({
        metadata: {
            contentType: file.mimetype
        }
    });

    return new Promise((resolve, reject) => {
        stream.on('error', (err) => reject(err));
        stream.on('finish', async () => {
            // Make the file public
            await fileUpload.makePublic();
            const url = `https://storage.googleapis.com/${bucket.name}/${filename}`;
            resolve(url);
        });
        stream.end(file.buffer);
    });
};

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ===============================
// PUBLIC API ROUTES
// ===============================

app.post('/api/apply', async (req, res) => {
    const { name, email, projectType, message } = req.body;

    try {
        const applicationData = {
            name,
            email,
            projectType,
            message,
            type: 'application',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'pending'
        };

        const docRef = await db.collection('applications').add(applicationData);
        console.log('✅ Application saved to Firebase with ID:', docRef.id);

        // Send response IMMEDIATELY, don't wait for email
        res.status(200).json({ success: true, message: 'Application submitted successfully!' });

        // Send email in background
        const mailOptions = {
            from: email,
            to: 'richardson240806@gmail.com',
            subject: `New Work Request from ${name}`,
            text: `
            Name: ${name}
            Email: ${email}
            Project Type: ${projectType}
            Message: ${message}
            `
        };
        transporter.sendMail(mailOptions).then(() => {
            console.log('✅ Email notification sent');
        }).catch(emailError => {
            console.log('⚠️ Email failed but Firebase save succeeded:', emailError.message);
        });

    } catch (error) {
        console.error('Error processing application:', error);
        res.status(500).json({ success: false, message: 'Failed to send application.' });
    }
});

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const contactData = {
            name,
            email,
            message,
            type: 'contact',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'unread'
        };

        const docRef = await db.collection('contacts').add(contactData);
        console.log('✅ Contact saved to Firebase with ID:', docRef.id);

        // Send response IMMEDIATELY
        res.status(200).json({ success: true, message: 'Message sent successfully!' });

        // Send email in background
        transporter.sendMail(mailOptions).then(() => {
            console.log('✅ Email notification sent');
        }).catch(emailError => {
            console.log('⚠️ Email failed but Firebase save succeeded:', emailError.message);
        });

    } catch (error) {
        console.error('Error processing contact:', error);
        res.status(500).json({ success: false, message: 'Failed to send message.' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', firebase: 'connected' });
});

// ===============================
// ADMIN API ROUTES
// ===============================

// Get all applications
app.get('/api/admin/applications', async (req, res) => {
    try {
        const snapshot = await db.collection('applications')
            .orderBy('createdAt', 'desc')
            .get();

        const applications = [];
        snapshot.forEach(doc => {
            applications.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || null
            });
        });

        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch applications.' });
    }
});

// Get all contacts
app.get('/api/admin/contacts', async (req, res) => {
    try {
        const snapshot = await db.collection('contacts')
            .orderBy('createdAt', 'desc')
            .get();

        const contacts = [];
        snapshot.forEach(doc => {
            contacts.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || null
            });
        });

        res.status(200).json({ success: true, data: contacts });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch contacts.' });
    }
});

// Update application status
app.patch('/api/admin/applications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.collection('applications').doc(id).update({ status });

        res.status(200).json({ success: true, message: 'Application updated.' });
    } catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({ success: false, message: 'Failed to update application.' });
    }
});

// Update contact status
app.patch('/api/admin/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.collection('contacts').doc(id).update({ status });

        res.status(200).json({ success: true, message: 'Contact updated.' });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ success: false, message: 'Failed to update contact.' });
    }
});

// Delete application
app.delete('/api/admin/applications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('applications').doc(id).delete();
        res.status(200).json({ success: true, message: 'Application deleted.' });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ success: false, message: 'Failed to delete application.' });
    }
});

// Delete contact
app.delete('/api/admin/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('contacts').doc(id).delete();
        res.status(200).json({ success: true, message: 'Contact deleted.' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ success: false, message: 'Failed to delete contact.' });
    }
});

// Get dashboard stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        const appsSnapshot = await db.collection('applications').get();
        const contactsSnapshot = await db.collection('contacts').get();
        const reelsSnapshot = await db.collection('reels').get();
        const webdesignsSnapshot = await db.collection('webdesigns').get();

        const pendingApps = appsSnapshot.docs.filter(doc => doc.data().status === 'pending').length;
        const unreadContacts = contactsSnapshot.docs.filter(doc => doc.data().status === 'unread').length;

        res.status(200).json({
            success: true,
            data: {
                totalApplications: appsSnapshot.size,
                totalContacts: contactsSnapshot.size,
                pendingApplications: pendingApps,
                unreadContacts: unreadContacts,
                totalReels: reelsSnapshot.size,
                totalWebDesigns: webdesignsSnapshot.size
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
    }
});

// ===============================
// REELS MANAGEMENT
// ===============================

// Upload a new reel
app.post('/api/admin/reels', upload.single('file'), async (req, res) => {
    try {
        const { title, category } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        // Upload to Firebase Storage
        const publicUrl = await uploadFileToFirebase(file, 'reels');

        const reelData = {
            title: title || 'Untitled Reel',
            category: category || 'General',
            filename: file.originalname, // Store original name for reference
            mimetype: file.mimetype,
            size: file.size,
            url: publicUrl, // Store full HTTPS URL
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            isActive: true
        };

        const docRef = await db.collection('reels').add(reelData);
        console.log('✅ Reel saved with ID:', docRef.id);

        res.status(200).json({
            success: true,
            message: 'Reel uploaded successfully!',
            data: { id: docRef.id, ...reelData }
        });
    } catch (error) {
        console.error('Error uploading reel:', error);
        res.status(500).json({ success: false, message: 'Failed to upload reel.' });
    }
});

// Get all reels
app.get('/api/admin/reels', async (req, res) => {
    try {
        const snapshot = await db.collection('reels')
            .orderBy('createdAt', 'desc')
            .get();

        const reels = [];
        snapshot.forEach(doc => {
            reels.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || null
            });
        });

        res.status(200).json({ success: true, data: reels });
    } catch (error) {
        console.error('Error fetching reels:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch reels.' });
    }
});

// Get active reels (public API)
app.get('/api/reels', async (req, res) => {
    try {
        // Fetch all reels and filter in code to avoid Firestore composite index requirement
        const snapshot = await db.collection('reels')
            .orderBy('createdAt', 'desc')
            .get();

        const reels = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            // Only include active reels
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
        console.error('Error fetching public reels:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch reels.' });
    }
});

// Delete a reel
app.delete('/api/admin/reels/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await db.collection('reels').doc(id).get();

        if (doc.exists) {
            const data = doc.data();
            // Delete from Cloud Storage if it's a cloud URL
            if (data.url && data.url.includes('storage.googleapis.com')) {
                try {
                    const bucketName = bucket.name;
                    const path = data.url.split(bucketName + '/')[1];
                    if (path) {
                        await bucket.file(decodeURIComponent(path)).delete();
                        console.log('Deleted reel from storage:', path);
                    }
                } catch (err) {
                    console.log('Error deleting reel from storage:', err.message);
                }
            }
        }

        await db.collection('reels').doc(id).delete();
        res.status(200).json({ success: true, message: 'Reel deleted.' });
    } catch (error) {
        console.error('Error deleting reel:', error);
        res.status(500).json({ success: false, message: 'Failed to delete reel.' });
    }
});

// Toggle reel visibility
app.patch('/api/admin/reels/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive, title, category } = req.body;

        const updateData = {};
        if (typeof isActive !== 'undefined') updateData.isActive = isActive;
        if (title) updateData.title = title;
        if (category) updateData.category = category;

        await db.collection('reels').doc(id).update(updateData);
        res.status(200).json({ success: true, message: 'Reel updated.' });
    } catch (error) {
        console.error('Error updating reel:', error);
        res.status(500).json({ success: false, message: 'Failed to update reel.' });
    }
});

// ===============================
// WEB DESIGNS MANAGEMENT
// ===============================

// Upload a new web design
app.post('/api/admin/webdesigns', upload.single('file'), async (req, res) => {
    try {
        const { title, category, tech } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        // Upload to Firebase Storage
        const publicUrl = await uploadFileToFirebase(file, 'webdesigns');

        const webdesignData = {
            title: title || 'Untitled Design',
            category: category || 'Web Design',
            tech: tech || 'React',
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: publicUrl,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            isActive: true
        };

        const docRef = await db.collection('webdesigns').add(webdesignData);
        console.log('✅ Web design saved with ID:', docRef.id);

        res.status(200).json({
            success: true,
            message: 'Web design uploaded successfully!',
            data: { id: docRef.id, ...webdesignData }
        });
    } catch (error) {
        console.error('Error uploading web design:', error);
        res.status(500).json({ success: false, message: 'Failed to upload web design.' });
    }
});

// Get all web designs
app.get('/api/admin/webdesigns', async (req, res) => {
    try {
        const snapshot = await db.collection('webdesigns')
            .orderBy('createdAt', 'desc')
            .get();

        const webdesigns = [];
        snapshot.forEach(doc => {
            webdesigns.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || null
            });
        });

        res.status(200).json({ success: true, data: webdesigns });
    } catch (error) {
        console.error('Error fetching web designs:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch web designs.' });
    }
});

// Get active web designs (public API)
app.get('/api/webdesigns', async (req, res) => {
    try {
        // Fetch all webdesigns and filter in code to avoid Firestore composite index requirement
        const snapshot = await db.collection('webdesigns')
            .orderBy('createdAt', 'desc')
            .get();

        const webdesigns = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            // Only include active webdesigns
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
        console.error('Error fetching public web designs:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch web designs.' });
    }
});

// Delete a web design
app.delete('/api/admin/webdesigns/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await db.collection('webdesigns').doc(id).get();

        if (doc.exists) {
            const data = doc.data();
            // Delete from Cloud Storage
            if (data.url && data.url.includes('storage.googleapis.com')) {
                // Parse filename from URL or use stored filename if valid
                try {
                    // Filename storage strategy: "webdesigns/TIMESTAMP-name.ext"
                    // Ideally we stored the full path, but we stored 'filename' = 'originalName' in new logic?
                    // Wait, in new POST logic: filename = file.originalname. 
                    // We need the ACTUAL path in bucket to delete it.
                    // The URL is: https://storage.googleapis.com/BUCKET/webdesigns/TIMESTAMP-name
                    // To delete, we need the path "webdesigns/TIMESTAMP-name".
                    // Since we didn't store the exact bucket path in a separate field, we must extract it from URL.

                    const bucketName = bucket.name;
                    const path = data.url.split(bucketName + '/')[1];
                    if (path) {
                        await bucket.file(decodeURIComponent(path)).delete();
                        console.log('Deleted file from storage:', path);
                    }
                } catch (err) {
                    console.log('Error deleting file properties from storage:', err.message);
                }
            }
        }

        await db.collection('webdesigns').doc(id).delete();
        res.status(200).json({ success: true, message: 'Web design deleted.' });
    } catch (error) {
        console.error('Error deleting web design:', error);
        res.status(500).json({ success: false, message: 'Failed to delete web design.' });
    }
});

// Toggle web design visibility
app.patch('/api/admin/webdesigns/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive, title, category, tech } = req.body;

        const updateData = {};
        if (typeof isActive !== 'undefined') updateData.isActive = isActive;
        if (title) updateData.title = title;
        if (category) updateData.category = category;
        if (tech) updateData.tech = tech;

        await db.collection('webdesigns').doc(id).update(updateData);
        res.status(200).json({ success: true, message: 'Web design updated.' });
    } catch (error) {
        console.error('Error updating web design:', error);
        res.status(500).json({ success: false, message: 'Failed to update web design.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on port ${PORT}`);
    console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
    console.log('✅ Firebase Admin SDK initialized successfully\n');
});
