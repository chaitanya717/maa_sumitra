(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.nav-bar').addClass('sticky-top');
        } else {
            $('.nav-bar').removeClass('sticky-top');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 24,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            992:{
                items:2
            }
        }
    });
    
})(jQuery);



const config = {
    slidesToShow: 5,
    centerMode: true,
    gap: 20,
  };

  const images = [
    { id: 0, label: 'Jehanabad', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiCA5b2oBiM2fgU0vPcevpU3lBUajFNXAE01yzW4u5WRE2OSocF-GY_yq8_gRYT60BKRo&usqp=CAU' },
    { id: 1, label: 'Patna', src: 'https://s7ap1.scene7.com/is/image/incredibleindia/gol-ghar-patna-bihar-gol-ghar-city-ff?qlt=82&ts=1742186424384' },
    { id: 2, label: 'Gaya', src: 'https://www.goindigo.in/content/dam/s6web/in/en/assets/Destinations/destinations/gaya/Mahabodhi%20Temple%20Large.jpeg' },
    { id: 3, label: 'Rajgir', src: 'https://www.bihartrip.com/pub/media/destination/rajgir/places_to_visit_in_Rajgir_glass_bridge_8_.jpg' },
    { id: 4, label: 'Jharkhand', src: 'https://www.godigit.com/content/dam/godigit/directportal/en/contenthm/jharkhand-famous-for.jpg' },
    { id: 5, label: 'Gujrat', src: 'https://www.financialexpress.com/wp-content/uploads/2019/03/SMART-CITY.jpg' }
  ];

  const track = document.getElementById('sliderTrack');
  let currentLogicalIndex = 0;
  let currentPhysicalIndex = 0;
  let slides = [];
  let isTransitioning = false;

  let sideSlideSize = 0;
  let centerSlideSize = 0;
  let isMobile = window.innerWidth <= 768;

  function calculateWidths() {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const containerSize = isMobile ? sliderWrapper.offsetHeight : sliderWrapper.offsetWidth;
    const totalGaps = config.gap * (config.slidesToShow - 1);
    const availableSize = containerSize - totalGaps;

    if (config.centerMode) {
      centerSlideSize = availableSize * 0.4;
      sideSlideSize = (availableSize - centerSlideSize) / (config.slidesToShow - 1);
    } else {
      sideSlideSize = availableSize / config.slidesToShow;
      centerSlideSize = sideSlideSize;
    }
  }

  function createSlide(item) {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.dataset.label = item.label;
    slide.dataset.id = item.id;
    slide.innerHTML = `<img src="${item.src}" alt="${item.label}">`;
    return slide;
  }

  function buildInfiniteTrack() {
    track.innerHTML = '';
    calculateWidths();
    const repeatCount = 20;

    for (let rep = 0; rep < repeatCount; rep++) {
      images.forEach(item => {
        const slide = createSlide(item);
        track.appendChild(slide);
      });
    }

    slides = Array.from(track.children);
    currentPhysicalIndex = Math.floor(slides.length / 2);
    currentLogicalIndex = currentPhysicalIndex % images.length;
    applyWidths();
  }

  function applyWidths() {
    slides.forEach((slide, index) => {
      const isCenter = index === currentPhysicalIndex && config.centerMode;
      const size = isCenter ? centerSlideSize : sideSlideSize;

      if (isMobile) {
        slide.style.height = `${size}px`;
        slide.style.marginTop = '0px';
        slide.style.marginBottom = `${config.gap}px`;
      } else {
        slide.style.width = `${size}px`;
        slide.style.height = '300px';
        slide.style.marginLeft = '0px';
        slide.style.marginRight = `${config.gap}px`;
      }
    });

    if (slides.length > 0) {
      if (isMobile) {
        slides[slides.length - 1].style.marginBottom = '0px';
      } else {
        slides[slides.length - 1].style.marginRight = '0px';
      }
    }
  }

  function getCenterOffset(slideIndex) {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const containerCenter = isMobile ? sliderWrapper.offsetHeight / 2 : sliderWrapper.offsetWidth / 2;
    let offset = 0;

    for (let i = 0; i < slideIndex; i++) {
      const size = (i === currentPhysicalIndex) ? centerSlideSize : sideSlideSize;
      offset += size + config.gap;
    }

    const currentSize = (slideIndex === currentPhysicalIndex) ? centerSlideSize : sideSlideSize;
    offset += currentSize / 2;

    return offset - containerCenter;
  }

  function updateSlider(animate = true) {
    if (isTransitioning && animate) return;
    applyWidths();

    slides.forEach(slide => slide.classList.remove('active'));
    if (slides[currentPhysicalIndex] && config.centerMode) {
      slides[currentPhysicalIndex].classList.add('active');
    }

    const offset = getCenterOffset(currentPhysicalIndex);
    const direction = isMobile ? 'translateY' : 'translateX';
    track.style.transition = animate ? 'transform 0.6s ease' : 'none';
    track.style.transform = `${direction}(-${offset}px)`;

    if (animate) {
      isTransitioning = true;
      setTimeout(() => {
        isTransitioning = false;
        resetPositionIfNeeded();
      }, 600);
    }
  }

  function resetPositionIfNeeded() {
    const resetThreshold = images.length * 2;
    const middlePosition = Math.floor(slides.length / 2);
    if (currentPhysicalIndex < resetThreshold || currentPhysicalIndex > slides.length - resetThreshold) {
      const targetLogical = currentLogicalIndex;
      currentPhysicalIndex = middlePosition + (targetLogical - (middlePosition % images.length));
      updateSlider(false);
    }
  }

  function nextSlide() {
    if (isTransitioning) return;
    currentPhysicalIndex++;
    currentLogicalIndex = (currentLogicalIndex + 1) % images.length;
    updateSlider(true);
  }

  function prevSlide() {
    if (isTransitioning) return;
    currentPhysicalIndex--;
    currentLogicalIndex = (currentLogicalIndex - 1 + images.length) % images.length;
    updateSlider(true);
  }

  function bindEvents() {
    document.querySelector('.next-button').addEventListener('click', nextSlide);
    document.querySelector('.prev-button').addEventListener('click', prevSlide);

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide();
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevSlide();
    });

    window.addEventListener('resize', () => {
      isMobile = window.innerWidth <= 768;
      calculateWidths();
      applyWidths();
      updateSlider(false);
    });
  }

  buildInfiniteTrack();
  updateSlider(false);
  bindEvents();

  // Create a lightbox
(function() {
  var $lightbox = $("<div class='lightbox'></div>");
  var $img = $("<img>");
  var $caption = $("<p class='caption'></p>");

  // Add image and caption to lightbox

  $lightbox
    .append($img)
    .append($caption);

  // Add lighbox to document

  $('body').append($lightbox);

  $('.lightbox-gallery img').click(function(e) {
    e.preventDefault();

    // Get image link and description
    var src = $(this).attr("data-image-hd");
    var cap = $(this).attr("alt");

    // Add data to lighbox

    $img.attr('src', src);
    $caption.text(cap);

    // Show lightbox

    $lightbox.fadeIn('fast');

    $lightbox.click(function() {
      $lightbox.fadeOut('fast');
    });
  });

}());