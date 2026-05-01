
import React, { useState } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserRole, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onGoBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName || 'Pengguna'}&background=4CAF50&color=fff`,
          joinedAt: new Date().toISOString(),
          ecoStats: { treesGrown: 0, leavesCount: 0, co2Saved: 0, waterSaved: 0 }
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        onLogin(newUser);
      }
    } catch (err: any) {
      console.error("Google Login Error:", err);
      if (err.code === 'auth/operation-not-allowed') {
        setError("Metode login Google belum diaktifkan. Buka Console > Authentication > Sign-in method dan aktifkan 'Google'.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("Login dibatalkan (pop-up ditutup).");
      } else if (err.code === 'auth/cancelled-by-user') {
        setError("Login dibatalkan oleh pengguna.");
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError("Akun sudah terdaftar dengan metode login lain.");
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

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError("Silakan masukkan alamat email yang valid.");
      setLoading(false);
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("Password harus minimal 6 karakter.");
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {
        const result = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        const firebaseUser = result.user;
        
        const isAdminEmail = [
          'admin@bookflow.com',
          'hdhdg9089@gmail.com'
        ].includes(trimmedEmail.toLowerCase());

        const newUser: User = {
          id: firebaseUser.uid,
          name: fullName || trimmedEmail.split('@')[0],
          email: trimmedEmail,
          points: isAdminEmail ? 1000 : 10,
          role: isAdminEmail ? UserRole.ADMIN : UserRole.USER,
          avatar: `https://ui-avatars.com/api/?name=${fullName || trimmedEmail.split('@')[0]}&background=4CAF50&color=fff`,
          joinedAt: new Date().toISOString(),
          ecoStats: { treesGrown: 0, leavesCount: 0, co2Saved: 0, waterSaved: 0 }
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        onLogin(newUser);
      } else {
        const result = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
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
          ].includes(trimmedEmail.toLowerCase());

          if (isAdminEmail && userData.role !== UserRole.ADMIN) {
            userData.role = UserRole.ADMIN;
            import('firebase/firestore').then(({ updateDoc }) => {
              updateDoc(doc(db, 'users', firebaseUser.uid), { role: UserRole.ADMIN });
            });
          }
          
          onLogin(userData);
        } else {
          const isAdminEmail = [
            'admin@bookflow.com',
            'hdhdg9089@gmail.com'
          ].includes(trimmedEmail.toLowerCase());

          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || trimmedEmail.split('@')[0],
            email: trimmedEmail,
            points: isAdminEmail ? 1000 : 10,
            role: isAdminEmail ? UserRole.ADMIN : UserRole.USER,
            avatar: `https://ui-avatars.com/api/?name=${firebaseUser.displayName || trimmedEmail.split('@')[0]}&background=4CAF50&color=fff`,
            joinedAt: new Date().toISOString(),
            ecoStats: { treesGrown: 0, leavesCount: 0, co2Saved: 0, waterSaved: 0 }
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          onLogin(newUser);
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/operation-not-allowed') {
        setError("Metode login ini belum diaktifkan. Buka Console > Authentication > Sign-in method dan aktifkan 'Email/Password'.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Format email tidak valid.");
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Email atau password salah.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Email sudah terdaftar.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password terlalu lemah.");
      } else {
        setError(err.message || "Gagal autentikasi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-dark flex font-sans overflow-hidden">
      {/* Left Pane: Branding & Hero Illustration (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark p-20 flex-col justify-between relative overflow-hidden h-full">
        {/* Abstract Background Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-primary/10 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-20">

            <div className="w-16 h-16 flex items-center justify-center bg-white rounded-xl shadow-lg group-hover:rotate-6 transition-transform duration-500 overflow-hidden">
                <img src="/logo.png" className="w-full h-full object-contain" alt="Jivagreen Logo" referrerPolicy="no-referrer" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter italic">
                Jiva<span className="text-primary italic">green.</span>
              </span>
            </div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-7xl font-black text-white leading-[0.85] tracking-tighter mb-8">
              Pulihkan <br/> <span className="text-primary tracking-tighter">Planet Kita.</span>
            </h1>
            <p className="text-white/40 text-xl max-w-md leading-relaxed font-medium tracking-tight">
              Memulihkan lingkungan kita melalui pengelolaan limbah yang cerdas dan ekonomi sirkular.
            </p>
          </motion.div>
        </div>

        {/* Removed social proof section */}
      </div>

      {/* Right Pane: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center h-full overflow-y-auto bg-soft-white relative p-6 sm:p-12 lg:px-24">
        {/* Back Button */}
        <button 
          onClick={onGoBack}
          className="absolute top-8 left-8 z-20 flex items-center gap-3 px-6 py-3 bg-white border border-black/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm hover:bg-dark hover:text-primary transition-all active:scale-95 group"
        >
           <i className="fas fa-arrow-left transition-transform group-hover:-translate-x-1"></i>
           Kembali
        </button>

        {/* Background blobs for mobile */}
        <div className="lg:hidden absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="flex-1 flex flex-col justify-center w-full max-w-md py-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full text-center lg:text-left"
          >
            <div className="mb-8 md:mb-10">
              <h2 className="text-3xl md:text-5xl font-black text-dark tracking-tighter mb-2 md:mb-4 italic">
                {isRegister ? 'Buat Akun' : 'Selamat Datang'}
              </h2>
              <p className="text-dark/40 text-sm font-medium">
                {isRegister ? 'Bergabunglah untuk mulai berdampak.' : 'Lanjutkan kontribusi hijau Anda hari ini.'}
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-xs font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              <AnimatePresence mode="wait">
                {isRegister && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-dark/40 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required 
                      value={fullName} 
                      onChange={e => setFullName(e.target.value)} 
                      className="w-full px-6 py-4 bg-white border border-black/5 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                      placeholder="Masukkan nama Anda" 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="space-y-2">
                <label className="text-dark/40 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Alamat Email</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full px-6 py-3 md:py-4 bg-white border border-black/5 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                  placeholder="nama@email.com" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-dark/40 text-[10px] font-black uppercase tracking-[0.2em]">Kata Sandi</label>
                  <button type="button" className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline">Lupa?</button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full px-6 py-3 md:py-4 bg-white border border-black/5 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-dark/20 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                disabled={loading} 
                className="w-full py-4 md:py-5 bg-primary text-white font-black rounded-2xl transition-all shadow-xl shadow-primary/20 hover:bg-primary-dark active:scale-[0.98] flex items-center justify-center gap-3 md:gap-4 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs"
              >
                {loading ? (
                  <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (isRegister ? 'Buat Akun' : 'Masuk Sesi')}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
              <div className="relative flex justify-center text-[8px] md:text-[9px] uppercase font-bold text-dark/20 bg-soft-white px-6 tracking-widest">Atau Lanjutkan Dengan</div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 md:py-4 bg-white border border-black/5 text-dark font-bold rounded-2xl hover:bg-soft-white transition-all flex items-center justify-center gap-3 md:gap-4 shadow-sm active:scale-[0.98]"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 md:w-5 h-4 md:h-5" alt="Google" />
              <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-black">Google Account</span>
            </button>

            <div className="mt-8 text-center text-dark/40 text-[10px] uppercase tracking-widest">
               {isRegister ? 'Sudah punya akun? ' : "Belum punya akun? "}
               <button onClick={() => setIsRegister(!isRegister)} className="text-primary font-bold ml-1 hover:underline">
                 {isRegister ? 'Login' : 'Daftar Sekarang'}
               </button>
            </div>
          </motion.div>
        </div>

        <div className="w-full py-8 text-center opacity-20 hover:opacity-100 transition-opacity mt-auto">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-dark">
            &copy; {new Date().getFullYear()} Jivagreen Intel. Privasi & Kebijakan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;





