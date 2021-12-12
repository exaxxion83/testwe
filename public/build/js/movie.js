$(function($) {
    $('#create-movie').submit(function(event) {
        event.preventDefault();
        let form = $(this),
            formData = $(this).serializeArray(),
            url = '/api/movies';

        $.ajax({
            method: "POST",
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: getDataWithForm(formData)
        })
            .done(function(resultat) {
                $('.alert-success').removeClass('none');
            });
    });

    const getDataWithForm = (data) => {
        let result = {
            title: "",
            duration: "",
            people: [],
            type: []
        }

        Object.keys(data).map((index) => {
            let value = data[index].value,
                name = data[index].name;

            if (name.includes('people')) {
                result.people.push('/api/people/' + value);
            } else if (name.includes('type')) {
                result.type.push('/api/types/' + value);
            } else {
                result[name] = name === 'duration' ? parseInt(value) : value;
            }
        });

        return JSON.stringify(result);
    }

    $('#movie').on('change', function(event) {
        let url = '/api/movies/' + event.target.value;

        if($(this).val()){
            $.ajax({
                method: "GET",
                url: url,
            })
                .done(function(resultat) {
                    let currentSelect = $('select').eq(0);
                    currentSelect.prop('disabled', true);
                    currentSelect.before('<div id="remove-movie-filter" class="col-md-12 color-red fs-10 cursor-pointer pl-0"><i class="fas fa-ban"></i> remove </div>');

                    $('#edit-movie').removeClass('none');
                    $('#movieTitle').val(resultat.title);
                    $('#duration').val(resultat.duration);
                    changeSelectValue('people', resultat, 'casting');
                    changeSelectValue('type', resultat, 'type');
                    $('.alert-success').addClass('none');
                });
        }
    });

    const changeSelectValue = (type, resultat, selectClass) =>
    {
        let results = [];

        resultat[type].map(value => {
            results.push(value.id);
        })
        $('#' + selectClass).val(results);
        $('#' + selectClass).trigger('change');
    }

    $('#edit-movie').submit(function(event) {
        event.preventDefault();

        let form = $(this),
            formData = $(this).serializeArray(),
            movieId = $('#movie').val(),
            url = '/api/movies/' + movieId;

        $.ajax({
            method: "PATCH",
            url: url,
            contentType: 'application/merge-patch+json',
            dataType: 'json',
            data: getDataWithForm(formData)
        })
            .done(function(resultat) {
                $('.alert-success').removeClass('none');
            });
    });

    $(document).on('click', '#remove-movie-filter', function(element) {
        let currentSelect = $('select').eq(0);
        currentSelect.prop('disabled', false);

        $('.alert-success').addClass('none');
        $('#edit-movie').addClass('none');
        $(this).remove();
    })
});
