/* eslint-disable import/first */
import p5 from 'p5';

// p5.sound는 p5의 전역 객체(window.p5)에 의존합니다.
// 따라서 p5를 전역에 등록해줍니다.
if (typeof window !== 'undefined') {
    window.p5 = p5;
}

// p5.sound를 가져와서 p5 객체를 확장합니다.
// 버전에 따라 'p5/lib/addons/p5.sound' 또는 'p5.sound' 둘 중 하나가 작동할 수 있습니다.
import 'p5/lib/addons/p5.sound';

// 이제 p5를 내보냅니다.
export default p5;