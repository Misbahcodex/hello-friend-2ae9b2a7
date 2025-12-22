import { Search, MoreVertical, BadgeCheck, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export function AdminUsers() {
    const [activeTab, setActiveTab] = useState<'sellers' | 'buyers'>('sellers');

    const users = [
        { id: "USR-001", name: "Tech Haven KE", type: "seller", status: "verified", joinDate: "Jan 12, 2023", riskScore: "Low" },
        { id: "USR-002", name: "Glamour Trends", type: "seller", status: "pending", joinDate: "Dec 20, 2023", riskScore: "Medium" },
        { id: "USR-003", name: "John Doe", type: "buyer", status: "active", joinDate: "Mar 05, 2023", riskScore: "Low" },
        { id: "USR-004", name: "Suspicious User", type: "buyer", status: "flagged", joinDate: "Today", riskScore: "High" },
    ];

    const filteredUsers = users.filter(u => u.type === activeTab.slice(0, -1)); // simple plural to singular mapping

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">User Management</h2>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex gap-6 px-6">
                        <button
                            onClick={() => setActiveTab('sellers')}
                            className={`py-4 text-sm font-bold border-b-2 transition ${activeTab === 'sellers' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Sellers
                        </button>
                        <button
                            onClick={() => setActiveTab('buyers')}
                            className={`py-4 text-sm font-bold border-b-2 transition ${activeTab === 'buyers' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Buyers
                        </button>
                    </nav>
                </div>

                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-white text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">User Details</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Risk Score</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-900">{user.name}</p>
                                            {user.status === 'verified' && <BadgeCheck size={16} className="text-blue-500" />}
                                        </div>
                                        <p className="text-xs text-gray-500">{user.id}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${user.status === 'verified' ? 'bg-blue-100 text-blue-700' :
                                            user.status === 'active' ? 'bg-green-100 text-green-700' :
                                                user.status === 'flagged' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {user.riskScore === 'High' && <ShieldAlert size={16} className="text-red-500" />}
                                        <span className={`font-semibold ${user.riskScore === 'High' ? 'text-red-600' : 'text-gray-700'
                                            }`}>
                                            {user.riskScore}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {user.joinDate}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
