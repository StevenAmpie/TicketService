CREATE TABLE "Clients" (
                           id UUID CONSTRAINT pk_clients_id PRIMARY KEY DEFAULT gen_random_uuid(),
                           username VARCHAR(15) NOT NULL CONSTRAINT uq_clients_username UNIQUE,
                           "dateOfBirth" DATE NOT NULL,
                           email VARCHAR(50) NOT NULL CONSTRAINT uq_clients_email UNIQUE,
                           password TEXT NOT NULL,
                           picture TEXT NOT NULL,
                           role CHAR(6) DEFAULT 'client' NOT NULL,
                           CONSTRAINT ck_clients_role CHECK (role in ('client')),
                           CONSTRAINT ck_clients_email CHECK (email !~* '^[A-Za-z][A-Za-z0-9.]*@megatech\.org$' AND email ~ '^[A-Za-z][A-Za-z0-9.]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
    );

CREATE TABLE "Agents" (
                          id UUID CONSTRAINT pk_agents_id PRIMARY KEY DEFAULT gen_random_uuid(),
                          "fullName" VARCHAR(15) NOT NULL,
                          "dateOfBirth" DATE NOT NULL,
                          email VARCHAR(50) NOT NULL CONSTRAINT uq_agents_email UNIQUE,
                          password TEXT NOT NULL,
                          picture TEXT NOT NULL,
                          role CHAR(5) DEFAULT 'agent' NOT NULL,
                          CONSTRAINT ck_agents_role CHECK (role in ('agent')),
                          CONSTRAINT ck_clients_email CHECK (email ~* '^[A-Za-z][A-Za-z0-9.]*@megatech\.org$')
    );

CREATE TABLE "Tickets" (
                           id UUID CONSTRAINT pk_tickets_id PRIMARY KEY DEFAULT uuidv7(),
                           title VARCHAR(100) NOT NULL,
                           detail TEXT NOT NULL,
                           picture TEXT NOT NULL,
                           "openedAt" TIMESTAMPTZ(0) DEFAULT NOW() NOT NULL,
                           "closedAt" TIMESTAMPTZ(0) DEFAULT NULL,
                           "eliminatedAt" TIMESTAMPTZ(0) DEFAULT NULL,
                           status VARCHAR(10) NOT NULL DEFAULT 'opened',
                           "clientId" UUID NOT NULL,
                           CONSTRAINT ck_tickets_status CHECK(status in('opened', 'processing', 'processed', 'eliminated')),
                           CONSTRAINT fk_tickets_clientId FOREIGN KEY ("clientId") REFERENCES "Clients"(id)
);

CREATE TABLE "Comments" (
                            id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_comments_id PRIMARY KEY,
                            content TEXT NOT NULL,
                            "publishedAt" TIMESTAMPTZ(0) DEFAULT NOW() NOT NULL,
                            role VARCHAR (6) NOT NULL,
                            "clientId" UUID,
                            "agentId" UUID,
                            "ticketId" UUID NOT NULL,
                            "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
                            CONSTRAINT ck_comments_role CHECK (role in ('client', 'agent')),
                            CONSTRAINT fk_comments_clientId FOREIGN KEY ("clientId") REFERENCES "Clients"(id),
                            CONSTRAINT fk_comments_agentId FOREIGN KEY ("agentId") REFERENCES "Agents"(id),
                            CONSTRAINT fk_comments_ticketId FOREIGN KEY ("ticketId") REFERENCES "Tickets"(id)
);

CREATE TABLE "TicketsCases" (
                                "ticketId" UUID,
                                "agentId" UUID,
                                CONSTRAINT pk_ticketCases_ticketId_agentId PRIMARY KEY ("ticketId", "agentId"),
                                CONSTRAINT fk_ticketCases_ticketId FOREIGN KEY ("ticketId") REFERENCES "Tickets" (id),
                                CONSTRAINT fk_ticketCases_agentId FOREIGN KEY ("agentId") REFERENCES "Agents" (id)
);

CREATE TABLE "RefreshTokens" (
                                 id TEXT CONSTRAINT pk_refreshTokens PRIMARY KEY,
                                 "clientId" UUID NOT NULL,
                                 "expiresAt" BIGINT NOT NULL,
                                 CONSTRAINT fk_refreshTokens FOREIGN KEY ("clientId") REFERENCES "Clients"(id)
);