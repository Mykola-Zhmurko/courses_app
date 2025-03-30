const toCurrency = price => {
    return new Intl.NumberFormat('de-DE', {
        currency: 'EUR',
        style: 'currency'
    }).format(price);
}
document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
});


const toDate = date => {
    return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

document.querySelectorAll('.date').forEach(node=>{
    node.textContent = toDate(node.textContent)
})




const $card = document.querySelector('#card')

if($card){
    $card.addEventListener('click', event =>{
        if(event.target.classList.contains('js-remove')){
            const id = event.target.dataset.id
            const csrf = event.target.dataset.csrf

            fetch('/card/remove/' + id,{
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            }).then(res => res.json())
            .then(card=>{
                if(card.courses.length){
                    const html = card.courses.map(c =>{
                    return`
                    <tr>
                    <td>${c.title}</td> 
                    <td>${c.count}</td>
                    <td>${c.price}</td>
                    <td>
                        <button class="button is-small is-danger js-remove" data-id="${c.id}" data-csrf="${csrf}">Delete</button>
                    </td>
                    </tr>
                    `
                    }).join('')
                    $card.querySelector('tbody').innerHTML = html
                    $card.querySelector('.price').textContent = toCurrency(card.price)
                }else{
                    $card.innerHTML = '<p>Your cart is empty</p>'
                }
            })
        }
    })
}


document.addEventListener("DOMContentLoaded", function() {
    const tabs = document.querySelectorAll(".tabs li");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", function() {

            tabs.forEach(tab => tab.classList.remove("is-active"));
            tab.classList.add("is-active");

            tabContents.forEach(content => content.classList.add("is-hidden"));
            
            const target = document.querySelector(tab.querySelector("a").getAttribute("href"));
            target.classList.remove("is-hidden");
        });
    });
});
