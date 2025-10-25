const registerHealthRoute = (server) => {
  server.get('/health', async () => ({ status: 'ok' }))
}

export { registerHealthRoute }
