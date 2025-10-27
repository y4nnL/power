import Pusher from "pusher";

declare global {
  // eslint-disable-next-line no-var
  var pusherServer: Pusher | undefined;
}

export const pusher = global.pusherServer ??
  new Pusher({
    appId: process.env.PUSHER_APP_ID ?? "",
    key: process.env.NEXT_PUBLIC_PUSHER_KEY ?? "",
    secret: process.env.PUSHER_SECRET ?? "",
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "eu",
    useTLS: true
  });

if (process.env.NODE_ENV !== "production") {
  global.pusherServer = pusher;
}
