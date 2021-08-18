import renderList from '../templates/list.hbs';
import renderForm from '../templates/form.hbs';

function initMap() {
    var currentPoints = {};
    if (localStorage.map) {
        currentPoints = JSON.parse(localStorage.map);
    }

    ymaps.ready(() => {
        let myPlacemark;
        let myMap = new ymaps.Map('map', {
            center: [53.902496, 27.561481],
            zoom: 10,
            controls: []
        });

        const customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="" data-id="{{ properties.idForGeoObj }}">{{ properties.balloonContentHeader|raw }}</div>'
        );

        let clusterer = new ymaps.Clusterer({
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
            return renderList({reviews: reviewAr});
        };

        const renderBlock = () => {
            return renderForm();
        };

        function addNewReview(form, coords, placemark = '') {
            const name = form.elements.reviewName.value,
                place = form.elements.reviewPlace.value,
                text = form.elements.reviewText.value,
                date = new Date().toLocaleDateString();

            if (!name || !place || !text) {
                alert('Все поля должны быть заполнены!')
            } else {
                const newReview = {'name': name, 'place': place, 'text': text, 'date': date};

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

        function createPlacemark(coords, reviewAr) {
            myPlacemark = new ymaps.Placemark(coords, {
                balloonContentHeader: renderHeader(reviewAr),
                balloonContent: renderBlock(),
                myCoords: coords,
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

            clusterer.add(myPlacemark);
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
                const form = document.querySelector('form[name="review"]');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    addNewReview(form, coords, curPlaceMark);
                });
            }
        });

        myMap.events.add('click', function (e) {
            if (!myMap.balloon.isOpen()) {
                var coords = e.get('coords');

                myMap.balloon.open(coords, {
                    contentBody: renderBlock(),
                }).then(
                    function () {
                        const form = document.querySelector('form[name="review"]');
                        form.addEventListener('submit', (e) => {
                            e.preventDefault();
                            addNewReview(form, coords);
                        });
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
