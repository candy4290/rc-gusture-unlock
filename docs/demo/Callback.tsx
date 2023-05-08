import React, { useRef } from 'react';
import GustureLock from 'rc-gusture-unlock';
import type { GustureLockRef } from '@/interface';

export default function App() {
  const gustureRef = useRef<GustureLockRef>();
  function onchange(pwd: string) {
    console.log(pwd)
    if (pwd === '14789') {
      gustureRef.current.success();
    } else {
      gustureRef.current.error();
    }
  }
  return (
    <>
    <button onClick={() => gustureRef.current.reset()}>重置</button>
    <div>尝试连接第一列及最后一行的点，将显示成功状态，否则显示失败状态</div>
    <GustureLock ref={gustureRef} callBack={onchange} />
    </>
  );
}
