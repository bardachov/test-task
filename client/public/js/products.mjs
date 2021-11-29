import Cookies from '/static/js/js.cookie.min.mjs';
Notiflix.Notify.init({timeout: 3000, position: 'right-bottom'});

class Validate{
    name(JQElement){
        if (JQElement.val().length > 32 || JQElement.val().length < 3){
            this.notify.failure('Product name must be more than 3 and less than 32 characters');
            JQElement.addClass('invalid');
            JQElement.removeClass('valid');
            return false;
        }
        JQElement.addClass('valid');
        JQElement.removeClass('invalid');
        return true;
    }

    price(JQElement){
        if (isNaN(Number(JQElement.val())) || JQElement.val().length == 0){
            this.notify.failure('Product price should only be a number');
            JQElement.addClass('invalid');
            JQElement.removeClass('valid');
            return false;
        }
        JQElement.addClass('valid');
        JQElement.removeClass('invalid');
        return true;
    }

    image(JQElement, JQWrapper){
        if (!JQElement.prop('files')[0]){
            this.notify.failure('Select Image!');
            JQWrapper.addClass('invalid');
            JQWrapper.removeClass('valid');
            return false;
        }
        JQWrapper.addClass('valid');
        JQWrapper.removeClass('invalid');
        return true;
    }

    constructor(notify){
        this.notify = notify ? notify : Notiflix.Notify;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const Notify = Notiflix.Notify;
    const Validator = new Validate(Notify);
    const logoutBtn = $('#log-out-btn');
    const productImageBox = $('#product-image');
    const productImageWrapper = $('#product-image-wrapper')
    const productNameBox = $('#product-name');
    const productPriceBox = $('#product-price');
    const productDescription = $('#product-description');
    const submitBtn = $('#submit-btn');

    const editModal = M.Modal.init(document.querySelectorAll('.product-edit-init'), {});
    const createModal = M.Modal.init(document.querySelectorAll('.product-create-init'), {});
    const deleteModal = M.Modal.init(document.querySelectorAll('.product-delete-init'), {});

    const ajaxRefresh = () => {
        $.ajax({
            url: "",
            context: document.body,
            success: function(s,x){
                $(this).html(s);
            }
        });
    }
    const imageToBase64 = async (file) => new Promise( (resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            resolve(reader.result)
        });
        reader.readAsDataURL(file);
    })

    logoutBtn.click( () => {
        Cookies.remove('authorization');
        window.location = '/';
    });

    submitBtn.click( async () => {
        let flags = {
            image: Validator.image(productImageBox, productImageWrapper),
            name: Validator.name(productNameBox),
            price: Validator.price(productPriceBox)
        };
        if (!flags.image || !flags.price || !flags.name) return;
        axios.post('/api/products', {
            image: await imageToBase64(productImageBox.prop('files')[0]),
            name: productNameBox.val(),
            price: Number(productPriceBox.val()),
            description: productDescription.val()
        }).then( () => {
            Notify.success('Product created!');
            return ajaxRefresh();
        }).catch( (err) => {
            return Notify.failure(err.response?.data?.message || err.message);
        }).finally( () => {
            createModal.close();
        })
    });

    const initModal = async (modal) => {
        const product_id = modal.getAttribute('data-product-id');
        const delModal = deleteModal[Number(modal.getAttribute('data-n'))];
        const updateModal = editModal[Number(modal.getAttribute('data-n'))];
        const remove = modal.querySelector('.btn-agree');
        const dismiss = modal.querySelector('.btn-dismiss');

        $(dismiss).click( () => {
            delModal.close();
        })

        $(remove).click( () => {
            axios.delete(`/api/products?id=${product_id}`)
                .then(() => {
                    Notify.success('Product deleted!');
                    delModal.close();
                    window.location.reload();
                })
                .catch( (err) => {
                    delModal.close();
                    return Notify.failure(err.response?.data?.message || err.message);
                })
        })
    }

    document.querySelectorAll('.modal-container').forEach( async (modal) => {
        initModal(modal);
    })
})