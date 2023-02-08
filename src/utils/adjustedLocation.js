export default function adjustedLocation (ref){
  const btnRef = ref.current.getBoundingClientRect();
  const ratio = window.devicePixelRatio === 1.25 ? 0.8 : 1;

  return{
    width :btnRef.width * ratio,
    left: btnRef.left * ratio,
    top: btnRef.top * ratio,
    height: btnRef.height * ratio,
  }
}
