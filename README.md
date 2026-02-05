# TICKET SERVICE
[![NPM Version](https://img.shields.io/npm/v/@nestjs/core.svg)](https://www.npmjs.com/~nestjscore)
[![DeepScan grade](https://deepscan.io/api/teams/28952/projects/30992/branches/1001051/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=28952&pid=30992&bid=1001051)

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
