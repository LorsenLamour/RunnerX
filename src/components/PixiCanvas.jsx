import * as PIXI from 'pixi.js';
import React, { useEffect, useRef, useState } from 'react';
import GameOverMessage from './GameOverMessage';
import CountdownTimer from './CountdownTimer';
import VictoryMessage from './VictoryMessage';
import GameInfoBtn from './GameInfoBtn';
import GameMusic from './GameMusic';


const PixiCanvas = ({ castContext }) => {
  const canvasRef = useRef(null);
  const pixiAppRef = useRef(null);
  const spriteRef = useRef(null);
  const walkAnimRef = useRef(null);
  const isMovingRef = useRef(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasWon, setHasWon] = useState(false);
  const [posX, setPosX] = React.useState(30);
  const [posY, setPosY] = React.useState(30);

  React.useEffect(() => {
    let handleKeyDown = () => { };
    let handleKeyUp = () => { };
    fetch('/levels/level1.json')
      .then(res => res.json())
      .then(levelData => {
        const app = new PIXI.Application({
          view: canvasRef.current,
          width: levelData.dimensions.width,
          height: levelData.dimensions.height,
          backgroundAlpha: 0,
        });

        pixiAppRef.current = app;
        const obstacles = [];
        const deathTriangles = [];

        const backgroundTexture = PIXI.Texture.from('/background.png');
        const backgroundSprite = new PIXI.Sprite(backgroundTexture);
        backgroundSprite.width = app.screen.width;
        backgroundSprite.height = app.screen.height;
        app.stage.addChild(backgroundSprite);

        const createObstacle = (x, y, width, height) => {
          const graphics = new PIXI.Graphics();
          graphics.beginFill(0x000);
          graphics.drawRect(0, 0, width, height);
          graphics.endFill();
          graphics.x = x;
          graphics.y = y;
          return graphics;
        };
        const deathTriangle = (x, y, width, height) => {
          const graphics = new PIXI.Graphics();
          graphics.beginFill(0xff0000); // Rouge
          graphics.moveTo(0, height);
          graphics.lineTo(width / 2, 0);
          graphics.lineTo(width, height);
          graphics.lineTo(0, height);
          graphics.endFill();
          graphics.x = x;
          graphics.y = y;
          return graphics;
        };
        levelData.obstacles.forEach(ob => {
          const obstacle = createObstacle(ob.x, ob.y, ob.width, ob.height);
          app.stage.addChild(obstacle);
          obstacles.push(obstacle);
        });

        levelData.deathZones.forEach(zone => {
          const triangle = deathTriangle(zone.x, zone.y, zone.width, zone.height);
          app.stage.addChild(triangle);
          deathTriangles.push(triangle);
        });

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
            portalSprite.x = levelData.portal.x;
            portalSprite.y = levelData.portal.y;
            portalSprite.width = levelData.portal.width;
            portalSprite.height = levelData.portal.height;
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
            walkAnim.x = levelData.playerStart.x;
            walkAnim.y = levelData.playerStart.y;
            app.stage.addChild(walkAnim);
            walkAnimRef.current = walkAnim;

            const jumpAnim = new PIXI.AnimatedSprite([
              sheet.textures["jump_up.png"],
              sheet.textures["jump_fall.png"]
            ]);
            jumpAnim.animationSpeed = 0.15;
            jumpAnim.loop = true;
            jumpAnim.play();
            jumpAnim.visible = false;
            jumpAnim.anchor.set(0.5, 1);
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

              for (const triangle of deathTriangles) {
                const bounds = triangle.getBounds();
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
                  break;  
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

              if (sprite.y > app.screen.height + 100) {
                sprite.visible = false;
                setGameOver(true);
                console.log("Le joueur est mort !");
              }
            });
            handleKeyDown = (e) => {
              if (gameOver) return;
              pressedKeys.add(e.key);
              if (e.key === "ArrowUp" && velocityY === 0) {
                velocityY = -25;
                switchAnim(jumpAnim);
              }
            };
            handleKeyUp = (e) => {
              if (gameOver) return;
              pressedKeys.delete(e.key);
            };

            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("keyup", handleKeyUp);
          });
        return () => {
          window.removeEventListener("keydown", handleKeyDown);
          window.removeEventListener("keyup", handleKeyUp);
        };
      })
  }, []);
  React.useEffect(() => {
    if (gameOver) {
      console.log('Game Over');
    }
  }, [gameOver]);

  React.useEffect(() => {
    if (gameOver) return; 

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true); 
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
    spriteRef.current.visible = true;
    spriteRef.current.x = 30;
    spriteRef.current.y = 455;
  };
  React.useEffect(() => {
    if (!castContext) return;

    const CHANNEL = 'urn:x-cast:testChannel';
    castContext.addCustomMessageListener(CHANNEL, function (customEvent) {
      const pos = customEvent.data.msg.split(',');
      setPosX(pos[0]);
      setPosY(pos[1]);
    });
  }, [castContext]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef}></canvas>
      <GameInfoBtn />
      <GameMusic />
      {hasWon && <VictoryMessage timeLeft={timeLeft} restartGame={restartGame} />}
      {gameOver && !hasWon && <GameOverMessage restartGame={restartGame} />}
      {!gameOver && <CountdownTimer timeLeft={timeLeft} />}
    </div>
  );
};
export default PixiCanvas; 