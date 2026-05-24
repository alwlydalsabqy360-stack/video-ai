import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user from firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        let userDoc = await getDoc(userRef);

        const isSuperAdmin = firebaseUser.email === 'alwlydalsabqy360@gmail.com';

        if (!userDoc.exists()) {
          // Create the user profile
          const newUserData = {
            displayName: firebaseUser.displayName || 'Guest Player',
            photoURL: firebaseUser.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + firebaseUser.uid,
            level: 1,
            xp: 0,
            coins: 100,
            isAdmin: isSuperAdmin,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          
          try {
            await setDoc(userRef, newUserData);
            userDoc = await getDoc(userRef); // Fetch again to get evaluated timestamps (optional but safe)
          } catch (error) {
            console.error("Error creating user profile", error);
            // In a real app we might handle handledFirestoreError
            setLoading(false);
            return;
          }
          login({ uid: firebaseUser.uid, ...newUserData } as any);
        } else {
          let data = userDoc.data();
          if (isSuperAdmin && !data.isAdmin) {
             // Force update
             await updateDoc(userRef, { isAdmin: true, updatedAt: serverTimestamp() });
             data.isAdmin = true;
          }
          login({ uid: firebaseUser.uid, ...data } as any);
        }
      } else {
        logout();
      }
      setLoading(false);
    });

    return () => unsub();
  }, [login, logout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent flex rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
