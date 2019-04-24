float camx,camy,easing=0.0008,HH,WW,d,ce,se,ca,sa,r=300;

void setup(){
  size(800,800,P3D);
  WW=width/2;
  HH=height/2;
  d=TWO_PI/10;
  stroke(164,202,246);
	fill (164,202,246);
  smooth(8);
}

void draw(){
  background(255);
  float targetX = map(width-mouseX,0,width,0,180);
  float dx = targetX - camx;
  camx += dx * easing;
  
  float targetY = map(height-mouseY,0,width,0,180);
  float dy = targetY - camy;
  camy += dy * easing;
  
  translate(WW,HH,0);
  rotateX(radians(camy));
  rotateY(radians(camx));
  for(float a=0;a<PI;a+=d){
    ca=cos(a);
    sa=sin(a);
    for(float e=0;e<TWO_PI;e+=d){
      ce=cos(e);
      se=sin(e);
      line(0,0,0,r*ce*sa,r*se*sa,r*ca);
    }
  }
  int total = 10;
  for(int i = 0; i< total; i+=2){
    float lon = map(i, 0, total, 0, PI);
     for(int j = 0; j< total; j+=1){
       float lat = map(j, 0, total, 0, TWO_PI);
       float x = r * sin(lat) * cos(lon);
       float y = r * sin(lat) * sin(lon);
       float z = r * cos(lat);
       pushMatrix();
       translate(x,y,z);
       sphere(10);
       popMatrix();
     }
  }
  sphere(10);
  
}

void keyPressed(){
  switch(keyCode){
    case UP:d+=0.01;break;
    case DOWN:d-=0.01;break;
  }
}