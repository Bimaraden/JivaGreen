
import React, { useState } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserRole, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onGoToSetup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToSetup }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        if (userData.isBlocked) {
          await auth.signOut();
          throw new Error("Akun Anda telah diblokir.");
        }
        
        const isAdminEmail = [
          'admin@bookflow.com',
          'hdhdg9089@gmail.com'
        ].includes(firebaseUser.email?.toLowerCase().trim() || '');

        if (isAdminEmail && userData.role !== UserRole.ADMIN) {
          userData.role = UserRole.ADMIN;
          // Don't await this to avoid blocking login, it will sync in background
          import('firebase/firestore').then(({ updateDoc }) => {
            updateDoc(doc(db, 'users', firebaseUser.uid), { role: UserRole.ADMIN });
          });
        }
        
        onLogin(userData);
      } else {
        const isAdminEmail = [
          'admin@bookflow.com',
          'hdhdg9089@gmail.com'
        ].includes(firebaseUser.email?.toLowerCase().trim() || '');

        const newUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Pengguna',
          email: firebaseUser.email || '',
          points: isAdminEmail ? 1000 : 10,
          role: isAdminEmail ? UserRole.ADMIN : UserRole.USER,
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName || 'Pengguna'}&background=004d40&color=fff`,
          joinedAt: new Date().toISOString(),
          ecoStats: { treesGrown: 0, leavesCount: 0, co2Saved: 0, waterSaved: 0 }
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        onLogin(newUser);
      }
    } catch (err: any) {
      console.error("Google Login Error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError("Popup diblokir oleh browser. Silakan izinkan popup untuk login.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("Login dibatalkan.");
      } else {
        setError(err.message || "Gagal login dengan Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = result.user;
        
        const isAdminEmail = [
          'admin@bookflow.com',
          'hdhdg9089@gmail.com'
        ].includes(email.toLowerCase().trim());

        const newUser: User = {
          id: firebaseUser.uid,
          name: fullName || email.split('@')[0],
          email: email,
          points: isAdminEmail ? 1000 : 10,
          role: isAdminEmail ? UserRole.ADMIN : UserRole.USER,
          avatar: `https://ui-avatars.com/api/?name=${fullName || email.split('@')[0]}&background=004d40&color=fff`,
          joinedAt: new Date().toISOString(),
          ecoStats: { treesGrown: 0, leavesCount: 0, co2Saved: 0, waterSaved: 0 }
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        onLogin(newUser);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = result.user;
        
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          if (userData.isBlocked) {
            await auth.signOut();
            throw new Error("Akun Anda telah diblokir.");
          }
          
          const isAdminEmail = [
            'admin@bookflow.com',
            'hdhdg9089@gmail.com'
          ].includes(email.toLowerCase().trim());

          if (isAdminEmail && userData.role !== UserRole.ADMIN) {
            userData.role = UserRole.ADMIN;
            import('firebase/firestore').then(({ updateDoc }) => {
              updateDoc(doc(db, 'users', firebaseUser.uid), { role: UserRole.ADMIN });
            });
          }
          
          onLogin(userData);
        } else {
          // If profile missing for some reason, create it
          const isAdminEmail = [
            'admin@bookflow.com',
            'hdhdg9089@gmail.com'
          ].includes(email.toLowerCase().trim());

          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || email.split('@')[0],
            email: email,
            points: isAdminEmail ? 1000 : 10,
            role: isAdminEmail ? UserRole.ADMIN : UserRole.USER,
            avatar: `https://ui-avatars.com/api/?name=${firebaseUser.displayName || email.split('@')[0]}&background=004d40&color=fff`,
            joinedAt: new Date().toISOString(),
            ecoStats: { treesGrown: 0, leavesCount: 0, co2Saved: 0, waterSaved: 0 }
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          onLogin(newUser);
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/user-not-found') {
        setError("Email tidak terdaftar.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Password salah.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Format email tidak valid.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password terlalu lemah (minimal 6 karakter).");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Email sudah digunakan.");
      } else {
        setError(err.message || "Gagal autentikasi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 w-full max-w-md relative overflow-hidden animate-in zoom-in duration-500">
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-[2.2rem] overflow-hidden mx-auto mb-6 shadow-2xl border-4 border-emerald-50/50">
            <img src="https://images.squarespace-cdn.com/content/v1/5e94819777d6127c569d1560/1601332733971-S6C7I7I6B2Q2K2H6S6S6/Logo+Icon.png" className="w-full h-full object-contain" alt="WasteFlow" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            {isRegister ? 'Gabung Ekosistem' : 'Masuk Cloud'}
          </h2>
          <p className="text-slate-400 text-xs mt-2 font-medium">Platform Jual Sampah Eco-Friendly</p>
        </div>

        {error && (
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-bold uppercase tracking-widest text-center">
              {error}
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 text-[9px] font-medium leading-relaxed">
              <p className="font-black mb-1 uppercase tracking-widest">Tips Troubleshooting:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Pastikan koneksi internet stabil.</li>
                <li>Jika menggunakan Google Login, izinkan popup di browser Anda.</li>
                <li>Jika error berlanjut, coba buka aplikasi di tab baru atau mode Incognito.</li>
                <li>Pastikan Firebase Auth sudah diaktifkan di Firebase Console.</li>
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Lengkap</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Budi Santoso" />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500" placeholder="user@example.com" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500" placeholder="••••••••" />
          </div>

          <button disabled={loading} className="w-full py-5 bg-emerald-600 text-white font-black rounded-[2rem] hover:bg-emerald-500 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-[11px] flex items-center justify-center gap-3">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isRegister ? 'DAFTAR SEKARANG' : 'MASUK KE AKUN')}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-300 bg-white px-4 tracking-widest">Atau</div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest shadow-sm active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Masuk dengan Google
        </button>

        <div className="mt-8 text-center">
           <button onClick={() => setIsRegister(!isRegister)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600">
             {isRegister ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
