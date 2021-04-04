async function serve() {
  const { createServer } = await import('./server')
  try {
    const server = await createServer({})
    await server.listen()
  } catch (e) {
    console.log('error')
    process.exit(1)
  }
}

serve()
