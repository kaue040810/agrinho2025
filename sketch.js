let milhos = [];
let gotas = [];
let milhosIrrigados = 0;

function setup() {
  createCanvas(600, 400);

  for (let i = 0; i < 5; i++) {
    let x = 100 + i * 80;
    let y = height - 30;
    milhos.push(new Milho(x, y));
  }
}

function draw() {
  background(135, 206, 235); // céu azul

  fill(102, 204, 0); // chão verde
  rect(0, height - 20, width, 20);

  // Exibe e atualiza os milhos
  for (let i = milhos.length - 1; i >= 0; i--) {
    let milho = milhos[i];
    milho.show();
    milho.crescer();

    if (milho.fase > 3) {
      milhos.splice(i, 1); // Colhe o milho (remove)
    }
  }

  // Exibe e move as gotas
  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].fall();
    gotas[i].show();

    for (let j = 0; j < milhos.length; j++) {
      if (gotas[i] && gotas[i].hits(milhos[j])) {
        milhos[j].irrigar();
        gotas.splice(i, 1);
        break;
      }
    }

    if (i < gotas.length && gotas[i].y > height) {
      gotas.splice(i, 1);
    }
  }

  addGotas();

  // Exibe contador
  fill(255);
  textSize(20);
  textAlign(LEFT);
  text('Irrigados: ' + milhosIrrigados, 10, 30);
}

class Milho {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tamanho = 32;
    this.fase = 0;
    this.irrigado = false;
    this.crescendo = false;
    this.timerCrescimento = 0;
  }

  show() {
    textAlign(CENTER);
    textSize(this.tamanho);
    text(this.getEmojiPorFase(), this.x, this.y);
  }

  getEmojiPorFase() {
    switch (this.fase) {
      case 0: return '🌱';
      case 1: return '🌽';
      case 2: return '🌽';
      default: return ''; // Após colheita, nada é exibido
    }
  }

  irrigar() {
    if (!this.irrigado && this.fase < 3) {
      this.irrigado = true;
      this.crescendo = true;
      milhosIrrigados++;
    }
  }

  crescer() {
    if (this.crescendo) {
      this.timerCrescimento++;

      if (this.fase === 0 && this.timerCrescimento > 60) { // fase 1 após ~1s
        this.fase++;
        this.tamanho = 40;
        this.timerCrescimento = 0;
      } else if (this.fase === 1 && this.timerCrescimento > 90) { // fase 2
        this.fase++;
        this.tamanho = 55;
        this.timerCrescimento = 0;
      } else if (this.fase === 2 && this.timerCrescimento > 120) { // fase 3
        this.fase++;
        this.tamanho = 65;
        this.timerCrescimento = 0;
      } else if (this.fase === 3 && this.timerCrescimento > 60) { // colheita
        this.fase++;
        this.crescendo = false;
      }
    }
  }
}

class Gota {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vel = random(10, 16); // Mais rápida
  }

  fall() {
    this.y += this.vel;
  }

  show() {
    noStroke();
    fill(0, 100, 255, 180);
    ellipse(this.x, this.y, 6, 12);
  }

  hits(milho) {
    return (
      this.x > milho.x - 15 &&
      this.x < milho.x + 15 &&
      this.y > milho.y - 40 &&
      this.y < milho.y
    );
  }
}

function addGotas() {
  // CHUVA FORTE: adiciona várias gotas por frame
  if (frameCount % 2 === 0) {
    for (let i = 0; i < 8; i++) {
      gotas.push(new Gota(random(width), 0));
    }
  }
}
