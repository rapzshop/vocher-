import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnMWzFVcgPopeIDGcTvFEck_Ag_Tqhd48",
  authDomain: "pembayaran-8587d.firebaseapp.com",
  databaseURL: "https://pembayaran-8587d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pembayaran-8587d",
  storageBucket: "pembayaran-8587d.appspot.com",
  messagingSenderId: "254544978602",
  appId: "1:254544978602:web:6b211fd7a68c57e30be6d3",
  measurementId: "G-GSPCJWXS28"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function getUserID() {
  let userId = localStorage.getItem("user_id");
  if (!userId) {
    userId = 'USER-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    localStorage.setItem("user_id", userId);
  }
  return userId;
}

const currentUserID = getUserID();
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userId").value = currentUserID;
});

async function kirimTelegram(pesan) {
  const token = '7834741276:AAE4aBvJWrAQt1iUNirsayeuyA3zCBWu0oA';
  const chat_id = '7133478033';
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat_id, text: pesan })
  });
}

window.buatVoucher = async function () {
  const kode = document.getElementById('kode').value.trim();
  const potongan = parseInt(document.getElementById('potongan').value);
  const userId = document.getElementById('userId').value.trim();
  const expired = document.getElementById('expired').value;
  const produk = document.getElementById('produk').value;
  const now = new Date().toLocaleString();

  if (!kode || isNaN(potongan) || !expired) {
    alert('Harap isi semua field dengan benar!');
    return;
  }

  const voucherData = {
    kode: kode,
    potongan: potongan,
    aktif: true,
    digunakan: false,
    userId: userId || null,
    produk: produk || null,
    dibuat: now,
    expired: expired
  };

  await set(ref(db, 'voucher/' + kode), voucherData);

  const pesan = `🎟️ Voucher Baru Dibuat\n\nKode: ${kode}\nPotongan: Rp${potongan}\nProduk: ${produk || 'Semua'}\nUser ID: ${userId || '-'}\nDibuat: ${now}\nExpired: ${expired}`;
  await kirimTelegram(pesan);

  alert('✅ Voucher berhasil dibuat dan dikirim ke Telegram!');
  document.getElementById('formVoucher').reset();
};
