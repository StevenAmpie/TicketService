# TICKET SERVICE
[![NPM Version](https://img.shields.io/npm/v/@nestjs/core.svg)](https://www.npmjs.com/~nestjscore)
[![DeepScan grade](https://deepscan.io/api/teams/28952/projects/30992/branches/1001051/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=28952&pid=30992&bid=1001051)
[![TicketService CI](https://github.com/StevenAmpie/TicketService/actions/workflows/ci.yaml/badge.svg)](https://github.com/StevenAmpie/TicketService/actions/workflows/ci.yaml)

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803.svg?style=for-the-badge&logo=typeorm&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)


<img width="144" height="36" alt="jwt-compatible badge" src="https://github.com/user-attachments/assets/f7da7a17-1586-4e54-9e65-2c870550b148" />



## Authors

- **Ampie, Steven**
- **Fagbemi, Emiola**



---


## Table of Contents

- [Description](#description)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Testing](#run-tests)

---

## Description

This project is a service for managing support tickets / incidents within the **MegaTech** platform.

`TicketService` is responsible for the creation, update, and tracking of support tickets.  
It can integrate with other MegaTech services to handle too:

- Ticket creation from external events.
- Ticket status updates (open, in progress, resolved, closed).
- Assignment of tickets to agents.
- Change history and comments.

---

## Features

- Full creation and management of the ticket lifecycle.
- `REST API` to create, read, update, and delete tickets (CRUD).
- Real-time communication between Client and Operator using `WebSockets`.
- Standardized error handling and responses.

---

## Architecture

Brief description of the architecture:

- Pattern: **REST API** & **WebSockets**
- Database: **PostgreSQL**

---

## Technologies

- **Language / Runtime**: Node.js with TypeScript
- **Main Framework**: NestJS
- **Database**: PostgreSQL
- **Testing**: Jest
- **Linters & Formatters**: ESLint & Prettier

---

## Prerequisites

Make sure you have installed:

- Node.js `>= 18`
- `npm` (dependency manager)
- Testing: Jest
- Linters & Formatters: ESLint & Prettier

---

## Installation

Clone the repository:

```bash
git clone https://github.com/StevenAmpie/TicketService
cd TicketService

npm install
```
## Compile and run the project

```

# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Run tests
```
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
