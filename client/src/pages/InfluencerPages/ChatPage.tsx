import { useEffect, useState } from "react";
import { CampaignService } from "../../services/Campaign";
import { Agreement, Adversiter } from "../../types";
import { UserService } from "../../services/UserService";
import { MessageService, Message } from "../../services/MessageService";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import { useRef } from "react";

const ContentCreatorChatPage: React.FC = () => {
  const campaignService = new CampaignService();
  const userService = new UserService();
  const messageService = new MessageService();

  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [advertisers, setAdvertisers] = useState<{ [key: number]: Adversiter }>(
    {}
  );
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showUserList, setShowUserList] = useState(true);

  useEffect(() => {
    const fetchAdvertiser = async (advertiserId: number) => {
      try {
        const advertiser = await userService.getUserById(advertiserId);
        setAdvertisers((prev) => ({
          ...prev,
          [advertiserId]: advertiser as Adversiter,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAgreements = async () => {
      try {
        const response = await campaignService.getMyAgreements();
        setAgreements(response);

        const uniqueAdvertiserIds = [
          ...new Set(response.map((agreement) => agreement.advertiserId)),
        ];
        uniqueAdvertiserIds.forEach((id) => fetchAdvertiser(id));

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
          selectedAgreement.advertiserId,
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
  const receiverId = selectedAgreement.advertiserId;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-8">
          Mesajlarım
        </h1>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-[calc(100vh-8rem)] md:h-[calc(100vh-14rem)]">
          <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-xl shadow-lg mb-2">
            <h2 className="font-semibold text-gray-800">Aktif Anlaşmalar</h2>
            <button
              onClick={() => setShowUserList(!showUserList)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <div
            className={`${
              showUserList ? "block" : "hidden"
            } md:block w-full md:w-1/3 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100`}
          >
            <div className="p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
              <h2 className="font-semibold text-gray-800 text-lg hidden md:block">
                Aktif Anlaşmalardaki Reklamcılar
              </h2>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-16rem)] md:h-full">
              {agreements.map((agreement) => (
                <div
                  key={agreement.id}
                  onClick={() => {
                    setSelectedAgreement(agreement);
                    setShowUserList(false);
                  }}
                  className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-purple-50/50 transition-all duration-200 ${
                    selectedAgreement?.id === agreement.id
                      ? "bg-purple-50 border-l-4 border-l-purple-500"
                      : ""
                  }`}
                >
                  {advertisers[agreement.advertiserId] && (
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="relative">
                        <img
                          src={advertisers[agreement.advertiserId].photo}
                          alt="Advertiser"
                          className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover ring-2 ring-purple-100"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate text-sm md:text-base">
                          {advertisers[agreement.advertiserId].username}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 truncate">
                          {agreement.title}
                        </p>
                      </div>
                      <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-purple-600">
                          {agreement.budget} TL
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(agreement.agreementDate).toLocaleDateString(
                            "tr-TR"
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
            {selectedAgreement ? (
              <>
                <div className="p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white flex items-center gap-4">
                  {advertisers[selectedAgreement.advertiserId] && (
                    <>
                      <div className="relative">
                        <img
                          src={
                            advertisers[selectedAgreement.advertiserId].photo
                          }
                          alt="Advertiser"
                          className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover ring-2 ring-purple-100"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                          {advertisers[selectedAgreement.advertiserId].username}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500">
                          {selectedAgreement.title}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white">
                  <div className="flex flex-col gap-3 md:gap-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-400 text-sm py-8">
                        Henüz mesaj bulunmuyor
                      </div>
                    ) : (
                      messages.map((msg, index) => {
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

                        const messageDate = msg.sentAt
                          ? new Date(msg.sentAt)
                          : new Date();
                        const now = new Date();
                        const isToday =
                          messageDate.toDateString() === now.toDateString();
                        const isYesterday =
                          new Date(
                            now.setDate(now.getDate() - 1)
                          ).toDateString() === messageDate.toDateString();

                        const showDateDivider =
                          index === 0 ||
                          (messages[index - 1] &&
                            new Date(
                              messages[index - 1].sentAt || ""
                            ).toDateString() !== messageDate.toDateString());

                        let timeDisplay = "";
                        if (isToday) {
                          timeDisplay = messageDate.toLocaleTimeString(
                            "tr-TR",
                            { hour: "2-digit", minute: "2-digit" }
                          );
                        } else if (isYesterday) {
                          timeDisplay =
                            "Dün " +
                            messageDate.toLocaleTimeString("tr-TR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                        } else {
                          timeDisplay =
                            messageDate.toLocaleDateString("tr-TR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }) +
                            " " +
                            messageDate.toLocaleTimeString("tr-TR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                        }

                        let dateDividerText = "";
                        if (isToday) {
                          dateDividerText = "Bugün";
                        } else if (isYesterday) {
                          dateDividerText = "Dün";
                        } else {
                          dateDividerText = messageDate.toLocaleDateString(
                            "tr-TR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          );
                        }

                        return (
                          <>
                            {showDateDivider && (
                              <div className="flex items-center gap-2 md:gap-4 my-2 md:my-4">
                                <div className="flex-1 h-px bg-gray-200"></div>
                                <span className="text-xs text-gray-500 font-medium px-2 md:px-4 py-1 bg-gray-50 rounded-full whitespace-nowrap">
                                  {dateDividerText}
                                </span>
                                <div className="flex-1 h-px bg-gray-200"></div>
                              </div>
                            )}
                            <div
                              key={index}
                              className={`flex ${
                                isMine ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div className="flex flex-col max-w-[85%] md:max-w-md">
                                <div
                                  className={`px-4 md:px-6 py-2 md:py-3 rounded-2xl text-sm shadow-sm ${
                                    isMine
                                      ? "bg-purple-600 text-white rounded-br-none"
                                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                                  }`}
                                >
                                  {msg.content}
                                </div>
                                <span
                                  className={`text-xs mt-1 px-2 ${
                                    isMine
                                      ? "text-right text-gray-500"
                                      : "text-left text-gray-400"
                                  }`}
                                >
                                  {timeDisplay}
                                </span>
                              </div>
                            </div>
                          </>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="p-4 md:p-6 border-t border-gray-100 bg-white">
                  <div className="flex gap-2 md:gap-3">
                    <input
                      type="text"
                      placeholder="Mesajınızı yazın..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 rounded-xl border border-gray-200 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-purple-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm md:text-base whitespace-nowrap"
                    >
                      Gönder
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 bg-gradient-to-b from-gray-50/50 to-white p-4 text-center">
                <div>
                  <p className="mb-2">Görüntülemek için bir anlaşma seçin</p>
                  <p className="text-sm text-gray-500">
                    Mobil görünümde üst menüden seçim yapabilirsiniz
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCreatorChatPage;
