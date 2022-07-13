// Copyright (c) 2022 Bondo Pangaji
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const { nanoid } = require('nanoid')
const books = require('../model/books')

/**
 * Controller for creating books
 * @param request object with details about the end user's request
 * @param reply response toolkit, an object with several methods used to respond to the request.
 * @returns {*}
 */
const addBookController = async (request, reply) => {
  try {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = await request.payload

    if (name === undefined) {
      const response = reply.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
      })
      response.code(400)
      return response
    }

    if (pageCount < readPage) {
      const response = reply.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
      return response
    }

    const id = nanoid(16)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt
    const finished = (pageCount === readPage)
    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt
    }

    books.push(newBook)

    const isSuccess = books.filter((book) => book.id === id).length > 0

    if (isSuccess) {
      const response = reply.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id
        }
      })
      response.code(201)
      return response
    }
  } catch (err) {
    const response = reply.response({
      status: 'fail',
      message: err.message
    })
    response.code(500)
    return response
  }

  const response = reply.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

/**
 * Controller for getting all books
 * @param request object with details about the end user's request
 * @param reply response toolkit, an object with several methods used to respond to the request.
 * @returns {*}
 */
const getAllBooksController = async (request, reply) => {
  try {
    const { name, reading, finished } = await request.query
    let queriedBooks = books

    if (name !== undefined) { // Filter books by name query (non-case-sensitive)
      queriedBooks = queriedBooks
        .filter((book) => book.name
          .toLowerCase()
          .includes(name.toLowerCase()))
    }

    if (reading !== undefined) { // Filter books by reading query
      queriedBooks = queriedBooks
        .filter((book) => book.reading === !!Number(reading))
    }

    if (finished !== undefined) { // Filter books by finished query
      queriedBooks = queriedBooks
        .filter((book) => book.finished === !!Number(finished))
    }

    const response = reply.response({
      status: 'success',
      data: {
        books: queriedBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  } catch (err) {
    const response = reply.response({
      status: 'fail',
      message: err.message
    })
    response.code(500)
    return response
  }
}

/**
 * Controller for getting book by id
 * @param request object with details about the end user's request
 * @param reply response toolkit, an object with several methods used to respond to the request.
 * @returns {{data: {note: *}, status: string}|*}
 */
const getBookByIdController = async (request, reply) => {
  try {
    const { id } = await request.params
    const book = books.filter((book) => book.id === id)[0]

    if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book
        }
      }
    }

    const response = reply.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  } catch (err) {
    const response = reply.response({
      status: 'fail',
      message: err.message
    })
    response.code(500)
    return response
  }
}

/**
 * Controller for edit book by id
 * @param request object with details about the end user's request
 * @param reply response toolkit, an object with several methods used to respond to the request.
 * @returns {*}
 */
const editBookByIdController = async (request, reply) => {
  try {
    const { id } = await request.params
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = await request.payload
    const updatedAt = new Date().toISOString()
    const index = books.findIndex((book) => book.id === id)

    if (index !== -1) {
      if (name === undefined) {
        const response = reply.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
      }

      if (pageCount < readPage) {
        const response = reply.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
      }

      const finished = (pageCount === readPage)

      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt
      }

      const response = reply.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })
      response.code(200)
      return response
    }

    const response = reply.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  } catch (err) {
    const response = reply.response({
      status: 'fail',
      message: err.message
    })
    response.code(500)
    return response
  }
}

/**
 * Controller for delete book by id
 * @param request object with details about the end user's request
 * @param reply response toolkit, an object with several methods used to respond to the request.
 * @returns {*}
 */
const deleteBookByIdController = async (request, reply) => {
  try {
    const { id } = await request.params
    const index = books.findIndex((note) => note.id === id)

    if (index !== -1) {
      books.splice(index, 1)
      const response = reply.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
      })
      response.code(200)
      return response
    }

    const response = reply.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  } catch (err) {
    const response = reply.response({
      status: 'fail',
      message: err.message
    })
    response.code(500)
    return response
  }
}

module.exports = {
  addBookController,
  getAllBooksController,
  getBookByIdController,
  editBookByIdController,
  deleteBookByIdController
}
