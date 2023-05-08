import React from 'react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { GustureLockProps, GustureLockRef } from './interface';

const GustureLock = forwardRef<GustureLockRef, GustureLockProps>(
    (
        {
            callBack,
            className,
            style,
            initColor = '#A6A6A6',
            successColor = '#3a85ff',
            errorColor = 'red',
            activeColor = '#C8CED6',
            size = 280,
            nums = 3
        },
        ref
    ) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const ctxRef = useRef<any>({
            ctx: null,
            devicePixelRatio: 0,
            r: '', // 圆圈半径
            point: [], // 连线经过的点位
            arr: [], // 原始点位
            restPoint: [], // 连线还未经过的点位
            canvas: '',
            touchFlag: false,
        });
        useImperativeHandle(ref, () => ({
            success,
            error,
            reset,
        }));

        useEffect(() => {
            init();
            bindEvent();
            return () => {
                unbindEvent();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        function init() {
            initDom();
            ctxRef.current.point = [];

            const canvas = canvasRef.current;
            ctxRef.current.touchFlag = false;
            if (canvas) {
                ctxRef.current.ctx = canvas.getContext('2d');
                createCircle();
            }
        }

        function initDom() {
            // window.navigator.userAgent.match(/iphone/gi)
            if (window.devicePixelRatio > 2) { // 3倍屏也采用2倍屏方案；参考：https://github.com/amfe/lib-flexible/blob/master/src/flexible.js
                ctxRef.current.devicePixelRatio = 2
            } else {
                ctxRef.current.devicePixelRatio = window.devicePixelRatio || 1;
            }
            const canvas = canvasRef.current;
            const width = size || 280;
            const height = size || 280;

            // 设置画笔+画纸大小
            if (canvas) {
                /* 画布大小 */
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
                /* 画纸大小：解决多倍屏模糊问题 */
                canvas.height = height * ctxRef.current.devicePixelRatio;
                canvas.width = width * ctxRef.current.devicePixelRatio;
            }
        }

        function createCircle() {
            /* 创建解锁点的坐标，根据canvas的大小来平均分配半径 */
            let count = 0;
            ctxRef.current.r = ctxRef.current.ctx.canvas.width / (4 * nums);
            ctxRef.current.point = [];
            ctxRef.current.arr = [];
            ctxRef.current.restPoint = [];
            const r = ctxRef.current.r;
            for (let i = 0; i < nums; i++) {
                for (let j = 0; j < nums; j++) {
                    count++;
                    const obj = {
                        x: r * (2 + 4 * j),
                        y: r * (2 + 4 * i),
                        index: count,
                    };
                    ctxRef.current.arr.push(obj);
                    ctxRef.current.restPoint.push(obj);
                }
            }
            clearRect();
        }

        function clearRect() {
            ctxRef.current.ctx.clearRect(0, 0, ctxRef.current.ctx.canvas.width, ctxRef.current.ctx.canvas.height);
            for (let i = 0; i < ctxRef.current.arr.length; i++) {
                drawCle(ctxRef.current.arr[i].x, ctxRef.current.arr[i].y);
            }
        }

        function drawCle(x: number, y: number) {
            /* 初始化解锁密码画板 小圆圈 */
            ctxRef.current.ctx.strokeStyle = initColor;
            ctxRef.current.ctx.lineWidth = 2 * ctxRef.current.devicePixelRatio;
            ctxRef.current.ctx.beginPath();
            ctxRef.current.ctx.arc(x, y, ctxRef.current.r, 0, Math.PI * 2);
            ctxRef.current.ctx.closePath();
            ctxRef.current.ctx.stroke();
        }

        function touchstart(e: TouchEvent) {
            reset();
            e.preventDefault(); // 某些android的touchmove不宜触发
            const po = getPosition(e);
            for (let i = 0; i < ctxRef.current.arr.length; i++) {
                if (Math.abs(po.x - ctxRef.current.arr[i].x) < ctxRef.current.r && Math.abs(po.y - ctxRef.current.arr[i].y) < ctxRef.current.r) {
                    ctxRef.current.touchFlag = true;
                    ctxRef.current.point.push(ctxRef.current.arr[i]);
                    ctxRef.current.restPoint.splice(i, 1);
                }
            }
        }

        function touchmove(e: TouchEvent) {
            if (ctxRef.current.touchFlag) {
                update(getPosition(e));
            }
        }

        function touchend() {
            if (ctxRef.current.touchFlag) {
                ctxRef.current.touchFlag = false;
                let password = '';
                for (let i = 0; i < ctxRef.current.point.length; i++) {
                    password += ctxRef.current.point[i].index;
                }
                if (callBack) {
                    callBack(password)
                } else {
                    defaultCallback();
                }
            }
        }

        function bindEvent() {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.addEventListener('touchstart', touchstart);
                canvas.addEventListener('touchmove', touchmove);
                canvas.addEventListener('touchend', touchend);
            }
        }

        function unbindEvent() {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.removeEventListener('touchstart', touchstart);
                canvas.removeEventListener('touchmove', touchmove);
                canvas.removeEventListener('touchend', touchend);
            }
        }

        function getPosition(e: TouchEvent) {
            // 获取touch点相对于canvas的坐标
            const rect = (e.currentTarget as any).getBoundingClientRect(); /* 返回一个 DOMRect 对象，其提供了元素的大小及其相对于视口的位置。 */
            const po = {
                /* clientX视野相对于视口的距离，不受滚动距离影响 */
                x: (e.touches[0].clientX - rect.left) * ctxRef.current.devicePixelRatio,
                y: (e.touches[0].clientY - rect.top) * ctxRef.current.devicePixelRatio,
            };
            return po;
        }

        /* 绘制当前连线中的点 */
        function drawPoint(fillStyle: string | CanvasGradient | CanvasPattern) {
            /* 初始化圆心 */
            for (let i = 0; i < ctxRef.current.point.length; i++) {
                ctxRef.current.ctx.fillStyle = fillStyle;
                ctxRef.current.ctx.beginPath();
                ctxRef.current.ctx.arc(ctxRef.current.point[i].x, ctxRef.current.point[i].y, ctxRef.current.r / 2.5, 0, Math.PI * 2);
                ctxRef.current.ctx.closePath();
                ctxRef.current.ctx.fill();
            }
        }

        function update(po: { x: number; y: number }) {
            /* 核心变换方法在touchMove时候调用 */
            clearRect();
            for (let i = 0; i < ctxRef.current.restPoint.length; i++) {
                if (Math.abs(po.x - ctxRef.current.restPoint[i].x) < ctxRef.current.r && Math.abs(po.y - ctxRef.current.restPoint[i].y) < ctxRef.current.r) {
                    ctxRef.current.point.push(ctxRef.current.restPoint[i]);
                    ctxRef.current.restPoint.splice(i, 1);
                    break;
                }
            }
            drawPoint(activeColor);
            drawStatusPoint(activeColor);
            drawLine(activeColor, po);
        }

        /* 绘制当前连线中点的圈 */
        function drawStatusPoint(type: any) {
            /* 初始化线条状态 */
            for (let i = 0; i < ctxRef.current.point.length; i++) {
                ctxRef.current.ctx.strokeStyle = type;
                ctxRef.current.ctx.lineWidth = 2 * ctxRef.current.devicePixelRatio;
                ctxRef.current.ctx.beginPath();
                ctxRef.current.ctx.arc(ctxRef.current.point[i].x, ctxRef.current.point[i].y, ctxRef.current.r, 0, Math.PI * 2);
                ctxRef.current.ctx.closePath();
                ctxRef.current.ctx.stroke();
            }
        }

        function drawLine(strokeStyle: string | CanvasGradient | CanvasPattern, po: { x: number; y: number }) {
            /* 解锁轨迹 */
            ctxRef.current.ctx.beginPath();
            ctxRef.current.ctx.strokeStyle = strokeStyle;
            ctxRef.current.ctx.lineWidth = 3 * ctxRef.current.devicePixelRatio;
            ctxRef.current.ctx.moveTo(ctxRef.current.point[0].x, ctxRef.current.point[0].y);

            for (let i = 1; i < ctxRef.current.point.length; i++) {
                ctxRef.current.ctx.lineTo(ctxRef.current.point[i].x, ctxRef.current.point[i].y);
            }
            ctxRef.current.ctx.lineTo(po.x, po.y);
            ctxRef.current.ctx.stroke();
            ctxRef.current.ctx.closePath();
        }

        /* 重置绘制区域 */
        function reset() {
            createCircle();
        }

        /* 绘制成功效果色 */
        function defaultCallback() {
            clearRect();
            drawStatusPoint(initColor);
            drawPoint(initColor);
            drawLine(initColor, ctxRef.current.point[ctxRef.current.point.length - 1]);
        }

        /* 绘制成功效果色 */
        function success() {
            clearRect();
            drawStatusPoint(successColor);
            drawPoint(successColor);
            drawLine(successColor, ctxRef.current.point[ctxRef.current.point.length - 1]);
        }

        /* 绘制失败效果色 */
        function error() {
            clearRect();
            drawStatusPoint(errorColor);
            drawPoint(errorColor);
            drawLine(errorColor, ctxRef.current.point[ctxRef.current.point.length - 1]);
        }

        return <canvas className={className} ref={canvasRef} style={style} />;
    });
export default GustureLock;
