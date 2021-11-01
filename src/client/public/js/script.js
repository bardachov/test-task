document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.select-items').forEach(node => {
        const node_items = node.querySelectorAll('.select-item > a')
        for (const click_item of node_items){
            click_item.addEventListener('click', event => {
                for (let item of node_items){
                    item != event.currentTarget ? item.parentElement.classList.remove('active') : item.parentElement.classList.add('active');
                };
            });
        };
    });
});