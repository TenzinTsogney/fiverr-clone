import axios from "axios";

const API_URL = "http://localhost:8800/api";

async function registerUser(user) {
  return axios.post(`${API_URL}/auth/register`, user);
}

async function loginUser(username, password) {
  const res = await axios.post(`${API_URL}/auth/login`, { username, password }, { withCredentials: true });
  return res.headers['set-cookie'][0]; // return JWT cookie
}

async function createGig(gig, cookie) {
  return axios.post(`${API_URL}/gigs`, gig, { headers: { Cookie: cookie } });
}

async function createConversation(convo, cookie) {
  return axios.post(`${API_URL}/conversations`, convo, { headers: { Cookie: cookie } });
}

async function sendMessage(message, cookie) {
  return axios.post(`${API_URL}/messages`, message, { headers: { Cookie: cookie } });
}

async function createReview(review, cookie) {
  return axios.post(`${API_URL}/reviews`, review, { headers: { Cookie: cookie } });
}

async function createOrder(order, cookie) {
  return axios.put(`${API_URL}/orders`, order, { headers: { Cookie: cookie } });
}

async function seed() {
  try {
    console.log("Seeding data...");

    // 1. Register Users
    const sellerData = [
      { username: "seller1", email: "seller1@example.com", password: "123456", country: "US", isSeller: true },
      { username: "seller2", email: "seller2@example.com", password: "123456", country: "UK", isSeller: true }
    ];

    const buyerData = [
      { username: "buyer1", email: "buyer1@example.com", password: "123456", country: "US", isSeller: false },
      { username: "buyer2", email: "buyer2@example.com", password: "123456", country: "IN", isSeller: false }
    ];

    for (let user of [...sellerData, ...buyerData]) {
      await registerUser(user);
    }

    // 2. Login sellers
    const seller1Cookie = await loginUser("seller1", "123456");
    const seller2Cookie = await loginUser("seller2", "123456");

    // 3. Create gigs (by sellers)
    const gig1 = await createGig({
      title: "Logo Design",
      desc: "I will design a professional logo",
      price: 50,
      cat: "Design",
      cover: "https://example.com/logo1.png",
      shortTitle: "Pro Logo",
      shortDesc: "High-quality logo design",
      deliveryTime: 3,
      revisionNumber: 2,
      features: ["High quality", "Source file"]
    }, seller1Cookie);

    const gig2 = await createGig({
      title: "Website Development",
      desc: "I will build a responsive website",
      price: 200,
      cat: "Web",
      cover: "https://example.com/web.png",
      shortTitle: "Responsive Web",
      shortDesc: "Full-stack website development",
      deliveryTime: 7,
      revisionNumber: 3,
      features: ["Responsive design", "SEO optimized"]
    }, seller2Cookie);

    // 4. Login buyers
    const buyer1Cookie = await loginUser("buyer1", "123456");
    const buyer2Cookie = await loginUser("buyer2", "123456");

    // 5. Create conversations between buyer1 and seller1
    const conversation = await createConversation({
      sellerId: gig1.data.userId, // seller of gig1
      buyerId: "buyer1" // Adjust with real buyer ID (API might auto-assign)
    }, buyer1Cookie);

    // 6. Send messages in conversation
    await sendMessage({
      conversationId: conversation.data._id,
      desc: "Hi, I'm interested in your logo design gig."
    }, buyer1Cookie);

    await sendMessage({
      conversationId: conversation.data._id,
      desc: "Great! Let's proceed."
    }, seller1Cookie);

    // 7. Create review for gig1
    await createReview({
      gigId: gig1.data._id,
      star: 5,
      desc: "Excellent work!"
    }, buyer1Cookie);

    // 8. Create order for gig2
    await createOrder({
      payment_intent: "mock-payment-intent",
      gigId: gig2.data._id
    }, buyer2Cookie);

    console.log("✅ Seeding completed successfully!");
  } catch (err) {
    console.error("❌ Error seeding data:", err.response?.data || err.message);
  }
}
useEffect(() => {
  fetch(`${API_URL}/gigs`)
    .then(res => res.json())
    .then(data => {
      console.log("Fetched gigs:", data);
      setGigs(data);
    });
}, []);
import { useEffect, useState } from "react";    
seed();
export default seed;