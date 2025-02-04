document.addEventListener('DOMContentLoaded', function () {
    // Get elements
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeValue = document.querySelector('.slider-value');
    const colorOptions = document.querySelectorAll('input[name="color"]');
    const experienceButtons = document.querySelectorAll('.experience-btn');
    const clearButton = document.querySelector('.clear-btn');
    const priceDisplay = document.querySelector('.price-display h2');
    const selects = document.querySelectorAll('select');

    // Base price configuration
    const priceConfig = {
        basePrice: 50,
        sizeMultiplier: 5,
        colorMultiplier: {
            bw: 1,
            color: 1.5
        },
        experienceMultiplier: {
            'Beginner (0-2 years)': 1,
            'Intermediate (2-5 years)': 1.5,
            'Expert (5+ years)': 2
        }
    };

    // Update size value display
    function updateSizeValue() {
        const cm = sizeSlider.value;
        const inches = (cm * 0.393701).toFixed(1);
        sizeValue.textContent = `${cm} cm (${inches}")`;
        calculatePrice();
    }

    // Calculate and update price
    function calculatePrice() {
        // Get current values
        const size = parseInt(sizeSlider.value);
        const colorType = document.querySelector('input[name="color"]:checked').id;
        const experienceLevel = document.querySelector('.experience-btn.active').textContent;

        // Calculate price
        let price = priceConfig.basePrice + (size * priceConfig.sizeMultiplier);
        price *= priceConfig.colorMultiplier[colorType];
        price *= priceConfig.experienceMultiplier[experienceLevel];

        // Add range of ±20%
        const minPrice = Math.round(price * 0.8);
        const maxPrice = Math.round(price * 1.2);

        // Update price display
        priceDisplay.textContent = `Est. Price Range: €${minPrice} - €${maxPrice}`;
    }

    // Event listeners
    sizeSlider.addEventListener('input', updateSizeValue);

    colorOptions.forEach(option => {
        option.addEventListener('change', calculatePrice);
    });

    experienceButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            experienceButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            calculatePrice();
        });
    });

    selects.forEach(select => {
        select.addEventListener('change', calculatePrice);
    });

    // Clear all function
    clearButton.addEventListener('click', function () {
        // Reset selects
        selects.forEach(select => {
            select.selectedIndex = 0;
        });

        // Reset color
        document.getElementById('bw').checked = true;

        // Reset size
        sizeSlider.value = 5;
        updateSizeValue();

        // Reset experience
        experienceButtons.forEach(btn => btn.classList.remove('active'));
        experienceButtons[0].classList.add('active');

        // Recalculate price
        calculatePrice();
    });

    // Initial calculation
    updateSizeValue();
}); 