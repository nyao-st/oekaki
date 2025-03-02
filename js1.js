//JavaScriptのエリア
const ok = document.getElementById("ok"); // ダウンロードボタンを保存ボタンに
const input1 = document.getElementById("input1"); //太さ
const input2 = document.getElementById("input2"); //色
const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2"); //ひとつ前の絵
const canvas3 = document.getElementById("canvas3"); //最後のとりまとめ用
const ctx1 = canvas1.getContext("2d",{willReadFrequently:true}); // willReadFrequently:getImageData()のメモリ節約
const ctx2 = canvas2.getContext("2d",{willReadFrequently:true});
const ctx3 = canvas3.getContext("2d",{willReadFrequently:true});
const can = document.getElementById("canvases"); //キャンバス全体

//1.変数の設定と初期化
const pen = {x:0, y:0};
let tms = ""
let lwidth = 10; // 線の太さ
let lcolor = "blue"
let v1 = 100;  // ミリ秒の初期値
let flg = 0; // mousedownしたら1, upの時は0
const tms1 = ["おどる", "かわいい", "へんてこな", "さかさまな"];
const tms2 = ["のりもの", "ロボット", "いきもの", "おうち"];

//キャンバスのサイズ調整
let width = 600;
let height = 500;
if (width > screen.width){
  changeSize();
}
let height3 = height + 100;
can.style.width = width + "px";
can.style.height = height3 + "px";
canvas1.width = width;
canvas1.height = height;
canvas2.width = width;
canvas2.height = height;
canvas3.width = width;
canvas3.height = height3;

//最初に表示させるもの
ctx3.fillStyle="blue";
ctx3.fillRect(0,0,width,height3); 
ctx3.fillStyle="white";
ctx3.font="bold 20px 'Segoe Print', san-serif"; //フォントを指定
ctx3.fillText("↑↑テーマを選んでね!",10,40);

//描画スタイルの設定(後で選択できるようにする)
ctx1.lineWidth = lwidth; //線の太さを指定
ctx1.fillStyle = lcolor;
ctx1.strokeStyle = lcolor; //線の色を指定
ctx1.lineCap = "round"; //線の終点は丸く

//テーマ選択
function select(){
  let r1 = Math.floor(Math.random()*tms1.length);
  let r2 = Math.floor(Math.random()*tms2.length);
  tms =  "『" + tms1[r1] + " "+ tms2[r2] + "』";
  reload()
}

//線の太さ変更
function change1(){
  lwidth = parseFloat(input1.value);
  ctx1.lineWidth = lwidth;
}

//線の色変更
function change2(){
  lcolor = input2.value
  ctx1.fillStyle = lcolor;
  ctx1.strokeStyle = lcolor; //線の色を指定
}

//描画開始
function oekakiStart(){
  ctx1.beginPath();
  ctx1.arc(pen.x, pen.y, lwidth/2, 0, 2*Math.PI,false);
  ctx1.closePath();
  ctx1.fill();
  ctx1.beginPath(); //パス開始
  moveTo(pen.x, pen.y);
  ctx1.stroke();      
}

//x.描画開始
canvas1.addEventListener("mousedown",function(){
  drow_add(ctx1, ctx2); //ctx1の絵をctx2へ書き込む
  flg = 1;
  oekakiStart();
});

//x.描画開始(スマホ)
canvas1.addEventListener("touchstart",function(e){
  drow_add(ctx1, ctx2); //ctx1の絵をctx2へ書き込む
  flg = 1;
  const rect = e.target.getBoundingClientRect();
  pen.x = e.clientX-rect.left;
  pen.y = e.clientY-rect.top;
  oekakiStart();
},{passive:false});

//x.座標追加
canvas1.addEventListener("mousemove",function(e){
  const rect = e.target.getBoundingClientRect();
  pen.x = e.clientX-rect.left;
  pen.y = e.clientY-rect.top;
  if(flg){
    ctx1.lineTo(pen.x, pen.y);
    ctx1.stroke();
  }
});

//x.座標追加(スマホ用)
canvas1.addEventListener("touchmove",
  function(e){
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    pen.x=e.touches[0].clientX-rect.left;
    pen.y=e.touches[0].clientY-rect.top;
    if(flg){
      ctx1.lineTo(pen.x, pen.y);
      ctx1.stroke();
    }
  }, {passive:false}
);

//x.描画終了
canvas1.addEventListener("mouseup",function(){
  flg = 0;   
});

//x.描画終了2
canvas1.addEventListener("mouseout",function(){
  flg = 0;
});

canvas1.addEventListener("touchend",function(){
  flg = 0;
});


//1つ前までの作業を保持
function drow_add(a, b){
  let img = a.getImageData(0, 0, width, height);
  b.putImageData(img, 0, 0);
}

// 最初から
function reload(){
  ctx1.fillStyle="white";
  ctx1.fillRect(0,0,width,height); //背景は白
  ctx2.clearRect(0,0,width,height);
  ctx3.clearRect(0,0,width,height3);
  ctx3.fillStyle="darkblue"; //塗色を指定
  ctx3.font="bold 20px 'Segoe Print', san-serif"; //フォントを指定
  ctx3.fillText("お絵描きスタート!",0,20);
  ctx3.fillStyle="black"; 
  ctx3.font="bold 16px 'Segoe Print', san-serif"; 
  ctx3.fillText(tms+"を描いてみよう!!",10,60); //文字(文字列,x,y)
  ctx1.fillStyle=lcolor;
}

// 一つ戻す
function back(){
  drow_add(ctx2, ctx1);      
}

function preview(){
  ctx3.fillStyle="white";
  ctx3.fillRect(0,0,width,height3);
  ctx3.fillStyle="black"; //塗色を指定
  ctx3.font="bold 20px 'Segoe Print', san-serif"; //フォントを指定
  ctx3.fillText(tms,10,50); //文字(文字列,x,y)
  let img = ctx1.getImageData(0, 0, width, height);
  ctx3.putImageData(img, 0, 80);
  ok.innerHTML = '<button class="btn" id="ok" onclick="download();">ダウンロードする</button>';      
}

function download(){
  let link = document.createElement("a");
  link.href = canvas3.toDataURL("image/png");
  link.download = "img.png";
  link.click();
}

function changeSize(){
  width = screen.width - (screen.width*0.1);
  height = width - 100;
}
