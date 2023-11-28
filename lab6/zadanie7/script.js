let modalPic = document.getElementById("modal-img");
let pic = 0;

function setPic1() {
	modalPic.src = "./nat-1-large.jpg";
}

function setPic2() {
	modalPic.src = "./nat-2-large.jpg";
}

function setPic3() {
	modalPic.src = "./nat-3-large.jpg";
}

function nextPic() {
	pic = (pic+1) % 3;
	modalPic.src = `./nat-${pic+1}-large.jpg`;
}

function prevPic() {
	pic = (pic-1) % 3;
	if(pic < 0) {
		pic = 2;
	}
	modalPic.src = `./nat-${pic+1}-large.jpg`;
}
