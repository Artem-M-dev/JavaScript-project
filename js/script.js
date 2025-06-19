window.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items')

    // Первая задача - это скрыть все ненужные табы
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        })

        // Когда мы скрываем все табы из видимости 
        // Мы также будем убирать класс активности у всех табов
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active')
        })
    }

    // Вторая задача - показать табы
    function showTabContent(i = 0) { // i = 0 - это значение по умолчанию. 
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active')
    }

    hideTabContent();
    showTabContent();
    // В функцию showTabContent() нужно передать какой то аргумент, и т.к 
    // нам всегда изначально нужно показывать первый слайд, мы передаем в качестве аргумента - 0

    // Но мы ничего не указали, потому что в написании функции указали значение по умолчанию


    // Третья задача - сделать обработчики событий на клики
    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) { // проверка что мы тыкаем на элемент, и на элемент с классом tabheader__item
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i); // вот для чего нужна переменная "i" в переборе forEach()
                }
            })
        }
    });



    // Timer 

    const deadline = '2025-06-25'; // Это наша отправная точка


    // Функция которая будет определять разницу между "deadline" и нашим текущем временем
    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date()); // Date.parse() мы получим количество секунд переменной переданной в скобках

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)); // Math.floor() - это округление до ближайшего целого 
            hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((t / (1000 * 60)) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        }
    };


    // Функция которая будет заниматься подставлением нуля перед единичными цифрами
    // 1 2 3 4 5 6 7 8 9
    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`
        } else {
            return num
        }
    }

    // Функция которая будут выставлять таймер на страничку
    function setClock(selecor, endtime) {
        const timer = document.querySelector(selecor),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        // Вызов функции для решения проблемы - мигание верстки
        // Когда мы заходим на сайт, и у нас начинает работать таймер только через секунду в нашем случае 
        updateClock()


        // Функция которая будет обновлять время на странце
        function updateClock() {
            const t = getTimeRemaining(endtime)

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval)
            }
        }
    }

    setClock('.timer', deadline);



    // Modal window

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        // modalClose = document.querySelector('[data-close]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal)
    });

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'
        // clearInterval(modalTimerId);
    };

    // Напишем функцию которая поможет избежать повторения кода в двух местах
    // Только для этого и нужна эта функция
    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''
    };


    // modalClose.addEventListener('click', closeModal);


    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal()
        }
    });

    // Для того, чтобы сделать событие реагирующее на нажатие клавиш, 
    // Есть событие "keydown"
    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // const modalTimerId = setTimeout(openModal, 3000)

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 0.5) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll)
            // После певого вызова функции "showModalByScroll()" обработчик события будет удален
        }
    };

    window.addEventListener('scroll', showModalByScroll);



    // Использование классов для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...clases) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.clases = clases;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 80; // Для конвертаци из долларов в русские рубли
            this.chageToRu();
        }

        chageToRu() {
            this.price = this.price * this.transfer
        }

        render() {
            const element = document.createElement('div'); // Получается у нас внутри этого div-а будет еще один div.

            if (this.clases.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element)
            } else {
                this.clases.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                    </div>
            `;

            this.parent.append(element);
        }
    }


    // getResource - это функция по получению ресурсов 
    const getResource = async (url) => { // В эту фукнцию можно будет передавать аргументы которые будут потом влиять на заголовки
        const res = await fetch(url);

        if(!res.ok) { // Если что то пошло не так
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }

        return await res.json()
    }

    getResource('http://localhost:3000/menu')
    .then(data => {
        data.forEach(({img, altimg, title, descr, price}) => { // Тут используется деструктуризация
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render(); 
        });
    });



    // Forms

    const forms = document.querySelectorAll('form');

    // message содержит список фраз, при удачных/неудачных попытках отправки данных
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Мы скоро с вами свяжемся',
        failure: 'Что-то пошло не так...'
    }

    forms.forEach(item => {
        bindPostData(item)
    })


    // Фукнция postData занимается тем, что она настраивает наш запрос и возвращает из себя promise - res.json() -- ЭТО JSON!
    const postData = async (url, data) => { // В эту фукнцию можно будет передавать аргументы которые будут потом влиять на заголовки
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json()
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => { // Событие 'submit' срабатывает каждый раз когда мы пытаемся отправить форму 
            e.preventDefault();


            // Введение нового блока, этот блок основной который выводит сообщения 
            // Находящихся в объекте message
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
            // Но пока что мы выводим только сообщение о загрузке
            // Последующие сообщение будут выводиться в ходе проверок




            // request.setRequestHeader('Content-type', 'multipart/form-data'); ЭТА СТРОКА ВЫЗЫВАЕТ ОШИБКУ // multipart/form-data - чтобы правильно работать с formData

            const formData = new FormData(form); // Во внутрь мы помещаем форму с которой будут браться данные/информация

            const json = JSON.stringify(Object.fromEntries(formData.entries())); // Таким образом мы получим данные с формы в формате - массивы в одном, объединяющем массиве

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data); // data вместо request.response. Это как раз те данные которые возвращаются из обещания
                    showThanksModal(message.success); // Если все хорошо то будет сообщение об успешной загрузке
                    form.reset(); // Так мы сбрасываем форму
                    statusMessage.remove()
                }).catch(() => {
                    showThanksModal(message.failure); // Но иначе будет сообщение о ошибке
                }).finally(() => {
                    form.reset();
                })
        })
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog')

        prevModalDialog.classList.add('hide');
        openModal(); // Функция отвечает за открытие модальных окон

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal(); // Функция для закрытия модального окна
        }, 4000)
    }


    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));
})
