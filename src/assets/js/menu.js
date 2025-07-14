$(document).ready(main);

var contador = 1;

function main() {
	// Botón menú movil
	$('.btn-menu').on("click", function() {
		if (contador == 1) {
			$('.menu__movil').animate({
				left: '0'
			});
			contador = 0;
		} else {
			contador = 1;
			$('.menu__movil').animate({
				left: '-100%'
			});
		}
	});

	// Ocultar menú
	$('.item-menu').click(function() {
		if (contador == 1) {
			$('.menu__movil').animate({
				left: '0'
			});
			$('.menu__movil').show();
			contador = 0;
		} else {
			contador = 1;
			$('.menu__movil').animate({
				left: '-100%'
			});
		}
	})

	

	if (window.matchMedia("(max-width: 1223px)").matches) {
  
        // Botón menú login
		$('.btn-user').on("click", function() {
			if (contador == 1) {
				$('.menu__desktop ul').animate({
					top: '38px'
				});
				contador = 0;
			} else {
				contador = 1;
				$('.menu__desktop ul').animate({
					top: '-400%'
				});
			}
		});

		// Ocultar login
		$('.item-login').click(function() {
			if (contador == 1) {
				$('.menu__desktop ul').animate({
					top: '38px'
				});
				contador = 0;
			} else {
				contador = 1;
				$('.menu__desktop ul').animate({
					top: '-400%'
				});
			}
		})

    }

}