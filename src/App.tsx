import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import EnvironmentalWidget from './components/EnvironmentalWidget';
import WasteList from './components/WasteList';
import AdminPanel from './components/AdminPanel';
import Wallet from './components/Wallet';
import Login from './components/Login';
import SellForm from './components/SellForm';
import Hero3D from './components/Hero3D';
import Features from './components/Features';
import SplashScreen from './components/SplashScreen';
import CheckoutModal from './components/CheckoutModal';
import Profile from './components/Profile';
import SecurityGuard from './components/SecurityGuard';
import WasteScanner from './components/WasteScanner';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import { db, auth, testConnection, handleFirestoreError, OperationType } from '@/firebase-config';
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

import About from './components/About';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [wastes, setWastes] = useState<Waste[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(() => {
    return !localStorage.getItem('jivagreen_visited');
  });
  const [selectedWasteForBuy, setSelectedWasteForBuy] = useState<Waste | null>(null);

  // Connection test
  useEffect(() => {
    testConnection();
  }, []);

  // Real-time listeners
  useEffect(() => {
    const qWastes = query(collection(db, 'wastes'), orderBy('createdAt', 'desc'));
    const unsubWastes = onSnapshot(qWastes, (snapshot) => {
      const mappedWastes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Waste));
      setWastes(mappedWastes);
      storage.saveWastes(mappedWastes);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'wastes');
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
        handleFirestoreError(err, OperationType.LIST, 'users');
      });

      const qWithdrawals = query(collection(db, 'withdrawal_requests'), orderBy('date', 'desc'));
      unsubWithdrawals = onSnapshot(qWithdrawals, (snapshot) => {
        const mapped = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithdrawalRequest));
        setWithdrawalRequests(mapped);
        storage.saveWithdrawals(mapped);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'withdrawal_requests');
      });
    } else {
      const qWithdrawals = query(collection(db, 'withdrawal_requests'), where('userId', '==', user.id));
      unsubWithdrawals = onSnapshot(qWithdrawals, (snapshot) => {
        const mapped = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithdrawalRequest));
        mapped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setWithdrawalRequests(mapped);
        storage.saveWithdrawals(mapped);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'withdrawal_requests');
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
          // Transform ID logic
          const originalUid = firebaseUser.uid;
          const displayId = originalUid.startsWith('gen-lang-client-') 
            ? originalUid.replace('gen-lang-client-', 'BRS-client-')
            : (originalUid.includes('-') ? originalUid : `BRS-client-${originalUid.substring(0, 8)}`);

          const userDoc = await getDoc(doc(db, 'users', originalUid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            // Ensure ID in state matches our custom format
            userData.id = displayId;
            
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
                await updateDoc(doc(db, 'users', firebaseUser.uid), { role: UserRole.ADMIN });
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
              id: displayId,
              name: firebaseUser.displayName || 'Pengguna',
              email: firebaseUser.email || '',
              points: isAdminEmail ? 1000 : 10,
              role: isAdminEmail ? UserRole.ADMIN : UserRole.USER,
              avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName || 'Pengguna'}&background=004d40&color=fff`,
              joinedAt: new Date().toISOString(),
              ecoStats: { treesGrown: 0, leavesCount: 0, co2Saved: 0, waterSaved: 0 }
            };
            await setDoc(doc(db, 'users', originalUid), newUser);
            setUser(newUser);
            storage.setCurrentUser(newUser);
          }
        } else {
          setUser(null);
          storage.setCurrentUser(null);
        }
      } catch (err: any) {
        handleFirestoreError(err, OperationType.GET, 'users');
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
      handleFirestoreError(err, OperationType.DELETE, `users/${userId}`);
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
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
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
      handleFirestoreError(err, OperationType.DELETE, `wastes/${wasteId}`);
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
      handleFirestoreError(err, OperationType.WRITE, `wastes/${wasteId}/recycle`);
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
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.id}`);
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
      handleFirestoreError(err, OperationType.WRITE, 'withdrawal_requests');
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
      handleFirestoreError(err, OperationType.WRITE, `withdrawal_requests/${requestId}/confirm`);
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
      handleFirestoreError(err, OperationType.WRITE, `wastes/${wasteId}/approve`);
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
      handleFirestoreError(err, OperationType.WRITE, `wastes/${selectedWasteForBuy.id}/buy`);
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
    } catch (err) { 
      handleFirestoreError(err, OperationType.UPDATE, 'users/reset_points');
    }
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
      handleFirestoreError(err, OperationType.WRITE, `wastes/${wasteId}/pickup`);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page: string) => {
    if (page === 'sell' && !user) { 
      setCurrentPage('login'); 
      window.scrollTo(0, 0);
    } else if (page === 'marketplace') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('marketplace-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);
        }
      }, 100);
    } else {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  if (showSplash) return <SplashScreen onFinish={() => {
    setShowSplash(false);
    localStorage.setItem('jivagreen_visited', 'true');
  }} />;

  if (currentPage === 'login') {
    return (
      <ErrorBoundary>
        <SecurityGuard>
          <Login 
            onLogin={handleLogin} 
            onGoBack={() => setCurrentPage('home')} 
          />
        </SecurityGuard>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <SecurityGuard>
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] selection:bg-primary/20 relative overflow-x-hidden">
          {/* Global Ambient Background */}
          <div className="fixed inset-0 pointer-events-none z-0">
             <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full animate-pulse"></div>
             <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary/3 blur-[100px] rounded-full"></div>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-[0.02]"></div>
          </div>

          <Navbar user={user} onLogout={handleLogout} onNavigate={handleNavigate} currentPage={currentPage} />
          
          {selectedWasteForBuy && user && (
            <CheckoutModal 
              waste={selectedWasteForBuy} 
              user={user} 
              onClose={() => setSelectedWasteForBuy(null)} 
              onConfirm={handleTransaction} 
            />
          )}

          <main className="flex-grow z-10 relative">
            <div className="max-w-[1440px] mx-auto w-full px-6 pt-28 pb-12 md:py-12 lg:py-24">
        {currentPage === 'home' && (
          <div className="space-y-20 md:space-y-32">
            <Hero3D onAction={() => handleNavigate('sell')} />
            
            <Features />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-5 lg:col-span-4 sticky top-32">
                <EnvironmentalWidget recycledCount={wastes.filter(b => b.status === WasteStatus.RECYCLED).length} />
              </div>
              <div className="md:col-span-7 lg:col-span-8 space-y-12">
                <div id="marketplace-section" className="flex flex-col sm:flex-row justify-between items-start sm:items-end bg-white p-10 md:p-14 rounded-[3rem] border border-black/5 shadow-sm gap-6 sm:gap-4">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black text-dark tracking-tighter font-['Montserrat',sans-serif]">Sustainable Marketplace</h2>
                    <p className="text-dark/40 text-[10px] md:text-[11px] font-black mt-2 uppercase tracking-[0.3em] font-['Poppins',sans-serif]">Temukan bahan baku berkualitas tinggi</p>
                  </div>
                  <button onClick={() => {}} className="w-14 h-14 rounded-2xl bg-white text-dark/30 hover:text-primary transition-all active:scale-90 flex items-center justify-center border border-black/5 shadow-sm">
                    <i className="fas fa-search text-base"></i>
                  </button>
                </div>
                <div className="bg-white p-6 md:p-14 rounded-[3.5rem] border border-black/5 shadow-sm">
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
          </div>
        )}
        {currentPage === 'about' && <About />}
        {currentPage === 'scanner' && <WasteScanner />}
        {currentPage === 'sell' && user && <SellForm onSell={async (data) => {
           try {
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
           } catch (err) {
             handleFirestoreError(err, OperationType.CREATE, 'wastes');
           }
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
            </div>
          </main>
          <Footer 
            onNavigate={handleNavigate} 
            isAdmin={user?.role === UserRole.ADMIN} 
          />
        </div>
      </SecurityGuard>
    </ErrorBoundary>
  );
};

export default App;

