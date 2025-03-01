"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export function MyAccount() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [avatar, setAvatar] = useState(user?.avatar || "")
  const [accessLog, setAccessLog] = useState<{ date: string; action: string }[]>([])
  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    stockMovements: false,
  })

  useEffect(() => {
    // Simular carregamento do histórico de acesso
    setAccessLog([
      { date: "2023-05-15 10:30", action: "Login bem-sucedido" },
      { date: "2023-05-14 15:45", action: "Alteração de senha" },
      { date: "2023-05-13 09:00", action: "Login bem-sucedido" },
    ])
  }, [])

  const handleProfileUpdate = () => {
    updateUser({ name, email, avatar })
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    })
  }

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }
    // Implementar lógica de alteração de senha aqui
    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso.",
    })
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Tabs defaultValue="profile" className="w-full max-w-4xl">
      <TabsList>
        <TabsTrigger value="profile">Perfil</TabsTrigger>
        <TabsTrigger value="security">Segurança</TabsTrigger>
        <TabsTrigger value="notifications">Notificações</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Editar Perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais aqui.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Input type="file" onChange={handleAvatarChange} accept="image/*" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleProfileUpdate}>Salvar Alterações</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Gerencie sua senha e veja o histórico de acesso.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button onClick={handlePasswordChange}>Alterar Senha</Button>

            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-2">Histórico de Acesso</h4>
              <ul className="space-y-2">
                {accessLog.map((log, index) => (
                  <li key={index} className="text-sm">
                    {log.date} - {log.action}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Gerencie suas preferências de notificação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="lowStock">Alerta de Baixo Estoque</Label>
              <Switch
                id="lowStock"
                checked={notifications.lowStock}
                onCheckedChange={() => handleNotificationChange("lowStock")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="newOrders">Novos Pedidos</Label>
              <Switch
                id="newOrders"
                checked={notifications.newOrders}
                onCheckedChange={() => handleNotificationChange("newOrders")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="stockMovements">Movimentações de Estoque</Label>
              <Switch
                id="stockMovements"
                checked={notifications.stockMovements}
                onCheckedChange={() => handleNotificationChange("stockMovements")}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() =>
                toast({
                  title: "Preferências salvas",
                  description: "Suas preferências de notificação foram atualizadas.",
                })
              }
            >
              Salvar Preferências
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

