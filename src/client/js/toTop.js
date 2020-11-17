/* ::: Scroll to Top ::: */

function backToTop() {
    const toTopButton = document.querySelector('#scrollToTop');
    document.addEventListener('scroll', (event) => {  
        if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
            toTopButton.style.display = 'block';
        } else {
            toTopButton.style.display = 'none';
        }
    })
    toTopButton.addEventListener('click', (event) => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    })
}

backToTop();

export { backToTop };