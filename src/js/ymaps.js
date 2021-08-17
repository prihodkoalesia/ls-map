function initMap() {
    var currentPoints = {};
    if (localStorage.map) {
        currentPoints = JSON.parse(localStorage.map);
    }

    ymaps.ready(() => {
        let myPlacemark;
        var geoObjects = [];
        let myMap = new ymaps.Map('map', {
            center: [53.902496, 27.561481],
            zoom: 10,
            controls: []
        });

        var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="" data-id="{{ properties.idForGeoObj }}">{{ properties.balloonContentHeader|raw }}</div>'
        );

        var clusterer = new ymaps.Clusterer({
            preset: 'islands#redClusterIcons',
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonItemContentLayout: customItemContentLayout,
            clusterBalloonContentLayoutWidth: 355,
            clusterBalloonContentLayoutMaxHeight: 500,
            clusterBalloonPagerSize: 5
        });

        const renderHeader = (reviewAr) => {
            const block = document.querySelector('#template_list').cloneNode(true);
            if (reviewAr.length > 0) {
                let fragment = document.createDocumentFragment();
                for (const review in reviewAr) {
                    var { name, place, text, date = '' } = reviewAr[review];
                    var line = block.querySelector('.review__item').cloneNode(true);
                    const blockForText = line.querySelector('.review__item-text'),
                        blockForName = line.querySelector('.review__item-name'),
                        blockForPlace = line.querySelector('.review__item-place'),
                        blockForDate = line.querySelector('.review__item-date');

                    blockForText.textContent = text;
                    blockForName.textContent = name;
                    blockForPlace.textContent = place;
                    blockForDate.textContent = date;
                    fragment.append(line);
                }
                block.querySelector('.review__list').innerHTML = '';
                block.querySelector('.review__list').style.display = 'block';
                block.querySelector('.review__list').append(fragment);
            }

            return block.innerHTML;
        }

        const renderBlock = () => {
            let template = document.querySelector('#template');
            const block = template.cloneNode(true);

            return block.innerHTML;
        };

        function addNewReview(form, coords, placemark = '') {
            const name = form.elements.reviewName.value,
                place = form.elements.reviewPlace.value,
                text = form.elements.reviewText.value,
                date = new Date().toLocaleDateString();

            if (!name || !place || !text) {
                alert('Все поля должны быть заполнены!')
            } else {
                const newReview = { 'name': name, 'place': place, 'text': text, 'date': date };

                if (!currentPoints[coords]) {
                    currentPoints[coords] = [];
                    createPlacemark(coords, [newReview]);
                } else {
                    clusterer.remove(placemark);
                    createPlacemark(coords, [...currentPoints[coords], newReview]);
                }

                currentPoints[coords].push(newReview);
                localStorage.map = JSON.stringify(currentPoints);

                myMap.balloon.close();
            }
        }

        var i = 0;

        function createPlacemark(coords, reviewAr) {

            myPlacemark = new ymaps.Placemark(coords, {
                balloonContentHeader: renderHeader(reviewAr),
                balloonContent: renderBlock(),
                myCoords: coords,
                idForGeoObj: i
            }, {
                preset: 'islands#redIcon',
                balloonMaxHeight: 500,
                balloonMaxWidth: 355
            });

            if (reviewAr.length > 1) {
                myPlacemark.options.set({
                    preset: 'islands#redCircleIcon'
                });
                myPlacemark.properties.set({
                    iconContent: reviewAr.length
                });
            }

            myPlacemark.events.add('click', function (e) {
                console.log(e.get('coords'));
            });

            geoObjects[i] = myPlacemark;
            clusterer.add(myPlacemark);
            i++;
        }

        if (Object.entries(currentPoints).length > 0) {
            for (const geo in currentPoints) {
                const reviewAr = currentPoints[geo],
                    coordsAr = geo.split(',');
                createPlacemark(coordsAr, reviewAr)
            }
        }

        myMap.events.add('balloonopen', function (e) {
            if (e.get('target').geometry) {
                const curPlaceMark = e.get('target');
                let coords = e.get('target').geometry.getCoordinates();
                const formList = document.querySelectorAll('form[name="review"]');

                formList.forEach((form) => {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        addNewReview(form, coords, curPlaceMark);
                    });
                })
            }
        });

        myMap.events.add('click', function (e) {
            if (!myMap.balloon.isOpen()) {
                var coords = e.get('coords');

                myMap.balloon.open(coords, {
                    contentBody: renderBlock(),
                }).then(
                    function () {
                        const formList = document.querySelectorAll('form[name="review"]');

                        formList.forEach((form) => {
                            form.addEventListener('submit', (e) => {
                                e.preventDefault();
                                addNewReview(form, coords);
                            });
                        })
                    }
                );

            } else {
                myMap.balloon.close();
            }
        });

        myMap.geoObjects.add(clusterer);
    })
}

export {
    initMap
}
