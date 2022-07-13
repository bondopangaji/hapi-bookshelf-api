// Copyright (c) 2022 Bondo Pangaji
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const Hapi = require('@hapi/hapi')
const routes = require('./routes/books-routes')

/**
 * Server configuration & initialization
 */
const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost'
  })

  server.route(routes)

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
