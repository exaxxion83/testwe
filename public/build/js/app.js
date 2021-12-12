$(function($) {
    $('.theme-single').each(function(index, element) {
        $(element).select2();
    });

    $('#search_form').submit(function(event) {
        event.preventDefault();
        let form = $(this),
            formData = $(this).serializeArray(),
            searchValues = ['actor', 'type', 'movie']
            dataForSearch = getDataForSearch(formData, searchValues);

        let url = constructSearchUrl(form.attr('action'), dataForSearch);

        $.ajax({
            method: "GET",
            url: url,
        })
            .done(function(resultat) {
                if (resultat['hydra:member'].length) {
                    $('.alert').remove();
                    displayData(resultat, form);
                } else {
                    $('#movie-result').remove();
                    form.append('<div class="alert alert-info" role="alert">' +
                        '  No data found!' +
                        '</div>');
                }
            });

    });

    $(document).on('click', '.page-item', function(event) {
        event.preventDefault();

        let form = $('#search_form'),
            url = $(this).attr('data-url');

        if (url) {
            $.ajax({
                method: "GET",
                url: url,
            })
                .done(function(resultat) {
                    displayData(resultat, form);
                });
        }
    });

    const getDataForSearch = (formData, searchValues) => {
        let result = [];
        searchValues.map(value => {result[value] = null});

        Object.keys(formData).map(function(index) {
            searchValues.map(value => {
                if (valueIsDefined(formData[index], value)) {
                    result[value] = formData[index].value;
                }
            })
        })

        return result;
    }

    const valueIsDefined = (array, value) => {
        return array.name.includes(value) && array.value !== 'undefined';
    }

    const constructSearchUrl = (baseUrl, dataForSearch, page = 1) => {
        let actorName = dataForSearch.actor?.split(' '),
            firstName = actorName ? '&people.firstname=' + actorName[0] : '',
            lastName = actorName ? '&people.lastname=' + actorName[1] : '',
            movieTitle = dataForSearch.movie ? '&title=' + dataForSearch.movie : '',
            type = dataForSearch.type ? '&type.name=' + dataForSearch.type : '';

        return baseUrl + '?page=' +
            page +
            movieTitle +
            firstName +
            lastName +
            type
    }

    const displayData = (resultat, form) => {
        $('#movie-result').remove();

        let moviesFind = resultat['hydra:member'],
            header = '<div id="movie-result" class="container mb-25">' +
                '        <div class="row">',
            content = '',
            footer = '</div>' + getNavigation(resultat['hydra:view']) + '</div>';

        moviesFind.map(movie => {
            let duration = formattedDuration(movie.duration),
                actors = getActors(movie.people),
                img = getImg(movie);
            
            content += '<div class="col-md-3">' +
                '               <img id="img-'+ movie.id +'" src="" alt="img-movie" width="100%"/>' +
                '            </div>' +
                '            <div class="col-md-9 mb-75">' +
                '                <div class="row">' +
                '                    <div class="col-md-12 text-center">' +
                '                        <h3>' + movie.title + '</h3>' +
                '                    </div>' +
                '                    <div class="col-md-12 mb-25">' +
                '                        <span><b>Duration :</b> ' + duration + '</span>' +
                '                    </div>' +
                '                    <div class="col-md-12 mb-25">' +
                '                        <span><b>Synopsis :</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem' +
                '                            Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer' +
                '                            took a galley of type and scrambled it to make a type specimen book. It has survived not only' +
                '                            five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.' +
                '                        </span>' +
                '                    </div>' +
                '                    <div class="col-md-12 mb-25">' +
                '                        <span><b>Casting :</b>' + actors + '</span>' +
                '                    </div>' +
                '                </div>' +
                '            </div>'
        });

        form.append(header + content + footer);
    }

    const formattedDuration = (duration) => {
        let hours = Math.floor(duration / 60),
            min = duration % 60;

        return hours + ' hours ' + (min ? min + ' minutes' : '');
    }

    const getActors = (actors) => {
        let result = '';

        actors.map((actor, index) => {
            let isLastIndex = (index + 1) === actors.length;
            result += ' ' + actor.firstname + ' ' + actor.lastname + ( isLastIndex ? '.' : ',')
        });

        return result;
    }

    const getImg = (resultat) => {
        let search = resultat.title,
            result = '';

        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://imdb8.p.rapidapi.com/auto-complete?q=" + search,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "imdb8.p.rapidapi.com",
                "x-rapidapi-key": "754237601amsh09f935cdb5ffcbfp1d2043jsn05080faa1d70"
            }
        };

        $.ajax(settings).done(function (response) {
            if (response.d) {
                $('#img-' + resultat.id).attr('src', response.d[0].i.imageUrl);
            }
        });

        return result;
    }

    const getNavigation = (urls) => {
        let urlsPagination = !urls['hydra:last'] ? [] : getUrlNavigation(urls),
            header = '<nav aria-label="Page navigation">' +
                '<ul class="pagination justify-content-end">';
            content = '',
            footer = '</ul>' +
                '   </nav>' +
                '</div>';

        Object.keys(urlsPagination).map(index => {
            let paginationNumber = urlsPagination[index] === 'disabled' ? '...' : index,
                disabled = isDisablePagination(paginationNumber, urls['@id'], urlsPagination[index]) ? 'disabled' : '',
                dataUrl = disabled === 'disabled' ? '' : urlsPagination[index];

            content += '<li class="page-item ' + disabled + '" data-url="'+ dataUrl +'"><a class="page-link">'+ paginationNumber +'</a></li>'
        });

        return header + content + footer;
    }

    const isDisablePagination = (paginationNumber, currentPagination, paginationInProcess) => {
        return paginationNumber === '...' || currentPagination === paginationInProcess;
    }

    const getUrlNavigation = (urls) => {
        let regex = /\d+/g,
            currentPage = parseInt(urls['@id'].match(regex)),
            lastPage = parseInt(urls['hydra:last'].match(regex)),
            previous = currentPage
            next = currentPage,
            urlsPagination = {};

        if (currentPage !== 1) {
            urlsPagination[1] = urls['@id'].replace(regex, 1);
            if ((currentPage - 5) > 2) {
                urlsPagination[2] = 'disabled';
            }
        }
        urlsPagination[currentPage] = urls['@id'];


        for(var i = 0; i < 5; i++) {
            if ((previous - 1) > 0 ) {
                previous--;
                urlsPagination[previous] = urls['@id'].replace(regex, previous);
            }

            if ((next + 1) <= lastPage) {
                next++;
                urlsPagination[next] = urls['@id'].replace(regex, next);
            }
        }

        if ((currentPage + 5) < lastPage) {
            urlsPagination[lastPage - 1] = 'disabled';
            urlsPagination[lastPage] = urls['hydra:last'];
        }

        return urlsPagination;
    }
});
