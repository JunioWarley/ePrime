"use client"

import { useState, useEffect } from "react"
import { Send } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  content: string
  sender: string
  recipient: string
  timestamp: Date
}

interface OnlineUser {
  id: string
  name: string
  avatar?: string
}

export function ChatModule() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])

  // Simulated online users
  useEffect(() => {
    setOnlineUsers([
      { id: "1", name: "Alice", avatar: "/alice-avatar.jpg" },
      { id: "2", name: "Bob", avatar: "/bob-avatar.jpg" },
      { id: "3", name: "Charlie", avatar: "/charlie-avatar.jpg" },
    ])
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: user?.id || "",
      recipient: selectedUser,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const filteredMessages = messages.filter((m) => m.sender === selectedUser || m.recipient === selectedUser)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[600px]">
        <div className="w-1/4 border-r pr-4">
          <h3 className="font-semibold mb-2">Usuários Online</h3>
          <ScrollArea className="h-[540px]">
            {onlineUsers.map((onlineUser) => (
              <div
                key={onlineUser.id}
                className={`flex items-center p-2 cursor-pointer ${
                  selectedUser === onlineUser.id ? "bg-secondary" : ""
                }`}
                onClick={() => setSelectedUser(onlineUser.id)}
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={onlineUser.avatar} />
                  <AvatarFallback>{onlineUser.name[0]}</AvatarFallback>
                </Avatar>
                <span>{onlineUser.name}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="w-3/4 pl-4 flex flex-col">
          <ScrollArea className="flex-grow mb-4">
            {filteredMessages.map((message) => (
              <div key={message.id} className={`mb-2 ${message.sender === user?.id ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === user?.id ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={!selectedUser}>
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

