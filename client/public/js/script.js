document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.products-filter').forEach(node => {
        const node_items = node.querySelectorAll('.products-filter__item > .products-filter__text')
        for (const click_item of node_items){
            click_item.addEventListener('click', event => {
                for (let item of node_items){
                    item != event.currentTarget ? item.parentElement.classList.remove('products-filter__item_active') : item.parentElement.classList.add('products-filter__item_active');
                };
            });
        };
    });

    $('.slider').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: $('.paginator__prev'),
        nextArrow: $('.paginator__next')
    });
});