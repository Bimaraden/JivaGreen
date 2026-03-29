
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EnvironmentalWidget from './components/EnvironmentalWidget';
import WasteList from './components/WasteList';
import AdminPanel from './components/AdminPanel';
import Wallet from './components/Wallet';
import Login from './components/Login';
import SellForm from './components/SellForm';
import Hero3D from './components/Hero3D';
import SplashScreen from './components/SplashScreen';
import FooterAnimation from './components/FooterAnimation';
import SetupGuide from './components/SetupGuide';
import CheckoutModal from './components/CheckoutModal';
import Profile from './components/Profile';
import AboutSection from './components/AboutSection';
import SecurityGuard from './components/SecurityGuard';
import WasteScanner from './components/WasteScanner';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  where,
  runTransaction
} from 'firebase/firestore';
import { storage } from './lib/storage';
import { Waste, User, UserRole, WasteStatus, WithdrawalRequest } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [wastes, setWastes] = useState<Waste[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedWasteForBuy, setSelectedWasteForBuy] = useState<Waste | null>(null);

  // Real-time listeners
  useEffect(() => {
    const qWastes = query(collection(db, 'wastes'), orderBy('createdAt', 'desc'));
    const unsubWastes = onSnapshot(qWastes, (snapshot) => {
      const mappedWastes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Waste));
      setWastes(mappedWastes);
      storage.saveWastes(mappedWastes);
    }, (err) => {
      console.error("Wastes snapshot error:", err);
      setWastes(storage.getWastes());
    });

    return () => {
      unsubWastes();
    };
  }, []);

  // Protected listeners (Users & Withdrawals)
  useEffect(() => {
    if (!user) return;

    let unsubUsers = () => {};
    let unsubWithdrawals = () => {};

    if (user.role === UserRole.ADMIN) {
      unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const mappedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setUsers(mappedUsers);
        storage.saveUsers(mappedUsers);
      }, (err) => {
        console.error("Users snapshot error:", err);
        setUsers(storage.getUsers());
      });

      const qWithdrawals = query(collection(db, 'withdrawal_requests'), orderBy('date', 'desc'));
      unsubWithdrawals = onSnapshot(qWithdrawals, (snapshot) => {
        const mapped = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithdrawalRequest));
        setWithdrawalRequests(mapped);
        storage.saveWithdrawals(mapped);
      }, (err) => {
        console.error("Withdrawals snapshot error:", err);
        setWithdrawalRequests(storage.getWithdrawals());
      });
    } else {
      const qWithdrawals = query(collection(db, 'withdrawal_requests'), where('userId', '==', user.id));
      unsubWithdrawals = onSnapshot(qWithdrawals, (snapshot) => {
        const mapped = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithdrawalRequest));
        mapped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setWithdrawalRequests(mapped);
        storage.saveWithdrawals(mapped);
      }, (err) => {
        console.error("Withdrawals snapshot error:", err);
        setWithdrawalRequests(storage.getWithdrawals());
      });
    }

    return () => {
      unsubUsers();
      unsubWithdrawals();
    };
  }, [user]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            if (userData.isBlocked) {
              await auth.signOut();
              setUser(null);
              storage.setCurrentUser(null);
              alert("Akun Anda telah diblokir.");
            } else {
              const isAdminEmail = [
                'admin@bookflow.com',
                'hdhdg9089@gmail.com'
              ].includes(firebaseUser.email?.toLowerCase().trim() || '');

              if (isAdminEmail && userData.role !== UserRole.ADMIN) {
                userData.role = UserRole.ADMIN;
                import('firebase/firestore').then(({ updateDoc }) => {
                  updateDoc(doc(db, 'users', firebaseUser.uid), { role: UserRole.ADMIN });
                });
              } else if (!isAdminEmail && userData.role === UserRole.ADMIN) {
                // Keep as admin if they were already set as admin in DB, 
                // unless we want to strictly enforce email-based role syncing
              }

              setUser(userData);
              storage.setCurrentUser(userData);
              if (userData.role === UserRole.ADMIN && currentPage === 'home') {
                setCurrentPage('admin');
              }
            }
          } else {
            // New user from Google Login or if profile missing
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
            setUser(newUser);
            storage.setCurrentUser(newUser);
          }
        } else {
          setUser(null);
          storage.setCurrentUser(null);
        }
      } catch (err: any) {
        console.error("Auth sync error:", err);
        // If it's a permission error, it might be because the user is newly logged in
        // and Firestore hasn't updated the auth context yet.
        if (err.message?.includes('insufficient permissions')) {
          console.warn("Retrying profile fetch due to permission delay...");
          setTimeout(() => {
            // This will trigger another auth change check or we could manually retry
          }, 1000);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'users', userId));
      alert("Akun berhasil dihapus.");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus akun.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlockUser = async (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;
    
    const newBlockedStatus = !targetUser.isBlocked;
    try {
      setLoading(true);
      await updateDoc(doc(db, 'users', userId), { isBlocked: newBlockedStatus });
      alert(newBlockedStatus ? "Akun berhasil diblokir." : "Blokir akun berhasil dibuka.");
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah status blokir.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWaste = async (wasteId: string) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'wastes', wasteId));
      alert("Sampah berhasil dihapus dari katalog.");
    } catch (err) {
      console.error("Error deleting waste:", err);
      alert("Gagal menghapus sampah.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecycleWaste = async (wasteId: string) => {
    try {
      setLoading(true);
      const waste = wastes.find(b => b.id === wasteId);
      if (!waste) return;

      await runTransaction(db, async (transaction) => {
        const sellerDoc = await transaction.get(doc(db, 'users', waste.sellerId));
        if (!sellerDoc.exists()) throw new Error("Seller not found");
        
        const currentPoints = sellerDoc.data().points || 0;
        transaction.update(doc(db, 'users', waste.sellerId), { points: currentPoints + 50 });
        transaction.update(doc(db, 'wastes', wasteId), { status: WasteStatus.RECYCLED });
      });

      alert(`Sampah "${waste.title}" telah diambil alih untuk didaur ulang. Penjual menerima 50 Poin Eco Reward.`);
    } catch (err) {
      console.error(err);
      alert("Gagal memproses daur ulang.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    storage.setCurrentUser(loggedInUser);
    if (loggedInUser.role === UserRole.ADMIN) {
      setCurrentPage('admin');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = async () => { 
    await auth.signOut();
    setUser(null); 
    storage.setCurrentUser(null); 
    setCurrentPage('home'); 
  };

  const handleTopUp = async (amount: number) => {
    if (!user) return;
    setLoading(true);
    try {
      const newPoints = user.points + amount;
      await updateDoc(doc(db, 'users', user.id), { points: newPoints });
      alert(`Top-up berhasil! ${amount} Poin telah ditambahkan ke saldo Anda.`);
    } catch (err) {
      alert("Top-up gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (amount: number, method: string, acc: string) => {
    if (!user) return;
    
    if (user.points < amount) {
      alert("Poin Anda tidak mencukupi untuk melakukan penarikan ini.");
      return;
    }

    setLoading(true);
    try {
      const requestId = Math.random().toString(36).substr(2, 9);
      const newRequest: WithdrawalRequest = {
        id: requestId,
        userId: user.id,
        userName: user.name || 'Pengguna',
        points: amount,
        amount: amount * 100,
        method: method,
        accountNumber: acc,
        status: 'PENDING',
        date: new Date().toISOString()
      };
      await setDoc(doc(db, 'withdrawal_requests', requestId), newRequest);
      alert(`Permintaan penarikan ${amount} Poin ke ${method} telah dikirim. Menunggu konfirmasi Admin.`);
    } catch (err: any) {
      console.error("Withdrawal error:", err);
      alert(`Gagal mengirim permintaan penarikan: ${err.message || "Terjadi kesalahan"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmWithdraw = async (requestId: string) => {
    try {
      const request = withdrawalRequests.find(r => r.id === requestId);
      if (!request) return;

      setLoading(true);
      
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(doc(db, 'users', request.userId));
        if (!userDoc.exists()) throw new Error("User tidak ditemukan");
        
        const currentPoints = userDoc.data().points || 0;
        if (currentPoints < request.points) throw new Error("Poin tidak mencukupi");
        
        transaction.update(doc(db, 'users', request.userId), { points: currentPoints - request.points });
        transaction.update(doc(db, 'withdrawal_requests', requestId), { status: 'COMPLETED' });
      });

      alert("Penarikan berhasil dikonfirmasi dan poin telah dikurangi.");
    } catch (err: any) {
      console.error("Confirm withdraw error:", err);
      alert(`Gagal konfirmasi penarikan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveWaste = async (wasteId: string, action: 'catalog' | 'recycle') => {
    try {
      setLoading(true);
      const waste = wastes.find(b => b.id === wasteId);
      if (!waste) return;

      const nextStatus = action === 'catalog' ? WasteStatus.AVAILABLE : WasteStatus.RECYCLED;
      
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, 'wastes', wasteId), { status: nextStatus });
        
        if (action === 'recycle') {
          const sellerDoc = await transaction.get(doc(db, 'users', waste.sellerId));
          if (sellerDoc.exists()) {
            const currentPoints = sellerDoc.data().points || 0;
            transaction.update(doc(db, 'users', waste.sellerId), { points: currentPoints + 50 });
          }
        }
      });

      alert(`Sampah "${waste.title}" telah ${action === 'catalog' ? 'dipublikasikan' : 'masuk proses daur ulang'}.`);
    } catch (err) {
      console.error(err);
      alert("Gagal memproses sampah.");
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (deliveryAddress: string) => {
    if (!selectedWasteForBuy || !user) return;
    
    setLoading(true);
    const wastePriceInPoints = Math.floor(selectedWasteForBuy.price / 100);
    const shippingPoints = 100;
    const totalDeduction = wastePriceInPoints + shippingPoints;

    if (user.points < totalDeduction) {
      alert("Poin Anda tidak mencukupi.");
      setLoading(false);
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const buyerDoc = await transaction.get(doc(db, 'users', user.id));
        const sellerDoc = await transaction.get(doc(db, 'users', selectedWasteForBuy.sellerId));
        const wasteDoc = await transaction.get(doc(db, 'wastes', selectedWasteForBuy.id));

        if (!buyerDoc.exists() || !sellerDoc.exists() || !wasteDoc.exists()) throw new Error("Data tidak lengkap");
        if (wasteDoc.data().status !== WasteStatus.AVAILABLE) throw new Error("Sampah sudah tidak tersedia");

        const buyerPoints = buyerDoc.data().points || 0;
        const sellerPoints = sellerDoc.data().points || 0;

        transaction.update(doc(db, 'users', user.id), { points: buyerPoints - totalDeduction });
        transaction.update(doc(db, 'users', selectedWasteForBuy.sellerId), { points: sellerPoints + wastePriceInPoints });
        
        // Admin fee
        const adminQ = query(collection(db, 'users'), where('role', '==', UserRole.ADMIN));
        const adminSnap = await getDocs(adminQ);
        if (!adminSnap.empty) {
          const adminDoc = adminSnap.docs[0];
          transaction.update(doc(db, 'users', adminDoc.id), { points: (adminDoc.data().points || 0) + shippingPoints });
        }

        transaction.update(doc(db, 'wastes', selectedWasteForBuy.id), { 
          status: WasteStatus.SOLD,
          description: `Dibeli oleh ${user.name}. Alamat: ${deliveryAddress}`
        });
      });

      alert(`Sukses! Sampah "${selectedWasteForBuy.title}" berhasil dibeli. Kurir akan mengirim ke alamat: ${deliveryAddress}`);
      setSelectedWasteForBuy(null);
    } catch (err: any) {
      console.error(err);
      alert(`Transaksi gagal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPoints = async () => {
    try {
      setLoading(true);
      const batch = users.map(u => {
        const resetVal = u.role === UserRole.ADMIN ? 1000 : 10;
        return updateDoc(doc(db, 'users', u.id), { points: resetVal });
      });
      await Promise.all(batch);
      alert("Poin telah dibersihkan!");
    } catch (err) { alert("Gagal mereset poin."); }
    finally { setLoading(false); }
  };

  const handleConfirmPickup = async (wasteId: string) => {
    try {
      setLoading(true);
      const waste = wastes.find(b => b.id === wasteId);
      if (!waste) return;
      
      const isRecycled = waste.isRecycle || waste.condition?.toLowerCase().includes('rusak');
      const nextStatus = isRecycled ? WasteStatus.RECYCLED : WasteStatus.AVAILABLE;
      
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, 'wastes', wasteId), { status: nextStatus });
        
        if (isRecycled) {
          const sellerDoc = await transaction.get(doc(db, 'users', waste.sellerId));
          if (sellerDoc.exists()) {
            const currentPoints = sellerDoc.data().points || 0;
            transaction.update(doc(db, 'users', waste.sellerId), { points: currentPoints + 50 });
          }
        }
      });

      alert(`Sampah "${waste.title}" dikonfirmasi ${nextStatus === WasteStatus.RECYCLED ? 'untuk didaur ulang (+50 Poin Eco Reward)' : 'siap dijual'}!`);
    } catch (err) {
      console.error(err);
      alert("Gagal konfirmasi");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page: string) => {
    if (page === 'sell' && !user) { setCurrentPage('login'); } 
    else { setCurrentPage(page); }
    window.scrollTo(0, 0);
  };

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <SecurityGuard>
      <div className="min-h-screen flex flex-col bg-[#fcfdfd] selection:bg-emerald-200">
      <Navbar user={user} onLogout={handleLogout} onNavigate={handleNavigate} currentPage={currentPage} />
      
      {selectedWasteForBuy && user && (
        <CheckoutModal 
          waste={selectedWasteForBuy} 
          user={user} 
          onClose={() => setSelectedWasteForBuy(null)} 
          onConfirm={handleTransaction} 
        />
      )}

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-6 py-12 md:py-20">
        {currentPage === 'home' && (
          <div className="space-y-16 md:space-y-28">
            <Hero3D onAction={() => handleNavigate('sell')} />
            <AboutSection />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
              <div className="md:col-span-5 lg:col-span-4 md:order-2">
                <EnvironmentalWidget recycledCount={wastes.filter(b => b.status === WasteStatus.RECYCLED).length} />
              </div>
              <div className="md:col-span-7 lg:col-span-8 md:order-1 space-y-12">
                 <div className="flex justify-between items-end border-b border-slate-100 pb-8">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">Sampah Terkurasi</h2>
                      <p className="text-slate-400 text-[10px] md:text-xs font-medium mt-1 uppercase tracking-widest">Koleksi Komunitas Eco-Friendly</p>
                    </div>
                    <button onClick={() => { /* No-op, real-time handles it */ }} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm active:scale-90"><i className="fas fa-sync-alt"></i></button>
                 </div>
                 <WasteList 
                   currentUser={user}
                   wastes={wastes.filter(b => b.status === WasteStatus.AVAILABLE)} 
                   onBuy={(waste) => {
                     if(!user) setCurrentPage('login');
                     else setSelectedWasteForBuy(waste);
                   }}
                 />
              </div>
            </div>
          </div>
        )}
        {currentPage === 'scanner' && <WasteScanner />}
        {currentPage === 'login' && <Login onLogin={handleLogin} onGoToSetup={() => setCurrentPage('setup')} />}
        {currentPage === 'setup' && <SetupGuide />}
        {currentPage === 'sell' && user && <SellForm onSell={async (data) => {
           const wasteId = Math.random().toString(36).substr(2, 9);
           await setDoc(doc(db, 'wastes', wasteId), {
             id: wasteId,
             title: data.title, 
             material: data.material, 
             price: Math.floor(Number(data.price) || 0), 
             condition: data.condition,
             imageUrl: data.image, 
             sellerId: user.id, 
             sellerName: user.name, 
             status: WasteStatus.PENDING_APPROVAL,
             latitude: data.latitude, 
             longitude: data.longitude, 
             address: data.address,
             composition: data.composition,
             createdAt: new Date().toISOString()
           });
           alert("Sampah berhasil dikirim! Menunggu persetujuan Admin sebelum dipublikasikan.");
           setCurrentPage('home');
        }} />}
        {currentPage === 'wallet' && user && (
          <Wallet 
            user={user} 
            onWithdraw={handleWithdraw} 
            onTopUp={handleTopUp} 
            requests={withdrawalRequests.filter(r => r.userId === user.id)}
          />
        )}
        {currentPage === 'admin' && user?.role === UserRole.ADMIN && (
          <AdminPanel 
            wastes={wastes} 
            users={users} 
            withdrawalRequests={withdrawalRequests}
            onConfirmPickup={handleConfirmPickup} 
            onDeleteUser={handleDeleteUser}
            onToggleBlockUser={handleToggleBlockUser}
            onDeleteWaste={handleDeleteWaste}
            onRecycleWaste={handleRecycleWaste}
            onApproveWaste={handleApproveWaste}
            onConfirmWithdraw={handleConfirmWithdraw}
            onResetPoints={handleResetPoints} 
          />
        )}
        {currentPage === 'profile' && user && <Profile user={user} />}
      </main>
      <FooterAnimation />
      <footer className="bg-white border-t border-slate-100 py-16 text-center">
         <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
               <i className="fas fa-seedling"></i>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">WasteFlow Platform v4.0 • AI Powered</p>
         </div>
      </footer>
      </div>
    </SecurityGuard>
  );
};

export default App;

