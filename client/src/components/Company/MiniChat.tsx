import { useEffect, useState } from "react";
import { CampaignService } from "../../services/Campaign";
import { Agreement, ContentCreator } from "../../types";
import { UserService } from "../../services/UserService";
import { MessageService, Message } from "../../services/MessageService";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import { useRef } from "react";
import { Menu, Wallet, X, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PaymentService } from "../../services/PaymentService";

const AdversiterChatPage: React.FC = () => {
  const campaignService = new CampaignService();
  const userService = new UserService();
  const messageService = new MessageService();
  const paymentService = new PaymentService();

  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [creators, setCreators] = useState<{ [key: number]: ContentCreator }>({});
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showUserList, setShowUserList] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchCreator = async (creatorId: number) => {
      try {
        const creator = await userService.getUserById(creatorId);
        setCreators((prev) => ({
          ...prev,
          [creatorId]: creator as ContentCreator,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAgreements = async () => {
      try {
        const response = await campaignService.getMyAgreements();
        setAgreements(response);

        const uniqueCreatorIds = [
          ...new Set(response.map((agreement) => agreement.contentCreatorId)),
        ];
        uniqueCreatorIds.forEach((id) => fetchCreator(id));

        if (response.length > 0) {
          setSelectedAgreement(response[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAgreements();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedAgreement) {
        try {
          const allMessages = await messageService.getMessages(
            selectedAgreement.contentCreatorId,
            selectedAgreement.id
          );
          setMessages(allMessages);
        } catch (err) {
          console.error("Mesajlar alınamadı:", err);
        }
      }
    };

    fetchMessages();
  }, [selectedAgreement]);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5003/hubs/chat", {
        accessTokenFactory: () => localStorage.getItem("token") || "",
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("SignalR bağlantısı kuruldu.");

          connection.on(
            "ReceiveMessage",
            (senderId: number, content: string, agreementId: number) => {
              const token = localStorage.getItem("token");
              if (!token) return;

              const decoded = jwtDecode<{ [key: string]: string }>(token);
              const receiverId = Number(
                decoded[
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                ]
              );

              setMessages((prev) => [
                ...prev,
                {
                  senderId,
                  receiverId,
                  content,
                  sentAt: new Date().toISOString(),
                  agreementId,
                },
              ]);
            }
          );
        })
        .catch((err) => console.error("SignalR bağlantı hatası:", err));
    }
  }, [connection]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!selectedAgreement || !newMessage.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode<{ [key: string]: string }>(token);
    const senderId = Number(
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ]
    );
    const receiverId = selectedAgreement.contentCreatorId;

    const message: Message = {
      senderId,
      receiverId,
      content: newMessage.trim(),
      agreementId: selectedAgreement.id,
    };

    try {
      await messageService.sendMessage(message);
      setMessages((prev) => [
        ...prev,
        { ...message, sentAt: new Date().toISOString() },
      ]);
      setNewMessage("");
    } catch (err) {
      console.error("Mesaj gönderilemedi:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePaymentConfirm = async () => {
    if (!selectedAgreement?.id || !selectedAgreement?.budget) return;

    try {
      console.log("Ödeme işlemi başlatılıyor:", {
        aggrementId: selectedAgreement.id,
        amount: selectedAgreement.budget,
      });
      const response = await paymentService.pay({
        aggrementId: selectedAgreement.id,
        amount: selectedAgreement.budget,
      });
      window.open(response.url, "_blank");
      console.log("Ödeme işlemi başarılı");
      setShowPaymentModal(false);
    } catch (err) {
      console.error("Ödeme yapılamadı:", err);
    }
  };

  const handlePayment = () => {
    setShowPaymentModal(false);
  };

  return (
    <>
      {/* Chat Trigger Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-200 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-40"
          >
            <div className="flex flex-col h-full">
              {/* User List Section */}
              <div className={`${showUserList ? "block" : "hidden"} h-full`}>
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">Sohbetler</h2>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="overflow-y-auto h-[calc(100%-60px)]">
                  {agreements.map((agreement) => (
                    <div
                      key={agreement.id}
                      onClick={() => {
                        setSelectedAgreement(agreement);
                        setShowUserList(false);
                      }}
                      className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-purple-50/50 transition-all duration-200 ${
                        selectedAgreement?.id === agreement.id
                          ? "bg-purple-50 border-l-4 border-l-purple-500"
                          : ""
                      }`}
                    >
                      {creators[agreement.contentCreatorId] && (
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={creators[agreement.contentCreatorId].photo}
                              alt="Creator"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate text-sm">
                              {creators[agreement.contentCreatorId].username}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {agreement.title}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-purple-600">
                              {agreement.budget} TL
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Section */}
              {!showUserList && selectedAgreement && (
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowUserList(true)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Menu className="w-5 h-5" />
                      </button>
                      {creators[selectedAgreement.contentCreatorId] && (
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <img
                              src={
                                creators[selectedAgreement.contentCreatorId]
                                  .photo
                              }
                              alt="Creator"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full border-2 border-white"></div>
                          </div>
                          <span className="font-medium text-sm">
                            {
                              creators[selectedAgreement.contentCreatorId]
                                .username
                            }
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-all duration-200 text-xs font-medium flex items-center gap-1"
                      >
                        <Wallet className="w-3 h-3" />
                        Ödeme
                      </button>
                      <button
                        onClick={() => setIsChatOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white">
                    <div className="flex flex-col gap-3">
                      {messages.map((msg, index) => {
                        const token = localStorage.getItem("token");
                        const decoded = jwtDecode<{ [key: string]: string }>(
                          token!
                        );
                        const currentUserId = Number(
                          decoded[
                            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                          ]
                        );
                        const isMine = msg.senderId === currentUserId;

                        return (
                          <div
                            key={index}
                            className={`flex ${
                              isMine ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`px-4 py-2 rounded-2xl text-sm max-w-[70%] ${
                                isMine
                                  ? "bg-purple-600 text-white rounded-br-none"
                                  : "bg-gray-100 text-gray-900 rounded-bl-none"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Mesajınızı yazın..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage();
                          }
                        }}
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-all duration-200 text-sm font-medium"
                      >
                        Gönder
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <Wallet className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ödeme Onayı
              </h3>
              <p className="text-gray-600 text-sm">
                {selectedAgreement &&
                  creators[selectedAgreement.contentCreatorId]?.username}{" "}
                adlı içerik üreticisine
                {selectedAgreement && ` ${selectedAgreement.budget} TL`}{" "}
                tutarında ödeme yapılacaktır.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 mb-6">
              <h4 className="font-medium text-purple-900 mb-2">
                Ödeme Detayları
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600">Anlaşma Başlığı:</span>
                  <span className="font-medium text-gray-900">
                    {selectedAgreement?.title}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Tutar:</span>
                  <span className="font-medium text-gray-900">
                    {selectedAgreement?.budget} TL
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Tarih:</span>
                  <span className="font-medium text-gray-900">
                    {new Date().toLocaleDateString("tr-TR")}
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePayment}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                İptal
              </button>
              <button
                onClick={handlePaymentConfirm}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Ödemeyi Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdversiterChatPage;
