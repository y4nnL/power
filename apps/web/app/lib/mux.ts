import Mux from "@mux/mux-node";

declare global {
  // eslint-disable-next-line no-var
  var muxClient: InstanceType<typeof Mux> | undefined;
}

export const mux = ((): InstanceType<typeof Mux> => {
  if (global.muxClient) return global.muxClient;
  const tokenId = process.env.MUX_TOKEN_ID ?? "";
  const tokenSecret = process.env.MUX_TOKEN_SECRET ?? "";
  const client = new Mux({ tokenId, tokenSecret });
  if (process.env.NODE_ENV !== "production") {
    global.muxClient = client;
  }
  return client;
})();
