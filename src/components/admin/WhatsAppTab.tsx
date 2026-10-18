import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { WhatsAppNotification } from '../../types';
import { 
  MessageSquare, 
  ExternalLink, 
  CheckCheck, 
  Phone, 
  ShieldAlert, 
  Clock, 
  Copy, 
  Check,
  Send
} from 'lucide-react';

export const WhatsAppTab: React.FC = () => {
  const { notifications, settings, showToast } = useStore();

  const [selectedNotification, setSelectedNotification] = useState<WhatsAppNotification | null>(
    notifications[0] || null
  );
  const [copied, setCopied] = useState(false);

  // If a notification was selected or fallback to first
  const activeNotif = selectedNotification || notifications[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Copied WhatsApp message to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsAppWeb = (notif: WhatsAppNotification) => {
    const cleanPhone = notif.customerPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const encoded = encodeURIComponent(notif.messageText);
    const url = `https://wa.me/${phoneWithCountry}?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-5">
      {/* Disclaimer Banner */}
      <div className="p-3.5 bg-emerald-50 border border-brand-green/30 rounded-2xl flex items-center gap-3 text-xs text-emerald-950">
        <ShieldAlert className="w-5 h-5 text-brand-green shrink-0" />
        <div>
          <span className="font-black text-brand-green block">
            DEMO MODE — Automated WhatsApp API Not Connected
          </span>
          <p className="text-[11px] text-emerald-800 mt-0.5">
            This module simulates how transactional order receipts will look and feel. You can click "Open in WhatsApp" to launch a pre-filled chat in WhatsApp Web for live presentation.
          </p>
        </div>
      </div>

      {/* Main Grid: Left List + Right WhatsApp Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Notification Logs List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-brand-border p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-brand-border pb-2.5">
            <h3 className="text-sm font-black text-brand-dark">Order Message Logs</h3>
            <span className="text-xs text-brand-muted font-bold">
              {notifications.length} {notifications.length === 1 ? 'Message' : 'Messages'}
            </span>
          </div>

          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-brand-muted">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p>No orders placed yet.</p>
              <p className="text-[11px] mt-1">Place a demo order in the storefront to simulate instant WhatsApp triggers!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {notifications.map((notif) => {
                const isSelected = activeNotif?.id === notif.id;

                return (
                  <div
                    key={notif.id}
                    onClick={() => setSelectedNotification(notif)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-brand-green bg-brand-greenLight/60 shadow-xs'
                        : 'border-brand-border hover:bg-brand-bg'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-brand-dark">#{notif.orderId}</span>
                      <span className="text-[10px] text-brand-muted">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="font-semibold text-brand-dark truncate max-w-[150px]">
                        {notif.customerName}
                      </span>
                      <span className="font-black text-brand-green">₹{notif.totalAmount}</span>
                    </div>

                    <p className="text-[11px] text-brand-muted truncate mt-1">
                      +91 {notif.customerPhone}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Realistic WhatsApp Chat Simulator */}
        <div className="lg:col-span-7 flex flex-col">
          {activeNotif ? (
            <div className="bg-[#EFEAE2] rounded-3xl border border-brand-border overflow-hidden shadow-md flex flex-col h-full">
              {/* WhatsApp Top Chat Bar */}
              <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-brand-yellow text-sm border border-white/20">
                    🌿
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">Gaon Ki Sugandh Store Bot</h4>
                    <p className="text-[10px] text-emerald-200">Official Business Account • Online</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(activeNotif.messageText)}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    title="Copy message text"
                  >
                    {copied ? <Check className="w-4 h-4 text-brand-yellow" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleOpenWhatsAppWeb(activeNotif)}
                    className="px-3 py-1.5 bg-[#25D366] hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                    title="Open wa.me link with this message prefilled"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 flex flex-col justify-end min-h-[350px]">
                {/* Date bubble */}
                <div className="self-center bg-white/80 backdrop-blur-xs px-3 py-0.5 rounded-full text-[10px] font-bold text-gray-600 shadow-xs">
                  TODAY
                </div>

                {/* Message Bubble */}
                <div className="self-start max-w-sm sm:max-w-md bg-white p-3.5 rounded-2xl rounded-tl-xs shadow-xs text-xs text-brand-dark space-y-2 border border-gray-100">
                  <div className="whitespace-pre-line leading-relaxed font-sans text-gray-800">
                    {activeNotif.messageText}
                  </div>

                  {/* Timestamp and Double Check */}
                  <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 font-medium pt-1">
                    <span>{new Date(activeNotif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Fake WhatsApp Input Footer */}
              <div className="bg-[#F0F2F5] p-2.5 border-t border-gray-300 flex items-center gap-2">
                <input
                  type="text"
                  disabled
                  placeholder="Demo automated trigger message (read only)"
                  className="flex-1 px-3 py-2 bg-white rounded-xl text-xs text-gray-500 outline-none border border-gray-200"
                />
                <button
                  disabled
                  className="w-9 h-9 rounded-full bg-[#075E54] text-white flex items-center justify-center opacity-60"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-brand-border p-12 text-center text-brand-muted text-xs h-full flex flex-col items-center justify-center">
              <MessageSquare className="w-10 h-10 text-brand-green/30 mb-2" />
              <p className="font-bold text-brand-dark">No Notification Selected</p>
              <p className="text-[11px] mt-1">Select an order from the list on the left to preview its WhatsApp receipt.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
