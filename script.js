const qs = s => document.querySelector(s)
const qsa = s => document.querySelectorAll(s)

let qtd = 1
let cart = []
let pizzaSelected

pizzaJson.map( (pizza) => {
    let pizzaItem  = qs('.pizza-item').cloneNode(true)

    pizzaItem.querySelector('a').href = "#"
    pizzaItem.querySelector('a').addEventListener('click', (e) => {preencheModal(e, pizza)})
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img
    pizzaItem.querySelector('.pizza-item--price').innerText = `R$ ${pizza.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerText = pizza.name
    pizzaItem.querySelector('.pizza-item--desc').innerText = pizza.description

    qs('.pizza-area').append(pizzaItem)
})


let pizzaModal = qs('.pizzaWindowArea')

const closeModal = () => {
    pizzaModal.style.display = 'none'
}

const preencheModal = (e, pizza) =>{
    qtd = 1
    pizzaSelected = pizza

    pizzaModal.querySelector('img').src = pizza.img
    pizzaModal.querySelector('h1').innerText = pizza.name
    pizzaModal.querySelector('.pizzaInfo--desc').innerText = pizza.description
    pizzaModal.querySelector('.pizzaInfo--actualPrice').innerText = `R$ ${pizza.price.toFixed(2)}`
    pizzaModal.querySelector('.pizzaInfo--qt').innerText = qtd
    
    pizzaModal.querySelectorAll('.pizzaInfo--sizes div').forEach( size => {
        let key = size.getAttribute('data-key')
        size.addEventListener('click', (e) => {
            qsa('.pizzaInfo--size').forEach(sizeItem => {sizeItem.classList.remove('selected')})
            qs(`.pizzaInfo--sizes div[data-key='${key}']`).classList.add('selected')
        })
        size.querySelector('span').innerText = pizza.sizes[key]
    });

    pizzaModal.querySelector('.pizzaInfo--cancelButton').addEventListener('click', (e) => {
        closeModal()
    })
    pizzaModal.querySelector('.pizzaInfo--cancelMobileButton').addEventListener('click', (e) => {
        closeModal()
    })
    
    pizzaModal.style.display = 'flex'
}

pizzaModal.querySelector('.pizzaInfo--qtmenos').addEventListener('click', (e) => {
    if(qtd > 1){
        qtd--
        pizzaModal.querySelector('.pizzaInfo--qt').innerText = qtd
    }
})

pizzaModal.querySelector('.pizzaInfo--qtmais').addEventListener('click', (e) => {
    qtd++
    pizzaModal.querySelector('.pizzaInfo--qt').innerText = qtd
})

pizzaModal.querySelector('.pizzaInfo--addButton').addEventListener('click', (e) => {
    cartAddItem()
    closeModal()
})

const cartAddItem = () => {
    let tamanho = parseInt(qs('.pizzaInfo--sizes div.selected').getAttribute('data-key'))
    let pizzaId = pizzaSelected.id
    let id = `${pizzaId}@${tamanho}`

    let cartSelected = cart.findIndex( cartSelectedItem => cartSelectedItem.id == id)

    if(cartSelected >= 0){
        cart[cartSelected].qtd += qtd
    }else{
        cart.push({
            id,
            pizzaId,
            qtd: qtd,
            tamanho
        })
    }

    updateCart()
}

const updateCart = () => {
    let subtotal = 0
    let cartPizzaItem = qs('.cart')
    cartPizzaItem.innerText = ''

    cart.forEach( item => {
        let cartItem = qs('.cart--item').cloneNode(true)
        let pizza = pizzaJson.find(pizzaItem => pizzaItem.id == item.pizzaId)
        subtotal += pizza.price*item.qtd

        let size = ''
        switch (item.tamanho) {
            case 0:
                size = 'P'
                break;
            case 1:
                size = 'M'
                break;
            case 2:
                size = 'G'
                break;
        }

        cartItem.querySelector('img').src = pizza.img
        cartItem.querySelector('.cart--item-nome').innerText = `${pizza.name} (${size})`
        cartItem.querySelector('.cart--item--qt').innerText = item.qtd
        
        cartItem.querySelector('.cart--item-qtmais').addEventListener('click', (e) => {
            item.qtd++
            updateCart()
        })
        cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', (e) => {
            item.qtd--
            if(item.qtd < 1){
                cart.splice(cart.findIndex( c => c.id == item.id ) , 1)
            }
            updateCart()
        })

        cartPizzaItem.append(cartItem)
        
    })

    let desconto = subtotal-(subtotal*0.9)
    let total = subtotal-desconto
    qs('.cart--totalitem.subtotal span:last-child').innerText = subtotal.toFixed(2)
    qs('.cart--totalitem.desconto span:last-child').innerText = desconto.toFixed(2)
    qs('.cart--totalitem.total span:last-child').innerText = total.toFixed(2)

    qs('.menu-openner span').innerText = cart.length

    qs('aside').classList.add('show')

    if(cart.length == 0){
        qs('aside').classList.remove('show')
        qs('aside').style.left = '100vw'
    }
}

qs('.menu-openner').addEventListener('click', (e) => {
    if(cart.length > 0){
        qs('aside').style.left = 0
    }
})
qs('.menu-closer').addEventListener('click', (e) => {
    qs('aside').style.left = '100vw'
})