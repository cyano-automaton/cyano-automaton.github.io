w = window.innerWidth;
h = window.innerHeight;
/*
if (w > h) {
  let u = w/64;
}

if (w < h) {
  let u = w/30;
}*/

u = 20;

let right_now;
let last24 = [];
let last7 = [];

let canvas_height = 2000;

function TitleWithTimeOrDate(title, timeordate) {
  let graph_width = width - u * 4;
  let graph_height = graph_width * 720 / 1280;
  fill(255, 128, 0);
  noStroke();
  textAlign(LEFT);
  text(title, 2 * u, -graph_height - u)
  textAlign(RIGHT);
  if (timeordate == "time") {
    noStroke();
    text(time24[0] + "—" + time24[1] + " " + date24, graph_width + 2 * u, -graph_height - u)
  }
  if (timeordate == "date") {
    noStroke();
    text(date7[0] + "—" + date7[1], graph_width + 2 * u, -graph_height - u)
  }
}

function draw24Graph(param, min, max) {
  let graph_width = width - u * 4;
  let graph_height = graph_width * 720 / 1280;
  push();
  translate(2 * u, 0);
  noFill();
  beginShape();
  for (i = 0; i < last24.length; i++) {
    vertex((graph_width / last24.length) * i, -map(last24[i][param], min, max, 0, graph_height));
  }
  endShape();
  pop();
}

function draw7Graph(param, min, max) {
  let graph_width = width - u * 4;
  let graph_height = graph_width * 720 / 1280;
  push();
  translate(2 * u, 0);
  noFill();
  beginShape();
  for (i = 0; i < last7.length; i++) {
    vertex((graph_width / last7.length) * i, -map(last7[i][param], min, max, 0, graph_height));
  }
  endShape();
  pop();
}

function axisLeft7(min, max, step, title) {
  let graph_width = width - u * 4;
  let graph_height = graph_width * 720 / 1280;
  push()
  translate(2 * u, 0);

  push();
  noStroke();
  textAlign(RIGHT);
  rotate(-PI / 2);
  text(title, graph_height, -u / 2);
  pop();

  fill(224, 192, 192);
  stroke(224, 192, 192);
  strokeWeight(1);
  line(0, 0, 0, -graph_height);
  noStroke();
  textSize(u / 2);
  textAlign(LEFT)
  podzialka = (max - min) / step
  offset = graph_height / podzialka
  for (i = 0; i <= podzialka; i++) {
    noStroke();
    text(min + (step * i), 5, -offset * i - 5);
    stroke(224, 192, 192);
    line(0, -offset * i, u / 2, -offset * i)
  }
  pop()
}

function axisLeft24(min, max, step, title) {
  let graph_width = width - u * 4;
  let graph_height = graph_width * 720 / 1280;

  push()
  translate(2 * u, 0);

  push();
  noStroke();
  textAlign(RIGHT);
  rotate(-PI / 2);
  text(title, graph_height, -u / 2);
  pop();

  fill(224, 192, 192);
  stroke(224, 192, 192);
  strokeWeight(1);
  line(0, 0, 0, -graph_height);
  noStroke();


  textSize(u / 2);
  textAlign(LEFT)
  podzialka = (max - min) / step
  offset = graph_height / podzialka
  for (i = 0; i <= podzialka; i++) {
    noStroke();
    text(min + (step * i), 5, -offset * i - 5);
    stroke(224, 192, 192);
    line(0, -offset * i, graph_width, -offset * i)
  }
  pop()
}

function axisBottom24() {
  let graph_width = width - u * 4;
  let graph_height = graph_width * 720 / 1280;

  push()
  translate(2 * u, 0);
  fill(224, 192, 192);
  stroke(224, 192, 192);
  strokeWeight(1);
  line(0, 0, graph_width, 0);
  noStroke();
  textSize(u / 2);
  textAlign(LEFT)
  for (i = 0; i < last24.length; i = i + 12) {
    push();
    rotate(PI / 2);
    noStroke();
    text(last24[i].hour, u, -i * (graph_width / last24.length));
    pop();
    stroke(224, 192, 192);
    line(i * (graph_width / last24.length), 0, i * (graph_width / last24.length), 10)
  }
  pop()
}

function axisBottom7() {
  let graph_width = width - u * 4;
  let graph_height = graph_width * 720 / 1280;

  push()
  translate(2 * u, 0);
  fill(224, 192, 192);
  stroke(224, 192, 192);
  strokeWeight(1);
  line(0, 0, graph_width, 0);
  noStroke();
  textSize(u / 2);
  textAlign(LEFT)

  for (i = 0; i < last7.length; i = i + 48) {
    push();
    // rotate(PI / 2);
    noStroke();
    text(last7[i].day + "." + last7[i].month, i * (graph_width / last7.length) - 10, 2 * u / 3);
    pop();
    stroke(224, 192, 192);
    line(i * (graph_width / last7.length), 0, i * (graph_width / last7.length), -graph_height);
  }
  pop()
}

function toogle(title, order) {
  let graph_width = width - u * 4;
  let graph_height = graph_width * 720 / 1280;

  push();
  translate(u * 2 * order, u * 4);
  textAlign(CENTER);
  noStroke();
  text(title, 4 * u, u / 2);

  if (title == "Heater") {
    noFill();
    if (last24[last24.length - 1].temp - last24[last24.length - 2].temp > 0) {
      noFill();
      if (frameCount % 3 == 0) {
        fill(255, 128, 0);
      } else {
        fill(0);
      }
      stroke(224, 192, 192)
    }
    if (last24[last24.length - 1].temp - last24[last24.length - 2].temp < 0) {
      noFill();
      stroke(224, 192, 192)
    }
    circle(u * 4, 2 * u, u)

  }

  if (title == "Lamp") {

    if (hour() < 22 && hour() > 6) {
      if (frameCount % 3 == 1) {
        fill(255, 128, 0);
      } else {
        fill(0);
      }
      stroke(224, 192, 192)
    } else {
      noFill();
      stroke(224, 192, 192)
    }
    circle(u * 4, 2 * u, u)

  }

  if (title == "Air pump") {
    if (hour() < 22 && hour() > 6) {
      if (frameCount % 3 == 2) {
        fill(255, 128, 0);
      } else {
        fill(0);
      }
      stroke(224, 192, 192)
    } else {
      noFill();
      stroke(224, 192, 192)
    }
    circle(u * 4, 2 * u, u)
  }

  pop();
}
