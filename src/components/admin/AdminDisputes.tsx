import { MessageSquare, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function AdminDisputes() {
    const disputes = [
        {
            id: "DSP-2023-001",
            orderId: "ORD-9921",
            complainant: "Mike Ross",
            reason: "Item not as described (Fake Product)",
            amount: 120000,
            status: "Open",
            date: "2 hours ago"
        },
        {
            id: "DSP-2023-002",
            orderId: "ORD-5541",
            complainant: "System Flag",
            reason: "Potential Fraud Pattern Detected",
            amount: 4500,
            status: "Escalated",
            date: "1 day ago"
        }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dispute Resolution Center</h2>

            <div className="grid grid-cols-1 gap-6">
                {disputes.map((dispute) => (
                    <div key={dispute.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${dispute.status === 'Open' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {dispute.status}
                                </span>
                                <span className="text-gray-400 text-sm">Case #{dispute.id}</span>
                                <span className="text-gray-400 text-sm">• {dispute.date}</span>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{dispute.reason}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Dispute raised by <span className="font-semibold">{dispute.complainant}</span> for Order <span className="font-mono text-blue-600">{dispute.orderId}</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm max-w-md">
                                <AlertTriangle size={16} />
                                <span className="font-bold">Amount at Risk: KES {dispute.amount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 justify-center min-w-[200px]">
                            <button className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition flex items-center justify-center gap-2">
                                <MessageSquare size={16} /> View Evidence
                            </button>
                            <div className="grid grid-cols-2 gap-2">
                                <button className="py-2 px-3 border border-green-200 bg-green-50 text-green-700 rounded-lg font-semibold hover:bg-green-100 transition flex items-center justify-center gap-2 text-xs">
                                    <CheckCircle size={14} /> Release Funds
                                </button>
                                <button className="py-2 px-3 border border-red-200 bg-red-50 text-red-700 rounded-lg font-semibold hover:bg-red-100 transition flex items-center justify-center gap-2 text-xs">
                                    <XCircle size={14} /> Refund Buyer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {disputes.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                        <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-gray-900">All Clear!</h3>
                        <p className="text-gray-500">There are no open disputes requiring attention.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
