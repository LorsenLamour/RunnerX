import * as PIXI from 'pixi.js';
import React, { useEffect } from 'react';
import GameOverMessage from './GameOverMessage';
import './GameOverMessage.css';
import CountdownTimer from './CountdownTimer';
import VictoryMessage from './VictoryMessage';


const PixiCanvas = ({ castContext }) => {
  const canvasRef = React.useRef(null);
  const pixiAppRef = React.useRef(null);
  const spriteRef = React.useRef(null);
  const walkAnimRef = React.useRef(null);
  const isMovingRef = React.useRef(false);
    const messageRef = React.useRef(null); 
  // const [posX, setPosX] = React.useState(30);
  //const [posY, setPosY] = React.useState(30);
  const [gameOver, setGameOver] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(60);
  const [hasWon, setHasWon] = React.useState(false);
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
      deathTriangle(350, 350, 50, 50),// Version B pour le test A/B on met en commentaire les positions des triangles pour faciliter le nv.
      //deathTriangle(370, 350, 50, 50), // Cette position reste en commentaire pour la version difficile du jeu.
      deathTriangle(699, 250, 50, 50),
      deathTriangle(899, 400, 50, 50),
      //deathTriangle(1129, 550, 50, 50), // Version B pour le test A/B on met en commentaire les positions des triangles pour faciliter le nv.
    ];
    deathTriangles.forEach(obt => app.stage.addChild(obt));

    const pressedKeys = new Set();
    let velocityY = 0;
    const gravity = 1;

    PIXI.Loader.shared
      .add("spritesheet", "/texture.json")
      .add("portal", "/portal.png")
      .load((loader, resources) => {
        const sheet = resources["spritesheet"].spritesheet;


        const portalTexture = resources["portal"].texture;
        const portalSprite = new PIXI.Sprite(portalTexture);
        portalSprite.x = 1260;
        portalSprite.y = 565;
        portalSprite.width = 70;
        portalSprite.height = 70;
        portalSprite.anchor.set(0.5);
        app.stage.addChild(portalSprite);


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

          if (!hasWon) {
            const portalBounds = portalSprite.getBounds();
            const isTouchingPortal = (
              spriteBounds.x + spriteBounds.width > portalBounds.x &&
              spriteBounds.x < portalBounds.x + portalBounds.width &&
              spriteBounds.y + spriteBounds.height > portalBounds.y &&
              spriteBounds.y < portalBounds.y + portalBounds.height
            );

            if (isTouchingPortal) {
              setHasWon(true);
              setGameOver(true);
              console.log("Victoire !");
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


    return () => {
      window.removeEventListener("keydown", () => { });
      window.removeEventListener("keyup", () => { });
    };
  }, []);
  React.useEffect(() => {
    if (gameOver) {
      console.log('Game Over');
    }
  }, [gameOver]);

  React.useEffect(() => {
    if (gameOver) return; // Ne pas décrémenter si le joueur est mort

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true); // Fin du jeu si temps écoulé
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  const restartGame = () => {
    setGameOver(false);
    setTimeLeft(60);
    setHasWon(false);
    // Réinitialise la position du sprite et d'autres variables de jeu ici
    spriteRef.current.visible = true;
    spriteRef.current.x = 30;
    spriteRef.current.y = 455;
  };

  // Cast integration
  React.useEffect(() => {
    if (!castContext) return;
    const CHANNEL = 'urn:x-cast:testChannel';

    React.useEffect(() => {
      if (!castContext) return;

      const listener = castContext.addCustomMessageListener(CHANNEL, function (customEvent) {
      const messageRecu = {message: "Position recue", position: customEvent.data.msg};
      castContext.sendCustomMessageListener(CHANNEL,undefined,messageRecu) 
      const msg = JSON.parse(customEvent.data).msg;
        switch (msg) {
          case "jump":
            if (velocityY === 0) {
              velocityY = -25;
              switchAnim(jumpAnim);
            }
            break;
// utilise un useRef depixi text, pour voir le message qu'il y a dedans
          case "avancer":
            pressedKeys.add("ArrowRight");
            break;
          case "reculer":
            pressedKeys.add("ArrowLeft");
            break;
          case "descendre":
            pressedKeys.add("ArrowDown");
            break;
          case "jumpForward":
            eventArrowUp();
            pressedKeys.add("ArrowRight");
            break;
          default:
            break;
        }
      });

      return () => {
        castContext.removeCustomMessageListener(CHANNEL, listener);
      };
    }, [castContext]);

  }, [castContext]);


  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef}></canvas>
      <div style={{ color: 'white', marginTop: 10 }}>
        Last Msg: {messageRef.current}
      </div>
      {hasWon && <VictoryMessage timeLeft={timeLeft} restartGame={restartGame} />}
      {gameOver && !hasWon && <GameOverMessage restartGame={restartGame} />}
      {!gameOver && <CountdownTimer timeLeft={timeLeft} />}
    </div>
  );
};

export default PixiCanvas;
