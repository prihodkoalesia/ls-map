import renderList from '../templates/list.hbs';
import renderForm from '../templates/form.hbs';

function initMap() {
    let currentPoints = {};

    if (localStorage.map) {
        currentPoints = JSON.parse(localStorage.map);
    }

    ymaps.ready(() => {
        const myPoints = {};
        const myMap = new ymaps.Map('map', {
            center: [53.902496, 27.561481],
            zoom: 10,
            controls: []
        });

        const customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="" data-id="{{ properties.idForGeoObj }}">{{ properties.myReviews|raw }}</div>'
        );

        const clusterer = new ymaps.Clusterer({
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
            return renderList({ reviews: reviewAr });
        };

        const renderBlock = () => {
            return renderForm();
        };

        function addNewReview(form, coords) {
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
                }
                currentPoints[coords].push(newReview);

                if (myPoints[coords]) {
                    changeViewPlaceMark(myPoints[coords], currentPoints[coords].length);
                } else {
                    createPlacemark(coords, currentPoints[coords]);
                }

                localStorage.map = JSON.stringify(currentPoints);

                myMap.balloon.close();
            }
        }

        const changeViewPlaceMark = (placemark, count) => {
            placemark.options.set({
                preset: 'islands#redCircleIcon'
            });
            placemark.properties.set({
                iconContent: count
            });
        }

        function createPlacemark(coords, reviewAr) {
            const myPlacemark = new ymaps.Placemark(coords, {
                myReviews: renderHeader(reviewAr),
            }, {
                preset: 'islands#redIcon',
                balloonMaxHeight: 500,
                balloonMaxWidth: 355
            });

            if (reviewAr.length > 1) {
                changeViewPlaceMark(myPlacemark, reviewAr.length)
            }

            myPlacemark.events.add('click', (e) => {
                openBalloon(e, { coords: coords, reviewAr: reviewAr });
            });

            myPoints[coords] = myPlacemark;
            clusterer.add(myPlacemark);
        }

        if (Object.entries(currentPoints).length > 0) {
            for (const geo in currentPoints) {
                const reviewAr = currentPoints[geo],
                    coordsAr = geo.split(',');

                createPlacemark(coordsAr, reviewAr)
            }
        }

        const openBalloon = (e, reviews = {}) => {
            const coords = reviews.coords ? reviews.coords : e.get('coords');
            const properties = { contentBody: renderBlock() };

            if (reviews.reviewAr && reviews.reviewAr.length > 0) {
                properties.contentHeader = renderHeader(reviews.reviewAr);
            }
            myMap.balloon.open(coords, properties)
                .then(() => {
                    const form = document.querySelector('form[name="review"]');

                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        addNewReview(form, coords);
                    });
                });
        }

        myMap.events.add('click', function (e) {
            if (!myMap.balloon.isOpen()) {
                openBalloon(e);
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
