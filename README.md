
Além do README principal, recomendo adicionar no topo alguns badges para deixar seu GitHub mais profissional:

```md
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Flask](https://img.shields.io/badge/Flask-black)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-red)
![License](https://img.shields.io/badge/license-MIT-green)
```
# 📋 Sistema de Chamados

Sistema web de gerenciamento de chamados desenvolvido para facilitar a comunicação entre usuários e administradores, permitindo a abertura, acompanhamento e resolução de solicitações de forma organizada.

## 🚀 Funcionalidades

### Usuário
- Criar chamados
- Visualizar chamados enviados
- Acompanhar status dos chamados
- Reabrir chamados resolvidos
- Adicionar respostas aos chamados
- Editar informações do perfil

### Administrador
- Visualizar todos os chamados
- Filtrar chamados por status e período
- Responder chamados
- Alterar status dos chamados
- Gerenciar usuários
- Acessar métricas e informações do sistema

## 🛠️ Tecnologias Utilizadas

### Front-end
- React
- TypeScript
- React Router
- Axios
- React Icons

### Back-end
- Flask
- SQLAlchemy
- Flask-Bcrypt
- JWT Authentication

### Banco de Dados
- SQLite (desenvolvimento)
- Compatível com outros bancos suportados pelo SQLAlchemy

## 📂 Estrutura do Projeto

```bash
Sistema-Chamados/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── config/
│   ├── app.py
│   └── requirements.txt
│
└── README.md
```

##🔐 Controle de Acesso
O sistema possui autenticação baseada em JWT e controle de permissões para:

- Usuários comuns
- Administradores

As rotas administrativas são protegidas para impedir acesso não autorizado.
