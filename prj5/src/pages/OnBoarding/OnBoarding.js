import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import 'p5.sound';
import 'p5/lib/addons/p5.sound';
import './OnBoarding.css';

const OnBoarding = () => {
    const sketchRef = useRef(null);
    const p5Instance = useRef(null);
    useEffect(() => {
        const sketch = (p) => {
            // 변수 선언
            let mic, amplitude;
            let bgMusic, fftMusic;
            let dinosaurY;           // 공룡의 y위치
            let dinosaurVelocity = 0; // 공룡의 점프 속도
            let groundLevel;         // 땅의 y좌표
            let isJumping = false;   // 점프 여부

            // 장애물 관련 변수
            let obstacleX;
            const obstacleWidth = 50;
            const obstacleHeight = 50;
            const obstacleSpeed = 6;

            // 두 사각형이 충돌하는지 체크하는 함수
            function isColliding(x1, y1, w1, h1, x2, y2, w2, h2) {
                return (
                    x1 < x2 + w2 &&
                    x1 + w1 > x2 &&
                    y1 < y2 + h2 &&
                    y1 + h1 > y2
                );
            }

            // preload에서 배경음악 로드
            p.preload = () => {
                // 'background.mp3' 파일은 public 폴더 내에 있어야 합니다.
                bgMusic = p.loadSound('background.mp3');
            };

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight);
                groundLevel = p.height - 100;
                dinosaurY = groundLevel;
                obstacleX = p.width; // 장애물 초기 위치

                // 마이크 입력 초기화
                mic = new p5.AudioIn();
                mic.start();

                amplitude = new p5.Amplitude();
                amplitude.setInput(mic);

                // 배경음악의 주파수를 시각화하기 위한 FFT 객체
                fftMusic = new p5.FFT();
                fftMusic.setInput(bgMusic);

                bgMusic.loop();
            };

            p.draw = () => {
                p.background(50);

                // 배경음악의 주파수 데이터를 활용해 '길' 모양 시각화
                let spectrum = fftMusic.analyze();
                p.noStroke();
                p.fill(200, 100, 100);
                p.beginShape();
                for (let i = 0; i < spectrum.length; i++) {
                    const x = p.map(i, 0, spectrum.length, 0, p.width);
                    const y = p.map(spectrum[i], 0, 255, groundLevel, groundLevel - 150);
                    p.vertex(x, y);
                }
                p.vertex(p.width, p.height);
                p.vertex(0, p.height);
                p.endShape(p.CLOSE);

                // 장애물 이동 (오른쪽에서 왼쪽)
                obstacleX -= obstacleSpeed;
                if (obstacleX < -obstacleWidth) {
                    obstacleX = p.width; // 장애물이 화면 밖으로 벗어나면 다시 등장
                }

                // 장애물 그리기 (빨간 사각형)
                p.fill(255, 0, 0);
                p.rect(obstacleX, groundLevel - obstacleHeight, obstacleWidth, obstacleHeight);

                // 마이크의 진폭 값을 분석해 점프 트리거 (임계값 조절 가능)
                const micLevel = amplitude.getLevel();
                if (!isJumping && micLevel > 0.05) {
                    dinosaurVelocity = -15; // 위쪽으로 점프하도록 속도 부여
                    isJumping = true;
                }

                // 공룡의 점프와 중력 효과 적용
                dinosaurY += dinosaurVelocity;
                dinosaurVelocity += 0.8; // 중력 가속도

                // 땅에 도달하면 단순 착지 처리 (리셋은 하지 않음)
                if (dinosaurY > groundLevel) {
                    dinosaurY = groundLevel;
                    dinosaurVelocity = 0;
                    isJumping = false;
                }

                // 공룡 그리기 (녹색 사각형으로 표시)
                const dinoX = 100;
                const dinoY = dinosaurY - 50; // 공룡의 y좌표 (사각형의 높이 50 고려)
                const dinoWidth = 50;
                const dinoHeight = 50;
                p.fill(0, 255, 0);
                p.rect(dinoX, dinoY, dinoWidth, dinoHeight);

                // 장애물과 공룡의 충돌 검사
                if (
                    isColliding(
                        dinoX,
                        dinoY,
                        dinoWidth,
                        dinoHeight,
                        obstacleX,
                        groundLevel - obstacleHeight,
                        obstacleWidth,
                        obstacleHeight
                    )
                ) {
                    // 충돌 발생 시 게임 상태 리셋 (초기 상태 복원)
                    dinosaurY = groundLevel;
                    dinosaurVelocity = 0;
                    isJumping = false;
                    obstacleX = p.width;
                }
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
                groundLevel = p.height - 100;
                if (dinosaurY > groundLevel) dinosaurY = groundLevel;
            };
        };

        const p5Instance = new p5(sketch, sketchRef.current);

        return () => {
            p5Instance.remove();
        };
    }, []);

    return (
        <div className="onboarding">
            <div ref={sketchRef} className="p5-container"></div>
        </div>
    );
};

export default OnBoarding;
