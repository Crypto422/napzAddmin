import React, { useRef, useEffect } from 'react';

interface CanvasProps {
    objects: any;
    imgUrl: string;
    selectedObject: string;
}

const ObjectCanvas = ({ imgUrl,selectedObject, objects }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const draw = () => {
        if (!canvasRef.current) {
            return;
        }
        // Open the original image into a canvas
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        const img = new Image();
        img.src = imgUrl;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            if (context) {
                context.drawImage(img, 0, 0, img.width, img.height);
                context.strokeStyle = 'rgba(0,255,0,0.8)';
                context.fillStyle = 'rgba(0,255,0,0.8)';
                
                objects.forEach((object: any, index: any) => {
                    context.beginPath();
                    let origX = 0;
                    let origY = 0;
                    if (parseInt(selectedObject) === index){
                        context.lineWidth =img.width/100;
                    }
                    else {
                        context.lineWidth = img.width/220;
                    }
                    object.boundingPoly.normalizedVertices.forEach((bounds: any, i: any) => {
                        let x = bounds.x*img.width || 0;
                        let y = bounds.y*img.height || 0;
                        if (i === 0) {
                            origX = x;
                            origY = y;
                        }
                        context.lineTo(x, y);
                    });
                    context.lineTo(origX, origY);
                    context.stroke();
                });
            }
        };

    }
    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        draw()
        // eslint-disable-next-line
    }, [canvasRef, selectedObject])

    return (
        <canvas
            ref={canvasRef}
            style={{ opacity: "100%", width: 'inherit',maxHeight: '500px'}}
        />
    )
};

export default ObjectCanvas;
