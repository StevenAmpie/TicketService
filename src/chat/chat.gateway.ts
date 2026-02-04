import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  Ack,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CommentsService } from "../comments/comments.service";
import { CreateCommentDto } from "../comments/dto/create-comment.dto";

@WebSocketGateway(81, {})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly commentsService: CommentsService) {}

  @SubscribeMessage("sendMessage")
  async sendMessage(
    @MessageBody() payload: CreateCommentDto,
    @ConnectedSocket() client: Socket,
    @Ack()
    ack: (response: { status: string; data: string; id: string }) => void,
  ) {
    await this.commentsService.create(payload);

    ack({ status: "Recibido.", data: payload.content, id: client.id });
  }
}
