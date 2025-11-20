(() => {
  // MatrixData.js
  var MatrixData = class {
    constructor() {
      this.x = 0;
      this.y = 0;
    }
  };

  // Matrix.js
  var Matrix = class extends MatrixData {
    constructor(name, values, changeable) {
      super();
      if (typeof changeable === "undefined") {
        changeable = false;
      }
      this.name = name;
      this.minValue = -99;
      this.maxValue = 100;
      this.rows = values.length;
      this.cols = values[0].length;
      this.changeable = changeable;
      this.showRowIndexes = true;
      this.showColIndexes = true;
      this.rowIndexes = {};
      this.colIndexes = {};
      this.rowLoopMarkers = {};
      this.colLoopMarkers = {};
      this.indexesPos = 0;
      this.indexStrokeC = "#000";
      this.indexFillC = "#FFF";
      this.loopC = "rgba(0, 0, 0, 0.3)";
      this.elements = this.createMatrix(values);
    }
    render() {
      const indexOffset = 10;
      const gap = 1;
      if (this.showRowIndexes) {
        for (let i = 0; i < this.rows; i++) {
          const x = this.x - this.elements[0][0].width / 2 - indexOffset;
          const y = this.y + i * (this.elements[i][0].height + gap);
          this.ctx.fillStyle = "#888";
          this.ctx.font = "14px Arial";
          this.ctx.textAlign = "center";
          this.ctx.textBaseline = "middle";
          this.ctx.fillText(i.toString(), x, y);
        }
      }
      if (this.showColIndexes) {
        for (let j = 0; j < this.cols; j++) {
          const x = this.x + j * (this.elements[0][j].width + gap);
          const y = this.y - this.elements[0][0].height / 2 - indexOffset;
          this.ctx.fillStyle = "#888";
          this.ctx.font = "14px Arial";
          this.ctx.textAlign = "center";
          this.ctx.textBaseline = "middle";
          this.ctx.fillText(j.toString(), x, y);
        }
      }
      for (const name in this.rowLoopMarkers) {
        if (this.rowIndexes.hasOwnProperty(name)) {
          let markerPos = 0;
          if (this.rowIndexes[name].position >= 0) {
            markerPos = this.rowIndexes[name].position;
          } else {
            let fixIndexPos = [];
            for (const otherName in this.rowIndexes) {
              if (this.rowIndexes[name].value === this.rowIndexes[otherName].value && this.rowIndexes[name].position >= 0) {
                fixIndexPos = fixIndexPos.concat([this.rowIndexes[name].position]);
              }
            }
            for (const otherName in this.rowIndexes) {
              if (this.rowIndexes[name].value === this.rowIndexes[otherName].value && this.rowIndexes[name].position < 0 && name > otherName) {
                while (fixIndexPos.indexOf(markerPos) > -1) {
                  markerPos++;
                }
                fixIndexPos = fixIndexPos.concat([markerPos]);
              }
            }
            while (fixIndexPos.indexOf(markerPos) > -1) {
              markerPos++;
            }
          }
          let startX, startY;
          if (this.rowLoopMarkers[name].from >= 0 && this.rowLoopMarkers[name].from < this.elements.length) {
            startX = this.elements[0][0].x - this.elements[0][0].width - this.elements[0][0].width * 0.3 - this.indexesPos - 11.5 - 30 * markerPos;
            startY = this.elements[this.rowLoopMarkers[name].from][0].y;
          } else if (this.rowLoopMarkers[name].from === -1) {
            startX = this.elements[0][0].x - this.elements[0][0].width - this.elements[0][0].width * 0.3 - this.indexesPos - 11.5 - 30 * markerPos;
            startY = this.elements[0][0].y - this.elements[0][0].height - 2;
          } else {
            startX = this.elements[0][0].x - this.elements[0][0].width - this.elements[0][0].width * 0.3 - this.indexesPos - 11.5 - 30 * markerPos;
            startY = this.elements[this.elements.length - 1][0].y + this.elements[0][0].height + 2;
          }
          let targetY;
          if (this.rowLoopMarkers[name].to >= 0 && this.rowLoopMarkers[name].to < this.elements.length) {
            targetY = this.elements[this.rowLoopMarkers[name].to][0].y;
          } else if (this.rowLoopMarkers[name].to === -1) {
            targetY = this.elements[0][0].y - this.elements[0][0].height - 2;
          } else {
            targetY = this.elements[this.elements.length - 1][0].y + this.elements[0][0].height + 2;
          }
          const loopHeight = Math.abs(startY - targetY);
          let isUpwardLoop = this.rowLoopMarkers[name].from > this.rowLoopMarkers[name].to;
          if (this.rowLoopMarkers[name].from === this.rowLoopMarkers[name].to) {
            isUpwardLoop = this.rowLoopMarkers[name].backward;
          }
          if (isUpwardLoop) {
            startY = targetY;
          }
          this.ctx.strokeStyle = this.loopC;
          this.ctx.fillStyle = this.indexFillC;
          this.ctx.beginPath();
          this.ctx.rect(startX, startY, 16, loopHeight);
          this.ctx.fill();
          this.ctx.stroke();
          this.ctx.fillStyle = this.loopC;
          const loopChar = isUpwardLoop ? "\u25B2" : "\u25BC";
          const charSpacing = 18;
          let textY = startY + charSpacing / 2;
          while (textY < startY + loopHeight) {
            this.ctx.fillText(loopChar, startX + 8, textY);
            textY += charSpacing;
          }
        }
      }
      for (const name in this.colLoopMarkers) {
        if (this.colIndexes.hasOwnProperty(name)) {
          let markerPos = 0;
          if (this.colIndexes[name].position >= 0) {
            markerPos = this.colIndexes[name].position;
          } else {
            let fixIndexPos = [];
            for (const otherName in this.colIndexes) {
              if (this.colIndexes[name].value === this.colIndexes[otherName].value && this.colIndexes[name].position >= 0) {
                fixIndexPos = fixIndexPos.concat([this.colIndexes[otherName].position]);
              }
            }
            for (const otherName in this.colIndexes) {
              if (this.colIndexes[name].value === this.colIndexes[otherName].value && this.colIndexes[name].position < 0 && name > otherName) {
                while (fixIndexPos.indexOf(markerPos) > -1) {
                  markerPos++;
                }
                fixIndexPos = fixIndexPos.concat([markerPos]);
              }
            }
            while (fixIndexPos.indexOf(markerPos) > -1) {
              markerPos++;
            }
          }
          let startX, startY;
          if (this.colLoopMarkers[name].from >= 0 && this.colLoopMarkers[name].from < this.elements[0].length) {
            startX = this.elements[0][this.colLoopMarkers[name].from].x;
            startY = this.elements[0][0].y - this.elements[0][0].height - this.elements[0][0].height * 0.3 - this.indexesPos - 11.5 - 30 * markerPos;
          } else if (this.colLoopMarkers[name].from === -1) {
            startX = this.elements[0][0].x - this.elements[0][0].width - 2;
            startY = this.elements[0][0].y - this.elements[0][0].height - this.elements[0][0].height * 0.3 - this.indexesPos - 11.5 - 30 * markerPos;
          } else {
            startX = this.elements[0][this.elements[0].length - 1].x + this.elements[0][0].width + 2;
            startY = this.elements[0][0].y - this.elements[0][0].height - this.elements[0][0].height * 0.3 - this.indexesPos - 11.5 - 30 * markerPos;
          }
          let targetX;
          if (this.colLoopMarkers[name].to >= 0 && this.colLoopMarkers[name].to < this.elements[0].length) {
            targetX = this.elements[0][this.colLoopMarkers[name].to].x;
          } else if (this.colLoopMarkers[name].to === -1) {
            targetX = this.elements[0][0].x - this.elements[0][0].width - 2;
          } else {
            targetX = this.elements[0][this.elements[0].length - 1].x + this.elements[0][0].width + 2;
          }
          const loopWidth = Math.abs(startX - targetX);
          let isBackwardLoop = this.colLoopMarkers[name].from > this.colLoopMarkers[name].to;
          if (this.colLoopMarkers[name].from === this.colLoopMarkers[name].to) {
            isBackwardLoop = this.colLoopMarkers[name].backward;
          }
          if (isBackwardLoop) {
            startX = targetX;
          }
          this.ctx.strokeStyle = this.loopC;
          this.ctx.fillStyle = this.indexFillC;
          this.ctx.beginPath();
          this.ctx.rect(startX, startY, loopWidth, 16);
          this.ctx.fill();
          this.ctx.stroke();
          this.ctx.fillStyle = this.loopC;
          let loopText = "\u25BA";
          if (isBackwardLoop) {
            loopText = "\u25C4";
          }
          while (this.ctx.measureText(loopText + " >").width < loopWidth) {
            if (!isBackwardLoop) {
              loopText = loopText + " \u25BA";
            } else {
              loopText = loopText + " \u25C4";
            }
          }
          this.ctx.fillText(loopText, startX + loopWidth / 2, startY + 7.5);
        }
      }
      for (let i = 0; i < this.elements.length; i++) {
        for (let j = 0; j < this.elements[i].length; j++) {
          this.elements[i][j].ctx = this.ctx;
          const element = this.elements[i][j];
          element.x = this.x + j * (element.width + gap);
          element.y = this.y + i * (element.height + gap);
          element.render();
        }
      }
      for (let i = -1; i <= this.elements.length; i++) {
        let maxOffset = -1;
        let fixIndexPos = [];
        for (const name in this.rowIndexes) {
          if (this.rowIndexes[name].value === i && this.rowIndexes[name].position >= 0) {
            fixIndexPos = fixIndexPos.concat([this.rowIndexes[name].position]);
          }
        }
        let indexNames = Object.keys(this.rowIndexes).sort();
        for (let n = 0; n < indexNames.length; n++) {
          if (this.rowIndexes[indexNames[n]].value === i) {
            let currentOffset = this.indexesPos;
            if (this.rowIndexes[indexNames[n]].position >= 0) {
              currentOffset = currentOffset + 30 * this.rowIndexes[indexNames[n]].position;
            } else {
              let availablePos = 0;
              while (fixIndexPos.indexOf(availablePos) > -1) {
                availablePos++;
              }
              fixIndexPos = fixIndexPos.concat([availablePos]);
              currentOffset = this.indexesPos + 30 * availablePos;
            }
            this.ctx.strokeStyle = this.loopC;
            this.ctx.fillStyle = this.indexFillC;
            this.ctx.beginPath();
            if (i >= 0 && i < this.elements.length) {
              this.ctx.arc(this.elements[0][0].x - this.elements[0][0].width - this.elements[0][0].height * 0.3 - currentOffset - 3, this.elements[i][0].y, 11.5, 0, 2 * Math.PI);
            } else if (i === -1) {
              this.ctx.arc(this.elements[0][0].x - this.elements[0][0].width - this.elements[0][0].height * 0.3 - currentOffset - 3, this.elements[0][0].y - this.elements[0][0].height, 11.5, 0, 2 * Math.PI);
            } else {
              this.ctx.arc(this.elements[0][0].x - this.elements[0][0].width - this.elements[0][0].height * 0.3 - currentOffset - 3, this.elements[this.elements.length - 1][0].y + this.elements[0][0].height, 11.5, 0, 2 * Math.PI);
            }
            if (currentOffset > maxOffset) {
              maxOffset = currentOffset;
            }
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.fillStyle = this.indexStrokeC;
            this.ctx.font = "bold 12px Courier New";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "alphabetic";
            if (i >= 0 && i < this.elements.length) {
              this.ctx.fillText(indexNames[n], this.elements[0][0].x - this.elements[0][0].width - this.elements[0][0].height * 0.3 - currentOffset - 3, this.elements[i][0].y + 3);
            } else if (i === -1) {
              this.ctx.fillText(indexNames[n], this.elements[0][0].x - this.elements[0][0].width - this.elements[0][0].height * 0.3 - currentOffset - 3, this.elements[0][0].y - this.elements[0][0].height + 3);
            } else {
              this.ctx.fillText(indexNames[n], this.elements[0][0].x - this.elements[0][0].width - this.elements[0][0].height * 0.3 - currentOffset - 3, this.elements[this.elements.length - 1][0].y + this.elements[0][0].height + 3);
            }
          }
        }
      }
      for (let j = -1; j <= this.elements[0].length; j++) {
        let maxOffset = -1;
        let fixIndexPos = [];
        for (const name in this.colIndexes) {
          if (this.colIndexes[name].value === j && this.colIndexes[name].position >= 0) {
            fixIndexPos = fixIndexPos.concat([this.colIndexes[name].position]);
          }
        }
        let indexNames = Object.keys(this.colIndexes).sort();
        for (let n = 0; n < indexNames.length; n++) {
          if (this.colIndexes[indexNames[n]].value === j) {
            let currentOffset = this.indexesPos;
            if (this.colIndexes[indexNames[n]].position >= 0) {
              currentOffset = currentOffset + 30 * this.colIndexes[indexNames[n]].position;
            } else {
              let availablePos = 0;
              while (fixIndexPos.indexOf(availablePos) > -1) {
                availablePos++;
              }
              fixIndexPos = fixIndexPos.concat([availablePos]);
              currentOffset = this.indexesPos + 30 * availablePos;
            }
            this.ctx.strokeStyle = this.loopC;
            this.ctx.fillStyle = this.indexFillC;
            this.ctx.beginPath();
            if (j >= 0 && j < this.elements[0].length) {
              this.ctx.arc(this.elements[0][j].x, this.elements[0][0].y - this.elements[0][0].height - this.elements[0][0].height * 0.3 - currentOffset - 3, 11.5, 0, 2 * Math.PI);
            } else if (j === -1) {
              this.ctx.arc(this.elements[0][0].x - this.elements[0][0].width - 2, this.elements[0][0].y - this.elements[0][0].height - this.elements[0][0].height * 0.3 - currentOffset - 3, 11.5, 0, 2 * Math.PI);
            } else {
              this.ctx.arc(this.elements[0][this.elements[0].length - 1].x + this.elements[0][0].width + 2, this.elements[0][0].y - this.elements[0][0].height - this.elements[0][0].height * 0.3 - currentOffset - 3, 11.5, 0, 2 * Math.PI);
            }
            if (currentOffset > maxOffset) {
              maxOffset = currentOffset;
            }
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.fillStyle = this.indexStrokeC;
            this.ctx.font = "bold 12px Courier New";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "alphabetic";
            if (j >= 0 && j < this.elements[0].length) {
              this.ctx.fillText(indexNames[n], this.elements[0][j].x, this.elements[0][0].y - this.elements[0][0].height - this.elements[0][0].height * 0.3 - currentOffset);
            } else if (j === -1) {
              this.ctx.fillText(indexNames[n], this.elements[0][0].x - this.elements[0][0].width - 2, this.elements[0][0].y - this.elements[0][0].height - this.elements[0][0].height * 0.3 - currentOffset);
            } else {
              this.ctx.fillText(indexNames[n], this.elements[0][this.elements[0].length - 1].x + this.elements[0][0].width + 2, this.elements[0][0].y - this.elements[0][0].height - this.elements[0][0].height * 0.3 - currentOffset);
            }
          }
        }
      }
      const centerX = this.x + (this.cols - 1) * (this.elements[0][0].width + gap) / 2;
      const bottomY = this.y + this.rows * (this.elements[0][0].height + gap) - this.elements[0][0].height / 5;
      this.ctx.fillStyle = "#888";
      this.ctx.font = "14px Arial";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(this.name, centerX, bottomY);
    }
    randomize = (min, max) => {
      for (let i = 0; i < this.elements.length; i++) {
        for (let j = 0; j < this.elements[i].length; j++) {
          const element = this.elements[i][j];
          element.randomize(min, max);
        }
      }
    };
    setRowIndexes(name, value, position = -1) {
      this.rowIndexes[name] = { "value": value, "position": position };
    }
    setColIndexes(name, value, position = -1) {
      this.colIndexes[name] = { "value": value, "position": position };
    }
    deleteIndexes(name) {
      delete this.rowIndexes[name];
      delete this.colIndexes[name];
      delete this.rowLoopMarkers[name];
      delete this.colLoopMarkers[name];
    }
    deleteAllIndexes() {
      this.rowIndexes = {};
      this.colIndexes = {};
      this.rowLoopMarkers = {};
      this.colLoopMarkers = {};
    }
    setRowLoopMarkers(name, from, to, backward = false) {
      this.rowLoopMarkers[name] = { "from": from, "to": to, "backward": backward };
    }
    setColLoopMarkers(name, from, to, backward = false) {
      this.colLoopMarkers[name] = { "from": from, "to": to, "backward": backward };
    }
    deleteLoopMarkers(name) {
      delete this.colLoopMarkers[name];
      delete this.rowLoopMarkers[name];
    }
    createMatrix(values) {
      const matrix = [];
      for (let i = 0; i < this.rows; i++) {
        const row = [];
        for (let j = 0; j < this.cols; j++) {
          const elementName = `${this.name}[${i}][${j}]`;
          const value = values[i] && values[i][j] !== void 0 ? values[i][j] : 0;
          const matrixElement = new matrixvis.MatrixElement(elementName, value, this.changeable);
          row.push(matrixElement);
        }
        matrix.push(row);
      }
      return matrix;
    }
    setSize(width, height) {
      const MAX_WIDTH = 50;
      const MAX_HEIGHT = 50;
      if (typeof width !== "number" || typeof height !== "number" || width <= 0 || height <= 0) {
        console.warn("Invalid width or height specified. Both must be positive numbers.");
        return;
      }
      if (width > MAX_WIDTH) {
        console.warn(`Width exceeds maximum allowed size of ${MAX_WIDTH}. Setting width to ${MAX_WIDTH}.`);
        width = MAX_WIDTH;
      }
      if (height > MAX_HEIGHT) {
        console.warn(`Height exceeds maximum allowed size of ${MAX_HEIGHT}. Setting height to ${MAX_HEIGHT}.`);
        height = MAX_HEIGHT;
      }
      for (let i = 0; i < this.elements.length; i++) {
        for (let j = 0; j < this.elements[i].length; j++) {
          const element = this.elements[i][j];
          element.width = width;
          element.height = height;
          element.copyWidth = width;
          element.copyHeight = height;
        }
      }
    }
    setMinValue(value) {
      for (let i = 0; i < this.elements.length; i++) {
        for (let j = 0; j < this.elements[i].length; j++) {
          this.elements[i][j].minValue = value;
        }
      }
    }
    setMaxValue(value) {
      for (let i = 0; i < this.elements.length; i++) {
        for (let j = 0; j < this.elements[i].length; j++) {
          this.elements[i][j].maxValue = value;
        }
      }
    }
  };

  // CanvasRenderer.js
  var CanvasRenderer = class {
    constructor(canvasId) {
      document.onselectstart = function() {
        return false;
      };
      this.canvas = document.getElementById(canvasId);
      this.canvas.parent = this;
      this.ctx = this.canvas.getContext("2d");
      this.matrixItems = {};
      this.vars = {};
      this.fps = 30;
      setInterval(() => this.render(), 1e3 / this.fps);
      this.controller = new matrixvis.Controller(this.ctx);
      this.controller.x = this.canvas.width / 6;
      this.controller.y = this.ctx.canvas.height - 30;
      this.canvas.addEventListener("mousemove", (e) => this.mouseMoveEvent(e));
      this.canvas.addEventListener("mousedown", (e) => this.mouseDownEvent(e));
      this.canvas.addEventListener("mouseup", (e) => this.mouseUpEvent(e));
      this.animating = 0;
      this.time = 1e3;
      this.render = (e) => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.controller.render();
        for (const matrixItem of Object.values(this.matrixItems)) {
          if (typeof matrixItem.render === "function") {
            matrixItem.render(this.ctx);
          }
        }
        for (const matrixItem of Object.values(this.matrixItems)) {
          if (matrixItem instanceof matrixvis.MatrixElement) {
            if (typeof matrixItem.copyRender === "function") {
              matrixItem.copyRender();
            }
          } else if (matrixItem instanceof matrixvis.Matrix) {
            for (let i = 0; i < matrixItem.elements.length; i++) {
              for (let j = 0; j < matrixItem.elements[i].length; j++) {
                if (typeof matrixItem.elements[i][j].copyRender === "function") {
                  matrixItem.elements[i][j].copyRender();
                }
              }
            }
          }
        }
      };
    }
    mouseMoveEvent = (e) => {
      const canvasRect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - canvasRect.left;
      const mouseY = e.clientY - canvasRect.top;
      let mouseCursor = "default";
      for (const obj of Object.values(this.controller)) {
        if (obj instanceof matrixvis.MatrixButton && obj.enabled) {
          if (obj.isOver(mouseX, mouseY)) {
            obj.color = obj.overColor;
            mouseCursor = "pointer";
          } else {
            obj.color = obj.defaultColor;
          }
        }
      }
      for (const obj of Object.values(this.matrixItems)) {
        if (obj instanceof matrixvis.MatrixElement) {
          if (obj.changeable && obj.isOver(mouseX, mouseY)) {
            mouseCursor = "pointer";
            obj.setDefaultOverColor();
          } else {
            if (obj.persistentColor) {
              obj.fillColor = obj.persistentColor;
            } else if (obj.comparing) {
              obj.setCompareColor();
            } else if (obj.copying && !obj.wasMoved) {
              obj.setCopyColor();
            } else if (obj.wasMoved) {
              obj.setGrayColor();
            } else {
              obj.setDefaultColor();
            }
          }
        }
        if (obj instanceof matrixvis.Matrix) {
          for (let i = 0; i < obj.elements.length; i++) {
            for (let j = 0; j < obj.elements[i].length; j++) {
              if (obj.elements[i][j].changeable && obj.elements[i][j].isOver(mouseX, mouseY)) {
                obj.elements[i][j].setDefaultOverColor();
                mouseCursor = "pointer";
              } else {
                if (obj.elements[i][j].persistentColor) {
                  obj.fillColor = obj.elements[i][j].persistentColor;
                } else if (obj.elements[i][j].comparing) {
                  obj.elements[i][j].setCompareColor();
                } else if (obj.elements[i][j].copying && !obj.elements[i][j].wasMoved) {
                  obj.elements[i][j].setCopyColor();
                } else if (obj.elements[i][j].wasMoved) {
                  obj.elements[i][j].setGrayColor();
                } else {
                  obj.elements[i][j].setDefaultColor();
                }
              }
            }
          }
        }
        if (obj instanceof matrixvis.MatrixButton && obj.enabled) {
          if (obj.isOver(mouseX, mouseY)) {
            obj.color = obj.overColor;
            mouseCursor = "pointer";
          } else {
            obj.color = obj.defaultColor;
          }
        }
      }
      e.target.style.cursor = mouseCursor;
    };
    mouseDownEvent = (e) => {
      if (e.button === 0) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;
        for (const obj of Object.values(this.controller)) {
          if (obj instanceof matrixvis.MatrixButton && obj.enabled) {
            if (obj.isOver(mouseX, mouseY)) {
              obj.clicked = true;
            }
          }
        }
        for (const obj of Object.values(this.matrixItems)) {
          if (obj instanceof matrixvis.MatrixElement) {
            if (obj.changeable && obj.isOver(mouseX, mouseY)) {
            }
          }
          if (obj instanceof matrixvis.Matrix) {
            for (let i = 0; i < obj.elements.length; i++) {
              for (let j = 0; j < obj.elements[i].length; j++) {
                if (obj.elements[i][j].changeable && obj.elements[i][j].isOver(mouseX, mouseY)) {
                }
              }
            }
          }
          if (obj instanceof matrixvis.MatrixButton && obj.enabled) {
            if (obj.isOver(mouseX, mouseY)) {
              obj.clicked = true;
              obj.clickFcn();
            }
          }
        }
      }
    };
    mouseUpEvent = (e) => {
      if (e.button === 0) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;
        for (const obj of Object.values(this.controller)) {
          if (obj instanceof matrixvis.MatrixButton && obj.enabled) {
            if (obj.isOver(mouseX, mouseY) && obj.clicked) {
              obj.clicked = false;
              obj.clickFcn();
            }
          }
        }
        for (const obj of Object.values(this.matrixItems)) {
          if (obj instanceof matrixvis.MatrixElement) {
            if (obj.changeable && obj.isOver(mouseX, mouseY)) {
              this.makeElementEditable(obj);
            }
          }
          if (obj instanceof matrixvis.Matrix) {
            for (let i = 0; i < obj.elements.length; i++) {
              for (let j = 0; j < obj.elements[i].length; j++) {
                if (obj.elements[i][j].changeable && obj.elements[i][j].isOver(mouseX, mouseY)) {
                  this.makeElementEditable(obj.elements[i][j]);
                }
              }
            }
          }
        }
      }
    };
    setSteps = (stepFunctions) => {
      this.controller.setSteps(stepFunctions);
    };
    add(matrixData, id) {
      if (this.matrixItems[id] !== void 0) {
        throw new Error(`Cannot add matrixItem ${id}, object with this id already exists.`);
      } else if (matrixData.id !== void 0) {
        throw new Error(`This object was already added to the canvas with ID: ${matrixData.id} .`);
      }
      matrixData.ctx = this.ctx;
      matrixData.id = id;
      this.matrixItems[id] = matrixData;
    }
    copy(obj1, obj2) {
      this.animating++;
      obj1.changeable = false;
      obj2.changeable = false;
      const fps = this.fps;
      const distance = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
      let time = distance * this.time / 100;
      if (time > this.time) {
        time = this.time;
      }
      let frames = Math.floor(time * fps / 1e3);
      let dx = (obj2.x - obj1.x) / frames;
      let dy = (obj2.y - obj1.y) / frames;
      let dw = (obj2.width - obj1.width) / frames;
      let dh = (obj2.height - obj1.height) / frames;
      const strokeC = obj1.strokeColor;
      const fillC = obj1.fillColor;
      obj1.startCopy();
      obj1.setCopyColor();
      const intervalId = setInterval(() => {
        frames--;
        if (frames > 0) {
          obj1.copyx += dx;
          obj1.copyy += dy;
          obj1.copyWidth += dw;
          obj1.copyHeight += dh;
        } else {
          obj1.copyx = obj2.x;
          obj1.copyy = obj2.y;
          obj1.copyWidth = obj2.width;
          obj1.copyHeight = obj2.height;
          obj2.value = obj1.value;
          obj2.sumvalue = obj2.value;
          obj2.minValue = obj1.minValue;
          obj2.maxValue = obj1.maxValue;
          obj2.strokeColor = strokeC;
          obj2.fillColor = fillC;
          obj2.wasMoved = false;
          clearInterval(intervalId);
          this.animating--;
        }
      }, 1e3 / fps);
    }
    swap(obj1, obj2) {
      this.animating++;
      obj1.changeable = false;
      obj2.changeable = false;
      const fps = this.fps;
      const distance = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
      let time = distance * this.time / 100;
      if (time > this.time) {
        time = this.time;
      }
      let frames = Math.floor(time * fps / 1e3);
      const dx = (obj2.x - obj1.x) / frames;
      const dy = (obj2.y - obj1.y) / frames;
      const strokeC = obj1.strokeColor;
      const fillC = obj1.fillColor;
      const dw1 = (obj2.width - obj1.width) / frames;
      const dh1 = (obj2.height - obj1.height) / frames;
      const dw2 = -dw1;
      const dh2 = -dh1;
      obj1.strokeColor = obj2.strokeColor;
      obj1.fillColor = obj2.fillColor;
      obj2.strokeColor = strokeC;
      obj2.fillColor = fillC;
      obj1.startCopy();
      obj2.startCopy();
      obj1.setGrayColor();
      obj2.setGrayColor();
      obj1.wasMoved = true;
      obj2.wasMoved = true;
      obj1.copyWidth = obj1.width;
      obj1.copyHeight = obj1.height;
      obj2.copyWidth = obj2.width;
      obj2.copyHeight = obj2.height;
      const intervalId = setInterval(() => {
        frames--;
        if (frames > 0) {
          obj1.copyx += dx;
          obj1.copyy += dy;
          obj2.copyx -= dx;
          obj2.copyy -= dy;
          obj1.copyWidth += dw1;
          obj1.copyHeight += dh1;
          obj2.copyWidth += dw2;
          obj2.copyHeight += dh2;
        } else {
          obj1.wasMoved = false;
          obj2.wasMoved = false;
          let tmp = obj2.value;
          obj2.value = obj1.value;
          obj1.value = tmp;
          tmp = obj2.sumvalue;
          obj2.sumvalue = obj1.sumvalue;
          obj1.sumvalue = tmp;
          obj1.copyx = obj1.x;
          obj1.copyy = obj1.y;
          obj2.copyx = obj2.x;
          obj2.copyy = obj2.y;
          obj1.copyWidth = obj1.width;
          obj1.copyHeight = obj1.height;
          obj2.copyWidth = obj2.width;
          obj2.copyHeight = obj2.height;
          clearInterval(intervalId);
          this.animating--;
        }
      }, 1e3 / fps);
    }
    move(obj1, obj2) {
      this.animating++;
      obj1.changeable = false;
      obj2.changeable = false;
      const fps = this.fps;
      const distance = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
      let time = distance * this.time / 100;
      if (time > this.time) {
        time = this.time;
      }
      let frames = Math.floor(time * fps / 1e3);
      const dx = (obj2.x - obj1.x) / frames;
      const dy = (obj2.y - obj1.y) / frames;
      const dw = (obj2.width - obj1.width) / frames;
      const dh = (obj2.height - obj1.height) / frames;
      const strokeC = obj1.strokeColor;
      const fillC = obj1.fillColor;
      obj1.startCopy();
      obj1.setGrayColor();
      obj1.wasMoved = true;
      obj1.copyWidth = obj1.width;
      obj1.copyHeight = obj1.height;
      const intervalId = setInterval(() => {
        frames--;
        if (frames > 0) {
          obj1.copyx += dx;
          obj1.copyy += dy;
          obj1.copyWidth += dw;
          obj1.copyHeight += dh;
        } else {
          obj1.copyx = obj2.x;
          obj1.copyy = obj2.y;
          obj1.copyWidth = obj2.width;
          obj1.copyHeight = obj2.height;
          obj2.value = obj1.value;
          obj2.sumvalue = obj2.value;
          obj2.minValue = obj1.minValue;
          obj2.maxValue = obj1.maxValue;
          obj2.strokeColor = strokeC;
          obj2.fillColor = fillC;
          obj2.wasMoved = false;
          obj1.wasSumming = true;
          obj1.value = 0;
          clearInterval(intervalId);
          this.animating--;
        }
      }, 1e3 / fps);
    }
    sum(obj1, obj2) {
      this.animating++;
      obj1.changeable = false;
      obj2.changeable = false;
      const fps = this.fps;
      const midX = obj2.x + obj2.width + 20;
      const midY = obj2.y;
      const distance1 = Math.hypot(midX - obj1.x, midY - obj1.y);
      const distance2 = Math.hypot(obj2.x - midX, obj2.y - midY);
      let time1 = distance1 * this.time / 100;
      let time2 = distance2 * this.time / 100;
      if (time1 > this.time) time1 = this.time;
      if (time2 > this.time) time2 = this.time;
      let frames1 = Math.floor(time1 * fps / 1e3);
      let frames2 = Math.floor(time2 * fps / 1e3);
      const dx1 = (midX - obj1.x) / frames1;
      const dy1 = (midY - obj1.y) / frames1;
      const dx2 = (obj2.x - midX) / frames2;
      const dy2 = (obj2.y - midY) / frames2;
      const dw1 = (obj2.width - obj1.width) / frames1;
      const dh1 = (obj2.height - obj1.height) / frames1;
      const strokeC = obj1.strokeColor;
      const fillC = obj1.fillColor;
      obj1.summing = true;
      obj1.startCopy();
      obj1.setCopyColor();
      obj1.copyWidth = obj1.width;
      obj1.copyHeight = obj1.height;
      let phase = 1;
      const intervalId = setInterval(() => {
        if (phase === 1) {
          if (frames1 > 0) {
            obj1.copyx += dx1;
            obj1.copyy += dy1;
            obj1.copyWidth += dw1;
            obj1.copyHeight += dh1;
            frames1--;
          } else {
            obj1.copyWidth = obj2.width;
            obj1.copyHeight = obj2.height;
            phase = 2;
          }
        } else if (phase === 2) {
          if (frames2 > 0) {
            obj1.copyx += dx2;
            obj1.copyy += dy2;
            frames2--;
            obj1.summing = false;
          } else {
            obj1.copyx = obj2.x;
            obj1.copyy = obj2.y;
            obj1.copyWidth = obj2.width;
            obj1.copyHeight = obj2.height;
            obj2.value += obj1.value;
            obj2.sumvalue = obj2.value;
            obj1.sumvalue = obj2.value;
            obj1.wasSumming = true;
            obj2.strokeColor = strokeC;
            obj2.fillColor = fillC;
            obj2.wasMoved = false;
            clearInterval(intervalId);
            this.animating--;
          }
        }
      }, 1e3 / fps);
    }
    compare(obj1, obj2) {
      obj1.startCompare();
      if (obj1 !== obj2) {
        obj2.startCompare();
      }
    }
    get(id) {
      return this.matrixItems[id];
    }
    makeElementEditable = (element) => {
      const input = document.createElement("input");
      input.type = "number";
      input.value = element.value;
	  input.min = element.minValue;
	  input.max = element.maxValue;
      input.style.position = "absolute";
      const rect = this.canvas.getBoundingClientRect();
      input.style.left = `${rect.left + window.scrollX + element.x - element.width / 2}px`;
      input.style.top = `${rect.top + window.scrollY + element.y - element.height}px`;
      input.style.width = `${element.width}px`;
      input.style.zIndex = 10;
      document.body.appendChild(input);
      input.focus();
      input.onblur = () => {
        this.updateElementValue(element, input);
      };
      input.onkeydown = (e) => {
        if (e.key === "Enter") {
          input.blur();
        }
      };
    };
    updateElementValue = (element, input) => {
      var newValue = parseInt(input.value, 10);
      if (!isNaN(newValue) && element.changeable) {
		if (newValue < element.minValue) { newValue = element.minValue; }
		if (newValue > element.maxValue) { newValue = element.maxValue; }
        element.updateValue(newValue);
        element.setUpdateColor();
      }
      document.body.removeChild(input);
    };
    stopComparingAndCopying = () => {
      for (const element of Object.values(this.matrixItems)) {
        if (element instanceof matrixvis.MatrixElement) {
          if (element.comparing) {
            element.stopCompare();
          }
          if (element.copying) {
            element.stopCopy();
          }
        }
        if (element instanceof matrixvis.Matrix) {
          for (let i = 0; i < element.elements.length; i++) {
            for (let j = 0; j < element.elements[i].length; j++) {
              if (element.elements[i][j].comparing) {
                element.elements[i][j].stopCompare();
              }
              if (element.elements[i][j].copying) {
                element.elements[i][j].stopCopy();
              }
            }
          }
        }
      }
    };
  };

  // Controller.js
  var Controller = class {
    constructor(ctx) {
      this.x = 0;
      this.y = 0;
      this.ctx = ctx;
      this.functionIndex = [0];
      this.stepFunctions = null;
      this.isPlaying = false;
      this.isWaiting = false;
      this.singleStep = false;
      this.autoNextStep = -1;
      this.undo = [];
      this.animationStepCheckID = null;
      this.resetIfPossible = false;
      this.resetLabel = "Reset";
      this.startLabel = "Play";
      this.stopLabel = "Stop";
      this.prevLabel = "\u25C4\u25C4";
      this.prevSingleLabel = "\u25C4";
      this.nextSingleLabel = "\u25BA";
      this.nextLabel = "\u25BA\u25BA";
      this.reset = new matrixvis.MatrixButton(this.resetLabel, 80, this.resetAnimation);
      this.startStop = new matrixvis.MatrixButton(this.startLabel, 80, this.startStopAnimation);
      this.prevStep = new matrixvis.MatrixButton(this.prevLabel, 80, this.previousStepFunction);
      this.nextStep = new matrixvis.MatrixButton(this.nextLabel, 80, this.nextStepFunction);
      this.prevSingleStep = new matrixvis.MatrixButton(this.prevSingleLabel, 80, this.previousSingleStepFunction);
      this.nextSingleStep = new matrixvis.MatrixButton(this.nextSingleLabel, 80, this.nextSingleStepFunction);
      this.reset.enabled = false;
      this.prevStep.enabled = false;
      this.prevSingleStep.enabled = false;
    }
    restoreStepfromUndo = (stepNumber) => {
      const mainCanvas = this.ctx.canvas.parent;
      const updateAttributes = (source, target) => {
        Object.entries(source).forEach(([key, value]) => {
          try {
            if (typeof value === "object" && value !== null) {
              if (!target.hasOwnProperty(key)) {
                target[key] = Array.isArray(value) ? [] : {};
              }
              updateAttributes(value, target[key]);
            } else {
              target[key] = value;
            }
          } catch (err) {
            console.warn(`Cannot update key: ${key} \u2192 Read-Only Error:`, err);
          }
        });
      };
      const cleanProperties = (source, target) => {
        Object.keys(target).forEach((key) => {
          try {
            if (typeof target[key] === "object" && target[key] !== null) {
              if (source.hasOwnProperty(key)) {
                cleanProperties(source[key], target[key]);
              } else {
                delete target[key];
              }
            } else if (!source.hasOwnProperty(key)) {
              delete target[key];
            }
          } catch (err) {
            console.warn(`Cannot delete key: ${key} \u2192 Read-Only Error:`, err);
          }
        });
      };
      const vars = JSON.parse(this.undo[stepNumber][0]);
      updateAttributes(vars, mainCanvas.vars);
      cleanProperties(vars, mainCanvas.vars);
      const matrixItems = JSON.parse(this.undo[stepNumber][1]);
      updateAttributes(matrixItems, mainCanvas.matrixItems);
      Object.values(mainCanvas.matrixItems).forEach((item) => {
        if (item instanceof matrixvis.MatrixCode) {
          if (matrixItems[item.id] && Array.isArray(matrixItems[item.id].selected)) {
            item.selected = [...matrixItems[item.id].selected];
          } else {
            item.selected = [];
          }
        }
        if (item instanceof matrixvis.Matrix) {
          if (matrixItems[item.id]) {
            item.rowIndexes = matrixItems[item.id].rowIndexes ? { ...matrixItems[item.id].rowIndexes } : {};
            item.colIndexes = matrixItems[item.id].colIndexes ? { ...matrixItems[item.id].colIndexes } : {};
            item.rowLoopMarkers = matrixItems[item.id].rowLoopMarkers ? { ...matrixItems[item.id].rowLoopMarkers } : {};
            item.colLoopMarkers = matrixItems[item.id].colLoopMarkers ? { ...matrixItems[item.id].colLoopMarkers } : {};
          } else {
            item.rowIndexes = {};
            item.colIndexes = {};
            item.rowLoopMarkers = {};
            item.colLoopMarkers = {};
          }
        }
      });
      this.functionIndex = JSON.parse(this.undo[stepNumber][2]);
      this.autoNextStep = this.undo[stepNumber][6];
    };
    resetAnimation = () => {
      const mainCanvas = this.ctx.canvas.parent;
      if (mainCanvas.animating === 0 && !this.isWaiting) {
        this.resetIfPossible = false;
        this.isPlaying = false;
        this.autoNextStep = -1;
        this.startStop.text = this.startLabel;
        this.restoreStepfromUndo(0);
        this.undo = [];
        this.reset.enabled = false;
        this.startStop.enabled = true;
        this.prevSingleStep.enabled = false;
        this.prevStep.enabled = false;
        this.nextSingleStep.enabled = true;
        this.nextStep.enabled = true;
      } else if (mainCanvas.animating > 0 || this.isWaiting) {
        this.resetIfPossible = true;
      }
    };
    startStopAnimation = () => {
      const mainCanvas = this.ctx.canvas.parent;
      this.singleStep = false;
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.startStop.text = this.stopLabel;
        this.prevSingleStep.enabled = false;
        this.nextSingleStep.enabled = false;
        this.prevStep.enabled = false;
        this.nextStep.enabled = false;
        if (mainCanvas.animating === 0) {
          this.nextStepAnimation();
        }
      } else {
        this.isPlaying = false;
        this.startStop.text = this.startLabel;
        if (this.undo.length > 0) {
          this.prevSingleStep.enabled = true;
          this.prevStep.enabled = true;
        }
        this.nextSingleStep.enabled = true;
        this.nextStep.enabled = true;
      }
    };
    previousStepAnimation = () => {
      const mainCanvas = this.ctx.canvas.parent;
      if (mainCanvas.animating === 0 && !this.isWaiting) {
        let i = this.undo.length - 1;
        if (!this.singleStep) {
          while (this.undo[i][6] > 0) {
            i--;
          }
        }
        this.restoreStepfromUndo(i);
        this.undo = this.undo.slice(0, i);
        if (this.undo.length === 0) {
          this.prevStep.enabled = false;
          this.prevSingleStep.enabled = false;
          this.reset.enabled = false;
        }
        this.startStop.enabled = true;
        this.nextSingleStep.enabled = true;
        this.nextStep.enabled = true;
      }
    };
    animationWaitDone = () => {
      this.isWaiting = false;
      if (this.resetIfPossible) {
        this.resetAnimation();
      } else if (this.isPlaying || this.autoNextStep > 0) {
        this.nextStepAnimation();
      }
    };
    checkIfAnimationStepDone = () => {
      const mainCanvas = this.ctx.canvas.parent;
      if (mainCanvas.animating === 0 && !this.isWaiting) {
        clearInterval(this.animationStepCheckID);
        if (this.resetIfPossible) {
          this.resetAnimation();
        } else if (this.autoNextStep === 0) {
          this.nextStepAnimation();
        } else if (this.autoNextStep > 0 && !this.singleStep) {
          this.isWaiting = true;
          setTimeout(this.animationWaitDone, mainCanvas.time / 1e3 * this.autoNextStep);
        } else if (this.isPlaying) {
          this.isWaiting = true;
          setTimeout(this.animationWaitDone, mainCanvas.time);
        }
      }
    };
    nextStepAnimation = () => {
      const mainCanvas = this.ctx.canvas.parent;
      if (mainCanvas.animating === 0 && !this.isWaiting && this.stepFunctions != null) {
        for (const matrixItem of Object.values(mainCanvas.matrixItems)) {
          if (matrixItem instanceof matrixvis.MatrixElement) {
            matrixItem.wasSumming = false;
          } else if (matrixItem instanceof matrixvis.Matrix) {
            for (let i2 = 0; i2 < matrixItem.elements.length; i2++) {
              for (let j = 0; j < matrixItem.elements[i2].length; j++) {
                matrixItem.elements[i2][j].wasSumming = false;
              }
            }
          }
        }
        if (this.autoNextStep !== 0) {
          this.reset.enabled = true;
          if (!this.isPlaying) {
            this.prevStep.enabled = true;
            this.prevSingleStep.enabled = true;
          }
          const i2 = this.undo.length;
          this.undo.push([
            JSON.stringify(mainCanvas.vars),
            JSON.stringify(mainCanvas.matrixItems),
            JSON.stringify(this.functionIndex),
            this.autoNextStep
          ]);
        }
        mainCanvas.stopComparingAndCopying();
      }
      let i = 0;
      const stepsArray = [this.stepFunctions];
      const stepsCheck = [null];
      while (Array.isArray(stepsArray[i][this.functionIndex[i]])) {
        stepsCheck[i + 1] = stepsArray[i][this.functionIndex[i] + 1];
        stepsArray[i + 1] = stepsArray[i][this.functionIndex[i]];
        i++;
        if (i >= this.functionIndex.length) {
          this.functionIndex[i] = 0;
        }
      }
      this.autoNextStep = stepsArray[i][this.functionIndex[i]]?.() ?? -1;
      let ok;
      do {
        ok = true;
        this.functionIndex[i]++;
        if (this.functionIndex[i] >= stepsArray[i].length) {
          if (stepsCheck[i]) {
            if (stepsCheck[i]()) {
              this.functionIndex[i] = 0;
            } else {
              i--;
              this.functionIndex[i]++;
              this.functionIndex = this.functionIndex.slice(0, i + 1);
              ok = false;
            }
          } else {
            this.autoNextStep = -1;
            this.isPlaying = false;
            if (this.undo.length > 0) {
              this.prevSingleStep.enabled = true;
              this.prevStep.enabled = true;
            }
            this.nextSingleStep.enabled = false;
            this.nextStep.enabled = false;
            this.startStop.enabled = false;
            this.startStop.text = this.startLabel;
          }
        }
      } while (!ok);
      this.animationStepCheckID = setInterval(this.checkIfAnimationStepDone, 10);
    };
    previousStepFunction = () => {
      this.singleStep = false;
      this.previousStepAnimation();
    };
    nextStepFunction = () => {
      const mainCanvas = this.ctx.canvas.parent;
      if (mainCanvas.animating > 0 || this.isWaiting) {
        return;
      }
      this.singleStep = false;
      this.nextStepAnimation();
    };
    previousSingleStepFunction = () => {
      this.singleStep = true;
      this.previousStepAnimation();
    };
    nextSingleStepFunction = () => {
      const mainCanvas = this.ctx.canvas.parent;
      if (mainCanvas.animating > 0 || this.isWaiting) {
        return;
      }
      this.singleStep = true;
      this.nextStepAnimation();
    };
    setSteps = (stepFunctions) => {
      this.stepFunctions = stepFunctions;
    };
    render = () => {
      const canvasWidth = this.ctx.canvas.clientWidth;
      this.ctx.setLineDash([]);
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#000";
      this.ctx.moveTo(0, this.y - 30 + 0.5);
      this.ctx.lineTo(this.ctx.canvas.clientWidth, this.y - 30 + 0.5);
      this.ctx.stroke();
      const buttons = [
        this.startStop,
        this.reset,
        this.prevStep,
        this.prevSingleStep,
        this.nextSingleStep,
        this.nextStep
      ];
      let totalButtonWidth = buttons.reduce((sum, button) => sum + button.width + 10, -10);
      let currentX = (canvasWidth - totalButtonWidth) / 2;
      buttons.forEach((button) => {
        if (button.width > 0) {
          button.ctx = this.ctx;
          button.x = currentX + button.width / 2;
          button.y = this.y;
          button.render();
          currentX += button.width + 10;
        }
      });
    };
  };

  // MatrixElements.js
  var MatrixElement = class extends MatrixData {
    constructor(name, value, changeable, showLabel) {
      super();
      if (typeof changeable === "undefined") {
        changeable = false;
      }
      if (typeof showLabel === "undefined") {
        showLabel = false;
      }
      this.name = name;
      this.value = value;
      this.maxValue = 99;
      this.minValue = -99;
      this.changeable = changeable;
      this.showLabel = showLabel;
      this.summing = false;
      this.sumvalue = value;
      this.wasSumming = false;
      this.wasMoved = false;
      this.copying = false;
      this.copyx = 0;
      this.copyy = 0;
      this.copyWidth = 30;
      this.copyHeight = 30;
      this.comparing = false;
      this.minSize = 35;
      this.maxSize = 50;
      this.width = 30;
      this.height = 30;
      this.fillColor = "#EEE";
      this.strokeColor = "#000";
      this.defaultColor = "#EEE";
      this.greenColor = "#579F6E";
      this.orangeColor = "#F9B900";
      this.lightOrangeColor = "#FFDA99";
      this.grayColor = "#BBBBBB";
      this.blackColor = "#000";
      this.updateColor = "#9FD7B6";
      this.originalFillColor = "#EEE";
      this.originalStrokeColor = "#000";
      this.persistentColor = null;
    }
    render() {
      this.ctx.fillStyle = this.fillColor;
      this.ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      this.ctx.setLineDash([]);
      this.ctx.strokeStyle = this.blackColor;
      this.ctx.strokeRect(this.x - this.width / 2 - 0.5, this.y - this.height / 2 - 0.5, this.width + 1, this.height + 1);
      if (this.comparing) {
        this.ctx.fillStyle = "#FFF";
        this.ctx.globalAlpha = 0.5;
        const textSize = (this.width + this.height) / 2;
        this.ctx.font = "bold " + textSize + "px serif";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("?", this.x, this.y);
        this.ctx.globalAlpha = 1;
      }
      this.ctx.fillStyle = this.strokeColor;
      this.ctx.font = "16px Arial";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(this.value, this.x, this.y);
      if (this.showLabel) {
        this.ctx.fillStyle = this.blackColor;
        this.ctx.font = "12px Arial";
        this.ctx.textBaseline = "alphabetic";
        this.ctx.fillText(this.name, this.x, this.y - this.height / 2 - 5);
      }
    }
    copyRender() {
      if (this.copying) {
        this.ctx.fillStyle = this.orangeColor;
        this.ctx.fillRect(this.copyx - this.copyWidth / 2, this.copyy - this.copyHeight / 2, this.copyWidth, this.copyHeight);
        this.ctx.setLineDash([5]);
        this.ctx.strokeStyle = this.blackColor;
        this.ctx.strokeRect(this.copyx - this.copyWidth / 2 - 0.5, this.copyy - this.copyHeight / 2 - 0.5, this.copyWidth + 1, this.copyHeight + 1);
        if (this.wasSumming) {
          this.ctx.fillStyle = this.blackColor;
          this.ctx.font = "16px Arial";
          this.ctx.textAlign = "center";
          this.ctx.textBaseline = "middle";
          this.ctx.fillText(this.sumvalue, this.copyx, this.copyy);
        } else {
          this.ctx.fillStyle = this.blackColor;
          this.ctx.font = "16px Arial";
          this.ctx.textAlign = "center";
          this.ctx.textBaseline = "middle";
          this.ctx.fillText(this.value, this.copyx, this.copyy);
        }
        if (this.summing) {
          this.ctx.setLineDash([]);
          this.ctx.beginPath();
          this.ctx.arc(this.copyx - this.copyWidth / 2 - 10, this.copyy, 7, 0, 2 * Math.PI, false);
          this.ctx.fillStyle = this.orangeColor;
          this.ctx.fill();
          this.ctx.fillStyle = this.strokeColor;
          this.ctx.stroke();
          this.ctx.font = "20px Arial";
          this.ctx.fillStyle = this.strokeColor;
          this.ctx.fillText("+", this.copyx - this.copyWidth / 2 - 10, this.copyy);
        }
      }
    }
    // set random value to element
    randomize = (min, max) => {
      min = typeof min === "undefined" ? this.minValue : min;
      max = typeof max === "undefined" ? this.maxValue : max;
      if (min > max) {
        [min, max] = [max, min];
      }
      this.value = Math.floor(Math.random() * (max - min) + min);
      this.sumvalue = this.value;
    };
    setSize(width, height) {
      if (typeof width !== "number" || typeof height !== "number" || width <= 0 || height <= 0) {
        console.warn("Invalid width or height specified. Both must be positive numbers.");
        return;
      }
      if (width > this.maxSize) {
        console.warn(`Width exceeds maximum allowed size of ${this.maxSize}. Setting width to ${this.maxSize}.`);
        width = this.maxSize;
      }
      if (height > this.maxSize) {
        console.warn(`Height exceeds maximum allowed size of ${this.maxSize}. Setting height to ${this.maxSize}.`);
        height = this.maxSize;
      }
      if (width < this.minSize) {
        console.warn(`Width exceeds maximum allowed size of ${this.maxSize}. Setting width to ${this.minSize}.`);
        width = this.minSize;
      }
      if (height < this.minSize) {
        console.warn(`Height exceeds maximum allowed size of ${this.maxSize}. Setting height to ${this.minSize}.`);
        height = this.minSize;
      }
      this.height = height;
      this.width = width;
      this.copyWidth = width;
      this.copyHeight = height;
    }
    isOver = (x, y) => {
      return this.width > 0 && x >= this.x - this.width / 2 && x <= this.x + this.width / 2 && y >= this.y - this.height / 2 && y <= this.y + this.height / 2;
    };
    startCopy() {
      this.originalFillColor = this.fillColor;
      this.originalStrokeColor = this.strokeColor;
      this.copyx = this.x;
      this.copyy = this.y;
      this.copying = true;
    }
    stopCopy() {
      if (this.copying && this.wasMoved) {
        this.fillColor = this.grayColor;
        this.strokeColor = this.grayColor;
        this.copying = false;
      } else if (this.copying && !this.wasMoved) {
        this.fillColor = this.originalFillColor;
        this.strokeColor = this.originalStrokeColor;
        this.copying = false;
      }
    }
    startCompare() {
      this.originalFillColor = this.fillColor;
      this.originalStrokeColor = this.strokeColor;
      this.fillColor = this.orangeColor;
      this.strokeColor = this.blackColor;
      this.comparing = true;
    }
    stopCompare() {
      if (this.comparing) {
        this.fillColor = this.originalFillColor;
        this.strokeColor = this.originalStrokeColor;
        this.comparing = false;
        this.changeable = false;
      }
    }
    updateValue(value) {
      this.value = value;
      this.sumvalue = value;
    }
    setDefaultColor() {
      this.persistentColor = null;
      this.fillColor = this.defaultColor;
      this.strokeColor = this.blackColor;
    }
    // setting color when object is changeable and mouse is over
    setDefaultOverColor() {
      if (!this.persistentColor) {
        this.fillColor = "#CCC";
      }
    }
    // setting color to green, when something is done
    setGreenColor() {
      this.fillColor = this.greenColor;
      this.strokeColor = "#000";
      this.persistentColor = this.greenColor;
    }
    setCompareColor() {
      this.fillColor = this.orangeColor;
      this.strokeColor = this.blackColor;
    }
    setCopyColor() {
      this.fillColor = this.lightOrangeColor;
      this.strokeColor = this.blackColor;
    }
    setGrayColor() {
      this.fillColor = this.grayColor;
      this.strokeColor = this.grayColor;
    }
    setUpdateColor() {
      this.fillColor = this.updateColor;
      this.strokeColor = "#000";
    }
    setOrangeColor() {
      this.fillColor = this.orangeColor;
      this.strokeColor = this.blackColor;
      this.persistentColor = this.orangeColor;
    }
  };

  // MatrixCode.js
  var MatrixCode = class extends MatrixData {
    constructor(code) {
      super();
      this.code = code;
      this.selected = [];
      this.selectionColor = "#7bbaa7";
    }
    render() {
      this.ctx.font = "bold 16px Courier New";
      const maxWidth = Math.max(...this.code.map((line) => this.ctx.measureText(line).width));
      this.ctx.fillStyle = this.selectionColor;
      this.selected.forEach((selectedIndex) => {
        this.ctx.fillRect(this.x, this.y + selectedIndex * 22, maxWidth + 20, 20);
      });
      this.ctx.fillStyle = "#000";
      this.ctx.textAlign = "left";
      this.ctx.textBaseline = "top";
      this.code.forEach((line, i) => {
        this.ctx.fillText(line, this.x + 20, this.y + 1 + i * 22);
      });
    }
  };

  // MatrixButton.js
  var MatrixButton = class extends MatrixData {
    constructor(text, width, clickFcn) {
      super();
      this.x = 0;
      this.y = 0;
      this.text = text;
      this.width = width;
      this.height = 28;
      this.enabled = true;
      this.clicked = false;
      this.clickFcn = clickFcn;
      this.color = "#579F6E";
      this.font = "bold 16px Arial";
      this.strokeColor = "#FFF";
      this.defaultColor = "#579F6E";
      this.disabledColor = "#999";
      this.overColor = "#357D4B";
    }
    render(ctx) {
      if (this.width > 0) {
        if (this.enabled === true) {
          this.ctx.fillStyle = this.color;
        } else {
          this.ctx.fillStyle = this.disabledColor;
        }
        this.ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        this.ctx.strokeStyle = this.color;
        this.ctx.strokeRect(this.x - this.width / 2 - 0.5, this.y - this.height / 2 - 0.5, this.width + 1, this.height + 1);
        if (this.enabled === true) {
          this.ctx.fillStyle = this.strokeColor;
        } else {
          this.ctx.fillStyle = "#000";
        }
        this.ctx.font = this.font;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.text, this.x, this.y);
      }
    }
    isOver = (x, y) => {
      return this.width > 0 && x >= this.x - this.width / 2 && x <= this.x + this.width / 2 && y >= this.y - this.height / 2 && y <= this.y + this.height / 2;
    };
  };

  // index.js
  var matrixvis = {
    Matrix,
    MatrixElement,
    CanvasRenderer,
    Controller,
    MatrixData,
    MatrixCode,
    MatrixButton
  };
  if (typeof window !== "undefined") {
    window.matrixvis = matrixvis;
  }
})();
