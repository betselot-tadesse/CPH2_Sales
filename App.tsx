import React, { useState, useEffect, useMemo } from 'react';
import { 
  Phone, 
  UtensilsCrossed, 
  ClipboardList, 
  BarChart3, 
  Settings as SettingsIcon, 
  Hotel, 
  LogOut,
  Menu as MenuIcon,
  X,
  CheckCircle2,
  XCircle,
  PhoneOff,
  Search,
  Save,
  Trash2,
  FileSpreadsheet,
  FileText,
  RefreshCw,
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
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out flex flex-col shadow-xl
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(MENU_CATEGORIES[0]);

  // Reset state helper
  const resetFlow = () => {
    setStep('input');
    setRoomNumber('');
    setCurrentOutcome(null);
    setCart([]);
    setSearchTerm('');
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
      // Immediate save for not picked
      const record: CallRecord = {
        id: Date.now().toString(),
        roomNumber,
        timestamp: Date.now(),
        callAttempt: 1, // Logic to check previous attempts could be added here
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
      // Save as Picked but Not Ordered
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

  // Render Step Content
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Call Management</h2>
            <p className="text-sm text-slate-500">Process active guest calls</p>
          </div>
          {step !== 'input' && (
            <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-mono font-semibold">
              Room: {roomNumber}
            </div>
          )}
        </div>

        <div className="p-6 min-h-[400px] flex flex-col justify-center">
          {step === 'input' && (
            <div className="max-w-sm mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Enter Room Number</label>
                <input 
                  type="number" 
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full text-3xl text-center tracking-widest p-4 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  placeholder="101"
                  autoFocus
                />
              </div>
              <button 
                onClick={handleCallAttempt}
                disabled={!roomNumber}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Phone size={24} />
                Initiate Call
              </button>
            </div>
          )}

          {step === 'outcome' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
              <button 
                onClick={() => handleOutcome(CallOutcome.Picked)}
                className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 p-6 rounded-xl flex flex-col items-center gap-3 transition-all group"
              >
                <CheckCircle2 size={48} className="group-hover:scale-110 transition-transform" />
                <span className="text-xl font-bold">Call Picked</span>
              </button>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleOutcome(CallOutcome.NotPicked1)}
                  className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-center justify-between px-6 font-medium transition-all"
                >
                  <span>Not Picked (Attempt 1)</span>
                  <PhoneOff size={20} />
                </button>
                <button 
                  onClick={() => handleOutcome(CallOutcome.NotPicked2)}
                  className="w-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 p-4 rounded-xl flex items-center justify-between px-6 font-medium transition-all"
                >
                  <span>Not Picked (Attempt 2)</span>
                  <PhoneOff size={20} />
                </button>
                <button 
                  onClick={() => handleOutcome(CallOutcome.NotPickedFinal)}
                  className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 p-4 rounded-xl flex items-center justify-between px-6 font-medium transition-all"
                >
                  <span>Not Picked (Final)</span>
                  <XCircle size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 'order-check' && (
            <div className="text-center space-y-8 max-w-lg mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-2xl font-bold text-slate-800">Did the guest order anything?</h3>
              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => handleOrderCheck(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-8 rounded-2xl shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 flex flex-col items-center gap-4"
                >
                  <UtensilsCrossed size={40} />
                  <span className="text-xl font-bold">Yes, Ordered</span>
                </button>
                <button 
                  onClick={() => handleOrderCheck(false)}
                  className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 p-8 rounded-2xl shadow-sm transition-all transform hover:-translate-y-1 flex flex-col items-center gap-4"
                >
                  <XCircle size={40} />
                  <span className="text-xl font-bold">No Order</span>
                </button>
              </div>
            </div>
          )}

          {step === 'menu-selection' && (
            <div className="w-full h-full flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
              {/* Menu Browser */}
              <div className="flex-1 flex flex-col gap-4 min-h-[500px]">
                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {MENU_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${selectedCategory === cat 
                          ? 'bg-slate-800 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                {/* Items Grid */}
                <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-3 content-start max-h-[500px]">
                  {MENU_ITEMS
                    .filter(item => item.category === selectedCategory)
                    .map(item => (
                    <div key={item.id} className="border border-slate-200 rounded-lg p-3 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex justify-between group cursor-pointer" onClick={() => addToCart(item)}>
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
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          +
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary / Cart */}
              <div className="lg:w-80 bg-slate-50 rounded-xl border border-slate-200 flex flex-col h-full">
                <div className="p-4 border-b border-slate-200 bg-white rounded-t-xl">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <ClipboardList size={18} />
                    Current Order
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center text-sm">
                      <UtensilsCrossed size={32} className="mb-2 opacity-20" />
                      <p>No items selected</p>
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex justify-between items-start text-sm bg-white p-2 rounded border border-slate-100">
                        <div>
                          <span className="font-medium text-slate-700">{item.quantity}x {item.name}</span>
                          <div className="text-xs text-slate-400">{item.price * item.quantity} AED</div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 bg-white border-t border-slate-200 rounded-b-xl space-y-4">
                  <div className="flex justify-between text-lg font-bold text-slate-800">
                    <span>Total</span>
                    <span>{cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)} AED</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={resetFlow} className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm hover:bg-slate-50 font-medium">Cancel</button>
                    <button 
                      onClick={submitOrder} 
                      disabled={cart.length === 0}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      Save Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. Records View
const RecordsView = ({ records }: { records: CallRecord[] }) => {
  
  const handleExportExcel = () => {
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
      link.style.visibility = 'hidden';
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
        setTimeout(() => {
           printWindow.print();
           printWindow.close();
        }, 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daily Records</h2>
          <p className="text-slate-500">Track all call activities for today</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            <FileSpreadsheet size={16} /> Export Excel
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors"
          >
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
  // Calculate Stats
  const stats: DailyStats = useMemo(() => {
    const totalRoomsCalled = records.length;
    const totalPicked = records.filter(r => r.outcome === CallOutcome.Picked).length;
    const totalOrders = records.filter(r => r.orderStatus === OrderStatus.Ordered).length;
    const totalNotPicked = totalRoomsCalled - totalPicked;
    const totalNotOrdered = totalPicked - totalOrders;
    const totalRevenue = records.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const conversionRate = totalRoomsCalled > 0 ? Math.round((totalOrders / totalRoomsCalled) * 100) : 0;

    return {
      totalRoomsCalled,
      totalPicked,
      totalOrders,
      totalNotPicked,
      totalNotOrdered,
      totalRevenue,
      conversionRate
    };
  }, [records]);

  // Top items logic
  const topItems = useMemo(() => {
    const itemCounts: Record<string, number> = {};
    records.forEach(r => {
      r.orderedItems.forEach(i => {
        itemCounts[i.name] = (itemCounts[i.name] || 0) + i.quantity;
      });
    });
    return Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [records]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daily Analytics</h2>
          <p className="text-slate-500">Performance Overview</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
          <ArrowRight size={16} /> Generate EOD Report
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        {/* Performance Chart Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[300px]">
          <h3 className="font-bold text-slate-800 mb-6">Call Outcomes</h3>
          <div className="flex items-center justify-center h-48">
            <div className="flex gap-4 items-end h-full w-full px-8 justify-around">
              {/* Simple CSS Bar Chart for visual demo */}
              <div className="w-16 bg-indigo-100 rounded-t-lg relative group flex flex-col justify-end" style={{height: '100%'}}>
                <div className="bg-indigo-500 rounded-t-lg transition-all" style={{height: `${stats.totalRoomsCalled ? (stats.totalOrders / stats.totalRoomsCalled) * 100 : 0}%`}}></div>
                <span className="absolute -bottom-6 w-full text-center text-xs font-medium text-slate-500">Ordered</span>
              </div>
              <div className="w-16 bg-emerald-100 rounded-t-lg relative group flex flex-col justify-end" style={{height: '100%'}}>
                <div className="bg-emerald-500 rounded-t-lg transition-all" style={{height: `${stats.totalRoomsCalled ? (stats.totalNotOrdered / stats.totalRoomsCalled) * 100 : 0}%`}}></div>
                <span className="absolute -bottom-6 w-full text-center text-xs font-medium text-slate-500">No Order</span>
              </div>
              <div className="w-16 bg-red-100 rounded-t-lg relative group flex flex-col justify-end" style={{height: '100%'}}>
                <div className="bg-red-500 rounded-t-lg transition-all" style={{height: `${stats.totalRoomsCalled ? (stats.totalNotPicked / stats.totalRoomsCalled) * 100 : 0}%`}}></div>
                <span className="absolute -bottom-6 w-full text-center text-xs font-medium text-slate-500">Missed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling */}
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
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
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

  // New State for Auto Reset
  const [autoResetEnabled, setAutoResetEnabled] = useState(() => {
    const saved = localStorage.getItem('cp-auto-reset-enabled');
    // Default to true if not set, or parse boolean
    return saved !== null ? saved === 'true' : true;
  });
  
  // New State for Toast
  const [showToast, setShowToast] = useState(false);

  // Persist records
  useEffect(() => {
    localStorage.setItem('cp-dashboard-records', JSON.stringify(records));
  }, [records]);

  // Persist Auto Reset setting
  useEffect(() => {
    localStorage.setItem('cp-auto-reset-enabled', String(autoResetEnabled));
  }, [autoResetEnabled]);

  // Auto-reset at 4AM logic
  useEffect(() => {
    const checkReset = () => {
        if (!autoResetEnabled) return;
        
        const lastReset = localStorage.getItem('cp-last-reset');
        const now = new Date();
        const todayStr = now.toDateString();
        
        // Reset condition: It is past 4 AM AND we haven't reset today yet
        if (now.getHours() >= 4 && lastReset !== todayStr) {
           setRecords([]); 
           localStorage.setItem('cp-last-reset', todayStr);
           console.log("System Auto-Reset executed");
        }
    };

    // Check on mount
    checkReset();
    
    // Check every minute
    const interval = setInterval(checkReset, 60000);
    
    return () => clearInterval(interval);
  }, [autoResetEnabled]);

  const handleSaveRecord = (record: CallRecord) => {
    setRecords(prev => [...prev, record]);
  };

  const handleResetData = () => {
    if(window.confirm("Are you sure you want to clear all of today's records? This cannot be undone.")) {
        setRecords([]);
        localStorage.removeItem('cp-dashboard-records');
        
        // Show toast
        setShowToast(true);
        
        // Hide toast after 1 second
        setTimeout(() => {
            setShowToast(false);
        }, 1000);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'call-panel':
        return <CallPanel onSaveRecord={handleSaveRecord} />;
      case 'menu-list':
        return (
          <div className="space-y-6">
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
    <div className="min-h-screen bg-slate-100 flex font-sans relative">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
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

        {/* Desktop Header (User Info) */}
        <header className="hidden lg:flex bg-white border-b border-slate-200 h-16 items-center justify-between px-8 shrink-0">
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

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {renderView()}
          </div>
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