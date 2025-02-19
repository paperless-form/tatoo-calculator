<script>
    var style = '', size = '', color = '', placement = '', beginner = '', intermediate = '', expert = '', fetching_data = '', selectedSize = '';
    const loadingOverlay = document.querySelector('.loading-overlay');
    const container = document.querySelector('.container');
    $(document).ready(function () {
        $('.dropify').dropify();

        // Handle image upload
        $('#tattooImage').on('change', function (event) {
            $('.price-display').addClass('d-none');
            $('.price-display h2').text('');

            fetching_data = data;
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = function () {
                const base64Image = reader.result.split(',')[1];
                $('.expert-artist').addClass('d-none');
                // Show loading state
                $('.ai-price-display h2').text('Analyzing image...');

                $.ajax({
                    url: 'https://script.google.com/macros/s/AKfycbyPa15xMDZutzk75Fj6-ITpwvx35C04sepRIKe4wikpH573JGK9ZYB-O2zVXUFTbKxn6g/exec',
                    type: 'POST',
                    data: {
                        image: base64Image
                    },
                    success: function (response) {
                        try {
                            const data = response.candidates[0].content.parts[0].text
                            updateUIWithResults(data.trim().replace(/^```json\n/, '').replace(/\n```$/, ''));
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                            $('.ai-price-display h2').text('Error analyzing photo. Please try again.');
                        }
                    },
                    error: function (error) {
                        console.error('Error:', error);
                        $('.ai-price-display h2').text('Error analyzing photo. Please try again.');
                    }
                });
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        });

        function updateUIWithResults(responseText) {
            // Parse the JSON string from the response text
            let data = responseText;
            const json_data = JSON.parse(responseText);

            const indexes = Object.entries(json_data);

            const values = indexes.map((subArray) => subArray[1]);

            style = '', size = '', color = '', placement = '', beginner = '', intermediate = '', expert = '';
            if (Array.isArray(values[0])) {
                style = values[0].join(', ')
                style = style.split(', ')[0].trim()
            }
            else {
                style = values[0]
            }

            if (Array.isArray(values[1])) {

                const size_indexes = Object.entries(values[1]);

                const size_values = size_indexes.map((subArray) => subArray[1]);
                size = size_values[0].split('-')[0].trim().replace('cm', '')
            }
            else if (values[1].toString().includes('-')) {
                size = values[1].split('-')[0].trim().replace('cm', '')
            }
            else if (values[1].toString().includes('x')) {
                size = values[1].split('x')[0].trim().replace('cm', '')
            }
            else if (Object.prototype.toString.call(values[1]) === '[object Object]') {
                const size_indexes = Object.entries(values[1]);

                const size_values = size_indexes.map((subArray) => subArray[1]);
                size = size_values[0].split('-')[0].trim().replace('cm', '')
                // size = size.split(', ')[0].trim().replace('cm', '')
            }
            else {
                size = values[1].toString().replace('cm', '')
            }

            if (Array.isArray(values[2])) {
                color = values[2].join(', ')
                color = color.split(', ')[0].trim()
            }
            else {
                color = values[2]
            }

            if (Array.isArray(values[3])) {
                placement = values[3].join(', ')
                placement = placement.split(', ')[0].trim()
            }
            else {
                placement = values[3]
            }

            console.log("size", size)
            if (parseInt(size) >= "0" && parseInt(size) <= "5") {
                console.log(parseInt(size) + " >" + parseInt(0) + " && " + parseInt(size) + " <=" + parseInt(5))
                selectedSize = "0-5";
            }
            else if (parseInt(size) >= "6" && parseInt(size) <= "10") {
                console.log(parseInt(size) + " >" + parseInt(6) + " && " + parseInt(size) + " <=" + parseInt(10))
                selectedSize = "5-10";
            }
            else if (parseInt(size) >= "11" && parseInt(size) <= "20") {
                console.log(parseInt(size) + " >" + parseInt(11) + " && " + parseInt(size) + " <=" + parseInt(20))
                selectedSize = "10-20";
            }
            else if (parseInt(size) >= "21" && parseInt(size) <= "30") {
                console.log(parseInt(size) + " >" + parseInt(21) + " && " + parseInt(size) + " <=" + parseInt(30))
                selectedSize = "20-30";
            }
            else if (parseInt(size) >= parseInt(31)) {
                console.log(parseInt(size) + " >" + parseInt(31))
                selectedSize = "30+";
            }

            $('.beginner-exp-status').text(``)
            $('.intermediate-exp-status').text(``)
            $('.expert-exp-status').text(``)
            $('.expert-artist').removeClass('d-none');

            // if (values[4]["Beginner (0-2 years)"]) {
            //     $('.expert-artist').removeClass('d-none');

            //     if (values[4]["Beginner (0-2 years)"].min) {
            //         $('.expert-artist').removeClass('d-none');
            //         $('.beginner-exp-status').text(`€` + `${values[4]["Beginner (0-2 years)"].min}` + ` - €` + `${values[4]["Beginner (0-2 years)"].max}`);
            //         $('.intermediate-exp-status').text(`€` + `${values[4]["Intermediate (3-5 years)"].min}` + ` - €` + `${values[4]["Intermediate (3-5 years)"].max}`);
            //         $('.expert-exp-status').text(`€` + `${values[4]["Expert (5+ years)"].min}` + ` - €` + `${values[4]["Expert (5+ years)"].max}`);
            //     }
            //     else {
            //         $('.expert-artist').removeClass('d-none');
            //         var beginner_min = values[4]["Beginner (0-2 years)"].split('-')[0].replace('$', '').replace('+', '').replace('USD', '');
            //         var beginner_max = values[4]["Beginner (0-2 years)"].split('-')[1].replace('$', '').replace('+', '').replace('USD', '');
            //         $('.beginner-exp-status').text(`€` + `${beginner_min}` + ` - €` + `${beginner_max}`);

            //         var intermediate_min = values[4]["Intermediate (3-5 years)"].split('-')[0].replace('$', '').replace('+', '').replace('USD', '');
            //         var intermediate_max = values[4]["Intermediate (3-5 years)"].split('-')[1].replace('$', '').replace('+', '').replace('USD', '');
            //         $('.intermediate-exp-status').text(`€` + `${intermediate_min}` + ` - €` + `${intermediate_max}`);

            //         var expert_min = values[4]["Expert (5+ years)"].split('-')[0].replace('$', '').replace('+', '').replace('USD', '');
            //         var expert_max = (values[4]["Expert (5+ years)"].split('-')[1] == undefined ? '' : values[4]["Expert (5+ years)"].split('-')[1].replace('$', '').replace('+', '').replace('USD', ''));
            //         expert_max == "" ? $('.expert-exp-status').text(`€` + `${expert_min}+`) : $('.expert-exp-status').text(`€` + `${expert_min}` + ` - €` + `${expert_max}`);
            //     }

            // }
            // else if (values[4]["Beginner"]) {
            //     $('.expert-artist').removeClass('d-none');

            //     if (values[4]["Beginner"].min) {
            //         $('.expert-artist').removeClass('d-none');
            //         $('.beginner-exp-status').text(`€` + `${values[4]["Beginner"].min}` + ` - €` + `${values[4]["Beginner"].max}`);
            //         $('.intermediate-exp-status').text(`€` + `${values[4]["Intermediate"].min}` + ` - €` + `${values[4]["Intermediate"].max}`);
            //         $('.expert-exp-status').text(`€` + `${values[4]["Expert"].min}` + ` - €` + `${values[4]["Expert"].max}`);
            //     }
            //     else {
            //         $('.expert-artist').removeClass('d-none');
            //         var beginner_min = values[4]["Beginner"].split('-')[0].replace('$', '').replace('+', '').replace('USD', '');
            //         var beginner_max = values[4]["Beginner"].split('-')[1].replace('$', '').replace('+', '').replace('USD', '');
            //         $('.beginner-exp-status').text(`€` + `${beginner_min}` + ` - €` + `${beginner_max}`);

            //         var intermediate_min = values[4]["Intermediate"].split('-')[0].replace('$', '').replace('+', '').replace('USD', '');
            //         var intermediate_max = values[4]["Intermediate"].split('-')[1].replace('$', '').replace('+', '').replace('USD', '');
            //         $('.intermediate-exp-status').text(`€` + `${intermediate_min}` + ` - €` + `${intermediate_max}`);

            //         var expert_min = values[4]["Expert"].split('-')[0].replace('$', '').replace('+', '').replace('USD', '');
            //         var expert_max = (values[4]["Expert"].split('-')[1] == undefined ? '' : values[4]["Expert"].split('-')[1].replace('$', '').replace('+', '').replace('USD', ''));
            //         expert_max == "" ? $('.expert-exp-status').text(`€` + `${expert_min}+`) : $('.expert-exp-status').text(`€` + `${expert_min}` + ` - €` + `${expert_max}`);
            //     }
            // }
            // if (Array.isArray(values[4])) {
            //     beginner = values[4].join(', ')
            // }
            // else {
            //     beginner = values[4]
            // }
            $('.ai-price-display h2').html(`
                <div>Style: ${style}</div>
                <div>Size: ${size}cm</div>
                <div>Color: ${color}</div>
                <div>Placement: ${placement}</div>  
            `);

            var min_size = parseInt(selectedSize.split('-')[0]);
            var max_size = (selectedSize.split('-')[1] == undefined ? undefined : parseInt(selectedSize.split('-')[1]));
            var beginner_experience = false, intermediate_experience = false, expert_experience = false;

            for (var i = 0; i < fetching_data.length; i++) {
                if ((fetching_data[i][1] == style || fetching_data[i][2].includes(style)) && (color.trim().toLowerCase() == "black" ? fetching_data[i][3].trim() == "Black" : fetching_data[i][3].trim() != "Black") && (max_size != undefined ? parseInt(fetching_data[i][7]) >= min_size && parseInt(fetching_data[i][7]) <= max_size : parseInt(fetching_data[i][7]) >= min_size)) {
                    if (parseInt(fetching_data[i][9]) >= 0 && parseInt(fetching_data[i][9]) <= 2 && beginner_experience == false) {
                        beginner_experience = true;
                    } else if (parseInt(fetching_data[i][9]) >= 3 && parseInt(fetching_data[i][9]) <= 5 && intermediate_experience == false) {
                        intermediate_experience = true;
                    } else if (parseInt(fetching_data[i][9]) >= 6 && expert_experience == false) {
                        console.log(fetching_data[i][9])
                        expert_experience = true;
                    }
                }
            }

            if (!beginner_experience) {
                $('#beginner').prop('disabled', true);
                $('#beginner').closest('.experience-option').find('.beginner-exp-status').text('Not available');
            } else {
                $('#beginner').prop('disabled', false);
                $('#beginner').closest('.experience-option').find('.beginner-exp-status').text('');
            }

            if (!intermediate_experience) {
                $('#intermediate').prop('disabled', true);
                $('#intermediate').closest('.experience-option').find('.intermediate-exp-status').text('Not available');
            } else {
                $('#intermediate').prop('disabled', false);
                $('#intermediate').closest('.experience-option').find('.intermediate-exp-status').text('');
            }

            if (!expert_experience) {
                $('#expert').prop('disabled', true);
                $('#expert').closest('.experience-option').find('.expert-exp-status').text('Not available');
            } else {
                $('#expert').prop('disabled', false);
                $('#expert').closest('.experience-option').find('.expert-exp-status').text('');
            }

            if ($('input[name="ai_experience"]:not([disabled])').length > 0) {
                $('input[name="ai_experience"]:not([disabled]):first').prop('checked', true).trigger('change');
            }

        }
    });

    $(document).on('change', 'input[name="ai_experience"]', function () {
        calculateAiPrice();
    })

    function calculateAiPrice() {
        // const selectedCountry = $('.country-select').find(':selected').val();
        const selectedStyle = style;
        const selectedColor = color.trim().toLowerCase();

        const selectedExperience = $('input[name="ai_experience"]:checked').val();

        const priceDisplay = document.querySelector('.price-display h2');
        $('.price-display ').removeClass('d-none');

        // // Only calculate if both country and style are selected
        if (selectedStyle) {
            // Filter data based on selected country, style, color, size, and experience
            const relevantData = fetching_data.filter(item =>
                (style == "Japanese Traditional" || style == "Neo-Japanese" ? item[1] == "Japanese Traditional" || item[1] == "Neo-Japanese" || item[2].includes("Japanese Traditional") || item[2].includes("Neo-Japanese") : style == "Old School (Traditional)" || style == "Neo-Traditional" ? item[1] == "Old School (Traditional)" || item[1] == "Neo-Traditional" || item[2].includes("Old School (Traditional)") || item[2].includes("Neo-Traditional") : style == "Anime & Manga" || style == "Cartoon & Comics" ? item[1] == "Anime & Manga" || item[1] == "Cartoon & Comics" || item[2].includes("Anime & Manga") || item[2].includes("Cartoon & Comics") : style == "Color" || style == "New School" ? item[1] == "Color" || item[1] == "New School" || item[2].includes("Color") || item[2].includes("New School") : style == "Blackwork" || style == "Black & Gray" || style == "Black" ? item[1] == "Blackwork" || item[1] == "Black & Gray" || item[1] == "Black" || item[2].includes("Blackwork") || item[2].includes("Black & Gray") || item[2].includes("Black") : item[1] === selectedStyle || item[2].includes(selectedStyle)) &&
                (selectedColor === "black" ? item[3].trim() === "Black" : item[3].trim() !== "Black") &&
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

    $(document).on('click', '.clear-btn-ai', function () {
        $('.price-display').addClass('d-none');
        $('.price-display h2').text('');
        $('.expert-artist').addClass('d-none');

        $('.ai-price-display h2').text('Upload Image to Reveal Pricing');
        $('.dropify-clear').trigger('click');
    })
</script>