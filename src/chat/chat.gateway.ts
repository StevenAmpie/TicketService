import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CommentsService } from "../comments/comments.service";
import { CreateCommentDto } from "../comments/dto/create-comment.dto";

@WebSocketGateway(81, {
  cors: {
    origin: "*",
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly commentsService: CommentsService) {}

  @SubscribeMessage("sendMessage")
  async sendMessage(
    @MessageBody() payload: CreateCommentDto,
    /* toDo:
        @ConnectedSocket() client: Socket,
        @Ack()
        ack: (response: { status: string; data: string; id: string }) => void,
    */
  ) {
    await this.commentsService.create(payload);
    this.server
      .to(payload.ticketId)
      .emit("receiveMessage", payload.content, payload.role);

    // toDo: use in the future ack({ status: "Recibido.", data: payload.content, id: client.id });
  }

  @SubscribeMessage("joinRoom")
  async joinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    await socket.join(roomId);
  }
}
