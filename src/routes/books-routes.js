// Copyright (c) 2022 Bondo Pangaji
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const {
  addBookController,
  getAllBooksController,
  getBookByIdController,
  editBookByIdController,
  deleteBookByIdController
} = require('../controller/books-controller')

/**
 * Routing
 */
const booksRoutes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookController,
    options: {
      cors: {
        origin: ['*']
      }
    }
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksController,
    options: {
      cors: {
        origin: ['*']
      }
    }
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookByIdController,
    options: {
      cors: {
        origin: ['*']
      }
    }
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookByIdController,
    options: {
      cors: {
        origin: ['*']
      }
    }
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByIdController,
    options: {
      cors: {
        origin: ['*']
      }
    }
  }
]

module.exports = booksRoutes
