document.addEventListener('DOMContentLoaded', function () {
    const loadingOverlay = document.querySelector('.loading-overlay');
    const container = document.querySelector('.container');
    const API_URL = 'https://script.google.com/macros/s/AKfycbyPa15xMDZutzk75Fj6-ITpwvx35C04sepRIKe4wikpH573JGK9ZYB-O2zVXUFTbKxn6g/exec';
    let apiData = []; // Store the API data globally

    // Get size elements
    // const sizeSlider = document.getElementById('sizeSlider');
    // const sizeValue = document.querySelector('.slider-value');

    // // Update size value display
    // function updateSizeValue() {
    //     const cm = sizeSlider.value;
    //     const inches = (cm * 0.393701).toFixed(1);
    //     sizeValue.textContent = `${cm} cm (${inches} inches)`;
    // }

    // // Add size slider event listener
    // sizeSlider.addEventListener('input', updateSizeValue);

    // Initial size value update
    // updateSizeValue();

    // Function to update available options
    function updateAvailableOptions() {
        const selectedCountry = $('select').first().val();
        const selectedStyle = $('select').eq(1).val();


        if (selectedCountry && selectedStyle) {
            const relevantData = apiData.filter(item =>
                item[0] === selectedCountry &&
                item[1] === selectedStyle
            );

            if (relevantData.length > 0) {
                // Check for available colors
                const hasBlack = relevantData.some(item => item[3] === "Black");
                const hasColor = relevantData.some(item => item[3] !== "Black");

                // Show/hide color options
                // if (!hasBlack) {
                //     $('#bw').closest('.color-option').hide();
                // } else {
                //     $('#bw').closest('.color-option').show();
                // }
                if (!hasBlack) {
                    $('#bw').closest('.color-option').find('input').prop('disabled', true);
                } else {
                    $('#bw').closest('.color-option').find('input').prop('disabled', false);
                }

                if (!hasColor) {
                    $('#color').closest('.color-option').find('input').prop('disabled', true);
                } else {
                    $('#color').closest('.color-option').find('input').prop('disabled', false);
                }



                const tiny_size = relevantData.some(item => parseInt(item[7]) >= 0 && parseInt(item[7]) <= 5);
                const small_size = relevantData.some(item => parseInt(item[7]) >= 5 && parseInt(item[7]) <= 10);
                const medium_size = relevantData.some(item => parseInt(item[7]) >= 10 && parseInt(item[7]) <= 20);
                const large_size = relevantData.some(item => parseInt(item[7]) >= 20 && parseInt(item[7]) <= 40);

                if (!tiny_size) {
                    $('#sizeSelect option[value="0-5"]').prop('disabled', true)
                } else {
                    $('#sizeSelect option[value="0-5"]').prop('disabled', false)
                }

                if (!small_size) {
                    $('#sizeSelect option[value="5-10"]').prop('disabled', true)
                } else {
                    $('#sizeSelect option[value="5-10"]').prop('disabled', false)
                }

                if (!medium_size) {
                    $('#sizeSelect option[value="10-20"]').prop('disabled', true)
                } else {
                    $('#sizeSelect option[value="10-20"]').prop('disabled', false)
                }

                if (!large_size) {
                    $('#sizeSelect option[value="20-40"]').prop('disabled', true)
                } else {
                    $('#sizeSelect option[value="20-40"]').prop('disabled', false)
                }
                $('#sizeSelect option:not([disabled]):first').prop('selected', true);
                toolTip();







                // Get size range
                // const sizes = relevantData.map(item => parseInt(item[7]));
                // const minSize = Math.min(...sizes);
                // const maxSize = Math.max(...sizes);

                // // Update size slider
                // sizeSlider.min = minSize;
                // sizeSlider.max = maxSize;
                // sizeSlider.value = minSize;
                // updateSizeValue();

                // Check for available experience levels
                const experiences = relevantData.map(item => parseInt(item[9]));
                const hasBeginnerExp = experiences.some(exp => exp <= 2);
                const hasIntermediateExp = experiences.some(exp => exp > 2 && exp <= 5);
                const hasExpertExp = experiences.some(exp => exp > 5);

                // Show/hide experience options
                if (!hasBeginnerExp) {
                    $('#beginner').prop('disabled', true);
                    $('#beginner').closest('.experience-option').find('.exp-status').text('Not available');
                } else {
                    $('#beginner').prop('disabled', false);
                    $('#beginner').closest('.experience-option').find('.exp-status').text('');
                }


                if (!hasIntermediateExp) {
                    $('#intermediate').prop('disabled', true);
                    $('#intermediate').closest('.experience-option').find('.exp-status').text('Not available');
                } else {
                    $('#intermediate').prop('disabled', false);
                    $('#intermediate').closest('.experience-option').find('.exp-status').text('');
                }


                if (!hasExpertExp) {
                    $('#expert').prop('disabled', true);
                    $('#expert').closest('.experience-option').find('.exp-status').text('Not available');
                } else {
                    $('#expert').prop('disabled', false);
                    $('#expert').closest('.experience-option').find('.exp-status').text('');
                }



                // Select the first available experience option
                if ($('.experience-option:visible').length > 0) {
                    $('input[name="experience"]:not([disabled]):first').prop('checked', true);
                }

                // Select first available option if current selection is hidden
                if ($('.color-option:visible').length > 0) {
                    $('input[name="color"]:not([disabled]):first').prop('checked', true);
                }

            } else {
                // If no relevant data found, reset the price display
                const priceDisplay = document.querySelector('.price-display h2');
                priceDisplay.textContent = 'Est. Price Range: €0 - €0';
            }
        }
    }

    // Fetch data and populate dropdowns
    $.get(API_URL, function (response) {
        apiData = response.data; // Store the data

        // Populate country dropdown
        const countryData = response.country;
        const countrySelect = $('select').first();
        const defaultCountryOption = countrySelect.find('option').first();

        countrySelect.empty().append(defaultCountryOption);

        for (var i = 0; i < countryData.length; i++) {
            if (countryData[i][0] != "" && countryData[i][0] != null) {
                countrySelect.append(
                    $('<option>', {
                        value: countryData[i][0],
                        'data-id': i,
                        text: countryData[i][0]
                    })
                );
            }
        }

        // Populate style dropdown
        const styleData = response.style;
        const styleSelect = $('select').eq(1);
        const defaultStyleOption = styleSelect.find('option').first();

        styleSelect.empty().append(defaultStyleOption);

        for (var i = 0; i < styleData.length; i++) {
            if (styleData[i][0] != "" && styleData[i][0] != null) {
                styleSelect.append(
                    $('<option>', {
                        value: styleData[i][0],
                        'data-id': i,
                        text: styleData[i][0]
                    })
                );
            }
        }

        // Add change event listeners
        $('.select').on('change', function () {
            updateAvailableOptions();
            calculateEstimatedPrice();
        });
        $('input[name="color"], #sizeSelect, .experience-option').on('change', function () {
            toolTip()
            calculateEstimatedPrice();
        });

        // Hide loading overlay
        loadingOverlay.style.opacity = '0';
        container.classList.add('visible');
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    })
        .fail(function (error) {
            console.error('Error fetching data:', error);
            loadingOverlay.style.opacity = '0';
            container.classList.add('visible');
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        });

    // Calculate estimated price range
    function calculateEstimatedPrice() {
        const selectedCountry = $('select').first().val();
        const selectedStyle = $('select').eq(1).val();
        const selectedColor = $('input[name="color"]:checked').val();
        const selectedSize = $('#sizeSelect').find(":selected").val().split('-');
        const selectedExperience = $('input[name="experience"]:checked').val();


        const priceDisplay = document.querySelector('.price-display h2');

        // Only calculate if both country and style are selected
        if (selectedCountry && selectedStyle) {
            // Filter data based on selected country, style, color, size, and experience
            const relevantData = apiData.filter(item =>
                item[0] === selectedCountry &&
                item[1] === selectedStyle &&

                (selectedColor === "black" ? item[3] === "Black" : item[3] !== "Black") &&
                (parseInt(selectedSize[0]) <= parseInt(item[7]) && parseInt(selectedSize[1]) >= parseInt(item[7])) &&
                ((parseInt(selectedExperience) == 2 && parseInt(item[9]) <= 2) ||
                    (parseInt(selectedExperience) == 5 && parseInt(item[9]) >= 2 && parseInt(item[9]) <= 5) ||
                    (parseInt(selectedExperience) == 6 && parseInt(item[9]) >= 5))

            );

            console.log(relevantData);

            if (relevantData.length > 0) {
                // Get minimum and maximum prices
                const minPrices = relevantData.map(item => parseInt(item[5]));
                const maxPrices = relevantData.map(item => parseInt(item[6]));

                // Calculate averages
                const avgMinPrice = Math.round(minPrices.reduce((a, b) => a + b) / minPrices.length);
                const avgMaxPrice = Math.round(maxPrices.reduce((a, b) => a + b) / maxPrices.length);

                // Update price display
                priceDisplay.textContent = `Est. Price Range: €${avgMinPrice} - €${avgMaxPrice}`;

                console.log({
                    country: selectedCountry,
                    style: selectedStyle,
                    minPrice: avgMinPrice,
                    maxPrice: avgMaxPrice,
                    matchingRows: relevantData,
                    dataPoints: relevantData.length
                });
            } else {
                priceDisplay.textContent = 'Est. Price Range: €0 - €0';
                console.log('No data found for:', {
                    country: selectedCountry,
                    style: selectedStyle
                });
            }
        } else {
            priceDisplay.textContent = 'Est. Price Range: €0 - €0';
        }
    }

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
        priceDisplay.textContent = 'Est. Price Range: €0 - €0';

        // Optionally, you can also call updateAvailableOptions to reset any dependent fields
        updateAvailableOptions();
    });
});

function toolTip() {
    if ($('#sizeSelect').find(":selected").val() == "0-5") {
        $('#sizeTooltip').text("Small symbols, minimalistic designs, initials, small symbols like stars or hearts.");
    } else if ($('#sizeSelect').find(":selected").val() == "5-10") {
        $('#sizeTooltip').text("Small quotes, delicate florals, simple designs that fit on wrists, ankles, or behind the ear.");
    } else if ($('#sizeSelect').find(":selected").val() == "10-20") {
        $('#sizeTooltip').text("More detailed designs, such as small portraits, animal tattoos, or larger symbols like anchors or roses on the forearm or calf.");
    } else if ($('#sizeSelect').find(":selected").val() == "20-40") {
        $('#sizeTooltip').text("Full arm pieces, intricate nature designs, larger portraits, or detailed sleeves.");
    }
}



