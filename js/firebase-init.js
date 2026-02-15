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
        return new Promise((resolve, reject) => {
            if (!storage) return reject(new Error("Firebase Storage not initialized"));

            const ref = storage.ref().child(path);
            const uploadTask = ref.put(file);

            console.log(`Starting upload: ${path}`);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + Math.round(progress) + '% done');
                },
                (error) => {
                    console.error("Storage Error during upload:", error);
                    reject(error);
                },
                async () => {
                    try {
                        const url = await uploadTask.snapshot.ref.getDownloadURL();
                        console.log("Upload successful, URL:", url);
                        resolve(url);
                    } catch (e) {
                        reject(e);
                    }
                }
            );
        });
    },

    async getProducts() {
        const snapshot = await db.collection("products").get();
        if (snapshot.empty) return [];
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async addProduct(product) {
        return await db.collection("products").add(product);
    },

    async deleteProduct(id) {
        await db.collection("products").doc(id).delete();
    },

    async updateProduct(id, product) {
        const { id: _, ...data } = product;
        await db.collection("products").doc(id).set(data, { merge: true });
    },

    async getBlogPosts() {
        const snapshot = await db.collection("blog").get();
        if (snapshot.empty) return [];
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async addBlogPost(post) {
        return await db.collection("blog").add(post);
    },

    async deleteBlogPost(id) {
        await db.collection("blog").doc(id).delete();
    },

    async updateBlogPost(id, post) {
        const { id: _, ...data } = post;
        await db.collection("blog").doc(id).update(data);
    }
};

window.dataService = window.firebaseService;
console.log("Firebase Service (Storage Enabled) Ready");
