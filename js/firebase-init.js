// Firebase Compat Version
const firebaseConfig = {
    apiKey: "AIzaSyDBwxpaWojCmDNm2hCjGo5uxkeRFmXC5T0",
    authDomain: "olivsfresh.firebaseapp.com",
    projectId: "olivsfresh",
    storageBucket: "olivsfresh.firebasestorage.app",
    messagingSenderId: "1051912698826",
    appId: "1:1051912698826:web:cab8fc06d75aadeed1ad33",
    measurementId: "G-TRZVMQBW60"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Service Object
window.firebaseService = {
    auth: auth,
    storage: storage,

    async uploadFile(file, path) {
        console.log("📤 Tentative d'upload vers:", path);
        if (!storage) {
            console.error("❌ Firebase Storage n'est pas initialisé !");
            throw new Error("Service de stockage indisponible.");
        }

        try {
            const ref = storage.ref().child(path);
            const snapshot = await ref.put(file);
            console.log("✅ Upload terminé avec succès");
            const url = await snapshot.ref.getDownloadURL();
            console.log("🔗 URL générée:", url);
            return url;
        } catch (e) {
            console.error("❌ Erreur de stockage Firebase:", e);
            throw new Error("Impossible d'envoyer l'image : " + e.message);
        }
    },

    async getProducts() {
        console.log("📡 Récupération des produits...");
        const snapshot = await db.collection("products").get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async addProduct(product) {
        console.log("➕ Ajout produit:", product.name);
        return await db.collection("products").add(product);
    },

    async deleteProduct(id) {
        console.log("🗑️ Suppression produit:", id);
        return await db.collection("products").doc(id).delete();
    },

    async updateProduct(id, product) {
        console.log("📝 Mise à jour produit:", id);
        const { id: _, ...data } = product;
        return await db.collection("products").doc(id).set(data, { merge: true });
    },

    async getBlogPosts() {
        console.log("📡 Récupération du blog...");
        const snapshot = await db.collection("blog").get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async addBlogPost(post) {
        console.log("➕ Ajout article:", post.title);
        return await db.collection("blog").add(post);
    },

    async deleteBlogPost(id) {
        console.log("🗑️ Suppression article:", id);
        return await db.collection("blog").doc(id).delete();
    },

    async updateBlogPost(id, post) {
        console.log("📝 Mise à jour article:", id);
        const { id: _, ...data } = post;
        return await db.collection("blog").doc(id).set(data, { merge: true });
    },

    // Subscriptions
    async getSubscriptions() {
        const snapshot = await db.collection("subscriptions").get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async updateSubscription(id, sub) {
        const { id: _, ...data } = sub;
        return await db.collection("subscriptions").doc(id).set(data, { merge: true });
    },
    async deleteSubscription(id) {
        console.log("🗑️ Suppression abonnement:", id);
        return await db.collection("subscriptions").doc(id).delete();
    },

    // Relay Points & Delivery
    async getDeliveryInfo() {
        const snapshot = await db.collection("delivery_info").get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async updateDeliveryInfo(id, info) {
        const { id: _, ...data } = info;
        return await db.collection("delivery_info").doc(id).set(data, { merge: true });
    },
    async deleteDeliveryInfo(id) {
        console.log("🗑️ Suppression point livraison:", id);
        return await db.collection("delivery_info").doc(id).delete();
    }
};

window.dataService = window.firebaseService;
console.log("Firebase Service (Storage Enabled) Ready");
