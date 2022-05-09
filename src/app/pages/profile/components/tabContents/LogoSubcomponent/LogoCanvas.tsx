import React, { useRef, useEffect } from 'react';

interface CanvasProps {
    logos: any;
    imgUrl: string;
    selectedLogo: string;
}

const LogoCanvas = ({ imgUrl,selectedLogo, logos }: CanvasProps) => {
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
                logos.forEach((logo: any, index: any) => {
                    context.beginPath();
                    let origX = 0;
                    let origY = 0;
                    if (parseInt(selectedLogo) === index){
                        context.lineWidth =img.width/100;
                    }
                    else {
                        context.lineWidth = img.width/220;
                    }
                    logo.boundingPoly.vertices.forEach((bounds: any, i: any) => {
                        let x = bounds.x || 0;
                        let y = bounds.y || 0;
                        if (i === 0) {
                            origX =x;
                            origY = y;
                        }
                        context.lineTo(x, y);
                    });
                    context.lineTo(origX, origY);
                    context.stroke();
                     // Show detection confident
                     let fontSize = img.width/20
                     context.font = `${fontSize}px arial`;
                     // 'origY-5' so the text wont get so close to the box
                     context.fillText(logo.description, origX+7, origY + fontSize);
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
    }, [canvasRef, selectedLogo])

    return (
        <canvas
            ref={canvasRef}
            style={{ opacity: "100%", width: 'inherit',maxHeight: '500px'}}
        />
    )
};

export default LogoCanvas;
