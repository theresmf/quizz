import { Server as HTTPServer } from "http";
import { Socket } from "net";

declare module "net" {
  interface Socket {
    server: HTTPServer;
  }
}

declare module "next" {
  interface NextApiResponse {
    socket: Socket & {
      server: HTTPServer & {
        io?: boolean;
      };
    };
  }
}

declare module "http" {
  interface Server {
    io?: SocketIOServer; // io is now strictly a Socket.IO server instance or undefined
  }
}

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: SocketIOServer; // Ensure io is either a Socket.IO instance or undefined
    };
  };
};
