CREATE OR REPLACE FUNCTION changeTicketStatusToProcessing()
RETURNS TRIGGER AS $$
   BEGIN
    UPDATE Tickets
    SET status = 'processing' WHERE id = NEW."ticketId";
    RETURN NULL;
   END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER t_changeTicketStatus
AFTER INSERT ON TicketsCases
    FOR EACH ROW
    EXECUTE FUNCTION changeTicketStatusToProcessing();

CREATE OR REPLACE FUNCTION checkForTwoNulls()
RETURNS TRIGGER AS $$
    BEGIN
        IF NEW."agentId" IS NOT NULL AND NEW."clientId" IS NOT NULL
            THEN
            RETURN NULL;
        END IF;
        IF NEW."agentId" IS NULL AND NEW."clientId" IS NULL
            THEN
            RETURN NULL;
        END IF;
    RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER t_avoidTwoUsersIdInsert
BEFORE INSERT ON Comments
    FOR EACH ROW
    EXECUTE FUNCTION checkForTwoNulls();

CREATE TRIGGER t_avoidTwoUsersIdUpdate
BEFORE UPDATE ON Comments
    FOR EACH ROW
    EXECUTE FUNCTION checkForTwoNulls();