import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/useAuth';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { CreditCard, Calendar, CheckCircle2, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const TransactionHistory = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) console.error("RLS/Fetch Error:", error.message);
            
            if (!error) setTransactions(data);
            setLoading(false);
        };
        fetchTransactions();
    }, [user]);

    const generateReceipt = (tx) => {
        const doc = new jsPDF();

        // Branding & Header
        doc.setFontSize(22);
        doc.setTextColor(163, 230, 53); // Lime-400 equivalent
        doc.text("THE FAIRWAY LEAGUE", 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("OFFICIAL ENTRY RECEIPT", 14, 30);
        doc.text(`Issued on: ${new Date().toLocaleDateString()}`, 14, 35);

        // Transaction Details Table
        doc.autoTable({
            startY: 45,
            head: [['Description', 'Details']],
            body: [
                ['Player ID', tx.user_id],
                ['Payment ID', tx.razorpay_payment_id],
                ['Order ID', tx.razorpay_order_id],
                ['Date of Entry', new Date(tx.created_at).toLocaleDateString('en-IN')],
                ['Amount Paid', `INR ${tx.amount}.00`],
                ['Status', 'SUCCESSFUL'],
            ],
            theme: 'striped',
            headStyles: { fillColor: [16, 185, 129] }, // Emerald-500
            styles: { fontSize: 9 }
        });

        doc.setFontSize(10);
        doc.setTextColor(150);
        const finalY = doc.lastAutoTable.finalY + 15;
        doc.text("This is a computer-generated receipt for your league entry.", 14, finalY);
        doc.text("Good luck on the fairway!", 14, finalY + 7);
        
        // Save the PDF
        doc.save(`Receipt_${tx.razorpay_payment_id}.pdf`);
    };

    if (loading) return <div className="text-slate-500 animate-pulse text-xs uppercase tracking-widest">Loading Ledger...</div>;

    if (transactions.length === 0) {
        return (
            <div className="mt-8 p-6 border border-dashed border-slate-800 rounded-2xl text-center">
                <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em]">No Transaction History Found</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
        >
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <CreditCard size={14} className="text-lime-400" /> Payment History
            </h3>

            <div className="space-y-3">
                {transactions.map((tx) => (
                    <div
                        key={tx.id}
                        className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex justify-between items-center group hover:border-slate-700 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-500/10 p-2 rounded-full">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm italic">₹{tx.amount}</p>
                                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">
                                    REF: {tx.razorpay_payment_id}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase">
                                    <Calendar size={10} />
                                    {new Date(tx.created_at).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </div>
                                <span className="text-[9px] text-emerald-500 font-black tracking-widest uppercase">SUCCESS</span>
                            </div>

                            {/* DOWNLOAD RECEIPT BUTTON */}
                            <button
                                onClick={() => generateReceipt(tx)}
                                className="p-2 bg-slate-800/50 text-slate-400 hover:text-lime-400 hover:bg-slate-800 rounded-xl transition-all active:scale-90"
                                title="Download Receipt"
                            >
                                <Download size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default TransactionHistory;