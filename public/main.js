console.log('пользовательский js подгрузился');


const deleteButton = document.querySelector('[data-post]')

deleteButton.addEventListener('click', async (e) => {

if (e.target.dataset.action) {
    console.log(e.target)
    const targ = e.target.dataset.id

    const response = await fetch(`/secret/${targ}`, {
        
    })

console.log(targ)
}
})