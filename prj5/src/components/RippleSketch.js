import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const BackgroundCircles = () => {
    const canvasRef = useRef(null);
    const p5Instance = useRef(null);

    useEffect(() => {
        const sketch = (p) => {
            let maxDistance;
            const spacing = 20;     // 격자 간격
            const baseSize = 66;    // 기준 크기 (Processing 코드의 66 사용)
            const freq = 0.5;       // 파동 주파수 (수치를 조절하여 빠르거나 느리게 할 수 있음)
            const phaseFactor = 0.01; // 원의 위치에 따른 위상 오프셋 (원마다 살짝 다른 파동 효과를 주기 위함)

            p.setup = () => {
                p.createCanvas(1920, 1080);
                p.noStroke();
                // 캔버스 대각선 길이를 최대 거리로 계산
                maxDistance = p.dist(0, 0, p.width, p.height);
            };

            p.draw = () => {
                p.background(0);
                // 시간 (초 단위) 계산
                const timeFactor = p.millis() / 1000;

                // 캔버스 중앙을 기준점으로 사용 (원하는 기준점으로 변경 가능)
                const centerX = p.width / 2;
                const centerY = p.height / 2;

                // 격자 상의 각 원에 대해
                for (let i = 0; i <= p.width; i += spacing) {
                    for (let j = 0; j <= p.height; j += spacing) {
                        // 기준점(중앙)부터 현재 격자 점까지의 거리 계산
                        const d = p.dist(centerX, centerY, i, j);
                        // 위치에 따른 비율 (0 ~ 1)
                        const distanceRatio = d / maxDistance;

                        // 시간과 각 원의 위치에 따른 사인파 (파동 주파수 효과)
                        // phaseFactor를 곱해 각 원마다 위상이 조금씩 다르게 나타나도록 함
                        const wave = p.abs(p.sin(timeFactor * p.TWO_PI * freq + d * phaseFactor));

                        // 원 크기는 기준 크기에 거리 비율과 사인파 값을 곱해 결정
                        const ellipseSize = baseSize * distanceRatio * wave;

                        // 원 채우기 색은 밝게 (필요시 fill 색상을 변화시킬 수도 있음)
                        p.fill(255);
                        p.ellipse(i, j, ellipseSize, ellipseSize);
                    }
                }
            };
        };

        // p5 인스턴스를 생성하여 canvasRef에 연결합니다.
        p5Instance.current = new p5(sketch, canvasRef.current);

        // 컴포넌트 언마운트 시 p5 인스턴스를 정리하여 메모리 누수를 막습니다.
        return () => {
            if (p5Instance.current) {
                p5Instance.current.remove();
            }
        };
    }, []); // 컴포넌트가 마운트될 때 한 번 실행

    return <div ref={canvasRef}></div>;
};

export default BackgroundCircles;
