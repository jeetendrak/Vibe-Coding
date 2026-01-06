
import React, { useState } from 'react';
import { 
  MessageSquareCode, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Plus
} from 'lucide-react';
import { parseSMSWithGemini, ParsedSMS } from '../services/geminiService';
import { Transaction } from '../types';

interface SMSParserProps {
  onTransactionParsed: (t: Transaction) => void;
}

const SMSParserScreen: React.FC<SMSParserProps> = ({ onTransactionParsed }) => {
  const [smsText, setSmsText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedSMS | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!smsText.trim()) return;
    
    setIsParsing(true);
    setError(null);
    setParsedData(null);

    const result = await parseSMSWithGemini(smsText);
    
    if (result) {
      setParsedData(result);
    } else {
      setError("Failed to parse SMS. Please try again or enter manually.");
    }
    setIsParsing(false);
  };

  const handleConfirm = () => {
    if (!parsedData) return;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount: parsedData.amount,
      category: parsedData.category || 'Other',
      type: parsedData.type === 'credit' ? 'INCOME' : 'EXPENSE',
      note: `Imported from SMS: ${parsedData.merchant}`,
      merchant: parsedData.merchant,
      date: new Date().toISOString()
    };

    onTransactionParsed(newTransaction);
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">SmartScan</h2>
        <p className="text-slate-500 text-sm">Paste your bank/UPI SMS here. SmartFin will automatically extract the details.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="relative">
          <textarea
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            placeholder="e.g. Rs. 500 debited from A/c XX123 at Amazon on 12-Oct-23..."
            className="w-full h-32 bg-slate-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          />
          <button 
            className="absolute top-3 right-3 p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            title="Paste example"
            onClick={() => setSmsText("SBI A/c XX4567 debited by Rs 1250.00 on 15 Oct 24 at ZOMATO. Ref No 42890123.")}
          >
            <Copy size={18} />
          </button>
        </div>

        <button
          onClick={handleParse}
          disabled={isParsing || !smsText}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${
            isParsing || !smsText ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 active:scale-95'
          }`}
        >
          {isParsing ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Sparkles size={18} />
              Analyze with Gemini
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {parsedData && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 space-y-4 animate-scaleIn">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Detected Details</h3>
            <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 size={12} /> VERIFIED
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Type</p>
              <p className={`text-sm font-bold ${parsedData.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {parsedData.type.toUpperCase()}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Amount</p>
              <p className="text-sm font-bold text-slate-800">₹{parsedData.amount}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl col-span-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Merchant / Source</p>
              <p className="text-sm font-bold text-slate-800">{parsedData.merchant}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl col-span-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Category (AI Suggestion)</p>
              <p className="text-sm font-bold text-slate-800">{parsedData.category}</p>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-95 transition-transform"
          >
            <Plus size={18} />
            Add Transaction
          </button>
        </div>
      )}

      <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
        <h4 className="text-indigo-900 font-bold text-sm mb-2">How it works?</h4>
        <ul className="text-indigo-700/70 text-xs space-y-2">
          <li className="flex gap-2">• Copy the SMS received from your bank</li>
          <li className="flex gap-2">• Paste it in the box above</li>
          <li className="flex gap-2">• Gemini AI intelligently parses dates, amounts, and merchants</li>
          <li className="flex gap-2">• Confirm and save it instantly to your ledger</li>
        </ul>
      </div>
    </div>
  );
};

export default SMSParserScreen;
