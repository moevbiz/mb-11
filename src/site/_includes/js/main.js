let filters = document.querySelectorAll('.filter')
let elements = document.querySelectorAll('.el')

function toggle(input) {
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
        toggle(filter.dataset.filterValue)
    })
})