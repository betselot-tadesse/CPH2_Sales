import React, { useState, useEffect, useMemo } from 'react';
import { 
  Phone, 
  UtensilsCrossed, 
  ClipboardList, 
  BarChart3, 
  Settings as SettingsIcon, 
  Hotel, 
  Menu as MenuIcon,
  CheckCircle2,
  XCircle,
  PhoneOff,
  Trash2,
  FileSpreadsheet,
  FileText,
  ArrowRight
} from 'lucide-react';
import { 
  CallRecord, 
  CallOutcome, 
  OrderStatus, 
  MenuItem, 
  OrderItem, 
  DailyStats 
} from './types';
import { MENU_ITEMS, MENU_CATEGORIES } from './data/menu';

// --- COMPONENTS ---

// 1. Sidebar
const Sidebar = ({ activeView, setActiveView, isMobileOpen, setIsMobileOpen }: any) => {
  const menuItems = [
    { id: 'call-panel', label: 'Call Panel', icon: Phone },
    { id: 'menu-list', label: 'Menu List', icon: UtensilsCrossed },
    { id: 'order-records', label: 'Order Records', icon: ClipboardList },
    { id: 'daily-report', label: 'Daily Report', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out flex flex-col shadow-xl shrink-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-3 text-amber-400">
            <Hotel size={32} />
          </div>
          <h1 className="font-bold text-lg leading-tight">Crystal Plaza<br/>Al Majaz Hotel</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Sales Dashboard</p>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setIsMobileOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                ${activeView === item.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} className={activeView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-500 text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>System Online</span>
          </div>
        </div>
      </aside>
    </>
  );
};

// 2. Call Panel View
const CallPanel = ({ onSaveRecord }: { onSaveRecord: (record: CallRecord) => void }) => {
  const [step, setStep] = useState<'input' | 'outcome' | 'order-check' | 'menu-selection'>('input');
  const [roomNumber, setRoomNumber] = useState('');
  const [currentOutcome, setCurrentOutcome] = useState<CallOutcome | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(MENU_CATEGORIES[0]);

  // Reset state helper
  const resetFlow = () => {
    setStep('input');
    setRoomNumber('');
    setCurrentOutcome(null);
    setCart([]);
  };

  // Handlers
  const handleCallAttempt = () => {
    if (!roomNumber.trim()) return;
    setStep('outcome');
  };

  const handleOutcome = (outcome: CallOutcome) => {
    setCurrentOutcome(outcome);
    if (outcome === CallOutcome.Picked) {
      setStep('order-check');
    } else {
      const record: CallRecord = {
        id: Date.now().toString(),
        roomNumber,
        timestamp: Date.now(),
        callAttempt: 1,
        outcome,
        orderStatus: OrderStatus.NoResponse,
        orderedItems: [],
        totalAmount: 0
      };
      onSaveRecord(record);
      resetFlow();
    }
  };

  const handleOrderCheck = (ordered: boolean) => {
    if (ordered) {
      setStep('menu-selection');
    } else {
      const record: CallRecord = {
        id: Date.now().toString(),
        roomNumber,
        timestamp: Date.now(),
        callAttempt: 1,
        outcome: CallOutcome.Picked,
        orderStatus: OrderStatus.NotOrdered,
        orderedItems: [],
        totalAmount: 0
      };
      onSaveRecord(record);
      resetFlow();
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const submitOrder = () => {
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const record: CallRecord = {
      id: Date.now().toString(),
      roomNumber,
      timestamp: Date.now(),
      callAttempt: 1,
      outcome: CallOutcome.Picked,
      orderStatus: OrderStatus.Ordered,
      orderedItems: cart,
      totalAmount
    };
    onSaveRecord(record);
    resetFlow();
  };

  // Render Internal Content Based on Step
  const renderContent = () => {
    if (step === 'menu-selection') {
      // Reusable Cart Component for Mobile/Desktop placement
      const CartContent = ({ isMobile }: { isMobile: boolean }) => (
        <div className={`bg-white flex flex-col ${isMobile ? 'rounded-xl shadow-sm border border-slate-200' : 'h-full'}`}>
            <div className={`p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center ${isMobile ? 'rounded-t-xl' : ''}`}>
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <ClipboardList size={18} />
                Current Order
              </h3>
              <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                {cart.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>
            
            <div className={`overflow-y-auto p-3 space-y-2 bg-slate-50/30 ${isMobile ? 'max-h-[300px]' : 'flex-1'}`}>
              {cart.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-slate-400 text-center text-sm">
                  <UtensilsCrossed size={32} className="mb-2 opacity-20" />
                  <p>No items selected</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex justify-between items-start text-sm bg-white p-3 rounded-lg border border-slate-100 shadow-sm animate-in slide-in-from-bottom-2">
                    <div>
                      <span className="font-medium text-slate-700 block">{item.quantity}x {item.name}</span>
                      <div className="text-xs text-slate-400">{item.price * item.quantity} AED</div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 p-1 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className={`p-4 bg-white border-t border-slate-200 space-y-3 ${isMobile ? 'rounded-b-xl' : ''}`}>
              <div className="flex justify-between text-lg font-bold text-slate-800">
                <span>Total</span>
                <span>{cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)} AED</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={resetFlow} className="px-4 py-3 border border-slate-300 text-slate-600 rounded-xl text-sm hover:bg-slate-50 font-bold transition-colors">Cancel</button>
                <button 
                  onClick={submitOrder} 
                  disabled={cart.length === 0}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-all"
                >
                  Save Order
                </button>
              </div>
            </div>
        </div>
      );

      return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Filters - Fixed Header */}
          <div className="shrink-0 p-3 bg-white border-b border-slate-200 shadow-sm z-10 relative">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {MENU_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0
                    ${selectedCategory === cat 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {/* Main Content Area - Mobile: Scrollable (Menu + Cart), Desktop: Flex Row */}
          <div className="flex-1 overflow-y-auto lg:overflow-hidden lg:flex bg-slate-50/30">
            
            {/* Menu Grid Wrapper */}
            <div className="flex-1 p-4 lg:overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {MENU_ITEMS
                  .filter(item => item.category === selectedCategory)
                  .map(item => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-3 hover:border-indigo-300 hover:shadow-md transition-all flex justify-between group cursor-pointer select-none" onClick={() => addToCart(item)}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800">{item.name}</h4>
                        <div className="flex gap-1">
                          {item.isVeg && <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded">V</span>}
                          {item.isSpicy && <span className="text-[10px] bg-red-100 text-red-700 px-1 rounded">🌶</span>}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.description}</p>
                      <div className="mt-2 font-semibold text-indigo-600">{item.price} AED</div>
                    </div>
                    <div className="flex items-center justify-center w-8">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        +
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Mobile Only: Cart positioned at the bottom of the scrollable list */}
              <div className="lg:hidden mt-8 mb-4">
                  <CartContent isMobile={true} />
              </div>
            </div>

            {/* Desktop Only: Sidebar Cart */}
            <div className="hidden lg:block w-96 shrink-0 border-l border-slate-200 bg-white z-10 shadow-xl h-full">
              <CartContent isMobile={false} />
            </div>

          </div>
        </div>
      );
    }

    // Steps: Input, Outcome, Order Check
    return (
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-start md:justify-center min-h-0">
         {/* Standard Steps Content */}
         {step === 'input' && (
            <div className="max-w-sm w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 my-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Enter Room Number</label>
                <input 
                  type="number" 
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full text-4xl text-center font-bold tracking-widest p-6 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800 placeholder:text-slate-200"
                  placeholder="101"
                  autoFocus
                />
              </div>
              <button 
                onClick={handleCallAttempt}
                disabled={!roomNumber}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <Phone size={24} />
                Initiate Call
              </button>
            </div>
          )}

          {step === 'outcome' && (
            <div className="w-full max-w-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300 my-auto">
              <h3 className="text-center text-slate-500 font-medium mb-4">Select call outcome for Room <span className="text-slate-900 font-bold">{roomNumber}</span></h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleOutcome(CallOutcome.Picked)}
                  className="bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-100 hover:border-emerald-300 text-emerald-800 p-8 rounded-2xl flex flex-col items-center gap-4 transition-all group"
                >
                  <div className="bg-emerald-200/50 p-4 rounded-full group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={40} />
                  </div>
                  <span className="text-xl font-bold">Call Picked</span>
                </button>
                
                <div className="space-y-3 flex flex-col">
                  {[
                    { l: 'Not Picked (Attempt 1)', v: CallOutcome.NotPicked1, c: 'amber' },
                    { l: 'Not Picked (Attempt 2)', v: CallOutcome.NotPicked2, c: 'orange' },
                    { l: 'Not Picked (Final)', v: CallOutcome.NotPickedFinal, c: 'red' }
                  ].map((opt) => (
                    <button 
                      key={opt.v}
                      onClick={() => handleOutcome(opt.v)}
                      className={`flex-1 bg-${opt.c}-50 hover:bg-${opt.c}-100 border border-${opt.c}-200 text-${opt.c}-800 p-4 rounded-xl flex items-center justify-between px-6 font-medium transition-all`}
                    >
                      <span>{opt.l}</span>
                      <PhoneOff size={20} />
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={resetFlow} className="w-full py-3 text-slate-400 hover:text-slate-600 font-medium">Cancel</button>
            </div>
          )}

          {step === 'order-check' && (
            <div className="text-center space-y-8 max-w-lg w-full animate-in fade-in zoom-in-95 duration-300 my-auto">
              <div>
                 <h3 className="text-2xl font-bold text-slate-800">Did the guest order anything?</h3>
                 <p className="text-slate-500 mt-2">Room {roomNumber} • Call Picked</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => handleOrderCheck(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-8 rounded-2xl shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 active:translate-y-0 flex flex-col items-center gap-4 group"
                >
                  <UtensilsCrossed size={40} className="group-hover:rotate-12 transition-transform" />
                  <span className="text-xl font-bold">Yes, Ordered</span>
                </button>
                <button 
                  onClick={() => handleOrderCheck(false)}
                  className="bg-white hover:bg-slate-50 text-slate-600 border-2 border-slate-200 hover:border-slate-300 p-8 rounded-2xl shadow-sm transition-all transform hover:-translate-y-1 active:translate-y-0 flex flex-col items-center gap-4"
                >
                  <XCircle size={40} />
                  <span className="text-xl font-bold">No Order</span>
                </button>
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto w-full">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-white shrink-0 flex justify-between items-center z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Call Management</h2>
            <p className="text-xs text-slate-500">Active Session</p>
          </div>
          {step !== 'input' && (
            <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-mono font-bold text-sm border border-indigo-100">
              Room {roomNumber}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        {renderContent()}
      </div>
    </div>
  );
};

// 3. Records View
const RecordsView = ({ records }: { records: CallRecord[] }) => {
  // ... (Keep existing export logic)
  const handleExportExcel = () => {
    // ... same logic as before
    const headers = ['Time', 'Room Number', 'Call Outcome', 'Order Status', 'Items', 'Total Amount (AED)'];
    const csvContent = [
      headers.join(','),
      ...records.map(r => {
        const items = r.orderedItems.map(i => `${i.quantity}x ${i.name}`).join(' | ');
        return [
          new Date(r.timestamp).toLocaleTimeString(),
          r.roomNumber,
          r.outcome,
          r.orderStatus,
          `"${items}"`,
          r.totalAmount
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if(printWindow) {
        printWindow.document.write('<html><head><title>Sales Report</title>');
        printWindow.document.write('<style>body{font-family: sans-serif; padding: 20px;} table{width:100%; border-collapse: collapse; margin-top:20px;} th, td{border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px;} th{background-color: #f2f2f2;} h2{color: #333;}</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(`<h2>Daily Sales Report - ${new Date().toLocaleDateString()}</h2>`);
        printWindow.document.write('<table><thead><tr><th>Time</th><th>Room</th><th>Status</th><th>Result</th><th>Items</th><th>Amount</th></tr></thead><tbody>');
        records.forEach(r => {
            const items = r.orderedItems.map(i => `${i.quantity}x ${i.name}`).join(', ');
            printWindow.document.write(`<tr><td>${new Date(r.timestamp).toLocaleTimeString()}</td><td>${r.roomNumber}</td><td>${r.outcome}</td><td>${r.orderStatus}</td><td>${items || '-'}</td><td>${r.totalAmount} AED</td></tr>`);
        });
        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
           printWindow.print();
        }, 500);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daily Records</h2>
          <p className="text-slate-500">Track all call activities for today</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">
            <FileSpreadsheet size={16} /> Export Excel
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">
            <FileText size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Result</th>
                <th className="px-6 py-4">Order Detail</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No records found for today. Start calling!
                  </td>
                </tr>
              ) : (
                [...records].reverse().map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">{record.roomNumber}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${record.outcome === CallOutcome.Picked ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {record.outcome === CallOutcome.Picked ? 'Picked' : 'Missed'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1
                        ${record.orderStatus === OrderStatus.Ordered ? 'text-emerald-600 font-medium' : 'text-slate-500'}
                      `}>
                         {record.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-slate-500" title={record.orderedItems.map(i => i.name).join(', ')}>
                      {record.orderedItems.length > 0 
                        ? record.orderedItems.map(i => `${i.quantity}x ${i.name}`).join(', ')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">
                      {record.totalAmount > 0 ? `${record.totalAmount} AED` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 4. Report View
const ReportView = ({ records }: { records: CallRecord[] }) => {
  const stats: DailyStats = useMemo(() => {
    const totalRoomsCalled = records.length;
    const totalPicked = records.filter(r => r.outcome === CallOutcome.Picked).length;
    const totalOrders = records.filter(r => r.orderStatus === OrderStatus.Ordered).length;
    const totalNotPicked = totalRoomsCalled - totalPicked;
    const totalNotOrdered = totalPicked - totalOrders;
    const totalRevenue = records.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const conversionRate = totalRoomsCalled > 0 ? Math.round((totalOrders / totalRoomsCalled) * 100) : 0;

    return {
      totalRoomsCalled, totalPicked, totalOrders, totalNotPicked, totalNotOrdered, totalRevenue, conversionRate
    };
  }, [records]);

  const topItems = useMemo(() => {
    const itemCounts: Record<string, number> = {};
    records.forEach(r => {
      r.orderedItems.forEach(i => {
        itemCounts[i.name] = (itemCounts[i.name] || 0) + i.quantity;
      });
    });
    return Object.entries(itemCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
  }, [records]);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daily Analytics</h2>
          <p className="text-slate-500">Performance Overview</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ... (Stats Cards - Same as before) ... */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Revenue</div>
          <div className="text-3xl font-bold text-slate-800 mt-2">{stats.totalRevenue} <span className="text-sm text-slate-400 font-normal">AED</span></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Conversion Rate</div>
          <div className="text-3xl font-bold text-indigo-600 mt-2">{stats.conversionRate}%</div>
          <div className="text-xs text-slate-400 mt-1">{stats.totalOrders} orders from {stats.totalRoomsCalled} calls</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Calls Picked</div>
          <div className="text-3xl font-bold text-emerald-600 mt-2">{stats.totalPicked}</div>
          <div className="text-xs text-slate-400 mt-1">{stats.totalNotPicked} missed calls</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Total Orders</div>
          <div className="text-3xl font-bold text-slate-800 mt-2">{stats.totalOrders}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[300px]">
          <h3 className="font-bold text-slate-800 mb-6">Call Outcomes</h3>
          <div className="flex items-center justify-center h-48">
            <div className="flex gap-8 items-end h-full w-full px-8 justify-around">
              <div className="w-20 bg-indigo-100 rounded-t-lg relative group flex flex-col justify-end h-full">
                <div className="bg-indigo-500 rounded-t-lg transition-all w-full" style={{height: `${stats.totalRoomsCalled ? (stats.totalOrders / stats.totalRoomsCalled) * 100 : 0}%`}}></div>
                <span className="absolute -bottom-6 w-full text-center text-xs font-medium text-slate-500">Ordered</span>
              </div>
              <div className="w-20 bg-emerald-100 rounded-t-lg relative group flex flex-col justify-end h-full">
                <div className="bg-emerald-500 rounded-t-lg transition-all w-full" style={{height: `${stats.totalRoomsCalled ? (stats.totalNotOrdered / stats.totalRoomsCalled) * 100 : 0}%`}}></div>
                <span className="absolute -bottom-6 w-full text-center text-xs font-medium text-slate-500">No Order</span>
              </div>
              <div className="w-20 bg-red-100 rounded-t-lg relative group flex flex-col justify-end h-full">
                <div className="bg-red-500 rounded-t-lg transition-all w-full" style={{height: `${stats.totalRoomsCalled ? (stats.totalNotPicked / stats.totalRoomsCalled) * 100 : 0}%`}}></div>
                <span className="absolute -bottom-6 w-full text-center text-xs font-medium text-slate-500">Missed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Top Selling Items</h3>
          <div className="space-y-4">
            {topItems.length === 0 ? (
              <p className="text-slate-400 text-sm">No sales data yet.</p>
            ) : (
              topItems.map(([name, count], idx) => (
                <div key={name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-700">{name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{count} sold</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Settings View
const SettingsView = ({ 
  resetData, 
  autoResetEnabled, 
  setAutoResetEnabled 
}: { 
  resetData: () => void, 
  autoResetEnabled: boolean, 
  setAutoResetEnabled: (val: boolean) => void 
}) => {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
        {/* Settings items ... */}
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-slate-900">Language</h3>
            <p className="text-sm text-slate-500">Interface language preference</p>
          </div>
          <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500">
            <option>English</option>
            <option>Arabic</option>
            <option>Russian</option>
            <option>Chinese</option>
          </select>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-slate-900">Auto-Reset</h3>
            <p className="text-sm text-slate-500">Clear daily data at 04:00 AM</p>
          </div>
          <button 
            onClick={() => setAutoResetEnabled(!autoResetEnabled)}
            className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${autoResetEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <span 
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ease-in-out shadow-sm ${autoResetEnabled ? 'translate-x-5' : 'translate-x-0.5'}`}
            />
          </button>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-red-600">Danger Zone</h3>
            <p className="text-sm text-slate-500">Manually reset all of today's data</p>
          </div>
          <button 
            onClick={resetData}
            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
          >
            Reset Dashboard Data
          </button>
        </div>
      </div>
      
      <div className="text-center text-xs text-slate-400">
        System Version 2.1.0 • Crystal Plaza Al Majaz Hotel
      </div>
    </div>
  );
};

// --- MAIN APP ---

function App() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeView, setActiveView] = useState('call-panel');
  const [records, setRecords] = useState<CallRecord[]>(() => {
    const saved = localStorage.getItem('cp-dashboard-records');
    return saved ? JSON.parse(saved) : [];
  });
  const [autoResetEnabled, setAutoResetEnabled] = useState(() => {
    const saved = localStorage.getItem('cp-auto-reset-enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    localStorage.setItem('cp-dashboard-records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('cp-auto-reset-enabled', String(autoResetEnabled));
  }, [autoResetEnabled]);

  useEffect(() => {
    const checkReset = () => {
        if (!autoResetEnabled) return;
        const lastReset = localStorage.getItem('cp-last-reset');
        const now = new Date();
        const todayStr = now.toDateString();
        if (now.getHours() >= 4 && lastReset !== todayStr) {
           setRecords([]); 
           localStorage.setItem('cp-last-reset', todayStr);
        }
    };
    checkReset();
    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, [autoResetEnabled]);

  const handleSaveRecord = (record: CallRecord) => {
    setRecords(prev => [...prev, record]);
  };

  const handleResetData = () => {
    if(window.confirm("Are you sure you want to clear all of today's records?")) {
        setRecords([]);
        localStorage.removeItem('cp-dashboard-records');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 1000);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'call-panel':
        return <CallPanel onSaveRecord={handleSaveRecord} />;
      case 'menu-list':
        return (
          <div className="h-full overflow-y-auto p-6 space-y-6 max-w-7xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-slate-800">Full Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {MENU_ITEMS.map(item => (
                 <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.category}</span>
                     <span className="font-bold text-slate-700">{item.price} AED</span>
                   </div>
                   <h3 className="font-bold text-slate-800">{item.name}</h3>
                   <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                 </div>
               ))}
            </div>
          </div>
        );
      case 'order-records':
        return <RecordsView records={records} />;
      case 'daily-report':
        return <ReportView records={records} />;
      case 'settings':
        return <SettingsView 
                  resetData={handleResetData} 
                  autoResetEnabled={autoResetEnabled}
                  setAutoResetEnabled={setAutoResetEnabled}
                />;
      default:
        return <CallPanel onSaveRecord={handleSaveRecord} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-100 flex font-sans relative">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:hidden shrink-0 z-30">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Hotel className="text-indigo-600" />
            <span>Crystal Plaza</span>
          </div>
          <button onClick={() => setIsMobileOpen(true)} className="p-2 text-slate-600">
            <MenuIcon size={24} />
          </button>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex bg-white border-b border-slate-200 h-16 items-center justify-between px-8 shrink-0 z-30">
          <h2 className="font-semibold text-slate-800">Food Sales Management System</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-slate-700">Sales Executive</div>
              <div className="text-xs text-slate-500">Logged in</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
              SE
            </div>
          </div>
        </header>

        {/* Main Content Area - Flex Container that prevents page scroll */}
        <div className="flex-1 flex flex-col overflow-hidden relative p-0 lg:p-6">
          {renderView()}
        </div>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
          <CheckCircle2 className="text-emerald-400" size={20} />
          <span className="font-medium">Data has been reset</span>
        </div>
      )}
    </div>
  );
}

export default App;