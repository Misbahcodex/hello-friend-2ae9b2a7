import { useState } from 'react';
import {
    Home, ShoppingBag, Shield, Clock, Settings, HelpCircle,
    Bell, Menu, X, CheckCircle,
    ArrowRight, Plus
} from 'lucide-react';
import { DisputesManagement } from '@/components/DisputesManagement';
import StatusBadge from '@/components/StatusBadge';
import { BuyerOrders } from '@/components/BuyerOrders';
import { BuyerHistory } from '@/components/BuyerHistory';
import { BuyerSettings } from '@/components/BuyerSettings';
import { BuyerSupport } from '@/components/BuyerSupport';
import { TopUpModal } from '@/components/TopUpModal';

// Types
interface Order {
    id: string;
    seller: string;
    amount: number;
    item: string;
    status: 'pending' | 'shipped' | 'delivered' | 'completed' | 'dispute' | 'cancelled';
    deadline: string;
    lastUpdate: string;
    trackingNumber?: string;
}

interface PaymentLinkData {
    itemName: string;
    amount: string;
    deadline: string;
    description: string;
}

export function BuyerDashboard() {
    const [activeTab, setActiveTab] = useState('home');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [paymentModal, setPaymentModal] = useState(false);
    const [topUpModal, setTopUpModal] = useState(false);

    // Empty data states - ready for API integration
    const [orders] = useState<Order[]>([
        // Mock data for visualization
        {
            id: "ORD-7829",
            seller: "Tech Haven KE",
            amount: 14500,
            item: "Samsung Galaxy Watch 5",
            status: "shipped",
            deadline: "2023-12-20",
            lastUpdate: "Shipped via Wells Fargo",
            trackingNumber: "WF-9928382"
        },
        {
            id: "ORD-9921",
            seller: "Glamour Trends",
            amount: 3200,
            item: "Vintage Denim Jacket",
            status: "pending",
            deadline: "2023-12-18",
            lastUpdate: "Waiting for seller acceptance"
        }
    ]);

    const [paymentLinkData, setPaymentLinkData] = useState<PaymentLinkData>({
        itemName: '',
        amount: '',
        deadline: '',
        description: ''
    });

    const navItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'orders', label: 'My Orders', icon: ShoppingBag },
        { id: 'disputes', label: 'Disputes', icon: Shield },
        { id: 'history', label: 'Transaction History', icon: Clock },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'support', label: 'Support', icon: HelpCircle },
    ];

    const handleCreatePaymentLink = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Payment Link Created! Redirecting to payment gateway...');
        setPaymentModal(false);
        // TODO: Implement actual link creation and redirection
    };

    const handleConfirmDelivery = (orderId: string) => {
        if (confirm("Are you sure you have received the item and want to release funds to the seller?")) {
            alert(`Funds released for order ${orderId}`);
            // TODO: API Call to release funds
        }
    };

    const renderHome = () => (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-800 -2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-2">Welcome back, Buyer! 👋</h1>
                    <p className="text-green-100 mb-6">Your funds are safe with SWIFTLINE Escrow.</p>
                    <button
                        onClick={() => setPaymentModal(true)}
                        className="bg-white text-green-700 px-6 py-3 -xl font-bold hover:shadow-lg transition flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Create Payment Link
                    </button>
                    <button
                        onClick={() => setTopUpModal(true)}
                        className="ml-4 bg-green-700/30 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-green-700/50 transition flex items-center gap-2"
                    >
                        <ShoppingBag size={20} />
                        Top Up Wallet
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 -xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-100 -lg text-blue-600">
                            <ShoppingBag size={24} />
                        </div>
                        <span className="text-sm font-bold text-gray-400">Active Orders</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}</p>
                    <p className="text-sm text-gray-500 mt-1">Pending delivery or acceptance</p>
                </div>

                <div className="bg-white p-6 -xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-100 -lg text-green-600">
                            <Shield size={24} />
                        </div>
                        <span className="text-sm font-bold text-gray-400">Protected Funds</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">KES {orders.reduce((acc, o) => (o.status !== 'completed' && o.status !== 'cancelled') ? acc + o.amount : acc, 0).toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">Held safely in escrow</p>
                </div>

                <div className="bg-white p-6 -xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-100 -lg text-purple-600">
                            <Clock size={24} />
                        </div>
                        <span className="text-sm font-bold text-gray-400">Total Spent</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">KES 45,200</p>
                    <p className="text-sm text-gray-500 mt-1">Lifetime protected purchases</p>
                </div>
            </div>

            {/* Active Orders Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">📦 Active Orders</h2>
                    <button onClick={() => setActiveTab('orders')} className="text-green-600 font-semibold hover:text-green-700">View All</button>
                </div>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-200 -xl p-6 hover:shadow-md transition">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-gray-100 -lg flex items-center justify-center text-gray-400">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{order.item}</h3>
                                        <p className="text-gray-500 text-sm">Sold by <span className="text-gray-900 font-medium">{order.seller}</span></p>
                                        <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <p className="font-black text-xl">KES {order.amount.toLocaleString()}</p>
                                    <StatusBadge status={order.status} />
                                </div>
                            </div>

                            <div className="border-t border-gray-100 my-4 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="text-sm text-gray-600 flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>Update: {order.lastUpdate}</span>
                                </div>

                                <div className="flex gap-3 w-full md:w-auto">
                                    {order.status === 'shipped' && (
                                        <button
                                            onClick={() => handleConfirmDelivery(order.id)}
                                            className="flex-1 md:flex-none bg-green-600 text-white px-6 py-2 -lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={18} />
                                            Confirm Delivery
                                        </button>
                                    )}
                                    <button className="flex-1 md:flex-none border border-gray-300 px-4 py-2 -lg font-semibold hover:bg-gray-50 transition">
                                        Details
                                    </button>
                                    {order.status !== 'completed' && (
                                        <button className="flex-1 md:flex-none text-red-600 px-4 py-2 -lg font-semibold hover:bg-red-50 transition">
                                            Report Issue
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );



    const renderPaymentModal = () => (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white -2xl max-w-lg w-full p-8 relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={() => setPaymentModal(false)}
                    className="absolute right-4 top-4 p-2 hover:bg-gray-100 -full transition"
                >
                    <X size={24} className="text-gray-500" />
                </button>

                <div className="mb-6">
                    <div className="w-12 h-12 bg-green-100 -xl flex items-center justify-center mb-4">
                        <Shield size={24} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Secure Your Payment</h2>
                    <p className="text-gray-600">Create an escrow link to protect your money until delivery.</p>
                </div>

                <form onSubmit={handleCreatePaymentLink} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">What are you buying?</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. iPhone 14 Pro Max from @seller_name"
                            className="w-full px-4 py-3 -lg border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition"
                            value={paymentLinkData.itemName}
                            onChange={(e) => setPaymentLinkData({ ...paymentLinkData, itemName: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (KES)</label>
                            <input
                                type="number"
                                required
                                placeholder="0.00"
                                className="w-full px-4 py-3 -lg border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition"
                                value={paymentLinkData.amount}
                                onChange={(e) => setPaymentLinkData({ ...paymentLinkData, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Deadline</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-3 -lg border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition"
                                value={paymentLinkData.deadline}
                                onChange={(e) => setPaymentLinkData({ ...paymentLinkData, deadline: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Details / Refund Rules (Optional)</label>
                        <textarea
                            placeholder="e.g. Must be delivered in original packaging. Full refund if not authentic."
                            rows={3}
                            className="w-full px-4 py-3 -lg border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition resize-none"
                            value={paymentLinkData.description}
                            onChange={(e) => setPaymentLinkData({ ...paymentLinkData, description: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-700 text-white font-bold py-4 -xl hover:shadow-lg hover:shadow-green-500/30 transition transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-4"
                    >
                        Create Secure Link
                        <ArrowRight size={20} />
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-4">
                        <Shield size={12} className="inline mr-1" />
                        Funds held securely in escrow until you confirm delivery.
                    </p>
                </form>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-30`}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        SWIFTLINE
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    if (window.innerWidth < 768) setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 -xl font-medium transition duration-200 ${activeTab === item.id
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-2 -lg bg-gray-50 border border-gray-200">
                        <div className="w-10 h-10 bg-green-100 -full flex items-center justify-center text-green-700 font-bold">
                            JD
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">John Doe</p>
                            <p className="text-xs text-green-600 truncate">Verified Buyer</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between md:hidden backdrop-blur-md sticky top-0 z-20">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-gray-900">Dashboard</span>
                    <button className="text-gray-700">
                        <Bell size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-5xl mx-auto">
                        {activeTab === 'home' && renderHome()}
                        {activeTab === 'orders' && <BuyerOrders />}
                        {activeTab === 'disputes' && <DisputesManagement />}
                        {activeTab === 'history' && <BuyerHistory />}
                        {activeTab === 'settings' && <BuyerSettings />}
                        {activeTab === 'support' && <BuyerSupport />}
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {paymentModal && renderPaymentModal()}
            <TopUpModal isOpen={topUpModal} onClose={() => setTopUpModal(false)} />
        </div>
    );
}
