'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  memoryLocalCache,
  type Firestore,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Next.js inclui no cliente apenas referências explícitas a process.env.
for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value) {
    console.warn(
      `[firebase] Faltando configuração ${key}. Confira .env.local.`
    );
  }
}

const existingApp = getApps().length > 0;
export const app: FirebaseApp = existingApp
  ? getApp()
  : initializeApp(firebaseConfig);

const forceLongPolling =
  (process.env.NEXT_PUBLIC_FIRESTORE_LONG_POLLING ?? '').toLowerCase() ===
  'true';

// Evita reinicialização em hot reload e conflitos do cache persistente entre abas.
export const db: Firestore = existingApp
  ? getFirestore(app)
  : initializeFirestore(app, {
      localCache: memoryLocalCache(),
      experimentalForceLongPolling: forceLongPolling,
    });
