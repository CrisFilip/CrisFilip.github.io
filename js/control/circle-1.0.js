define(['jquery'], function ($) {
    console.log('jquery and circle loaded')

    let circle = {
        init: function (canvas, state, font) {
            this.canvas = canvas
            this.canvas.addEventListener('mousedown', this.onClick(canvas, this.onClickSelector));
            this.context = canvas.getContext('2d')
            this.state = state
            this.font = font
            this.state.count = state.items.length
            this.state.itemAngle = (2 / this.state.count)

            for (i = 0; i < this.state.count; i++) {
                let currentItem = state.items[i]
                currentItem.angleStart = (this.state.itemAngle * i) - 0.5
                currentItem.angleEnd = (this.state.itemAngle * (i + 1)) - 0.5
            }
        },
        getWidth: function () {
            return this.canvas.width
        },
        getHeight: function () {
            return this.canvas.height
        },
        getCenter: function () {
            return {
                x: Math.floor(this.getWidth() / 2),
                y: Math.floor(this.getHeight() / 2)
            }
        },
        maxRadius: function (scalar) {
            return Math.min(
                Math.floor((this.getWidth() / 2) * scalar),
                Math.floor((this.getHeight() / 2) * scalar),
            )
        },
        drawCircle: function (selectionId) {
            let selected = false
            let center = this.getCenter()
            this.context.clearRect(0, 0, this.getWidth(), this.getHeight())
            for (i = 0; i < this.state.count; i++) {
                let item = this.state.items[i]
                selected = (i === selectionId)
                this.drawSection(center, selected, this.getImage(item.name), item.color, item.angleStart, item.angleEnd)
                if (selected) {
                    this.updateContent(item)
                    this.drawInnerCircle(center, item)
                }
            }
        },
        drawSection: function (center, selected, image, strokeStyle, angleStart, angleEnd) {
            let length = this.maxRadius(0.80)
            if (selected) {
                length = this.maxRadius(0.75)
                this.context.lineWidth = this.maxRadius(0.40)
            } else {
                this.context.lineWidth = this.maxRadius(0.30)
            }

            this.context.beginPath()
            this.context.arc(center.x, center.y, length, angleStart * Math.PI, angleEnd * Math.PI)
            this.context.strokeStyle = strokeStyle
            this.context.stroke()

            let imageLength = length
            let anglePicture = -angleStart - (0.5 * Math.PI)
            let imageX = center.x - (image.width / 2) + (imageLength * Math.sin(anglePicture * Math.PI))
            let imageY = center.y - (image.height / 2) + (imageLength * Math.cos(anglePicture * Math.PI))

            if (image) {
                this.context.drawImage(image, imageX, imageY)
            }
        },
        drawInnerCircle: function (center, item) {
            this.context.beginPath()
            this.context.arc(center.x, center.y, this.maxRadius(0.35), 0, 2 * Math.PI, false)
            this.context.fillStyle = item.color
            this.context.fill()
            this.context.font = this.font
            this.context.textBaseline = 'middle'
            this.context.textAlign = 'center'
            this.context.fillStyle = this.getTextColor(item)
            this.context.fillText(this.getPercentage(item), center.x, center.y)
        },
        getImage: function (name) {
            let element = document.getElementById(name + '_icon')
            if (element !== null) {
                return element
            } else {
                console.log('Error: Can not find image for "' + name + '_icon"')
                return null
            }
        },
        getContent: function (name) {
            let element = document.getElementById(name + '_content')
            if (element !== null) {
                return element.innerHTML
            } else {
                console.log('Error: Can not find content for "' + name + '_content"')
                return ''
            }
        },
        getPercentage: function (item) {
            if (item.percentage !== null) {
                return item.percentage + '%'
            } else {
                console.log('Error: Can not find percentage for "' + item.name + '"')
                return ''
            }
        },
        getTextColor: function (item) {
            if (item.textColor !== null) {
                return item.textColor
            } else {
                console.log('Error: Can not find percentage for "' + item.name + '"')
                return 'black'
            }
        },
        updateContent: function (item) {
            $('#circle-content').html(this.getContent(item.name))
        },
        onClick: function (canvas, onClickSelector) {
            return function(event) {
                let rect = canvas.getBoundingClientRect();
                let xMiddle = Math.floor(canvas.width / 2)
                let yMiddle = Math.floor(canvas.height / 2)
                let x = event.clientX - rect.left - xMiddle;
                let y = event.clientY - rect.top - yMiddle;

                let angle = (Math.atan2(y, x) / Math.PI);
                if(angle < -0.5) {
                    angle = angle + 2;
                }

                let length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                console.log('onClick x: ' + x + ' y: ' + y + ' angle: ' + angle + ' length: ' + length);
                onClickSelector(angle, length);
            }
        },
        onClickSelector: function(angle, length) {
            if(length > circle.maxRadius(0.5) && length < circle.maxRadius(1)) {
                let selected = -1;
                for (i = 0; i < circle.state.count; i++) {
                    let item = circle.state.items[i]
                    console.log('onClickSelector item: ' + item.name + ' angleStart: ' + item.angleStart + ' angleEnd: ' + item.angleEnd);
                    if(item.angleStart <= angle && angle < item.angleEnd) {
                        console.log('Click item: ' + item.name);
                        selected = i;
                    }
                }
                if(selected !== -1) {
                    circle.drawCircle(selected);
                }
            }
        }
    }

    return circle;
})