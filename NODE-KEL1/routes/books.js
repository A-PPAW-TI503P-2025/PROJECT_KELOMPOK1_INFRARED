 	const express = require('express');
 	const router = express.Router();
 	
    // Data array buku
 	let books = [
 	  {id: 1, title: 'Book 1', author: 'Author 1'},
 	  {id: 2, title: 'Book 2', author: 'Author 2'},
      {id: 3, title: 'Book 3', author: 'Author 3'},
      {id: 4, title: 'Book 4', author: 'Author 4'}
        
 	];
 	
 	router.get("/books", (req, res) => {
 	  res.json(books);
 	});
 	
 	router.get("/:id", (req, res) => {
 	  const book = books.find(b => b.id === parseInt(req.params.id));
 	  if (!book) return res.status(404).send('Book not found');
 	  res.json(book);
 	});
 	
 	router.post("/", (req, res) => {
 	  const { title, author } = req.body;
 	  if (!title || !author) {
 	      return res.status(400).json({ message: 'Title and author are required' });
 	  }
 	  const book = {
 	    id: books.length + 1,
 	    title,
 	    author
 	  };
 	  books.push(book);
 	  res.status(201).json(book);
 	});

	router.put("/:id", (req, res) => {
    // 1. Cari buku berdasarkan ID
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('Book not found'); // Jika tidak ada, kirim 404

    // 2. Validasi input dari body
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).json({ message: 'Title and author are required' });
    }

    // 3. Update data buku yang ditemukan
    book.title = title;
    book.author = author;

    // 4. Kirim kembali data buku yang sudah diupdate
    res.json(book);
});

	router.delete("/:id", (req, res) => {
    // 1. Cari index buku berdasarkan ID
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    // Jika tidak ada, kirim 404
    if (bookIndex === -1) return res.status(404).send('Book not found');

    // 2. Hapus buku dari array menggunakan splice
    const deletedBook = books.splice(bookIndex, 1);

    // 3. Kirim respons konfirmasi
    res.json({ message: 'Book Berhasil Di hapus', book: deletedBook[0] });
});
 	
 	module.exports = router;

