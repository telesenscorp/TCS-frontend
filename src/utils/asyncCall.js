export default function asyncCall(callback, timeout = 500) {
    setTimeout(callback, timeout);
}
