document.addEventListener('DOMContentLoaded', function () {
    const baseURL = 'http://localhost:3000/'
    const booksURL = baseURL + 'books/'

    const listUl = document.getElementById('list')
    const showPanel = document.getElementById('show-panel')
    // fetch books info
    const fetchBooks = () => {
        fetch(booksURL)
            .then(resp => resp.json())
            .then(books => {
                renderBooksList(books)
            })
    }

    const renderBooksList = books => {
        books.forEach(book => {
            const li = document.createElement('li')
            li.textContent = book.title
            listUl.appendChild(li)
            li.addEventListener('click', () => {
                renderShowPanel(book)
            })
        })
    }

    const renderShowPanel = book => {
        showPanel.innerHTML = ''

        const div = document.createElement('div')
        div.dataset.bookId = book.id
        showPanel.appendChild(div)

        const img = document.createElement('img')
        img.src = book.img_url
        img.alt = 'book cover picture'
        div.appendChild(img)

        const title = document.createElement('h2')
        title.textContent = book.title
        div.appendChild(title)

        const subtitle = document.createElement('h2')
        subtitle.textContent = book.subtitle
        div.appendChild(subtitle)

        const author = document.createElement('h2')
        author.textContent = book.author
        div.appendChild(author)

        const description = document.createElement('p')
        description.textContent = book.description
        div.appendChild(description)

        renderUserList(book)

        const button = document.createElement('button')
        button.textContent = 'LIKE'
        div.appendChild(button)
    }

    const renderUserList = book => {
        const ul = document.createElement('ul')
        ul.id = 'user-list'
        const div = document.querySelector('div#show-panel div')
        div.appendChild(ul)

        book.users.forEach(user => {
            const li = document.createElement('li')
            li.dataset.userId = user.id
            li.textContent = user.username
            ul.appendChild(li)
        })
    }

    const handleLike = () => {
        showPanel.addEventListener('click', e => {
            const element = e.target
            if (element.matches('button')) {
                const bookId = element.parentElement.dataset.bookId
                if (element.textContent === 'LIKE') {
                    likeRequest(bookId)
                } else {
                    unlikeRequest(bookId)
                }
            }
        })
    }

    const likeRequest = bookId => {
        const currentUl = document.getElementById('user-list')

        const patchArray = []
        for (const element of currentUl.children) {
            let key = element.dataset.userId
            patchArray.push({ id: key, username: element.textContent })
        }
        patchArray.push({ id: '1', username: 'pouros' })

        const patchRequest = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                users: patchArray,
            }),
        }
        fetch(booksURL + bookId, patchRequest)
            .then(resp => resp.json())
            .then(book => {
                // console.log(book)
                const li = document.createElement('li')
                li.textContent = book.users[book.users.length - 1].username
                currentUl.appendChild(li)
                const button = document.querySelector('button')
                button.textContent = 'UNLIKE'
            })
    }

    const unlikeRequest = bookId => {
        const currentUl = document.getElementById('user-list')

        const patchArray = []
        for (const element of currentUl.children) {
            let elementId = element.dataset.userId
            patchArray.push({ id: elementId, username: element.textContent })
        }
        const filteredPatchArray = patchArray.filter(element => element.username != 'pouros')

        // console.log(filteredPatchArray)

        const patchRequest = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                users: filteredPatchArray,
            }),
        }
        fetch(booksURL + bookId, patchRequest)
            .then(resp => resp.json())
            .then(book => {
                for (const element of currentUl.children) {
                    // console.log(element.textContent)
                    if (element.textContent === 'pouros') {
                        element.remove()
                    }
                }
                const button = document.querySelector('button')
                button.textContent = 'LIKE'
            })
    }

    fetchBooks()
    handleLike() // handles the like button
})
