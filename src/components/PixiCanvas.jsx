import * as PIXI from 'pixi.js';
import React from 'react';
import GameOverMessage from './GameOverMessage';
import './GameOverMessage.css';

const PixiCanvas = ({ castContext }) => {
  const canvasRef = React.useRef(null);
  const pixiAppRef = React.useRef(null);
  const spriteRef = React.useRef(null);
  const walkAnimRef = React.useRef(null);
  const isMovingRef = React.useRef(false);
  // const [posX, setPosX] = React.useState(30);
  //const [posY, setPosY] = React.useState(30);
  const [gameOver, setGameOver] = React.useState(false);

  React.useEffect(() => {
    const app = new PIXI.Application({
      view: canvasRef.current,
      width: 1285,
      height: 720,
      backgroundAlpha: 0,
    });

    pixiAppRef.current = app;

    const backgroundTexture = PIXI.Texture.from('/background.png');
    const backgroundSprite = new PIXI.Sprite(backgroundTexture);
    backgroundSprite.width = app.screen.width;
    backgroundSprite.height = app.screen.height;
    backgroundSprite.anchor.set(0);
    backgroundSprite.position.set(0, 0);
    app.stage.addChild(backgroundSprite);

    const createObstacle = (x, y, width, height) => {
      const obstacle = new PIXI.Graphics();
      obstacle.beginFill(0x000);
      obstacle.drawRect(x, y, width, height);
      obstacle.endFill();
      return obstacle;
    };

    const obstacles = [
      createObstacle(9, 500, 140, 30),
      createObstacle(300, 400, 150, 30),
      createObstacle(500, 600, 150, 50),
      createObstacle(550, 300, 200, 30),
      createObstacle(1130, 600, 150, 30),
      createObstacle(800, 450, 200, 30),
    ];
    obstacles.forEach(ob => app.stage.addChild(ob));

    const deathTriangle = (x, y, width, height) => {
      const triangle = new PIXI.Graphics();
      triangle.beginFill(0xff0000);
      triangle.moveTo(x + width / 2, y);
      triangle.lineTo(x, y + height);
      triangle.lineTo(x + width, y + height);
      triangle.lineTo(x + width / 2, y);
      triangle.endFill();
      return triangle;
    };

    const deathTriangles = [
      deathTriangle(350, 350, 50, 50),
      deathTriangle(699, 250, 50, 50),
      deathTriangle(899, 400, 50, 50),
      deathTriangle(1199, 550, 50, 50),
    ];
    deathTriangles.forEach(obt => app.stage.addChild(obt));

    const pressedKeys = new Set();
    let velocityY = 0;
    const gravity = 1;

    PIXI.Loader.shared
      .add("spritesheet", "/texture.json")
      .load((loader, resources) => {
        const sheet = resources["spritesheet"].spritesheet;

        // Walk animation
        const walkAnim = new PIXI.AnimatedSprite([
          sheet.textures["frame.png"],
          sheet.textures["frame-1.png"],
          sheet.textures["frame-2.png"]
        ]);
        walkAnim.animationSpeed = 0.2;
        walkAnim.loop = true;
        walkAnim.play();
        walkAnim.anchor.set(0.5, 1);
        walkAnim.x = 30;
        walkAnim.y = 455;
        app.stage.addChild(walkAnim);
        walkAnimRef.current = walkAnim;

        // Jump animation
        const jumpAnim = new PIXI.AnimatedSprite([
          sheet.textures["jump_up.png"],
          sheet.textures["jump_fall.png"]
        ]);
        jumpAnim.animationSpeed = 0.15;
        jumpAnim.loop = true;
        jumpAnim.play();
        jumpAnim.visible = false;
        jumpAnim.anchor.set(0.5, 1);
        jumpAnim.x = walkAnim.x;
        jumpAnim.y = walkAnim.y;
        app.stage.addChild(jumpAnim);

        spriteRef.current = walkAnim;
        let currentAnim = walkAnim;

        const switchAnim = (newAnim) => {
          if (currentAnim === newAnim) return;
          newAnim.x = currentAnim.x;
          newAnim.y = currentAnim.y;
          currentAnim.visible = false;
          newAnim.visible = true;
          spriteRef.current = newAnim;
          currentAnim = newAnim;
        };

        app.ticker.add(() => {
          const sprite = spriteRef.current;
          if (!sprite || gameOver) return;

          const step = 3;
          let moved = false;

          // Déplacement horizontal (même pendant le saut)
          if (pressedKeys.has("ArrowLeft")) {
            sprite.x -= step;
            sprite.scale.x = 1;
            moved = true;
          }

          if (pressedKeys.has("ArrowRight")) {
            sprite.x += step;
            sprite.scale.x = -1;
            moved = true;
          }

          isMovingRef.current = moved;

          const spriteBounds = sprite.getBounds();
          let landed = false;

          // Collision avec plateformes
          for (const obstacle of obstacles) {
            const bounds = obstacle.getBounds();
            const isTouching = (
              spriteBounds.x + spriteBounds.width > bounds.x &&
              spriteBounds.x < bounds.x + bounds.width &&
              spriteBounds.y + spriteBounds.height <= bounds.y + 10 &&
              spriteBounds.y + spriteBounds.height + velocityY >= bounds.y
            );

            if (isTouching) {
              velocityY = 0;
              sprite.y = bounds.y - sprite.height + sprite.height * sprite.anchor.y;
              landed = true;
              break;
            }
          }

          for (const deathTriangle of deathTriangles) {
            const bounds = deathTriangle.getBounds();
            const isTouchingTriangle = (
              spriteBounds.x + spriteBounds.width > bounds.x &&
              spriteBounds.x < bounds.x + bounds.width &&
              spriteBounds.y + spriteBounds.height > bounds.y &&
              spriteBounds.y < bounds.y + bounds.height
            );

            if (isTouchingTriangle) {
              sprite.visible = false;
              setGameOver(true);
              console.log("Le joueur est mort en touchant un triangle !");
              break;  // Sort de la boucle dès que le joueur meurt
            }
          }

          // Gravité et animation saut
          if (!landed) {
            velocityY += gravity;
            sprite.y += velocityY;
            switchAnim(jumpAnim);
          } else {
            if (!isMovingRef.current) {
              walkAnim.stop();
            } else {
              walkAnim.play();
            }
            switchAnim(walkAnim);
          }

          // Mort si tombe hors de l'écran
          if (sprite.y > app.screen.height + 100) {
            sprite.visible = false;
            setGameOver(true);
            console.log("Le joueur est mort !");
          }
        });


        // Gestion des touches
        window.addEventListener("keydown", (e) => {
          pressedKeys.add(e.key);

          // Saut
          if (e.key === "ArrowUp" && velocityY === 0) {
            velocityY = -25;
            switchAnim(jumpAnim);
          }
        });

        window.addEventListener("keyup", (e) => {
          pressedKeys.delete(e.key);
        });
      });

    // Nettoyage
    return () => {
      window.removeEventListener("keydown", () => { });
      window.removeEventListener("keyup", () => { });
    };
  }, []);
React.useEffect(() => {
  if (gameOver) {
    console.log('Game Over Triggered');
  }
}, [gameOver]);
  const restartGame = () => {
    setGameOver(false);
    // Réinitialise la position du sprite et d'autres variables de jeu ici
    spriteRef.current.visible = true;
    spriteRef.current.x = 30;
    spriteRef.current.y = 455;
  };

  // Cast integration
  React.useEffect(() => {
    if (!castContext) return;

    const CHANNEL = 'urn:x-cast:testChannel';
    castContext.addCustomMessageListener(CHANNEL, function (customEvent) {
      const pos = customEvent.data.msg.split(',');
      setPosX(pos[0]);
      setPosY(pos[1]);
      if (spriteRef.current) {
        spriteRef.current.x = pos[0] ?? spriteRef.current.x;
        spriteRef.current.y = pos[1] ?? spriteRef.current.y;
      }
    });
  }, [castContext]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef}></canvas>
      {gameOver && <GameOverMessage restartGame={restartGame} />}
    </div>
  );
};

export default PixiCanvas;
