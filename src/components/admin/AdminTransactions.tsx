import { Search, Filter, Eye, MoreHorizontal, Download } from 'lucide-react';
import StatusBadge from '../StatusBadge';

export function AdminTransactions() {
    const transactions = [
        { id: "TRX-8892", buyer: "John Doe", seller: "Tech Haven", amount: 45000, status: "locked", date: "Dec 20, 2023" },
        { id: "TRX-8893", buyer: "Sarah Smith", seller: "Glamour Trends", amount: 2500, status: "completed", date: "Dec 19, 2023" },
        { id: "TRX-8894", buyer: "Mike Ross", seller: "Gadget World", amount: 120000, status: "dispute", date: "Dec 18, 2023" },
        { id: "TRX-8895", buyer: "Jane Doe", seller: "Home Decor", amount: 8500, status: "shipped", date: "Dec 18, 2023" },
        { id: "TRX-8896", buyer: "Alex King", seller: "Auto Spares", amount: 1500, status: "cancelled", date: "Dec 17, 2023" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Transaction Monitoring</h2>
                    <p className="text-sm text-gray-500">Live view of all escrow transactions</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-black transition">
                    <Download size={16} /> Export CSV
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-gray-200 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Transaction ID, Buyer, or Seller..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                        />
                    </div>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Filter size={16} /> Filter Status
                    </button>
                </div>

                {/* Table */}
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Transaction ID</th>
                            <th className="px-6 py-4">Parties</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {transactions.map((trx) => (
                            <tr key={trx.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">
                                    {trx.id}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm">
                                        <p className="font-semibold text-gray-900">{trx.buyer}</p>
                                        <p className="text-xs text-gray-500">→ {trx.seller}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                    KES {trx.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={trx.status as any} />
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {trx.date}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition" title="View Details">
                                            <Eye size={18} />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
