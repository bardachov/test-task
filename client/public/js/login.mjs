import Cookies from '/static/js/js.cookie.min.mjs';
Notiflix.Notify.init({timeout: 3000, position: 'right-bottom'});

class Validate{
    email(JQelement, JQhelper){
        const emailPattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        if (emailPattern.test(JQelement.val())){
            JQhelper.addClass('hide');
            return true;
        }else{
            JQhelper.removeClass('hide');
            return false;
        }
    }

    password(JQelement, JQhelper){
        if (JQelement.val().length >= 6){
            JQhelper.addClass('hide');
            JQelement.removeClass('invalid');
            JQelement.addClass('valid');

            return true;
        }else{
            JQhelper.removeClass('hide');
            JQelement.removeClass('valid');
            JQelement.addClass('invalid');

            return false;
        }
    }

    repeat(checker, JQelement, JQChecker ,JQhelper){
        if (!checker || JQelement.val() == JQChecker.val()){
            JQhelper.addClass('hide');
            JQChecker.removeClass('invalid');
            JQChecker.addClass('valid');

            return true;
        }else{
            JQhelper.removeClass('hide');
            JQChecker.removeClass('valid');
            JQChecker.addClass('invalid');

            return false;
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const Validator = new Validate();
    const Notify = Notiflix.Notify;
    const submitBtn = $('#btn_login');
    const registerBtn = $('#register_btn');
    const loginBtn = $('#login_btn');

    const emailBox = $('#email');
    const emailHelper = $('#emailHelper');

    const passwordBox = $('#password');
    const passwordHelper = $('#passwordHelper');

    const repeatBox = $('#repeat');
    const repeatHepler = $('#repeatHelper');
    const repeatContainer = $('#repeatbx');

    const progressBox = $('#progress');
    const headerText = $('#headerText');

    let flags = {
        register: false,
        password: false,
        repeat: false,
        email: false
    }

    emailBox.on('change', () => {
        flags.email = Validator.email(emailBox, emailHelper)
    });

    passwordBox.on('change', () => {
        flags.password = Validator.password(passwordBox, passwordHelper);
        flags.repeat = Validator.repeat(flags.register, passwordBox, repeatBox, repeatHepler);
    });

    repeatBox.on('change', () => {
        flags.repeat = Validator.repeat(flags.register, passwordBox, repeatBox, repeatHepler);
    });

    registerBtn.click( () => {
        flags.register = true;
        flags.repeat = Validator.repeat(flags.register, passwordBox, repeatBox, repeatHepler);
        headerText.text('Register new account');
        registerBtn.addClass('hide');
        loginBtn.removeClass('hide');
        repeatContainer.removeClass('hide');
    });

    loginBtn.click( () => {
        flags.register = false;
        flags.repeat = Validator.repeat(flags.register, passwordBox, repeatBox, repeatHepler);
        headerText.text('Login into your account');
        registerBtn.removeClass('hide');
        loginBtn.addClass('hide');
        repeatContainer.addClass('hide');
    });

    submitBtn.click( () => {
        if (!flags.password || !flags.email || !flags.repeat) return Notify.failure('Please enter correct data');

        const password = passwordBox.val();
        const email = emailBox.val();
        submitBtn.addClass("hide");
        progressBox.removeClass("hide");

        axios.post(flags.register ? '/api/user/register' : '/api/user/login', {email, password})
            .then( (res) => {
                try{
                    Notify.success('Success');
                    Cookies.set('authorization', `${res.data.type} ${res.data.token}`);

                    window.location = '/account';
                }catch(err){
                    Notify.failure('Server return invalid data!');
                }
            })
            .catch(err => {
                Notify.failure(err.response?.data?.message || err.message);
            })
            .finally( () => {
                submitBtn.removeClass("hide");
                progressBox.addClass("hide");
            })
    });
})