$(() => {
  let anim_id;

  // Saving dom objects to variables
  const container = $('#container');
  const car = $('#car');
  const car_1 = $('#car_1');
  const car_2 = $('#car_2');
  const car_3 = $('#car_3');
  const line_1 = $('#line_1');
  const line_2 = $('#line_2');
  const line_3 = $('#line_3');
  const restart_div = $('#restart_div');
  const restart_btn = $('#restart');
  const score = $('#score');

  // Saving some initial setup
  const container_left = parseInt(container.css('left'));
  const container_width = parseInt(container.width());
  const container_height = parseInt(container.height());
  const car_width = parseInt(car.width());
  const car_height = parseInt(car.height());
  const audio = document.getElementById('track');
  audio.volume = 0.5;

  // Some other declarations
  let game_over = false;
  let score_counter = 1;
  let speed = 2;
  let line_speed = 5;
  let move_right = false;
  let move_left = false;
  let move_up = false;
  let move_down = false;

  // Hide the game elements initially
  $('#container').hide();
  $('#score_div').hide();
  $('#restart_div').hide();

  // Show game elements and start the game on button click
  $('#start_game').click(() => {
    $('#start_overlay').fadeOut(500, () => {
      $('#container').show();
      $('#score_div').show();
      initialize_game();
    });
  });

  const initialize_game = () => {
    score.text('0');
    speed = 2;
    line_speed = 5;
    score_counter = 1;
    game_over = false;
    car.css('left', '60%');
    car.css('top', '');
    car_1.css('top', '-100px');
    car_2.css('top', '-200px');
    car_3.css('top', '-350px');
    line_1.css('top', '-150px');
    line_2.css('top', '150px');
    line_3.css('top', '450px');
    start_game();
  };

  const start_game = () => {
    anim_id = requestAnimationFrame(repeat);
  };

  const stop_game = () => {
    game_over = true;
    cancelAnimationFrame(anim_id);
    cancelAnimationFrame(move_right);
    cancelAnimationFrame(move_left);
    cancelAnimationFrame(move_up);
    cancelAnimationFrame(move_down);
    $('#restart_div').slideDown();
    restart_btn.focus();
  };

  const left = () => {
    if (game_over === false && parseInt(car.css('left')) > 0) {
      car.css('left', parseInt(car.css('left')) - 5);
      move_left = requestAnimationFrame(left);
    }
  };

  const right = () => {
    if (game_over === false && parseInt(car.css('left')) < container_width - car_width) {
      car.css('left', parseInt(car.css('left')) + 5);
      move_right = requestAnimationFrame(right);
    }
  };

  const up = () => {
    if (game_over === false && parseInt(car.css('top')) > 0) {
      car.css('top', parseInt(car.css('top')) - 3);
      move_up = requestAnimationFrame(up);
    }
  };

  const down = () => {
    if (game_over === false && parseInt(car.css('top')) < container_height - car_height) {
      car.css('top', parseInt(car.css('top')) + 3);
      move_down = requestAnimationFrame(down);
    }
  };

  const repeat = () => {
    if (collision(car, car_1) || collision(car, car_2) || collision(car, car_3)) {
      stop_game();
      return;
    }

    score_counter++;

    if (score_counter % 20 == 0) {
      score.text(parseInt(score.text()) + 1);
    }
    if (score_counter % 500 == 0) {
      speed++;
      line_speed++;
    }

    car_down(car_1);
    car_down(car_2);
    car_down(car_3);

    line_down(line_1);
    line_down(line_2);
    line_down(line_3);

    anim_id = requestAnimationFrame(repeat);
  };

  const car_down = (car) => {
    let car_current_top = parseInt(car.css('top'));
    if (car_current_top > container_height) {
      car_current_top = -200;
      const car_left = parseInt(Math.random() * (container_width - car_width));
      car.css('left', car_left);
    }
    car.css('top', car_current_top + speed);
  };

  const line_down = (line) => {
    let line_current_top = parseInt(line.css('top'));
    if (line_current_top > container_height) {
      line_current_top = -300;
    }
    line.css('top', line_current_top + line_speed);
  };

  const collision = ($div1, $div2) => {
    const x1 = $div1.offset().left;
    const y1 = $div1.offset().top;
    const h1 = $div1.outerHeight(true);
    const w1 = $div1.outerWidth(true);
    const b1 = y1 + h1;
    const r1 = x1 + w1;
    const x2 = $div2.offset().left;
    const y2 = $div2.offset().top;
    const h2 = $div2.outerHeight(true);
    const w2 = $div2.outerWidth(true);
    const b2 = y2 + h2;
    const r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
  };

  $(document).on('keydown', (e) => {
    if (game_over === false) {
      const key = e.keyCode;
      if (key === 37 && move_left === false) {
        move_left = requestAnimationFrame(left);
      } else if (key === 39 && move_right === false) {
        move_right = requestAnimationFrame(right);
      } else if (key === 38 && move_up === false) {
        move_up = requestAnimationFrame(up);
      } else if (key === 40 && move_down === false) {
        move_down = requestAnimationFrame(down);
      }
    }
  });

  $(document).on('keyup', (e) => {
    if (game_over === false) {
      const key = e.keyCode;
      if (key === 37) {
        cancelAnimationFrame(move_left);
        move_left = false;
      } else if (key === 39) {
        cancelAnimationFrame(move_right);
        move_right = false;
      } else if (key === 38) {
        cancelAnimationFrame(move_up);
        move_up = false;
      } else if (key === 40) {
        cancelAnimationFrame(move_down);
        move_down = false;
      }
    }
  });

  // Restart game functionality
  restart_btn.click(() => {
    $('#restart_div').slideUp();
    initialize_game();
  });
});