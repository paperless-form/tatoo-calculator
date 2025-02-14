var data = [];
$(document).ready(function () {
    const loadingOverlay = document.querySelector('.loading-overlay');
    const container = document.querySelector('.container');

    $.get('https://script.google.com/macros/s/AKfycbyPa15xMDZutzk75Fj6-ITpwvx35C04sepRIKe4wikpH573JGK9ZYB-O2zVXUFTbKxn6g/exec', function (response) {

        // var countries = response.country;
        // for (var i = 0; i < countries.length; i++) {
        //     if (countries[i][0] != "" && countries[i][0] != null) {
        //         $('.country-select').append('<option value="' + countries[i][0] + '">' + countries[i][0] + '</option>');
        //     }
        // }

        var styles = response.style;
        for (var i = 0; i < styles.length; i++) {
            if (styles[i][0] != "" && styles[i][0] != null) {
                $('.style-select').append('<option value="' + styles[i][0] + '">' + styles[i][0] + '</option>');
            }
        }

        data = response.data;

        // Hide loading overlay
        loadingOverlay.style.opacity = '0';
        container.classList.add('visible');
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    });
});

function calculatePrice() {
    // const selectedCountry = $('.country-select').find(':selected').val();
    const selectedStyle = $('.style-select').find(':selected').val();
    const selectedColor = $('input[name="color"]:checked').val();
    const selectedSize = $('.size-select').find(":selected").val();
    const selectedExperience = $('input[name="experience"]:checked').val();


    const priceDisplay = document.querySelector('.price-display h2');

    // Only calculate if both country and style are selected
    if (selectedStyle) {
        // Filter data based on selected country, style, color, size, and experience
        const relevantData = data.filter(item =>
            (item[1] === selectedStyle || item[2].includes(selectedStyle)) &&

            (selectedColor === "black" ? item[3] === "Black" : item[3] !== "Black") &&
            (selectedSize == "0-5" ? parseInt(item[7]) >= parseInt(0) && parseInt(item[7]) <= parseInt(5) : selectedSize == "5-10" ? parseInt(item[7]) >= parseInt(5) && parseInt(item[7]) <= parseInt(10) : selectedSize == "10-20" ? parseInt(item[7]) >= parseInt(10) && parseInt(item[7]) <= parseInt(20) : selectedSize == "20-30" ? parseInt(item[7]) >= parseInt(20) && parseInt(item[7]) <= parseInt(30) : parseInt(item[7]) >= parseInt(30)) &&
            (selectedExperience == "2" ? parseInt(item[9]) <= parseInt(2) : selectedExperience == "5" ? parseInt(item[9]) >= parseInt(3) && parseInt(item[9]) <= parseInt(5) : parseInt(item[9]) >= parseInt(6))

        );

        if (relevantData.length > 0) {
            // Get minimum and maximum prices
            const minPrices = relevantData.map(item => parseInt(item[5]));
            const maxPrices = relevantData.map(item => parseInt(item[6]));

            // Calculate averages
            const avgMinPrice = Math.round(minPrices.reduce((a, b) => a + b) / minPrices.length);
            const avgMaxPrice = Math.round(maxPrices.reduce((a, b) => a + b) / maxPrices.length);

            // Update price display
            priceDisplay.textContent = `Est. Price Range: €${avgMinPrice} - €${avgMaxPrice}`;
        } else {
            priceDisplay.textContent = 'Est. Price Range: €0 - €0';
        }
    } else {
        priceDisplay.textContent = 'Est. Price Range: €0 - €0';
    }
}

function toolTip() {
    if ($('#sizeSelect').find(":selected").val() == "0-5") {
        $('#sizeTooltip').text("Small symbols, initials, tiny designs on fingers or behind the ear.");
    } else if ($('#sizeSelect').find(":selected").val() == "5-10") {
        $('#sizeTooltip').text("Wrist tattoos, small forearm designs, or ankle tattoos.");
    } else if ($('#sizeSelect').find(":selected").val() == "10-20") {
        $('#sizeTooltip').text("Forearm pieces, small shoulder tattoos, or medium-sized calf tattoos.");
    } else if ($('#sizeSelect').find(":selected").val() == "20-30") {
        $('#sizeTooltip').text("Half-sleeves, thigh tattoos, large chest pieces.");
    } else if ($('#sizeSelect').find(":selected").val() == "30+") {
        $('#sizeTooltip').text("Full sleeves, back pieces, or extensive leg tattoos.");
    }
}

$(document).on('change', '.style-select', function () {
    // var country = $('.country-select').find(':selected').val();
    var style = $('.style-select').find(':selected').val();
    var hasBlack = false, hasColor = false;
    if (style != "") {
        for (var i = 0; i < data.length; i++) {
            if ((data[i][1] == style || data[i][2].includes(style))) {
                if (data[i][3].trim() == "Black" && hasBlack == false) {
                    hasBlack = true;
                } else if (data[i][3].trim() != "Black" && hasColor == false) {
                    hasColor = true;
                }
            }
        }
        if (hasBlack) {
            $('#bw').closest('.color-option').find('input').prop('disabled', false);
        }
        else {
            $('#bw').closest('.color-option').find('input').prop('disabled', true);
        }

        if (hasColor) {
            $('#color').closest('.color-option').find('input').prop('disabled', false);
        }
        else {
            $('#color').closest('.color-option').find('input').prop('disabled', true);
        }

        if ($('input[name="color"]:not([disabled])').length > 0) {
            $('input[name="color"]:not([disabled]):first').prop('checked', true).trigger('change');
        }
        calculatePrice()
    }

});

$(document).on('change', 'input[name="color"]', function () {
    // var country = $('.country-select').find(':selected').val();
    var style = $('.style-select').find(':selected').val();
    var color = $('input[name="color"]:checked').val();
    var tiny_size = false, small_size = false, medium_size = false, large_size = false, extra_large_size = false;
    if (style != "" && color != undefined) {
        for (var i = 0; i < data.length; i++) {
            if ((data[i][1] == style || data[i][2].includes(style)) && (color == "black" ? data[i][3].trim() == "Black" : data[i][3].trim() != "Black")) {
                if (parseInt(data[i][7]) >= parseInt(30)) {
                    console.log(data[i])
                }
                if (parseInt(data[i][7]) >= 0 && parseInt(data[i][7]) <= 5 && tiny_size == false) {
                    tiny_size = true;
                } else if (parseInt(data[i][7]) >= 5 && parseInt(data[i][7]) <= 10 && small_size == false) {
                    small_size = true;
                } else if (parseInt(data[i][7]) >= 10 && parseInt(data[i][7]) <= 20 && medium_size == false) {
                    medium_size = true;
                } else if (parseInt(data[i][7]) >= 20 && parseInt(data[i][7]) <= 30 && large_size == false) {
                    large_size = true;
                } else if (parseInt(data[i][7]) >= 30 && extra_large_size == false) {
                    extra_large_size = true;
                }
            }
        }

        if (tiny_size) {
            $('.size-select').find('option[value="0-5"]').prop('disabled', false);
        } else {
            $('.size-select').find('option[value="0-5"]').prop('disabled', true);
        }

        if (small_size) {
            $('.size-select').find('option[value="5-10"]').prop('disabled', false);
        } else {
            $('.size-select').find('option[value="5-10"]').prop('disabled', true);
        }

        if (medium_size) {
            $('.size-select').find('option[value="10-20"]').prop('disabled', false);
        } else {
            $('.size-select').find('option[value="10-20"]').prop('disabled', true);
        }

        if (large_size) {
            $('.size-select').find('option[value="20-30"]').prop('disabled', false);
        } else {
            $('.size-select').find('option[value="20-30"]').prop('disabled', true);
        }

        if (extra_large_size) {
            $('.size-select').find('option[value="30+"]').prop('disabled', false);
        } else {
            $('.size-select').find('option[value="30+"]').prop('disabled', true);
        }

        if ($('.size-select').find('option:not([disabled])').length > 0) {
            $('.size-select').find('option:not([disabled]):first').prop('selected', true).trigger('change');
        }

        calculatePrice()
    }
});


$(document).on('change', '.size-select', function () {
    toolTip();
    var size = $('.size-select').find(':selected').val();
    // var country = $('.country-select').find(':selected').val();
    var style = $('.style-select').find(':selected').val();
    var color = $('input[name="color"]:checked').val();

    if (style != "" && color != undefined && size != "") {
        var min_size = parseInt(size.split('-')[0]);
        var max_size = (size.split('-')[1] == undefined ? undefined : parseInt(size.split('-')[1]));

        var beginner_experience = false, intermediate_experience = false, expert_experience = false;

        for (var i = 0; i < data.length; i++) {
            if ((data[i][1] == style || data[i][2].includes(style)) && (color == "black" ? data[i][3].trim() == "Black" : data[i][3].trim() != "Black") && (max_size != undefined ? parseInt(data[i][7]) >= min_size && parseInt(data[i][7]) <= max_size : parseInt(data[i][7]) >= min_size)) {
                if (parseInt(data[i][9]) >= 0 && parseInt(data[i][9]) <= 2 && beginner_experience == false) {
                    beginner_experience = true;
                } else if (parseInt(data[i][9]) >= 3 && parseInt(data[i][9]) <= 5 && intermediate_experience == false) {
                    intermediate_experience = true;
                } else if (parseInt(data[i][9]) >= 6 && expert_experience == false) {
                    console.log(data[i][9])
                    expert_experience = true;
                }
            }
        }

        if (!beginner_experience) {
            $('#beginner').prop('disabled', true);
            $('#beginner').closest('.experience-option').find('.exp-status').text('Not available');
        } else {
            $('#beginner').prop('disabled', false);
            $('#beginner').closest('.experience-option').find('.exp-status').text('');
        }

        if (!intermediate_experience) {
            $('#intermediate').prop('disabled', true);
            $('#intermediate').closest('.experience-option').find('.exp-status').text('Not available');
        } else {
            $('#intermediate').prop('disabled', false);
            $('#intermediate').closest('.experience-option').find('.exp-status').text('');
        }

        if (!expert_experience) {
            $('#expert').prop('disabled', true);
            $('#expert').closest('.experience-option').find('.exp-status').text('Not available');
        } else {
            $('#expert').prop('disabled', false);
            $('#expert').closest('.experience-option').find('.exp-status').text('');
        }

        if ($('input[name="experience"]:not([disabled])').length > 0) {
            $('input[name="experience"]:not([disabled]):first').prop('checked', true).trigger('change');
        }

        calculatePrice()
    }
});

$(document).on('change', 'input[name="experience"]', function () {
    calculatePrice();
});

// Add event listener for the Clear All button
document.querySelector('.clear-btn').addEventListener('click', function () {
    // Reset country and style dropdowns
    $('select').prop('selectedIndex', 0); // Reset to the first option

    // Reset color options
    $('input[name="color"]').prop('checked', false); // Uncheck all color options
    $('#bw').prop('checked', true); // Check the default color option (Black & Gray)

    // Reset experience options
    $('input[name="experience"]').prop('checked', false); // Uncheck all experience options
    $('#beginner').prop('checked', true); // Check the default experience option (Beginner)

    // Reset size slider
    // sizeSlider.value = sizeSlider.min; // Set slider to minimum value
    // updateSizeValue(); // Update the displayed size value

    // Reset price display
    const priceDisplay = document.querySelector('.price-display h2');
    priceDisplay.textContent = 'Select an Option to Reveal Pricing';

    $('#sizeTooltip').text("")
    $('.exp-status').text("")
});