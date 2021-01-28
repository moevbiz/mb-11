let filters = document.querySelectorAll('.filter');
let elements = document.querySelectorAll('.el');
const frame = document.querySelector('#frame');
const links = document.querySelectorAll('.container a.c');
const closeBtn = document.querySelector('#close-frame');

function openIframe(link) {
    show(frame);
    frame.src = link;
}

function closeIframe() {
    frame.src = '';
    hide(frame);
}

function toggleInput(input) {
    if (input != "All") {
        document.body.classList.add('filtered')
    } else {
        document.body.classList.remove('filtered')
    }
    filters.forEach((filter) => {
        if (filter.dataset.filterValue == input) {
            filter.classList.add('selected')
        } else {
            filter.classList.remove('selected')
        }
    })
    elements.forEach((element) => {
        if (input === "All") {
            show(element)
        } else if (element.dataset.type.split(',').includes(input)) {
            show(element)
        } else {
            hide(element)
        }
    })
}

function show(el) {
    el.classList.add('visible')
    el.classList.remove('hidden')
}

function hide(el) {
    el.classList.add('hidden')
    el.classList.remove('visible')
}

filters.forEach((filter) => {
    filter.addEventListener('click', function(e) {
        toggleInput(filter.dataset.filterValue)
    })
})

links.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        openIframe(e.target.href);
    })
})

document.body.addEventListener('click', (e) => {
    if (e.target === frame || e.target.classList.contains('c')) return;
    if (frame.classList.contains('visible')) {
        closeIframe(frame);
    };
})