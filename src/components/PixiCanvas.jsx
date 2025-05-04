import * as PIXI from 'pixi.js';
import React from 'react';


const PixiCanvas = ({ castContext }) => {
  const canvasRef = React.useRef(null);
  const pixiAppRef = React.useRef(null); // Référence persistante de PIXI.Application
  const spriteRef = React.useRef(null); // Référence à ton sprite principal
  const [posX, setPosX] = React.useState(30);
  const [posY, setPosY] = React.useState(30);


  React.useEffect(() => {
    const app = new PIXI.Application({
      view: canvasRef.current,
      width: 1280,
      height: 720,
      backgroundAlpha: 0,
    });

    pixiAppRef.current = app;

    const backgroundTexture = PIXI.Texture.from('/background.png');
    const backgroundSprite = new PIXI.Sprite(backgroundTexture);
    backgroundSprite.width = app.screen.width;
    backgroundSprite.height = app.screen.height;
    backgroundSprite.anchor.set(0); // alignement haut-gauche
    backgroundSprite.position.set(0, 0);
    app.stage.addChild(backgroundSprite);


    const createObstacle = (x, y, width, height) => {
      const obstacle = new PIXI.Graphics();

      // Draw rectangle
      obstacle.beginFill(0x000);
      obstacle.drawRect(x, y, width, height);
      obstacle.endFill();



      return obstacle;
    };
    const obstacles = [
      // x=avance, y = haut et bas
      createObstacle(9, 500, 140, 30),//Départ
      createObstacle(300, 400, 150, 30),//2
      createObstacle(500, 600, 150, 50), //3
      createObstacle(550, 300, 200, 30),//4
      createObstacle(1130, 600, 150, 30),//final
      createObstacle(800, 450, 200, 30)//6
    ];

    obstacles.forEach(ob => app.stage.addChild(ob));

    //Mes triangles

    const deathTriangle = (x, y, width, height) => {
      const triangle = new PIXI.Graphics();

      triangle.beginFill(0xff0000); // couleur rouge
      // Les points de mon triangle 
      triangle.moveTo(x + width / 2, y);         // le sommet
      triangle.lineTo(x, y + height);            // gauche
      triangle.lineTo(x + width, y + height);    // droit
      triangle.lineTo(x + width / 2, y);         // bas
      triangle.endFill();

      return triangle;
    };


    const deathTriangles = [
      deathTriangle(350, 350, 50, 50),//1
      deathTriangle(699, 250, 50, 50),// 2
      deathTriangle(899, 400, 50, 50),//3
      deathTriangle(1199, 550, 50, 50)//4
    ];
    deathTriangles.forEach(obt => app.stage.addChild(obt));



    // My sheet 
    PIXI.Loader.shared
      .add("spritesheet", "/texture.json")
      .load((loader, resources) => {
        const sheet = resources["spritesheet"].spritesheet;
        console.log(Object.keys(sheet.textures));  // Debugging textures

        // Walk animation
        const walkAnim = new PIXI.AnimatedSprite([
          sheet.textures["frame.png"],
          sheet.textures["frame-1.png"],
          sheet.textures["frame-2.png"]
        ]);
        walkAnim.animationSpeed = 0.1;
        walkAnim.loop = true;
        walkAnim.play();
        walkAnim.x = 100;
        walkAnim.y = 100;
        app.stage.addChild(walkAnim);
      });



  }, []);


  React.useEffect(() => {
    if (!castContext) return;

    const CHANNEL = 'urn:x-cast:testChannel';
    castContext.addCustomMessageListener(CHANNEL, function (customEvent) {
      // TODO ici mettre une structure json de votre choix.
      const pos = customEvent.data.msg.split(',');
      setPosX(pos[0]);
      setPosY(pos[1]);
      spriteRef.current.x = pos[0] ?? spriteRef.current.x;
      spriteRef.current.y = pos[1] ?? spriteRef.current.y;
    });

  }, [castContext]);


  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default PixiCanvas;