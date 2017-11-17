window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

function BubbleChart(divId, width, height, bubbleColour) {
    // USAGE: Have an empty div on the page with an ID
    // Dom ID of the div in which to place the chart
    this.divId = divId;
    // Width and height of the chart
    this.width = width;
    this.height = height;
    // Colour of the bubbles on the chart
    this.bubbleColour = bubbleColour;
    
    // Offset from the edge at which to draw the graph axes
    this.axisOffset = 90;

    // Maximum radius of a circle
    this.maxRadius = 60;

    // Bubbles on the chart
    this._bubbles = [];

    // Chart data
    this.data = null;

    // Selected date
    this.selectedDate = null;

    // Housekeeping
    this.canvas = null;
    this.context = null;
}

BubbleChart.prototype.isAnimating = function() {
    return this.curAnimStep !== null;
}

BubbleChart.prototype.init = function() {
    // Log this
    console.log('Initialising bubble chart in #' + this.divId);

    // Create new canvas object
    var canvasClass = 'bubble-chart';
    var canvasId = this._findCanvasId(canvasClass, 100);

    var canvas = $('<canvas/>', {
        'class': canvasClass,
        'id': canvasId
    }).prop({
        'width': this.width,
        'height': this.height
    });

    // Inject into supplied divId
    $('#' + this.divId).append(canvas);

    // Save...
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    // Let the drawing begin!
    requestAnimFrame(this.draw.bind(this));
};

BubbleChart.prototype._findCanvasId = function(base_id, max_charts) {
    // Might have multiple charts on the field. Look for the next free ID to use
    for(var i = 0; i < max_charts; i++) {
        if (!document.getElementById(name)) {
            return base_id + '-' + i;
        }
    }

    // We don't want to loop forever. Limit
    alert('Too many charts on the page');
    throw new Error("Too many charts on the page");
};


BubbleChart.prototype.draw = function() {
    // Clear canvas for redrawing
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Main draw loop. Draw all the things!
    // this._drawTitle();
    this._drawAxes();
    this._drawAxesLabels();

    if (this.data && this.selectedDate) {
        var bubbles = this.data;
        this._drawBubbles(bubbles);
    }

    // Keep the draw loop going. Bind the context of BubbleChart so that we can still
    // access class variables inside draw
    requestAnimFrame(this.draw.bind(this));
};

BubbleChart.prototype._drawCircle = function(x, y, radius, intensity) {
    var context = this.context;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = intensity;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = '#000000';
    context.stroke();
    context.closePath();
};

BubbleChart.prototype._drawAxis = function(startX, startY, endX, endY) {
    var context = this.context;
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.lineWidth = 1;
    context.strokeStyle = '#000000';
    context.stroke();
    context.closePath();
};

BubbleChart.prototype.scaleX = function(x) {
    // Scale an X value so it sits inside the chart axis
    return this.axisOffset + (x / 100.0) * (this.width - (2 * this.axisOffset));
}

BubbleChart.prototype.scaleY = function(y) {
    // Scale a Y value so it sits inside the chart axis. Also reverse the axis so that
    // 0,0 is at 0,0 on the drawn axis not the top right of the canvas
    return this.height - (this.axisOffset + (y / 100.0) * (this.height - (2 * this.axisOffset)));
}

BubbleChart.prototype._drawBubbles = function(debts) {
    if (!debts) {
        return;
    }

    for(var i = 0; i < debts.length; i++) {
        var debt = debts[i];
        var bubble = debt.bubble;

        var x = this.scaleX(bubble.current.x);
        var y = this.scaleY(bubble.current.y);
        
        var radius = bubble.current.radius;
        this._drawCircle(x, y, radius, shadeColor2(this.bubbleColour, 1 - (bubble.current.intensity / 100.0)));
        this._drawLabel(x, y, debt.name);
    }
};

BubbleChart.prototype._drawLabel = function(x, y, label) {
    this.context.font = "12px Noto Sans";
    this.context.fillStyle = "black";
    this.context.textAlign = "center";  

    this.context.fillText(label, x, y);
};

BubbleChart.prototype._drawTitle = function() {
    this.context.font = "36px Noto Sans";
    this.context.fillStyle = "black";
    this.context.textAlign = "center";  

    var title = 'Debt as of  ' + this.selectedDate;
    this.context.fillText(title, this.width / 2, 40);
};

BubbleChart.prototype._drawAxes = function() {
    this.context.font = "20px Noto Sans";
    this.context.fillStyle = "black";
    // Draw X axis
    this._drawAxis(this.axisOffset, this.height - this.axisOffset, this.width - this.axisOffset, this.height - this.axisOffset);
    for(var i = 0; i <= 100; i+=10) {
        this._drawAxis(this.axisOffset, this.scaleY(i), this.width - this.axisOffset, this.scaleY(i));
        this._drawAxis(this.scaleX(i), this.scaleY(0), this.scaleX(i), this.scaleY(-2));  
        this.context.textAlign = "center";  
        this.context.fillText(i, this.scaleX(i), this.scaleY(-5));
    }

    // Draw Y axis
    this._drawAxis(this.axisOffset, this.axisOffset, this.axisOffset, this.height - this.axisOffset);
    for(var i = 0; i <= 100; i+=10) {
        this._drawAxis(this.scaleX(i), this.axisOffset, this.scaleX(i), this.height - this.axisOffset);
        this._drawAxis(this.scaleX(0), this.scaleY(i), this.scaleX(-2), this.scaleY(i));
        this.context.textAlign = "right";
        this.context.fillText(i, this.scaleX(-3), this.scaleY(i) + 5);
    }
};

BubbleChart.prototype._drawAxesLabels = function() {
    this.context.font = "20px Noto Sans";
    this.context.fillStyle = "black";
    this.context.textAlign = "center";

    this.context.fillText("Time Remaining (%)", this.scaleX(50), this.height - this.axisOffset / 5);
    fillTextRotated(this.context, "Balance Remaining (%)", this.axisOffset / 4, this.scaleY(50));
};

function fillTextRotated(context, text, x, y) {
    context.save();
    context.translate(x, this.height / 2);
    context.rotate(-Math.PI/2);
    context.textAlign = "center";
    context.fillText(text, 0, 0);
    context.restore();
}

BubbleChart.prototype.setData = function(debts) {
    this.debts = debts;
};

BubbleChart.prototype.setDate = function(date) {
    // Copy debts so date change can recalculate debts
    var newDebts = $.extend(true, [], this.debts);

    var plan = this._generatePlan(date, newDebts);
    this.selectedDate = date;
    this.data = plan;

    return plan;
}

BubbleChart.prototype._generatePlan = function(planDate, debts) {
    var includedDebts = this._debtsOnOrBefore(planDate, debts);
    
    this._setPercentBalance(planDate, includedDebts);
    var filteredDebts = [];
    for (var i = 0; i < includedDebts.length; i++) {
        var debt = includedDebts[i];
        if (debt.percentBalance < 100) {
            filteredDebts.push(debt);
        }
    }

    this._setPriorities(filteredDebts);
    this._setPayOffDates(filteredDebts);

    this._setPercentTime(planDate, filteredDebts);


    this._setBubbleInfo(planDate, filteredDebts);

    return filteredDebts;
};

BubbleChart.prototype._setBubbleInfo = function(planDate, debts) {
    var maxBalance = 0;
    for (var i = 0; i < debts.length; i++) {
        var debt = debts[i];
        maxBalance = debt.totalBalance > maxBalance ? debt.totalBalance : maxBalance;
    }

    for (var i = 0; i < debts.length; i++) {
        var debt = debts[i];

        debt.bubble = {};
        debt.bubble.next = {};
        debt.bubble.current = {};

        debt.bubble.current.x = debt.bubble.next.x = debt.percentTime;
        debt.bubble.current.y = debt.bubble.next.y = debt.percentBalance;
        debt.bubble.current.radius = debt.bubble.next.radius = this.maxRadius - ((debt.priority - 1) * (this.maxRadius / debts.length));
        debt.bubble.current.intensity = debt.bubble.next.intensity = (debt.totalBalance / maxBalance) * 100.0;
    }
}

BubbleChart.prototype._setPriorities = function(debts) {
    // Sort so lowest divison is first, according to debt plan
    // this is highest priority
    var sorted = $(debts).sort(function (a, b) {return (a.totalBalance / a.recurringPayment) > (b.totalBalance / b.recurringPayment);});

    // Set Priorities
    for (var i = 0; i < sorted.length; i++) {
        var debt = sorted[i];
        debt.priority = i + 1;
    }

    return debts;
}

BubbleChart.prototype._setPayOffDates = function(debts) {
    // TODO: Calculate accumulated payment
    var paymentFromPreviousDebts = 0;

    // user may filter so that there are no debts
    if (debts.length == 0) return;

    // Calculate for priority #1 separately, it works differently
    debts[0].payOffDate = this._calculatePayOffDate(debts[0].recurringPayment * 1.1 + paymentFromPreviousDebts, debts[0].totalBalance, debts[0].addDate, debts[0].payOffPeriod);
    for (var i = 1; i < debts.length; i++) {
        var debt = debts[i];
        debt.payOffDate = this._calculatePayOffDate(debt.recurringPayment + paymentFromPreviousDebts, debt.totalBalance, debt.addDate, debt.payOffPeriod);
    }

    return debts;
}

BubbleChart.prototype._calculatePayOffDate = function(amount, total, addDate, periodicity) {
    var periods = 0;
    var runningTotal = amount;

    while (runningTotal < total) {
        periods += 1;
        runningTotal += amount;
    }

    var momentdict = {
        'monthly': 'months',
        'weekly': 'weeks'
    }

    return moment(addDate).add(periods, momentdict[periodicity]).format("YYYY-MM-DD");
}

BubbleChart.prototype._setPercentBalance = function(planDate, debts) {
    for (var i = 0; i < debts.length; i++) {
        var debt = debts[i];

        var totalPaid = debt.payments.map(function(payment) {
            if (moment(planDate) >= moment(payment.paymentDate)) {
                return payment.amount;
            }
            return 0;
        }).reduce(function(pre, cur) {return pre + cur;}, 0);
        debt.percentBalance = 100.0 * totalPaid / debt.totalBalance;
        debt.totalPaid = totalPaid;
    }
}

BubbleChart.prototype._setPercentTime = function(planDate, debts) {
    for (var i = 0; i < debts.length; i++) {
        var debt = debts[i];

        var startTime = moment(debt.addDate);
        var elapsedTime = moment(planDate).diff(startTime);
        var endTime = moment(debt.payOffDate).diff(startTime);

        debt.percentTime = Math.min(100.0 * (elapsedTime / endTime), 100);
    }
}

BubbleChart.prototype._debtsOnOrBefore = function(planDate, debts) {
    var res = [];

    for (var d = 0; d < debts.length; d++) {
        var debt = debts[d];
        if (moment(planDate).diff(moment(debt.addDate)) >= 0) {
            res.push(debt);
        }
    }

    return jQuery.extend(true, [], res);
}

function validate(val, name, min, max) {
    if (val < min) {
        throw new Error('Value of ' + name + '=' + val + ' is less than the min of ' + min);
    }
    if (val > max) {
        throw new Error('Value of ' + name + '=' + val + ' is more than the max of ' + max);
    }
}

// shadeColor2 from http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColor2(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
