CREATE INDEX idx_clients_id ON "Clients"(id);
CREATE INDEX idx_clients_email ON "Clients"(email);
CREATE INDEX idx_agents_id ON "Agents"(id);
CREATE INDEX idx_tickets_id ON "Tickets"(id);
CREATE INDEX idx_tickets_status_openedAt ON "Tickets"(status, "openedAt" DESC);
CREATE INDEX idx_comments_ticketId ON "Comments"("ticketId");