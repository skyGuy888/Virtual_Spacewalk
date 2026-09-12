async function captureSpacewalk(){
  const canvas=document.createElement("canvas");
  canvas.width=1920;
  canvas.height=1080;
  const ctx=canvas.getContext("2d");

  ctx.fillStyle="#080d18";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="#4b352d";
  ctx.beginPath();
  ctx.ellipse(
    canvas.width/2,
    canvas.height*1.15,
    canvas.width*.75,
    canvas.height*.45,
    0,0,Math.PI*2
  );
  ctx.fill();

  const face=document.getElementById("finalFace");

  if(face.complete && face.naturalWidth){
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width/2,410,115,0,Math.PI*2);
    ctx.clip();
    ctx.drawImage(face,canvas.width/2-115,295,230,230);
    ctx.restore();
  }

  const planet=SpacewalkState.selectedPlanet;

  ctx.fillStyle="#ffffff";
  ctx.textAlign="center";
  ctx.font="bold 46px Arial";
  ctx.fillText(planet?planet.name:"SPACEWALK",canvas.width/2,90);

  ctx.font="bold 34px Arial";
  ctx.fillText(
    `WEIGHT: ${SpacewalkState.planetWeight.toFixed(1)} kg`,
    canvas.width/2,
    1020
  );

  const dataUrl=canvas.toDataURL("image/png");
  const filename=`Spacewalk_${Date.now()}.png`;

  const result=await window.electronAPI.savePhoto({
    dataUrl,
    filename
  });

  if(!result.success){
    console.error(result.error);
    alert("บันทึกรูปไม่สำเร็จ");
    return;
  }

  setState("photoPath",result.filePath);
  document.getElementById("savedPath").textContent=
    `Saved: ${result.filePath}`;

  document.getElementById("qrcode").innerHTML=`
    <div style="
      width:280px;height:280px;
      display:grid;place-items:center;
      background:#eee;color:#111;
      font-weight:bold;
    ">
      QR DOWNLOAD
    </div>
  `;
}