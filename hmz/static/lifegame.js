var size = 18;
var data = [];
var timer;

function initData(arr) {
	var arrLine = [];
	
	for (let i = 0; i < size; i++) {
		arrLine = [];
		for (let j = 0; j < size; j++) {
			arrLine.push(0);
		}
		arr.push(arrLine);
	}
}

function load(arr) {
	var fragmant = document.createDocumentFragment();
	var vacant;
	var occupy;
	var row;
	
	clearTimeout(timer);
	
	document.getElementById('container').innerHTML = '';
	for (let i = 0; i < size; i++) {
		row = document.createElement('div');
		for (let j = 0; j < size; j++) {
			if (arr[i][j] === 0) {
				vacant = document.createElement('div');
				vacant.className = 'vacant';
				vacant.id = i + '_' + j;
				row.appendChild(vacant);
			} else {
				occupy = document.createElement('div');
				occupy.className = 'occupy';
				occupy.id = i + '_' + j;
				row.appendChild(occupy);
			}
			fragmant.appendChild(row);
		}
	}
	document.getElementById('container').appendChild(fragmant);
	
	var vacantDiv = document.getElementsByClassName('vacant');
	var occupyDiv = document.getElementsByClassName('occupy');
	for (let i = 0; i < vacantDiv.length; i++) {
		vacantDiv[i].addEventListener('click', changeStatus.bind(vacantDiv[i]), false);
	}
	for (let i = 0; i < occupyDiv.length; i++) {
		occupyDiv[i].addEventListener('click', changeStatus.bind(occupyDiv[i]), false);
	}
}

function changeStatus() {
	var i = this.id.split('_')[0];
	var j = this.id.split('_')[1];
	data[i][j] = this.className === 'vacant' ? 1 : 0;
	load(data);
}

function restart() {
	data = [];
	initData(data);
	load(data);
}

function start() {
	var newData = [];
	var neighbor;
	initData(newData);
	
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			neighbor = countNeighbor(i, j);
			if (data[i][j] === 0) {
				if (neighbor === 3) {
					newData[i][j] = 1;
				} else {
					newData[i][j] = 0;
				}
			} else {
				if (neighbor === 2 || neighbor === 3) {
					newData[i][j] = 1;
				} else {
					newData[i][j] = 0;
				}
			}
		}
	}
	data = newData;
	load(data);
	
	timer = setTimeout(arguments.callee, 1000 * 0.5);
}

function countNeighbor(i, j) {
	var count = 0;
	
	if (i === 0) {
		if (j === 0) {
			count = countPosition(count, i, j, 6, 8 ,9);
		} else if (j === size - 1) {
			count = countPosition(count, i, j, 4, 7 ,8);
		} else {
			count = countPosition(count, i, j, 4, 6, 7, 8, 9);
		}
	} else if (i === size - 1) {
		if (j === 0) {
			count = countPosition(count, i, j, 2, 3, 6);
		} else if (j === size - 1) {
			count = countPosition(count, i, j, 1, 2, 4);
		} else {
			count = countPosition(count, i, j, 1, 2, 3, 4, 6);
		}
	} else {
		if (j === 0) {
			count = countPosition(count, i, j, 2, 3, 6, 8 ,9);
		} else if (j === size -1) {
			count = countPosition(count, i, j, 1, 2, 4, 7, 8);
		} else {
			count = countPosition(count, i, j, 1, 2, 3, 4, 6, 7, 8, 9);
		}
	}
	
	return count;
}

/*
 * 1 2 3
 * 4 5 6
 * 7 8 9
 * (i,j) point to cell 5
 */
function countPosition(count, i, j, ...rest) {
	if (rest.indexOf(1) !== -1) {
		if (data[i - 1][j - 1] === 1) {
			count++;
		}
	}
	if (rest.indexOf(2) !== -1) {
		if (data[i - 1][j] === 1) {
			count++;
		}
	}
	if (rest.indexOf(3) !== -1) {
		if (data[i - 1][j + 1] === 1) {
			count++;
		}
	}
	if (rest.indexOf(4) !== -1) {
		if (data[i][j - 1] === 1) {
			count++;
		}
	}
	if (rest.indexOf(6) !== -1) {
		if (data[i][j + 1] === 1) {
			count++;
		}
	}
	if (rest.indexOf(7) !== -1) {
		if (data[i + 1][j - 1] === 1) {
			count++;
		}
	}
	if (rest.indexOf(8) !== -1) {
		if (data[i + 1][j] === 1) {
			count++;
		}
	}
	if (rest.indexOf(9) !== -1) {
		if (data[i + 1][j + 1] === 1) {
			count++;
		}
	}
	
	return count;
}

/* 小演示1 */
function yz1() {
	data = [];
	initData(data);
	
	data[3][3] = 1;
	data[3][4] = 1;
	data[4][3] = 1;
	data[5][6] = 1;
	data[6][5] = 1;
	data[6][6] = 1;
	
	load(data);
}

/* 小演示2 */
function yz2() {
	data = [];
	initData(data);
	
	data[6][6] = 1;
	data[7][6] = 1;
	data[8][6] = 1;
	data[7][7] = 1;
	
	load(data);
}

/* 滑翔者 */
function yz3() {
	data = [];
	initData(data);
	
	data[1][3] = 1;
	data[2][1] = 1;
	data[2][3] = 1;
	data[3][2] = 1;
	data[3][3] = 1;
	
	load(data);
}

/* 轻量级飞船 */
function yz4() {
	data = [];
	initData(data);
	
	data[3][3] = 1;
	data[3][4] = 1;
	data[4][2] = 1;
	data[4][3] = 1;
	data[4][4] = 1;
	data[4][5] = 1;
	data[4][3] = 1;
	data[5][2] = 1;
	data[5][3] = 1;
	data[5][5] = 1;
	data[5][6] = 1;
	data[6][4] = 1;
	data[6][5] = 1;
	
	load(data);
}

/* 
 * 脉冲星
 * When the size changes, data should be changed correspondingly.
 * If you know an elegant way to initialize data, please tell me.
 */
function yz5() {
	data = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0],
		[0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0],
		[0,0,1,0,0,1,0,1,0,1,0,1,0,0,1,0,0,0],
		[0,0,1,1,1,0,1,1,0,1,1,0,1,1,1,0,0,0],
		[0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0],
		[0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0],
		[0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0],
		[0,0,1,1,1,0,1,1,0,1,1,0,1,1,1,0,0,0],
		[0,0,1,0,0,1,0,1,0,1,0,1,0,0,1,0,0,0],
		[0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0],
		[0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	]
	
	load(data);
}

function undo() {
	alert('研究中，聪明的你也可以截图指导作者\n' + 'humingzhework@163.com');
}