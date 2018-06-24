var game = new Phaser.Game(800,600,Phaser.AUTO,'content',{preload: preload, create: 
create,update:update}); 

var counter = 0;
var text = 0;

function preload(){ 
		game.load.image('main_character','asset/main_character.png'); 
		game.load.image('ennemy','asset/ennemy.png'); 
} 
function create(){ 
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //initialisation du compteur 
        counter = 0;
        text = 0;
		//add sprite ofe main character, position
		monSprite=game.add.sprite(0,0,'main_character');
		monSprite.anchor.setTo (0.5,0.5); 
		monSprite.x=400; 
		monSprite.y=300; 
		monSprite.angle=0
        game.physics.enable(monSprite,Phaser.Physics.ARCADE);
		//add sprite of main ennemy, position
	    //ennemy = game.add.sprite(0,0,'ennemy');
        //variable qui compte le nombre de tour de la fonction update
        i = 0;
        //variable qui compte le nombre de vague de propagation
        i_spreading = 0;
        //groupe pour les ennemies
        //variable qui permet d'accélérer ou de ralentir la propagation
        a = 15;
        //variable qui correpond au nombre de boucle avant que la propagation s'arrete
        end_spreading = 100;
        //Text du temps
        text = game.add.text(game.world.centerX, game.world.centerY, 'Temps: 0', { font: "30px Arial", fill: "#ffffff", align: "center" });
        text.anchor.setTo(-1, 7.5);
        game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
        // Create an empty group
        ennemies = game.add.group(); 
	} 		
function update(){ 
        //vérifie si le joueur ne quitte pas le terrain
        exit();
        //Déplacement
		move();
        //variable qui vaut 0 si i/a n'a pas de reste
        tempo = i%a;
        //variable qui correpond au nombre de boucle avant que la propagation commence
        start_spreading = 10;
        //Tableau contenant tous les x et y des ennemy
        var x_ennemy = [];
        var y_ennemy = [];
        //condition qui agit différemment en fonction du nombre de fois que la fonction update est appelée
        //apparition du première ennemie
        //compteur
        i = i +1;
        if(i == start_spreading){
   
            game.physics.arcade.collide(monSprite, ennemies, restartGame());
            //position initiale de l'ennemie différente de celle du joueur
            do{
                x =  Math.floor(Math.random() * 800);
                y =  Math.floor(Math.random() * 600);
            }while(x != monSprite.x && y != monSprite.y);
            x_ennemy = x_ennemy.push(x);
            y_ennemy = y_ennemy.push(y);
            add_ennemy(x,y);
        }
        //propagation if(début de la propagation, fin de la propagation, tempo == 0 ne doit pas être changé)
        if(i>start_spreading && i<end_spreading && tempo == 0){
            //variable qui prendre des valeurs entre 0 et 3
            random =  Math.floor(Math.random() * 3);
            //En fonction de la varaiable aléatoire on ajoute ou soutrait 10px 
            switch (random) {
              case 0:
                 x = x + 10;
                break;
              case 1:
                 x = x - 10; 
                break;
              case 2:
                 y = y -10;
                break;
              case 3:
                 y = y +10;
                break;
            }
        if(x>800 || x<0 || y<0 || y>600){
           ennemies.destroy();
           i = 0;
        }
            x_ennemy = x_ennemy.push(x);
            y_ennemy = y_ennemy.push(y);
            add_ennemy(x,y);
        }
        //Si la propagation quitte le terrain on relance une nouvelle propagation
        //Si on arrive dans la dernière boucle alors on initialise le compteur i et incrémente le compteur de propagation et on le détruit
        if(i == (end_spreading-1)){
           ennemies.removeAll();
           i = 0;
           i_spreading = i_spreading + 1;
           end_spreading = end_spreading +100;
           if(a>2){
               a = a -1;
           }
        }
        //game.physics.arcade.collide(monSprite, ennemies, restartGame());
       // game.physics.arcade.overlap(ennemies, monSprite, restartGame(), null, null);    
}

function add_ennemy(x,y){
		ennemy = ennemies.create(x,y,'ennemy')
        game.physics.enable(ennemy,Phaser.Physics.ARCADE);
        // Add the pipe to our previously created group
        //ennemies.add(ennemy);
}

//function which allows to main character to move
function move(){
	if (game.input.keyboard.isDown(Phaser.Keyboard.D)==true || game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)==true){
        monSprite.x=monSprite.x+2
		monSprite.angle=monSprite.angle=90
    }
	if (game.input.keyboard.isDown(Phaser.Keyboard.Q)==true || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)==true){
        monSprite.x=monSprite.x-2
		monSprite.angle=monSprite.angle=-90
    }
	if (game.input.keyboard.isDown(Phaser.Keyboard.S)==true || game.input.keyboard.isDown(Phaser.Keyboard.DOWN)==true){
        monSprite.y=monSprite.y+2
		monSprite.angle=monSprite.angle=0
    }
	if (game.input.keyboard.isDown(Phaser.Keyboard.Z)==true || game.input.keyboard.isDown(Phaser.Keyboard.UP)==true){
        monSprite.y=monSprite.y-2
		monSprite.angle=monSprite.angle=180
    }
}

//fonction qui relance le jeu si on quitte le fond de jeu
function exit(){
    if(monSprite.x < 0 || monSprite.x > 800 || monSprite.y < 0 || monSprite.y > 600){
        restartGame();
    }
}
       
//Fonction qui relance le jeu
function restartGame(){
        // Start the 'main' state, which restarts the game
        console.log('Restart');
        this.game.state.restart();
    }

//incrémente les secondes
function updateCounter() {

    counter++;

    text.setText('Temps: ' + counter);

}
