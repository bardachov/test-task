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
        if (isNaN(Number(JQElement.val()))){
            this.notify.failure('Product price should only be a number');
            JQElement.addClass('invalid');
            JQElement.removeClass('valid');
            return false;
        }
        JQElement.addClass('valid');
        JQElement.removeClass('invalid');
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
    const productNameBox = $('#product-name');
    const productPriceBox = $('#product-price');
    const productDescription = $('#product-description');
    const submit = $('#submit-btn');

    let productImage;
    let flags = {
        image: false,
        name: false,
        price: false
    }
    productImageBox.on('change', async (event) => {
        const file = event.target.files[0];
        const DataUrl = await new Promise( (resolve, reject) => {
            const reader = new FileReader();    
            reader.addEventListener('load', () => {
                flags.image = true;
                resolve(reader.result)
            });
            reader.addEventListener('error', () => {
                flags.image = false;
                resolve(reader.result);
            });
            reader.readAsDataURL(file);
        })
        productImage = DataUrl;
    });

    productNameBox.on('change', () => {
        flags.name = Validator.name(productNameBox)
    });

    productPriceBox.on('change', () => {
        flags.price = Validator.price(productPriceBox)
    });


    submit.click( () => {
        if (!flags.image || !flags.price || !flags.name) return Notify.failure('Please enter correct data');
        axios.post('/api/products/create', {
            image: productImage,
            name: productNameBox.val(),
            price: Number(productPriceBox.val()),
            description: productDescription.val()
        }).then( (res) => {
            return Notify.success('Product created!');
        }).catch( (err) => {
            return Notify.failure(err.response?.data?.message || err.message);
        })
    })

    logoutBtn.click( () => {
        Cookies.remove('authorization');
        window.location = '/';
    });
})