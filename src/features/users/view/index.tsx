import PageHeader from "@/components/page/page-header";
import { Main } from "@/components/layout/main";
import { useUsersStore } from "@/stores/users-store";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Fingerprint, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import UserStatusBadge from "../components/user-status-badge";

export default function ViewUser({ id }: { id?: string }) {
    const { t } = useTranslation("common");
    const {
        users
    } = useUsersStore();
    const user = users.find((p) => p.id === id);

    if (!user) {
        return (
            <Main className="flex items-center justify-center h-full">
            <div className="text-center">
                <h2 className="text-lg font-semibold">User not found!</h2>
                <Link to="/users" className="text-primary hover:underline">
                Back to list
                </Link>
            </div>
            </Main>
        );
    }

     const getInitials = (first: string, last: string) => {
        return `${first.charAt(0)}${last ? last.charAt(0) : ""}`.toUpperCase();
    };

    // Formatação de data simples
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <>
            <PageHeader backTo="/users" title="Detalhes do Usuário" />
            <Main>
                {/* Header de Perfil (Hero Section) */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-card border rounded-xl shadow-sm">
                    <Avatar className="h-24 w-24 border-2 border-primary/10">
                        <AvatarImage src="" /> {/* Espaço para imagem se houver no futuro */}
                        <AvatarFallback className="text-2xl bg-primary/5 text-primary">
                            {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {user.firstName} {user.lastName}
                            </h1>
                            <Badge variant={user.status === 'invited' ? 'secondary' : 'default'} className="capitalize">
                                {user.status === 'invited' ? 'Convite Pendente' : user.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <span className="font-medium">@{user.username}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {user.email}</span>
                        </p>
                    </div>
                </div> 

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" /> Informações Pessoais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground font-medium">Nome Completo</p>
                                <p className="text-sm font-semibold">{user.firstName} {user.lastName || "-"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                                    <Fingerprint className="w-3 h-3" /> CPF
                                </p>
                                <p className="text-sm font-semibold">{user.cpf || "Não informado"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> E-mail
                                </p>
                                <p className="text-sm font-semibold text-primary">{user.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> Telefone
                                </p>
                                <p className="text-sm font-semibold">{user.phoneNumber || "Não informado"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" /> Histórico
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-dashed">
                                <span className="text-sm text-muted-foreground">Criado em:</span>
                                <span className="text-sm font-medium">{formatDate(user.createdAt.toISOString())}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-dashed">
                                <span className="text-sm text-muted-foreground">Última atualização:</span>
                                <span className="text-sm font-medium">{formatDate(user.updatedAt.toISOString())}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-dashed">
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <UserStatusBadge status={user.status} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Coluna 3: Roles (Ocupa a largura toda no mobile) */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary" /> Permissões e Perfis
                            </CardTitle>
                            <CardDescription>Papéis atribuídos a este usuário no sistema.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {user.roles.map((role) => (
                                    <Badge 
                                        key={role} 
                                        variant="secondary" 
                                        className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1"
                                    >
                                        {role.replace(/_/g, ' ')}
                                    </Badge>
                                ))}
                                {user.roles.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic">Nenhuma permissão atribuída.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Main>
        </>
    );
}
