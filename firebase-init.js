// ╔══════════════════════════════════════════════════════════════╗
// ║  BUROCRAPP — Firebase Config                                 ║
// ║  Paso 1: Ve a console.firebase.google.com                    ║
// ║  Paso 2: Crea un proyecto                                    ║
// ║  Paso 3: Agrega una app Web (</>)                            ║
// ║  Paso 4: Copia tu firebaseConfig y pégalo AQUÍ abajo         ║
// ╚══════════════════════════════════════════════════════════════╝

import { initializeApp }                          from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth,
         createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         signOut,
         onAuthStateChanged }                     from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore,
         doc, setDoc, getDoc,
         collection, addDoc, getDocs,
         query, where, orderBy }                  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ─── 🔥 PEGA TU CONFIGURACIÓN AQUÍ ───────────────────────────
const firebaseConfig = {
  apiKey:            "REEMPLAZA_apiKey",
  authDomain:        "REEMPLAZA_authDomain",
  projectId:         "REEMPLAZA_projectId",
  storageBucket:     "REEMPLAZA_storageBucket",
  messagingSenderId: "REEMPLAZA_messagingSenderId",
  appId:             "REEMPLAZA_appId"
};
// ──────────────────────────────────────────────────────────────

const _app  = initializeApp(firebaseConfig);
const _auth = getAuth(_app);
const _db   = getFirestore(_app);

// Exponer al scope global para que app.js los use
window.$auth = _auth;
window.$db   = _db;
window.$fb   = {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc, setDoc, getDoc,
  collection, addDoc, getDocs,
  query, where, orderBy,
};
