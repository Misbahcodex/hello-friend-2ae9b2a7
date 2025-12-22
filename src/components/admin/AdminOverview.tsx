import { TrendingUp, Users, AlertTriangle, DollarSign, Activity } from 'lucide-react';

export function AdminOverview() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Platform Overview</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-100 rounded-lg text-green-600">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12.5%</span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                    <h3 className="text-3xl font-black text-gray-900">KES 8.4M</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                            <Activity size={24} />
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">+5</span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Active Escrows</p>
                    <h3 className="text-3xl font-black text-gray-900">142</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                            <AlertTriangle size={24} />
                        </div>
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">2 New</span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Pending Disputes</p>
                    <h3 className="text-3xl font-black text-gray-900">8</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">+24</span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Total Users</p>
                    <h3 className="text-3xl font-black text-gray-900">1,204</h3>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Revenue Chart Placeholder */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">Revenue Analytics</h3>
                        <select className="text-sm border-gray-200 border rounded-lg p-2 bg-gray-50 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                        <div className="text-center text-gray-400">
                            <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Revenue Chart Visualization</p>
                            <p className="text-xs">(Integration Required)</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-800 mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[
                            { action: "New Seller Registration", user: "Tech World KE", time: "2 mins ago", icon: Users, color: "bg-blue-100 text-blue-600" },
                            { action: "Dispute Resolved", user: "Order #4492", time: "15 mins ago", icon: AlertTriangle, color: "bg-green-100 text-green-600" },
                            { action: "Large Withdrawal", user: "KES 450,000", time: "1 hour ago", icon: DollarSign, color: "bg-orange-100 text-orange-600" },
                            { action: "Suspicious Login", user: "ID: 99283", time: "3 hours ago", icon: AlertTriangle, color: "bg-red-100 text-red-600" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                                    <item.icon size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{item.action}</p>
                                    <p className="text-xs text-gray-500">{item.user} • {item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
